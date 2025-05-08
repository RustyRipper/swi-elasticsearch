package com.example.swibackend;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.json.JsonData;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SongService {

    private final ElasticsearchClient client;

    public SongService(ElasticsearchClient client) {
        this.client = client;
    }

    public List<Song> searchSongs(String query, String artist, String language, Integer yearFrom, Integer yearTo,
                                  String sortBy) throws IOException {
        SearchRequest searchRequest = SearchRequest.of(s -> s
                .index("genius_songs2")
                .query(q -> q
                        .bool(b -> {
                            if (query != null && !query.isEmpty()) {
                                b.must(m -> m
                                        .multiMatch(mm -> mm
                                                .fields("title", "lyrics")
                                                .query(query)
                                        )
                                );
                            }
                            if (artist != null) {
                                b.filter(f -> f.term(t -> t.field("artist").value(artist)));
                            }
                            if (language != null) {
                                b.filter(f -> f.term(t -> t.field("language").value(language)));
                            }
                            if (yearFrom != null || yearTo != null) {
                                b.filter(f -> f.range(r -> r
                                        .field("year")
                                        .gte(yearFrom != null ? JsonData.of(yearFrom) : null)
                                        .lte(yearTo != null ? JsonData.of(yearTo) : null)
                                ));
                            }
                            return b;
                        })
                )
                .sort(sort -> {
                    if ("views".equalsIgnoreCase(sortBy)) {
                        sort.field(f -> f.field("views").order(SortOrder.Desc));
                    } else if ("year".equalsIgnoreCase(sortBy)) {
                        sort.field(f -> f.field("year").order(SortOrder.Desc));
                    } else {
                        sort.score(p -> p.order(SortOrder.Desc));
                    }
                    return sort;
                })
        );

        SearchResponse<Song> response = client.search(searchRequest, Song.class);
        return response.hits().hits().stream()
                .map(Hit::source)
                .collect(Collectors.toList());
    }


    public Song getSongDetails(String id) {
        try {
            var response = client.get(g -> g.index("genius_songs2").id(id), Song.class);
            return response.source();
        } catch (IOException e) {
            throw new RuntimeException("Failed to get song details", e);
        }
    }
}
