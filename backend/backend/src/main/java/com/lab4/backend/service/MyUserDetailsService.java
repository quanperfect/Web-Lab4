package com.lab4.backend.service;

import com.lab4.backend.model.CustomUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class MyUserDetailsService implements UserDetailsService {
    @Autowired
    private CustomUserService customUserService;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        //сюда дописать цикл поиска по юзерам
        // THE ISSUE IS table name custom_user instead of customuser

        System.out.println("loadUserByUsername, USERNAME: " + userName);
        List<CustomUser> CustomUsers = customUserService.findAllCustomUsers();
        for (CustomUser i : CustomUsers) {
//            System.out.println("User of list: " +
//                    i.getUsername());
            if (Objects.equals(i.getUsername(), userName)) {
                System.out.println("found this user in Database: " + userName);
                return new User(i.getUsername(),i.getPassword(), new ArrayList<>());
            }
        }

        throw(new UsernameNotFoundException("No such user was found"));
    }

}
