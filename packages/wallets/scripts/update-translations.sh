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
        echo ${YELLOW}"crowdin-cli not found. Please follow the instructions here: https://support.crowdin.com/cli-tool-v2/#installation"${RESET}
        exit 1
    fi
fi

function message {
    echo ${GREEN}"  >"${RESET} $1
}

function fail {
  echo $1 >&2
  exit 1
}

function retry {
  local max=5
  local delay=2
  local attempt=1
  while true; do
    "$@" && break || {
      if [[ $attempt -lt $max ]]; then
        echo "Command failed. Attempt $attempt/$max:"
        sleep $(($delay * 2 ** attempt))
        ((attempt++))
      else
        fail "The command has failed after $attempt attempts."
      fi
    }
  done
}

if [ "$NODE_ENV" = "staging" ]; then
    echo "Running commands for staging environment..."
    message "Uploading source file to Crowdin" &&
    retry crowdin upload sources &&
    message "Complete, new translations have been uploaded to Crowdin" &&
    message "Downloading wallets files from Crowdin (*.json)" &&
    retry crowdin download && rm -rf src/translations/messages.json &&

    echo ${GREEN}"\nSuccessfully Done."
fi
