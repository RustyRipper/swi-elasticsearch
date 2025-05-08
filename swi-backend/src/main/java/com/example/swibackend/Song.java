package com.example.swibackend;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Song {

    @JsonProperty("id")
    private Integer id;

    @JsonProperty("title")
    private String title;

    @JsonProperty("artist")
    private String artist;

    @JsonProperty("tag")
    private String tag;

    @JsonProperty("year")
    private Integer year;

    @JsonProperty("views")
    private Integer views;

    @JsonProperty("features")
    private String features;

    @JsonProperty("lyrics")
    private String lyrics;

    @JsonProperty("language")
    private String language;
}
