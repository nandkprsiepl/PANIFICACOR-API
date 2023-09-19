#!/bin/bash

apt install maven
nohup mvn spring-boot:run &
#ps aux | grep -i spring-boot:run | awk {'print $2'} | xargs kill -9
#kill $(lsof -t -i:8080)
#lsof -i:3000 | awk {'print $2'}  | xargs  | awk {'print $2'} | xargs kill -9