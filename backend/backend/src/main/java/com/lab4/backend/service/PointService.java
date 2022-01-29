package com.lab4.backend.service;

import com.lab4.backend.model.Point;
import com.lab4.backend.repo.PointRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PointService {
    private final PointRepo pointRepo;

    @Autowired
    public PointService(PointRepo pointRepo) {
        this.pointRepo = pointRepo;
    }

    public Point addPoint(Point point) {
        return pointRepo.save(point);
    }

    public List<Point> findAllPoints() {
        return pointRepo.findAll();
    }

    public void deletePoints() {
        pointRepo.deleteAll();
    }
}
