package com.lab4.backend;

import com.lab4.backend.model.Point;
import com.lab4.backend.service.PointService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/point")
public class PointResource {
    private final PointService pointService;

    public PointResource(PointService pointService) {
        this.pointService = pointService;
    }

    private Boolean checkHitGraph(Point point) {
        if ((point.getX()*point.getX() + point.getY()* point.getY() <= point.getR()*point.getR()/4) && (point.getX() >= 0) && (point.getY() >= 0) ) {
            return true; // Circle hit
        }
        if (point.getY() >= 0 && point.getY() <= point.getR() && point.getX() <= 0 && point.getX() >= -point.getR()) {
            return true; // Square hit
        }
            if (point.getX() >= 0 && point.getX() <= point.getR() && point.getY() <= 0 && point.getY() >= -point.getR() && point.getY() >= (point.getX()- point.getR()) ) {
            return true; // Triangle hit
        }

        return false;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Point>> getAllPoints() {
        List<Point> points = pointService.findAllPoints();
        return new ResponseEntity<>(points, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Point> addPoint(@RequestBody Point point) {
        System.out.println("returning point");
        if (point.getR() <= 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        point.setHitGraph(checkHitGraph(point));
        Point newPoint = pointService.addPoint(point);
        return new ResponseEntity<Point>(newPoint, HttpStatus.OK);
    }


    @DeleteMapping("/delete")
    public ResponseEntity<?> deletePoints() {
        pointService.deletePoints();
        List<Point> points = pointService.findAllPoints();
        return new ResponseEntity<>(points, HttpStatus.OK);
    }
}
