# Smart Waste Management System - AI Agent Instructions

This document provides essential context for AI agents working with this codebase.

## Project Overview

This is a Spring Boot application for smart waste management, built with:
- Java 17
- Spring Boot 3.5.7
- Spring Data REST
- Spring WebFlux for reactive programming
- Spring Web for traditional web endpoints

## Project Structure

```
src/
  main/
    java/com/example/smart/waste/management/
      SmartWasteManagementApplication.java  # Main application entry point
    resources/
      application.properties                # Application configuration
      static/                              # Static web resources
      templates/                           # Template files
```

## Development Workflow

### Building and Running
1. Build the project:
   ```bash
   ./mvnw clean install
   ```
2. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Key Architectural Patterns
- Uses Spring Boot's opinionated defaults and auto-configuration
- RESTful service design with Spring Data REST
- Reactive programming support through WebFlux

## Integration Points
- REST endpoints automatically exposed through Spring Data REST
- Reactive endpoints using WebFlux for handling streaming data

## Testing
The project uses Spring Boot's testing framework. Test classes are located in `src/test/java/`.

## Configuration
- Main application properties are in `src/main/resources/application.properties`
- Development-specific configuration uses Spring Boot DevTools

---
Note: This is a new project under development. As the codebase grows, these instructions should be updated to reflect new patterns and conventions.