package com.lab4.backend.repo;

import com.lab4.backend.model.CustomUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomUserRepo extends JpaRepository<CustomUser, Long> {
    public CustomUser findByUsername(String username);
}
