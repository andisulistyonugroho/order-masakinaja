#!/bin/sh
# Black        0;30     Dark Gray     1;30
# Red          0;31     Light Red     1;31
# Green        0;32     Light Green   1;32
# Brown/Orange 0;33     Yellow        1;33
# Blue         0;34     Light Blue    1;34
# Purple       0;35     Light Purple  1;35
# Cyan         0;36     Light Cyan    1;36
# Light Gray   0;37     White         1;37
YELLOW='\033[0;33m'
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "${RED}ENVIRONMENT: $NODE_ENV >>>>>> $(date)${NC}"
echo "${BLUE}STATE: START, BISMILLAH >>>>>> $(date)${NC}"
echo "${GREEN}STATE: GENERATING STATIC CONTENT >>>>>> $(date)${NC}"
npm run generate-production
echo "${RED}STATE: DONE GENERATING STATIC CONTENT >>>>>> $(date)${NC}"
echo "${GREEN}STATE: DEPLOYING TO PRODUCTION >>>>>> $(date)${NC}"
scp -r dist/* syaamil-event-api:MASAKINAJA/member-masakinaja/.
echo "${RED}STATE: DONE DEPLOYING TO PRODUCTION >>>>>> $(date)${NC}"
echo "${GREEN}STATE: FINISH, ALHAMDULILLAH >>>>>> $(date)${NC}"
