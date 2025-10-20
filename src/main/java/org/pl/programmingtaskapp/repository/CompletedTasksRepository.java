package org.pl.programmingtaskapp.repository;

import org.pl.programmingtaskapp.entity.CompletedTask;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompletedTasksRepository extends MongoRepository<CompletedTask, UUID> {
    Optional<CompletedTask> findByUsernameAndTaskTitle(String username, String taskTitle);
}
