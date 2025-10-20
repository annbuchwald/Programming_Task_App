package org.pl.programmingtaskapp.service;

import org.pl.programmingtaskapp.entity.CompletedTask;
import org.pl.programmingtaskapp.entity.EvaluationResult;
import org.pl.programmingtaskapp.entity.ProgrammingTask;
import org.pl.programmingtaskapp.entity.ProgrammingTaskTestCase;
import org.pl.programmingtaskapp.entity.response.ProgrammingTaskResponse;
import org.pl.programmingtaskapp.mapper.TaskMapper;
import org.pl.programmingtaskapp.repository.CompletedTasksRepository;
import org.pl.programmingtaskapp.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository repository;

    @Autowired
    private CodeEvaluationService evaluationService;

    @Autowired
    private CompletedTasksRepository completedTasksRepository;

    public List<ProgrammingTaskResponse> getAllTasks(int page) {
        return repository.findAll(PageRequest.of(page, 20)).stream().map(TaskMapper::mapTaskToTaskResponse).toList();
    }

    public ProgrammingTaskResponse getTaskByTitle(String title) {
        return repository.findFirstByTitle(title).stream().map(TaskMapper::mapTaskToTaskResponse).findFirst().orElse(null);
    }

    public List<EvaluationResult> evaluateAnswer(String answer, String title) {
        Optional<ProgrammingTask> programmingTask = repository.findFirstByTitle(title);
        if (programmingTask.isEmpty()) {
            throw new IllegalArgumentException("Task not found!");
        }
        List<ProgrammingTaskTestCase> testCases = programmingTask.get().getTestCases();

        List<EvaluationResult> results = new ArrayList<>();
        for (ProgrammingTaskTestCase testCase : testCases) {
            String input = testCase.getInput();
            String expectedOutput = testCase.getExpectedOutput();

            try {
                results.add(evaluationService.evaluateCode(answer, input, expectedOutput));
            } catch (IOException | InterruptedException e) {
                throw new RuntimeException("Error evaluating answer!");
            }
        }
        if (results.stream().allMatch(EvaluationResult::isCorrect)) {
            final String username = SecurityContextHolder.getContext().getAuthentication().getName();
            final String taskTitle = programmingTask.get().getTitle();
            if (completedTasksRepository.findByUsernameAndTaskTitle(username, taskTitle).isEmpty()) {
                completedTasksRepository.insert(CompletedTask.builder()
                        .username(username)
                        .taskTitle(taskTitle)
                        .build());
            }
        }
        return results;
    }

    public boolean isCompletedByUser(String taskTitle) {
        final String username = SecurityContextHolder.getContext().getAuthentication().getName();

        return completedTasksRepository.findByUsernameAndTaskTitle(username, taskTitle).isPresent();
    }
}
