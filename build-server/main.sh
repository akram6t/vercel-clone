#!/bin/bash

export GIT_REPOSITORY__URL="$GIT_REPOSITORY__URL"

# Create .env file from BUILD_ prefixed variables
env | grep '^BUILD_' > /home/app/output/.env

git clone "$GIT_REPOSITORY__URL" /home/app/output

exec node script.js