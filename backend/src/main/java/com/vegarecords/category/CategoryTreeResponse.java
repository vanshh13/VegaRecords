package com.vegarecords.category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryTreeResponse {

    private UUID id;
    private String name;
    private String description;
    private String icon;
    private String color;
    private Boolean isSystem;
    @Builder.Default
    private List<CategoryTreeResponse> children = new ArrayList<>();
}
