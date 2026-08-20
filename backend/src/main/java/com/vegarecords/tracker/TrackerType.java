package com.vegarecords.tracker;

import com.vegarecords.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tracker_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackerType {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    @Column(name = "is_system")
    private Boolean isSystem = false;

    @OneToMany(mappedBy = "trackerType", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TrackerTypeField> fields = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (isSystem == null) {
            isSystem = false;
        }
    }
}
