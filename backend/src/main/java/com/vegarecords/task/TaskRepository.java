package com.vegarecords.task;

import com.vegarecords.auth.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    Optional<Task> findByIdAndUser(UUID id, User user);
    List<Task> findByUser(User user);

    @Query("SELECT t FROM Task t LEFT JOIN t.category c WHERE t.user = :user " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:priority IS NULL OR t.priority = :priority) " +
           "AND (:categoryId IS NULL OR c.id = :categoryId) " +
           "AND (:search IS NULL OR LOWER(t.title) LIKE :search OR LOWER(t.description) LIKE :search)")
    Page<Task> findAllWithFilters(
            @Param("user") User user,
            @Param("status") TaskStatus status,
            @Param("priority") TaskPriority priority,
            @Param("categoryId") UUID categoryId,
            @Param("search") String search,
            Pageable pageable
    );

    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.status != com.vegarecords.task.TaskStatus.COMPLETED AND t.dueDate >= :now ORDER BY t.dueDate ASC")
    List<Task> findUpcomingTasks(@Param("user") User user, @Param("now") LocalDateTime now);

    long countByUser(User user);
    long countByUserAndStatus(User user, TaskStatus status);
}
