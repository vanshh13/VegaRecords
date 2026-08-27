package com.vegarecords.tracker;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tracker_values")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackerValue {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tracker_id", nullable = false)
    private Tracker tracker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tracker_field_id", nullable = true)
    private TrackerTypeField trackerField;

    @Column(name = "value_json", columnDefinition = "TEXT")
    private String valueJson;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
