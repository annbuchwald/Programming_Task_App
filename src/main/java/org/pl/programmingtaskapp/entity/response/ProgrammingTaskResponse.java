package org.pl.programmingtaskapp.entity.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.pl.programmingtaskapp.entity.ProgrammingTaskTestCase;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProgrammingTaskResponse {
    private String title;

    private String description;

    private List<ProgrammingTaskTestCase> testCases;
}
