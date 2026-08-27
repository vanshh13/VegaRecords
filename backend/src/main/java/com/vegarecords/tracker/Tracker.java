package com.vegarecords.tracker;

import com.vegarecords.auth.entity.User;
import com.vegarecords.category.Category;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "trackers", indexes = {
        @Index(name = "idx_tracker_user", columnList = "user_id"),
        @Index(name = "idx_tracker_type", columnList = "tracker_type_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tracker {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tracker_type_id", nullable = false)
    private TrackerType trackerType;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Builder.Default
    @Column(length = 50)
    private String status = "ACTIVE";

    @Column(name = "cover_url", columnDefinition = "TEXT")
    private String coverUrl;

    @Column(name = "current_count")
    @Builder.Default
    private Integer currentCount = 0;

    @Column(name = "target_count")
    @Builder.Default
    private Integer targetCount = 100;

    @Column(name = "unit_label", length = 50)
    private String unitLabel;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "is_ongoing")
    @Builder.Default
    private Boolean isOngoing = false;

    @Column(name = "is_favorite")
    @Builder.Default
    private Boolean isFavorite = false;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "tracker_categories",
            joinColumns = @JoinColumn(name = "tracker_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @Builder.Default
    private Set<Category> categories = new HashSet<>();

    @OneToMany(mappedBy = "tracker", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TrackerValue> values = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
        if (status == null) {
            status = "ACTIVE";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
