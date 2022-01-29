package com.lab4.backend.service;

import com.lab4.backend.model.CustomUser;
import com.lab4.backend.model.Point;
import com.lab4.backend.repo.CustomUserRepo;
import com.lab4.backend.repo.PointRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserService {
    private final CustomUserRepo customUserRepo;

    @Autowired
    public CustomUserService(CustomUserRepo customUserRepo) {
        this.customUserRepo = customUserRepo;
    }

    public CustomUser addCustomUser(CustomUser customUser) {
        return customUserRepo.save(customUser);
    }

    public List<CustomUser> findAllCustomUsers() {
        return customUserRepo.findAll();
    }

    public CustomUser findByUsername(String username) {
        return customUserRepo.findByUsername(username);
    }

}
