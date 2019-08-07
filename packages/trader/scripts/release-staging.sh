#!/bin/sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
WHITE='\033[1;37m'
RESET='\033[0m'

function message {
    echo ${GREEN}"  >"${RESET} $1
}

function confirm {
    read -p "$(echo "\n${WHITE}$1 ${RESET}(y/n)${YELLOW}") " -n 1 -r &&
    echo "${RESET}"
}

cd $(git rev-parse --show-toplevel) && cd packages/trader/ &&

if [[ ! $(git config --get remote.origin.url) =~ binary-com/deriv-app ]]; then
    echo ${RED}"  > ERROR: "${RESET}"remote 'origin' should be pointing to binary-com/deriv-app."
    exit 1
fi

if [[ ! $(git rev-parse --abbrev-ref HEAD) =~ dev ]]; then
    echo ${RED}"  > ERROR: "${RESET}"Current working branch should be dev."
    exit 1
fi

message "Creating CNAME" &&
echo "staging.deriv.app" > ./scripts/CNAME &&

message "Checking npm production value" &&
if [[ $(npm config get production) =~ ^true$ ]]
then
    npm config set -g production false
fi

message "Installing packages" &&
npm ci &&

confirm "Please confirm release to STAGING" &&
if [[ $REPLY =~ ^[Nn]$ ]]
then
    message "Aborting release..."
    exit
fi &&

export NODE_ENV=staging &&

message "Running build and deploy" &&
npm run deploy:clean
