package com.vegarecords.auth.security;

import com.vegarecords.auth.entity.Role;
import com.vegarecords.auth.repository.RoleRepository;
import com.vegarecords.category.Category;
import com.vegarecords.category.CategoryRepository;
import com.vegarecords.tracker.TrackerType;
import com.vegarecords.tracker.TrackerTypeField;
import com.vegarecords.tracker.TrackerTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final CategoryRepository categoryRepository;
    private final TrackerTypeRepository trackerTypeRepository;

    @Override
    public void run(String... args) {
        createRoleIfNotFound("ADMIN");
        createRoleIfNotFound("USER");
        seedSystemCategories();
        seedSystemTrackerTypes();
    }

    private void createRoleIfNotFound(String roleName) {
        if (roleRepository.findByRoleName(roleName).isEmpty()) {
            Role role = Role.builder()
                    .roleName(roleName)
                    .build();
            roleRepository.save(role);
            log.info("Initialized role: {}", roleName);
        }
    }

    private void seedSystemCategories() {
        if (categoryRepository.countByIsSystemTrue() == 0) {
            List<Category> systemCategories = List.of(
                Category.builder().name("Entertainment").description("Movies, Series, Anime, Gaming, Music & Media").icon("Film").color("#ec4899").isSystem(true).build(),
                Category.builder().name("Health & Fitness").description("Workouts, Nutrition, Weight Loss & Daily Habits").icon("Heart").color("#ef4444").isSystem(true).build(),
                Category.builder().name("Finance").description("Expenses, Investments, Budgets & Subscriptions").icon("Database").color("#10b981").isSystem(true).build(),
                Category.builder().name("Career").description("Job Applications, Projects, Skills & Resume Milestones").icon("Briefcase").color("#3b82f6").isSystem(true).build(),
                Category.builder().name("Learning").description("Books, Courses, Certifications & Reading Goals").icon("Book").color("#8b5cf6").isSystem(true).build(),
                Category.builder().name("Travel").description("Destinations, Itineraries, Packing Lists & Triplogs").icon("Globe").color("#06b6d4").isSystem(true).build(),
                Category.builder().name("Lifestyle").description("Daily Routines, Hobbies & Personal Interests").icon("Coffee").color("#f59e0b").isSystem(true).build(),
                Category.builder().name("Personal Development").description("Mindfulness, Gratitude & Life Milestones").icon("Sparkles").color("#a855f7").isSystem(true).build(),
                Category.builder().name("Productivity").description("Tasks, Projects, Time Tracking & Goal Sprints").icon("Zap").color("#6366f1").isSystem(true).build(),
                Category.builder().name("Custom").description("Custom User Categories & Uncategorized Trackers").icon("Layers").color("#64748b").isSystem(true).build()
            );

            categoryRepository.saveAll(systemCategories);
            log.info("Initialized {} System Categories", systemCategories.size());
        }
    }

    private void seedSystemTrackerTypes() {
        if (trackerTypeRepository.findAll().stream().noneMatch(t -> Boolean.TRUE.equals(t.getIsSystem()))) {
            seedTrackerType("Progress Tracker", "Track progress towards numeric targets or completion milestones", List.of(
                field("Target Value", "NUMBER", true, 1),
                field("Current Progress", "NUMBER", true, 2),
                field("Unit", "TEXT", false, 3)
            ));

            seedTrackerType("Habit Tracker", "Build routines and track daily/weekly completion streaks", List.of(
                field("Frequency", "TEXT", true, 1),
                field("Target Days", "NUMBER", true, 2),
                field("Streak Counter", "NUMBER", false, 3)
            ));

            seedTrackerType("Collection Tracker", "Catalog books, movies, games, or items with ratings & statuses", List.of(
                field("Item Title", "TEXT", true, 1),
                field("Status", "TEXT", true, 2),
                field("Rating", "NUMBER", false, 3),
                field("Log Date", "DATE", false, 4)
            ));

            seedTrackerType("Expense Tracker", "Log income, daily spending, payment methods and category analytics", List.of(
                field("Amount", "NUMBER", true, 1),
                field("Category", "TEXT", true, 2),
                field("Payment Method", "TEXT", false, 3),
                field("Transaction Date", "DATE", true, 4)
            ));

            seedTrackerType("Goal Tracker", "Define key milestones, target dates and long-term objective completion", List.of(
                field("Goal Description", "TEXT", true, 1),
                field("Target Date", "DATE", true, 2),
                field("Priority Level", "TEXT", false, 3)
            ));

            seedTrackerType("Subscription Tracker", "Monitor recurring payments, billing dates and monthly spend summaries", List.of(
                field("Service Name", "TEXT", true, 1),
                field("Billing Amount", "NUMBER", true, 2),
                field("Billing Frequency", "TEXT", true, 3),
                field("Renewal Date", "DATE", true, 4)
            ));

            seedTrackerType("Project Tracker", "Manage multi-step initiatives with status boards and task deadlines", List.of(
                field("Task / Feature Name", "TEXT", true, 1),
                field("Status", "TEXT", true, 2),
                field("Priority", "TEXT", false, 3),
                field("Due Date", "DATE", false, 4)
            ));

            seedTrackerType("Custom Tracker", "Flexible blank canvas schema with custom dynamic field definitions", List.of(
                field("Item Name", "TEXT", true, 1),
                field("Notes", "TEXT", false, 2)
            ));

            log.info("Initialized 8 System Tracker Types");
        }
    }

    private void seedTrackerType(String name, String description, List<TrackerTypeField> fields) {
        TrackerType type = TrackerType.builder()
                .name(name)
                .description(description)
                .isSystem(true)
                .build();

        fields.forEach(f -> f.setTrackerType(type));
        type.setFields(fields);
        trackerTypeRepository.save(type);
    }

    private TrackerTypeField field(String name, String type, boolean required, int order) {
        return TrackerTypeField.builder()
                .fieldName(name)
                .fieldType(type)
                .isRequired(required)
                .displayOrder(order)
                .build();
    }
}
