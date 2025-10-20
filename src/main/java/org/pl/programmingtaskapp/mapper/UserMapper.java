package org.pl.programmingtaskapp.mapper;

import org.pl.programmingtaskapp.entity.User;
import org.pl.programmingtaskapp.entity.request.UserRequest;
import org.pl.programmingtaskapp.entity.response.UserResponse;

public class UserMapper {
    public static User mapUserRequestToUser(UserRequest userRequest) {
        return User.builder()
                .username(userRequest.getUsername())
                .email(userRequest.getEmail())
                .password(userRequest.getPassword())
                .build();
    }

    public static UserRequest mapUserToUserRequest(User user) {
        return UserRequest.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .password(user.getPassword())
                .build();
    }

    public static UserResponse mapUserToUserResponse(User user) {
        return UserResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles())
                .emailConfirmed(user.isEmailConfirmed())
                .build();
    }
}
