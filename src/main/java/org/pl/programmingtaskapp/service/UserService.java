package org.pl.programmingtaskapp.service;

import org.pl.programmingtaskapp.entity.EmailDetails;
import org.pl.programmingtaskapp.entity.Role;
import org.pl.programmingtaskapp.entity.User;
import org.pl.programmingtaskapp.entity.UserDetails;
import org.pl.programmingtaskapp.entity.response.UserResponse;
import org.pl.programmingtaskapp.mapper.UserMapper;
import org.pl.programmingtaskapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private RandomGeneratorService randomGeneratorService;

    @Value("${spring.user.confirmation.code.len}")
    private int confirmationCodeLength;

    @Value("${spring.application.url}")
    private String applicationUrl;

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        final Optional<User> foundUser = repository.findFirstByUsername(username);
        return foundUser.map(UserDetails::new).orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public User registerUser(User user) {
        user.setRoles(Role.USER.toString());
        user.setEmailConfirmed(false);
        user.setPassword(encoder.encode(user.getPassword()));
        user.setEmailConfirmationCode(randomGeneratorService.generateRandomAlphaNumeric(confirmationCodeLength));
        try {
            emailService.sendEmail(EmailDetails.builder()
                            .recipient(user.getEmail())
                            .subject("Email confirmation")
                            .msgBody("Confirm your email by clicking the following link: " + applicationUrl + "/confirm-email?code=" + user.getEmailConfirmationCode() + "&username=" + user.getUsername())
                    .build());
        } catch (Exception e) {
            throw new RuntimeException("Error sending email!");
        }
        return repository.save(user);
    }

    public void confirmEmailAddress(String username, String code) {
        final Optional<User> foundUser = repository.findFirstByUsername(username);
        if (foundUser.isPresent()) {
            final User user = foundUser.get();
            if (user.isEmailConfirmed()) {
                throw new RuntimeException("Email already confirmed!");
            }
            if (user.getEmailConfirmationCode().equals(code)) {
                user.setEmailConfirmed(true);
                repository.save(user);
            } else {
                throw new RuntimeException("Invalid email confirmation code!");
            }
        } else {
            throw new UsernameNotFoundException("User not found: " + username);
        }
    }

    public List<UserResponse> getAllUsers() {
        return repository.findAll().stream().map(UserMapper::mapUserToUserResponse).toList();
    }
}
