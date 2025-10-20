package org.pl.programmingtaskapp.service;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class RandomGeneratorService {
    private final Random random;

    public RandomGeneratorService() {
        random = new Random();
    }

    public String generateRandomAlphaNumeric(int length) {
        return random.ints(48, 123)
                        .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                        .limit(length)
                        .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                        .toString();
    }
}
