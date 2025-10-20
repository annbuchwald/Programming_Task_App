package org.pl.programmingtaskapp.controller;

import org.pl.programmingtaskapp.entity.request.AuthRequest;
import org.pl.programmingtaskapp.entity.request.UserRequest;
import org.pl.programmingtaskapp.entity.response.UserResponse;
import org.pl.programmingtaskapp.mapper.UserMapper;
import org.pl.programmingtaskapp.service.JwtService;
import org.pl.programmingtaskapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService service;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public String register(@RequestBody UserRequest userRequest) {
        service.registerUser(UserMapper.mapUserRequestToUser(userRequest));
        return "User added successfully";
    }

    @PostMapping("/login")
    public String login(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
            if (!authentication.isAuthenticated()) {
                throw new UsernameNotFoundException("");
            }
            return jwtService.generateToken(authRequest.getUsername());
        } catch (Exception e) {
            return "Invalid credentials!";
        }
    }

    @GetMapping("/confirm-email")
    public String confirmEmail(@RequestParam String username, @RequestParam String code) {
        service.confirmEmailAddress(username, code);
        return "Email confirmed successfully!";
    }

    @GetMapping("/all")
    public List<UserResponse> getUsers() {
        return service.getAllUsers();
    }
}
