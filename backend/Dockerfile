# ==========================================
# Stage 1: Build Stage
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy pom.xml to resolve dependencies first for Docker layer caching
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build production executable JAR package
RUN mvn clean package -DskipTests

# ==========================================
# Stage 2: Runtime Stage
# ==========================================
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Create a non-root dedicated user and group for container security
RUN addgroup -S springgroup && adduser -S springuser -G springgroup

# Copy compiled JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Set file permissions for non-root execution
RUN chown -R springuser:springgroup /app

# Switch to non-root user context
USER springuser

# Expose default port (Render dynamically binds $PORT at runtime)
EXPOSE 8080

# Default environment configuration (optimized for Render memory limits)
ENV PORT=8080 \
    JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

# Execute application using Java CLI
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
