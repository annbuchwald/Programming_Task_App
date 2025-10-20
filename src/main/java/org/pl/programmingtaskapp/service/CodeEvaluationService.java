package org.pl.programmingtaskapp.service;

import org.pl.programmingtaskapp.entity.EvaluationResult;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.List;

@Service
public class CodeEvaluationService {
    private static final String CPP_FILE = "Solution.cpp";
    private static final String DOCKER_IMAGE = "cpp-runner";
    private static final String WORKDIR = "/home/runner/";

    private void deleteDirectoryRecursively(File directory) {
        Path path = directory.toPath();
        try {
            Files.walkFileTree(path, new SimpleFileVisitor<>() {
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs)
                        throws IOException {
                    Files.delete(file);
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult postVisitDirectory(Path dir, IOException exc)
                        throws IOException {
                    Files.delete(dir);
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) {
            System.err.println("Failed to delete temporary directory: " + e.getMessage());
        }
    }

    public EvaluationResult evaluateCode(String code, String input, String expectedOutput) throws IOException, InterruptedException {
        Path tempDir = Files.createTempDirectory("cpp-eval");
        Path cppFile = tempDir.resolve(CPP_FILE);
        Files.write(cppFile, code.getBytes());

        final String username = SecurityContextHolder.getContext().getAuthentication().getName();
        final String inputFileName = "input" + username + ".txt";
        final String outputFileName = "output" + username +".txt";

        Files.write(tempDir.resolve(inputFileName), input.getBytes());

        List<String> command = List.of(
                "docker", "run", "--rm",
                "--cpus=0.5", "--memory=256m",
                "-v", tempDir.toAbsolutePath() + ":" + WORKDIR,
                DOCKER_IMAGE,
                "bash", "-c",
                String.join(" && ", List.of(
                        "cd " + WORKDIR,
                        "g++ " + CPP_FILE + " -o solution",
                        "timeout 2s ./solution < " + inputFileName + " > " + outputFileName
                ))
        );

        ProcessBuilder pb = new ProcessBuilder(command);
        Process process = pb.start();
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            return EvaluationResult.builder()
                    .isCorrect(false)
                    .message(new String(process.getErrorStream().readAllBytes()))
                    .build();
        }

        String actualOutput = Files.readString(tempDir.resolve(outputFileName)).trim();
        deleteDirectoryRecursively(tempDir.toFile());

        if (actualOutput.equals(expectedOutput)) {
            return EvaluationResult.builder()
                    .isCorrect(true)
                    .message("OK")
                    .build();
        } else {
            return EvaluationResult.builder()
                    .isCorrect(false)
                    .message(actualOutput)
                    .build();
        }
    }
}
