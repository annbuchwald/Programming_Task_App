package org.pl.programmingtaskapp.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "programming_tasks")
public class ProgrammingTask {
    @Id
    private String id;

    @Indexed(unique=true)
    private String title;

    private String description;

    private List<ProgrammingTaskTestCase> testCases;
}
