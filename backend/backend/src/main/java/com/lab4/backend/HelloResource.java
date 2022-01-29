package com.lab4.backend;

import com.lab4.backend.model.AuthenticationRequest;
import com.lab4.backend.model.AuthenticationResponse;
import com.lab4.backend.model.CustomUser;
import com.lab4.backend.service.CustomUserService;
import com.lab4.backend.service.MyUserDetailsService;
import com.lab4.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class HelloResource {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private MyUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtTokenUtil;

    @Autowired
    private CustomUserService customUserService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @RequestMapping("/hello")
    public String hello() {
        return "Hello World";
    }

    @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
     public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) throws Exception {
        System.out.println("Authentication in progress");
        System.out.println("Encrypted password: " + passwordEncoder.encode(authenticationRequest.getPassword()));
        try {
            authenticationManager.authenticate(
                   new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword())
//                     new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), passwordEncoder.encode(authenticationRequest.getPassword()))
            );
        } catch (BadCredentialsException e) {
            throw new Exception("Incorrect username or password", e);
        }

        final UserDetails userDetails = userDetailsService
                .loadUserByUsername(authenticationRequest.getUsername());

        final String jwt = jwtTokenUtil.generateToken(userDetails);

        return ResponseEntity.ok(new AuthenticationResponse(jwt));
    }

    @RequestMapping(value = "/validatetoken", method = RequestMethod.GET)
    public ResponseEntity<?> validateUserToken(HttpServletRequest request) {
        System.out.println("TEST VALIDATE USER TOKEN");
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            username = jwtTokenUtil.extractUsername(jwt);
        }
        System.out.println(username);
        return new ResponseEntity<>(new CustomUser(username,"hidden"), HttpStatus.OK);
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<?> registerNewUser(@RequestBody AuthenticationRequest authenticationRequest) throws Exception {
        System.out.println("trying to register: ");
        System.out.println("- username: " + authenticationRequest.getUsername());
        System.out.println("- password: " + authenticationRequest.getPassword())    ;
        if (authenticationRequest.getPassword().length() <= 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<CustomUser> CustomUsers = customUserService.findAllCustomUsers();

        // Checking for duplicate usernames
        for (CustomUser i : CustomUsers) {
//            System.out.println("User of list: " + i.getUsername());
            if (Objects.equals(i.getUsername(), authenticationRequest.getUsername())) {
                System.out.println("found this duplicate user in Database: " + authenticationRequest.getUsername());
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
        }

//        CustomUser newUser = new CustomUser(authenticationRequest.getUsername(), authenticationRequest.getPassword());
        CustomUser newUser = new CustomUser(authenticationRequest.getUsername(), passwordEncoder.encode(authenticationRequest.getPassword()));

        customUserService.addCustomUser(newUser);
        return new ResponseEntity<>(HttpStatus.OK);
    }

//    @RequestMapping(value = "/logout", method = RequestMethod.POST)
//    public ResponseEntity<?> logout(User user) {
//        System.out.println(user.getUsername() + " logged out");
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
}
