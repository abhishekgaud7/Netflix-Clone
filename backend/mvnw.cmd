@echo off
set MAVEN_HOME=C:\Users\lenovo\Downloads\apache-maven-3.9.6
set JAVA_HOME=C:\Program Files\Java\jdk-21.0.11
set PATH=%MAVEN_HOME%\bin;%JAVA_HOME%\bin;%PATH%
"%MAVEN_HOME%\bin\mvn.cmd" %*
