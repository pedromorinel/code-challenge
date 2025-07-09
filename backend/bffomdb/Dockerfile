FROM openjdk:21-jdk-slim

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY pom.xml .

COPY .mvn .mvn
COPY mvnw .

RUN chmod +x ./mvnw

RUN ./mvnw dependency:go-offline -B

COPY src ./src

RUN ./mvnw clean package

EXPOSE 8080

CMD ["java", "-jar", "target/bffomdb-0.0.1-SNAPSHOT.jar"] 