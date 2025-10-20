package org.pl.programmingtaskapp.controller;

import org.pl.programmingtaskapp.entity.EvaluationResult;
import org.pl.programmingtaskapp.entity.response.ProgrammingTaskResponse;
import org.pl.programmingtaskapp.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task")
public class TaskController {
    @Autowired
    private TaskService service;

    @GetMapping
    public List<ProgrammingTaskResponse> getAllTasks(@RequestParam(defaultValue = "0") int page) {
        return service.getAllTasks(page);
    }

    @GetMapping("/{title}")
    public ProgrammingTaskResponse getTaskByTitle(@PathVariable String title) {
        return service.getTaskByTitle(title);
    }

    @PostMapping("/{title}/answer")
    public String answerTask(@PathVariable String title, @RequestBody String answer) {
        return service.evaluateAnswer(answer, title).stream().map(EvaluationResult::toString).reduce("", (a, b) -> a + "\n" + b);
    }

    @GetMapping("/is-completed")
    public boolean isCompleted(@RequestParam String title) {
        return service.isCompletedByUser(title);
    }
}
