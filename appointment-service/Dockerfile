# Etapa 1: Construcción con Maven
# Usamos una imagen que contiene Maven y Java 17 para compilar el proyecto.
FROM maven:3.9-eclipse-temurin-17 AS build

# Establecemos el directorio de trabajo dentro del contenedor.
WORKDIR /app

# Copiamos primero el pom.xml para aprovechar el caché de capas de Docker.
# Si las dependencias no cambian, no se volverán a descargar.
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiamos el resto del código fuente.
COPY src ./src

# Compilamos la aplicación, omitiendo los tests para agilizar la construcción.
RUN mvn package -DskipTests

# Etapa 2: Imagen final de ejecución
# Usamos una imagen base ligera que solo contiene el JRE de Java 17.
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copiamos el archivo .jar compilado desde la etapa de 'build'.
COPY --from=build /app/target/appointment-service-*.jar app.jar

# Exponemos el puerto en el que corre el servicio.
EXPOSE 8082

# Comando para ejecutar la aplicación al iniciar el contenedor.
ENTRYPOINT ["java", "-jar", "app.jar"]