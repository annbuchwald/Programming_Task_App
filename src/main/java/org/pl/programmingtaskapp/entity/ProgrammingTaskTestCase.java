package org.pl.programmingtaskapp.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProgrammingTaskTestCase {
    private String input;
    private String expectedOutput;
}
