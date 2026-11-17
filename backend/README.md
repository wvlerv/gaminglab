# GamingLab backend

Requirements: Java 21 and Maven.

Run locally:

```powershell
cd backend
mvn spring-boot:run
```

API base: http://localhost:8080
Health: http://localhost:8080/actuator/health
H2 console: http://localhost:8080/h2-console

H2 uses a file database stored in `backend/data/gaminglab.mv.db`. Configure the database URL in `src/main/resources/application.properties`.
