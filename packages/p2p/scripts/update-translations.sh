#!/bin/sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
WHITE='\033[1;37m'
RESET='\033[0m'

if ! [ -x "$(command -v crowdin)" ]; then
    if [ -f /usr/local/bin/crowdin-cli.jar ]; then
        alias crowdin="java -jar /usr/local/bin/crowdin-cli.jar"
    else
        echo ${YELLOW}"crowdin-cli not found. Please follow the instructions here: https://support.crowdin.com/cli-tool/#installation"${RESET}
        exit 1
    fi
fi

if [[ $(git config --get remote.origin.url) =~ binary-com/deriv-app ]]; then
    echo ${RED}"  > ERROR: "${RESET}"remote 'origin' should be your fork."
    exit 1
fi

function message {
    echo ${GREEN}"  >"${RESET} $1
}

function confirm {
    read -p "$(echo "\n${WHITE}$1 ${RESET}(y/n)${YELLOW}") " -n 1 -r &&
    echo "${RESET}"
}

cd $(git rev-parse --show-toplevel) &&

message "Updating translations branch" &&
git branch -D translations &&
git push origin --delete translations
git checkout -b translations &&
git pull upstream dev &&

confirm "Update the source file (messages.json) and push to Crowdin?" &&
if [[ $REPLY =~ ^[Yy]$ ]]
then
    message "Updating translations source file" &&
    cd $(git rev-parse --show-toplevel) && cd packages/p2p/scripts && node extract-translations.js &&
    message "Uploading source file to Crowdin"
    cd $(git rev-parse --show-toplevel) && cd packages/p2p && source ~/.bash_profile && crowdin upload sources
    message "Complete, new translations have been uploaded to Crowdin"
fi &&

confirm "Download translation files and update javascript texts?" &&
if [[ $REPLY =~ ^[Yy]$ ]]
then
    message "Downloading translation files from Crowdin (*.json)" &&
    crowdin download
fi &&

confirm "Commit changes and push to origin?" &&
if [[ $REPLY =~ ^[Yy]$ ]]
then
    cd $(git rev-parse --show-toplevel) &&
    message "Committing"
    git commit -a -m "Update translations" &&
    message "Pushing"
    git push
fi &&

echo ${GREEN}"\nSuccessfully Done."