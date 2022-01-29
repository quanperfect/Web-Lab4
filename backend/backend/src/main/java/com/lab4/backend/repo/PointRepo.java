package com.lab4.backend.repo;

import com.lab4.backend.model.Point;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointRepo extends JpaRepository<Point, Long> {
}
