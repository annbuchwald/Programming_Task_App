package org.pl.programmingtaskapp;

import org.springframework.boot.SpringApplication;

public class TestProgrammingTaskAppApplication {

    public static void main(String[] args) {
        SpringApplication.from(ProgrammingTaskAppApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
