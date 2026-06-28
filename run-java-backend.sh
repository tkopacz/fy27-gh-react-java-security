#!/bin/bash
cd backend
# export JAVA_HOME="/c/Program Files/Java/jdk-21"
# export PATH="$JAVA_HOME/bin:$PATH"
mvn test
mvn spring-boot:run