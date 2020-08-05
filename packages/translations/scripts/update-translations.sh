#!/bin/sh
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
WHITE='\033[1;37m'
RESET='\033[0m'
GIT_USERNAME=$(git config user.name)
NEW_TRANSLATION_BRANCH='deriv_app_translations'

if ! [ -x "$(command -v crowdin)" ]; then
    if [ -f /usr/local/bin/crowdin-cli.jar ]; then
        alias crowdin="java -jar /usr/local/bin/crowdin-cli.jar"
    else
        echo ${YELLOW}"crowdin-cli not found. Please follow the instructions here: https://support.crowdin.com/cli-tool-v2/#installation"${RESET}
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

message "Updating deriv app translations branch" &&
git branch -D ${NEW_TRANSLATION_BRANCH} &&
git push origin --delete ${NEW_TRANSLATION_BRANCH}
git checkout -b ${NEW_TRANSLATION_BRANCH} &&
git pull upstream master &&

confirm "Update the source file (messages.json) and push to Crowdin?" &&
if [[ $REPLY =~ ^[Yy]$ ]]
then
    message "Updating translations source file" &&
    cd $(git rev-parse --show-toplevel) && cd packages/translations/scripts && node extract-translations.js &&
    message "Uploading source file to Crowdin"
    cd $(git rev-parse --show-toplevel) && cd packages/translations && source ~/.bash_profile && crowdin upload sources
    message "Complete, new translations have been uploaded to Crowdin"
fi

confirm "Download deriv app files and update javascript texts?" &&
if [[ $REPLY =~ ^[Yy]$ ]]
then
    message "Downloading deriv app files from Crowdin (*.json)" &&
    cd $(git rev-parse --show-toplevel) && cd packages/translations && crowdin download
fi &&

confirm "Commit changes and push to origin?" &&
if [[ $REPLY =~ ^[Yy]$ ]]
then
    cd $(git rev-parse --show-toplevel) &&
    message "Committing"
    git commit -a -m "Update deriv app translations" &&
    message "Pushing"
    git push -u origin ${NEW_TRANSLATION_BRANCH}
fi &&

echo ${GREEN}"\nSuccessfully Done."
