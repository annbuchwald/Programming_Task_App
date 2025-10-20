package org.pl.programmingtaskapp.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "completed_tasks")
public class CompletedTask {
    @Id
    private String id;

    @Field("username")
    private String username;

    @Field("task_title")
    private String taskTitle;
}
