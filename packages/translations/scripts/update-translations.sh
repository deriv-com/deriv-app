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

message "Checking out the dev branch" &&
git checkout dev &&
message "Updating dev" &&
git fetch upstream dev &&
git reset --hard upstream/dev &&
message "Creating new branch $NEW_TRANSLATION_BRANCH from dev" &&
if [ `git branch --list $NEW_TRANSLATION_BRANCH` ]
then
   echo "Branch name $NEW_TRANSLATION_BRANCH already exists."
   confirm "Delete existing $NEW_TRANSLATION_BRANCH branch?"
   if [[ $REPLY =~ ^[Yy]$ ]]
   then
       message "deleting branch locally" &&
       git branch -D $NEW_TRANSLATION_BRANCH
       message "deleting branch from remote" &&
       git push -d origin $NEW_TRANSLATION_BRANCH
       message "branch successfully deleted"
    else
       exit 1
    fi
fi &&

git checkout -b add_translations &&
confirm "Update the source file (messages.json) and push to Crowdin?" &&
if [[ $REPLY =~ ^[Yy]$ ]]
then
    message "Updating translations source file" &&
    cd $(git rev-parse --show-toplevel) && cd packages/translations/scripts && node extract-translations.js &&
    message "Uploading source file to Crowdin"
    cd $(git rev-parse --show-toplevel) && cd packages/translations && source ~/.bash_profile && crowdin upload sources
fi

confirm "Commit changes and push to the branch $NEW_TRANSLATION_BRANCH?" &&
if [[ $REPLY =~ ^[Yy]$ ]]
then
    cd $(git rev-parse --show-toplevel) &&
    message "Committing"
    git commit -a -m "Update translations" &&
    message "Pushing the changes" &&
    git push --set-upstream origin $NEW_TRANSLATION_BRANCH
fi

echo ${GREEN}"\nSuccessfully Done." &&

confirm "Open github to submit the PR?" &&
if [[ $REPLY =~ ^[Yy]$ ]]
then
    open "https://github.com/binary-com/deriv-app/compare/dev...$GIT_USERNAME:$NEW_TRANSLATION_BRANCH"
    git checkout dev
fi
