package com.lab4.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
public class Point implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false, updatable = false)
    private Long id;
    private Double x;
    private Double y;
    private Double r;
    private Boolean hitGraph;
//    @Column(name = "time", columnDefinition = "TIMESTAMP")
//    private LocalDateTime time;

    public Point() {}

    public Point(Double x, Double y, Double r, Boolean hitGraph) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hitGraph = hitGraph;
//        this.time = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public Double getR() {
        return r;
    }

    public void setR(Double r) {
        this.r = r;
    }

    public Boolean getHitGraph() {
        return this.hitGraph;
    }

    public void setHitGraph(Boolean hitGraph) {
        this.hitGraph = hitGraph;
    }

//    public LocalDateTime getTime() {
//        return this.time;
//    }
//
//    public void setTime(LocalDateTime time) {
//        this.time = LocalDateTime.now();
//    }
}
