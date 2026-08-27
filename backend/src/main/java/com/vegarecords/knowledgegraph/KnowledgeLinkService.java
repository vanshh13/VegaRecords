package com.vegarecords.knowledgegraph;

import com.vegarecords.auth.entity.User;
import com.vegarecords.auth.exception.ResourceNotFoundException;
import com.vegarecords.auth.repository.UserRepository;
import com.vegarecords.category.Category;
import com.vegarecords.category.CategoryRepository;
import com.vegarecords.note.Note;
import com.vegarecords.note.NoteRepository;
import com.vegarecords.resource.Resource;
import com.vegarecords.resource.ResourceRepository;
import com.vegarecords.task.Task;
import com.vegarecords.task.TaskRepository;
import com.vegarecords.tracker.Tracker;
import com.vegarecords.tracker.TrackerRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KnowledgeLinkService {

    private final KnowledgeLinkRepository knowledgeLinkRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final NoteRepository noteRepository;
    private final ResourceRepository resourceRepository;
    private final TrackerRepository trackerRepository;
    private final CategoryRepository categoryRepository;

    private static final Set<String> VALID_ENTITY_TYPES = Set.of(
            "TASK", "NOTE", "RESOURCE", "TRACKER", "CATEGORY"
    );

    private static final Set<String> VALID_RELATION_TYPES = Set.of(
            "RELATED_TO", "DEPENDS_ON", "REFERENCES", "PART_OF", "LEARNING_PATH"
    );

    @Transactional
    public KnowledgeLinkResponse createLink(String userEmail, KnowledgeLinkRequest request) {
        User user = findUser(userEmail);

        String srcType = request.getSourceType().toUpperCase();
        String tgtType = request.getTargetType().toUpperCase();
        String relType = request.getRelationType() != null ? request.getRelationType().toUpperCase() : "RELATED_TO";

        if (!VALID_ENTITY_TYPES.contains(srcType)) {
            throw new IllegalArgumentException("Invalid source type: " + srcType);
        }
        if (!VALID_ENTITY_TYPES.contains(tgtType)) {
            throw new IllegalArgumentException("Invalid target type: " + tgtType);
        }
        if (!VALID_RELATION_TYPES.contains(relType)) {
            throw new IllegalArgumentException("Invalid relation type: " + relType);
        }

        // Prevent duplicate links
        if (knowledgeLinkRepository.existsByUserAndSourceTypeAndSourceIdAndTargetTypeAndTargetId(
                user, srcType, request.getSourceId(), tgtType, request.getTargetId())) {
            throw new IllegalArgumentException("This link already exists");
        }

        KnowledgeLink link = KnowledgeLink.builder()
                .user(user)
                .sourceType(srcType)
                .sourceId(request.getSourceId())
                .targetType(tgtType)
                .targetId(request.getTargetId())
                .relationType(relType)
                .build();

        KnowledgeLink saved = knowledgeLinkRepository.save(link);
        return toResponse(saved);
    }

    @Transactional
    public void deleteLink(String userEmail, UUID linkId) {
        User user = findUser(userEmail);
        KnowledgeLink link = knowledgeLinkRepository.findById(linkId)
                .orElseThrow(() -> new ResourceNotFoundException("Knowledge link not found"));

        if (!link.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Knowledge link not found");
        }

        knowledgeLinkRepository.delete(link);
    }

    public List<KnowledgeLinkResponse> getLinksForEntity(String userEmail, String entityType, UUID entityId) {
        User user = findUser(userEmail);
        String type = entityType.toUpperCase();

        if (!VALID_ENTITY_TYPES.contains(type)) {
            throw new IllegalArgumentException("Invalid entity type: " + type);
        }

        return knowledgeLinkRepository.findByUserAndEntity(user, type, entityId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public KnowledgeGraphResponse getFullGraph(String userEmail) {
        User user = findUser(userEmail);

        Map<String, KnowledgeGraphResponse.GraphNode> nodeMap = new LinkedHashMap<>();
        List<KnowledgeGraphResponse.GraphEdge> edges = new ArrayList<>();
        Set<String> seenEdgeKeys = new HashSet<>();

        // 1. Automatically load Categories for user or system
        List<Category> categories = categoryRepository.findByUserOrIsSystemTrue(user);
        for (Category c : categories) {
            String nodeId = c.getId().toString();
            nodeMap.put(nodeId, KnowledgeGraphResponse.GraphNode.builder()
                    .id(nodeId)
                    .entityType("CATEGORY")
                    .label(c.getName())
                    .build());

            if (c.getParentCategory() != null) {
                String targetId = c.getParentCategory().getId().toString();
                String edgeKey = nodeId + "->PART_OF->" + targetId;
                if (seenEdgeKeys.add(edgeKey)) {
                    edges.add(KnowledgeGraphResponse.GraphEdge.builder()
                            .id(UUID.nameUUIDFromBytes(edgeKey.getBytes()).toString())
                            .source(nodeId)
                            .target(targetId)
                            .relationType("PART_OF")
                            .build());
                }
            }
        }

        // 2. Automatically load Tasks for user
        List<Task> tasks = taskRepository.findByUser(user);
        for (Task t : tasks) {
            String nodeId = t.getId().toString();
            nodeMap.put(nodeId, KnowledgeGraphResponse.GraphNode.builder()
                    .id(nodeId)
                    .entityType("TASK")
                    .label(t.getTitle())
                    .build());

            if (t.getCategory() != null) {
                String targetId = t.getCategory().getId().toString();
                String edgeKey = nodeId + "->PART_OF->" + targetId;
                if (seenEdgeKeys.add(edgeKey)) {
                    edges.add(KnowledgeGraphResponse.GraphEdge.builder()
                            .id(UUID.nameUUIDFromBytes(edgeKey.getBytes()).toString())
                            .source(nodeId)
                            .target(targetId)
                            .relationType("PART_OF")
                            .build());
                }
            }
        }

        // 3. Automatically load Notes for user
        List<Note> notes = noteRepository.findByUser(user);
        for (Note n : notes) {
            String nodeId = n.getId().toString();
            nodeMap.put(nodeId, KnowledgeGraphResponse.GraphNode.builder()
                    .id(nodeId)
                    .entityType("NOTE")
                    .label(n.getTitle())
                    .build());

            if (n.getCategory() != null) {
                String targetId = n.getCategory().getId().toString();
                String edgeKey = nodeId + "->PART_OF->" + targetId;
                if (seenEdgeKeys.add(edgeKey)) {
                    edges.add(KnowledgeGraphResponse.GraphEdge.builder()
                            .id(UUID.nameUUIDFromBytes(edgeKey.getBytes()).toString())
                            .source(nodeId)
                            .target(targetId)
                            .relationType("PART_OF")
                            .build());
                }
            }
            if (n.getTrackerId() != null) {
                String targetId = n.getTrackerId().toString();
                String edgeKey = nodeId + "->PART_OF->" + targetId;
                if (seenEdgeKeys.add(edgeKey)) {
                    edges.add(KnowledgeGraphResponse.GraphEdge.builder()
                            .id(UUID.nameUUIDFromBytes(edgeKey.getBytes()).toString())
                            .source(nodeId)
                            .target(targetId)
                            .relationType("PART_OF")
                            .build());
                }
            }
        }

        // 4. Automatically load Resources for user
        List<Resource> resources = resourceRepository.findByUser(user);
        for (Resource r : resources) {
            String nodeId = r.getId().toString();
            nodeMap.put(nodeId, KnowledgeGraphResponse.GraphNode.builder()
                    .id(nodeId)
                    .entityType("RESOURCE")
                    .label(r.getTitle())
                    .build());

            if (r.getCategories() != null) {
                for (Category c : r.getCategories()) {
                    String targetId = c.getId().toString();
                    String edgeKey = nodeId + "->PART_OF->" + targetId;
                    if (seenEdgeKeys.add(edgeKey)) {
                        edges.add(KnowledgeGraphResponse.GraphEdge.builder()
                                .id(UUID.nameUUIDFromBytes(edgeKey.getBytes()).toString())
                                .source(nodeId)
                                .target(targetId)
                                .relationType("PART_OF")
                                .build());
                    }
                }
            }
        }

        // 5. Automatically load Trackers for user
        List<Tracker> trackers = trackerRepository.findByUser(user);
        for (Tracker tr : trackers) {
            String nodeId = tr.getId().toString();
            nodeMap.put(nodeId, KnowledgeGraphResponse.GraphNode.builder()
                    .id(nodeId)
                    .entityType("TRACKER")
                    .label(tr.getTitle())
                    .build());
        }

        // 6. Incorporate custom user links from knowledge_links table
        List<KnowledgeLink> manualLinks = knowledgeLinkRepository.findByUser(user);
        for (KnowledgeLink link : manualLinks) {
            String srcId = link.getSourceId().toString();
            String tgtId = link.getTargetId().toString();
            String edgeKey = srcId + "->" + link.getRelationType() + "->" + tgtId;

            if (seenEdgeKeys.add(edgeKey)) {
                edges.add(KnowledgeGraphResponse.GraphEdge.builder()
                        .id(link.getId().toString())
                        .source(srcId)
                        .target(tgtId)
                        .relationType(link.getRelationType())
                        .build());
            }
        }

        return KnowledgeGraphResponse.builder()
                .nodes(new ArrayList<>(nodeMap.values()))
                .edges(edges)
                .build();
    }


    private void resolveNames(Map<String, Set<UUID>> entityIdsByType, Map<String, String> nameCache, User user) {
        Set<UUID> taskIds = entityIdsByType.getOrDefault("TASK", Collections.emptySet());
        if (!taskIds.isEmpty()) {
            taskRepository.findAllById(taskIds).forEach(t ->
                    nameCache.put("TASK:" + t.getId(), t.getTitle()));
        }

        Set<UUID> noteIds = entityIdsByType.getOrDefault("NOTE", Collections.emptySet());
        if (!noteIds.isEmpty()) {
            noteRepository.findAllById(noteIds).forEach(n ->
                    nameCache.put("NOTE:" + n.getId(), n.getTitle()));
        }

        Set<UUID> resourceIds = entityIdsByType.getOrDefault("RESOURCE", Collections.emptySet());
        if (!resourceIds.isEmpty()) {
            resourceRepository.findAllById(resourceIds).forEach(r ->
                    nameCache.put("RESOURCE:" + r.getId(), r.getTitle()));
        }

        Set<UUID> trackerIds = entityIdsByType.getOrDefault("TRACKER", Collections.emptySet());
        if (!trackerIds.isEmpty()) {
            trackerRepository.findAllById(trackerIds).forEach(t ->
                    nameCache.put("TRACKER:" + t.getId(), t.getTitle()));
        }

        Set<UUID> categoryIds = entityIdsByType.getOrDefault("CATEGORY", Collections.emptySet());
        if (!categoryIds.isEmpty()) {
            categoryRepository.findAllById(categoryIds).forEach(c ->
                    nameCache.put("CATEGORY:" + c.getId(), c.getName()));
        }
    }

    private KnowledgeLinkResponse toResponse(KnowledgeLink link) {
        return KnowledgeLinkResponse.builder()
                .id(link.getId())
                .sourceType(link.getSourceType())
                .sourceId(link.getSourceId())
                .sourceName(resolveEntityName(link.getSourceType(), link.getSourceId()))
                .targetType(link.getTargetType())
                .targetId(link.getTargetId())
                .targetName(resolveEntityName(link.getTargetType(), link.getTargetId()))
                .relationType(link.getRelationType())
                .createdAt(link.getCreatedAt())
                .build();
    }

    private String resolveEntityName(String type, UUID id) {
        try {
            return switch (type) {
                case "TASK" -> taskRepository.findById(id).map(t -> t.getTitle()).orElse("Deleted Task");
                case "NOTE" -> noteRepository.findById(id).map(n -> n.getTitle()).orElse("Deleted Note");
                case "RESOURCE" -> resourceRepository.findById(id).map(r -> r.getTitle()).orElse("Deleted Resource");
                case "TRACKER" -> trackerRepository.findById(id).map(t -> t.getTitle()).orElse("Deleted Tracker");
                case "CATEGORY" -> categoryRepository.findById(id).map(c -> c.getName()).orElse("Deleted Category");
                default -> "Unknown";
            };
        } catch (Exception e) {
            return "Unknown";
        }
    }

    private User findUser(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
