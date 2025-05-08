package com.example.swibackend;

import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/songs")
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping("/search")
    public List<Song> searchSongs(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String artist,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) Integer yearFrom,
            @RequestParam(required = false) Integer yearTo,
            @RequestParam(required = false) String sortBy) throws IOException {

        return songService.searchSongs(query, artist, language, yearFrom, yearTo, sortBy);
    }

    @GetMapping("/{id}")
    public Song getSongDetails(@PathVariable String id) {
        return songService.getSongDetails(id);
    }
}
