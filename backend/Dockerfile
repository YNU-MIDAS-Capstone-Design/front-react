FROM --platform=linux/amd64 gradle:8.12.1-jdk17 AS build
WORKDIR /app

COPY build.gradle settings.gradle ./

RUN gradle dependencies --no-daemon

COPY . /app

RUN gradle clean build -x test --no-daemon --refresh-dependencies

FROM --platform=linux/amd64 eclipse-temurin:17.0.10_7-jre
WORKDIR /app

COPY --from=build /app/build/libs/*.jar /app/agile.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/agile.jar"]