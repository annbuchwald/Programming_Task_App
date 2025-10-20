package org.pl.programmingtaskapp.repository;

import org.pl.programmingtaskapp.entity.ProgrammingTask;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends MongoRepository<ProgrammingTask, UUID> {
    Optional<ProgrammingTask> findFirstByTitle(String title);
}
