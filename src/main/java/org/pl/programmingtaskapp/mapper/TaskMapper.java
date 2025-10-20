package org.pl.programmingtaskapp.mapper;

import org.pl.programmingtaskapp.entity.ProgrammingTask;
import org.pl.programmingtaskapp.entity.response.ProgrammingTaskResponse;

public class TaskMapper {
    public static ProgrammingTask mapTaskResponseToTask(ProgrammingTaskResponse taskResponse) {
        return ProgrammingTask.builder()
                .title(taskResponse.getTitle())
                .description(taskResponse.getDescription())
                .testCases(taskResponse.getTestCases())
                .build();
    }

    public static ProgrammingTaskResponse mapTaskToTaskResponse(ProgrammingTask task) {
        return ProgrammingTaskResponse.builder()
                .title(task.getTitle())
                .description(task.getDescription())
                .testCases(task.getTestCases())
                .build();
    }
}
