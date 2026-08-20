package com.vegarecords.activity;

import com.vegarecords.auth.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {
    Page<ActivityLog> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    List<ActivityLog> findTop10ByUserOrderByCreatedAtDesc(User user);
}
