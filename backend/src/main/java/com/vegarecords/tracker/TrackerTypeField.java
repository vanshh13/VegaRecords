package com.vegarecords.tracker;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tracker_type_fields")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackerTypeField {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tracker_type_id", nullable = false)
    private TrackerType trackerType;

    @Column(name = "field_name", nullable = false, length = 100)
    private String fieldName;

    @Column(name = "field_type", nullable = false, length = 50)
    private String fieldType;

    @Builder.Default
    @Column(name = "is_required")
    private Boolean isRequired = false;

    @Builder.Default
    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (isRequired == null) {
            isRequired = false;
        }
        if (displayOrder == null) {
            displayOrder = 0;
        }
    }
}
