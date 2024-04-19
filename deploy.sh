#!/bin/bash

# const deployProc = Bun.spawn(["/tmp/repos/deploy.sh", localRepoDir, adminToken, apiHost, workspaceName, userToken], {

REPO_NAME=$1
ADMIN_TOKEN=$2
API_HOST=$3
WORKSPACE_NAME=$4
USER_TOKEN=$5

LOG_DIR=/tmp/repos/outlog
REPO_BASE=/tmp/repos

printf "\n------------\n" >> $LOG_DIR 


echo $REPO_NAME >> $LOG_DIR
echo $ADMIN_TOKEN >> $LOG_DIR 
echo $API_HOST >> $LOG_DIR
echo $WORKSPACE_NAME >> $LOG_DIR
echo $USER_TOKEN >> $LOG_DIR

cd $REPO_BASE/$REPO_NAME/tinybird

printf "\n" >> $LOG_DIR 

echo '--STEP auth' >> $LOG_DIR
tb auth --token $ADMIN_TOKEN --host $API_HOST
echo '--STEP ws create' >> $LOG_DIR
tb workspace create --user_token $USER_TOKEN $WORKSPACE_NAME
echo '--STEP ws use' >> $LOG_DIR
tb workspace use $WORKSPACE_NAME
echo '--STEP push' >> $LOG_DIR
tb push --yes --user_token $API_HOST
echo '--STEP deployed' >> $LOG_DIR
cd $REPO_BASE
rm -rf $REPO_NAME
echo '--STEP deleted' >> $LOG_DIR


printf "\n------------" >> $LOG_DIR 
