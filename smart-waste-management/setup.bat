@echo off
echo Starting Smart Waste Management System Setup...

echo Creating necessary directories...
mkdir src\main\resources\static
mkdir src\main\resources\templates
mkdir uploads
mkdir logs

echo Setting up Maven wrapper...
mvnw clean

echo Updating Maven dependencies...
mvnw dependency:purge-local-repository
mvnw clean install -U

echo Creating database...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS waste_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo Setup complete! You can now run the application using: mvnw spring-boot:run