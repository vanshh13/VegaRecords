package com.vegarecords.category;

import com.vegarecords.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByUserOrIsSystemTrue(User user);
    Optional<Category> findByIdAndUserOrIsSystemTrue(UUID id, User user);

    @Query("SELECT c FROM Category c WHERE (c.user = :user OR c.isSystem = true) AND c.parentCategory IS NULL")
    List<Category> findRootCategories(@Param("user") User user);

    long countByIsSystemTrue();
}
