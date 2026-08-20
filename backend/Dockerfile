# backend/Dockerfile
# Build stage
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app

# Copy only what we need first for caching
COPY pom.xml .
COPY src ./src

# Build the fat jar (skip tests during Docker build for speed; run tests in CI)
RUN mvn -B -DskipTests clean package

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy built jar (artifactId + version from pom.xml)
COPY --from=build /app/target/traceback-backend-1.0.0.jar ./app.jar

# Application listens on PORT env var (application.properties already reads ${PORT:8080})
EXPOSE 8080

ENV JAVA_OPTS=""

CMD ["sh", "-c", "java $JAVA_OPTS -jar /app.jar"]
