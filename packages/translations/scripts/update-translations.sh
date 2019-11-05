#!/bin/sh
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
WHITE='\033[1;37m'
RESET='\033[0m'
GIT_USERNAME=$(git config user.name)
NEW_TRANSLATION_BRANCH='add_translations'

if ! [ -x "$(command -v crowdin)" ]; then
    if [ -f /usr/local/bin/crowdin-cli.jar ]; then
        alias crowdin="java -jar /usr/local/bin/crowdin-cli.jar"
    else
        echo ${YELLOW}"crowdin-cli not found. Please follow the instructions here: https://support.crowdin.com/cli-tool/#installation"${RESET}
        exit 1
    fi
fi

if [[ $(git config --get remote.origin.url) =~ (binary-com|binary-static-deployed)/binary-static ]]; then
    echo ${RED}"  > ERROR: "${RESET}"remote 'origin' should be your fork."
    exit 1
fi

function message {
    echo ${GREEN}"  >"${RESET} $1
}

function confirm {
    echo "confirm"
    read -p "$(echo "\n${WHITE}$1 ${RESET}(y/n)${YELLOW}") " -n 1 -r &&
    echo "${RESET}"
}

message "Checkout dev" &&
git checkout dev &&
message "Updating dev" &&
git fetch upstream dev &&
git reset --hard upstream/dev &&

confirm "Update the source file (messages.json) and push to Crowdin?" &&
if [[ $REPLY =~ ^[Yy]$ ]]
then
    message "Updating translations source file" &&
    cd $(git rev-parse --show-toplevel) && cd packages/translations/scripts && node extract-translations.js &&
    message "Uploading source file to Crowdin"
    cd $(git rev-parse --show-toplevel) && cd packages/translations && source ~/.bash_profile && crowdin upload sources
    cd $(git rev-parse --show-toplevel) && git checkout packages/translations/crowdin/messages.json
    message "Complete, new translations have been uploaded to Crowdin"
fi
