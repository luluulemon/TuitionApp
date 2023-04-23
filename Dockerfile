## 1. Build Angular
FROM node:19 as angular

WORKDIR /app

# Copy files
COPY client/tuitionClient/angular.json .
COPY client/tuitionClient/package.json .
COPY client/tuitionClient/package-lock.json .
COPY client/tuitionClient/tsconfig.app.json .
COPY client/tuitionClient/tsconfig.json .
COPY client/tuitionClient/tsconfig.spec.json .
COPY client/tuitionClient/src ./src
#
# Install Angular
RUN npm install -g @angular/cli

# Install packages and build
RUN npm i
RUN ng build




## 2: Build Spring Boot
FROM maven:3.9.0-eclipse-temurin-19 AS springboot

WORKDIR /app

## build
COPY server/mvnw .
COPY server/mvnw.cmd .
COPY server/pom.xml .
COPY server/src ./src

# Copy compiled angular app to static directory
COPY --from=angular /app/dist/tuition-client ./src/main/resources/static

RUN mvn package -Dmaven.test.skip=true

# 3. Copy the final Jar file
FROM eclipse-temurin:19-jre

WORKDIR /app

COPY --from=springboot /app/target/server-0.0.1-SNAPSHOT.jar server.jar

## run
ENV PORT=8080
# ENV DB_SERVER=containers-us-west-26.railway.app
# ENV DB_PORT=5475

ENV SPRING_DATASOURCE_URL=jdbc:mysql://containers-us-west-26.railway.app:5475/tuition

EXPOSE ${PORT}

ENTRYPOINT java -Dserver.port=${PORT} -jar server.jar