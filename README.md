[![Build Status](https://travis-ci.org/binary-com/binary-bot.svg?branch=master)](https://travis-ci.org/binary-com/binary-bot)
[![Coverage Status](https://coveralls.io/repos/github/binary-com/binary-bot/badge.svg?branch=master)](https://coveralls.io/github/binary-com/binary-bot?branch=master)

# Binary Bot on Deriv

Visual automation for binary bot on deriv - [bot.deriv.com](https://bot.deriv.com)

Binary Bot on Deriv uses [Google Blockly](https://developers.google.com/blockly) to provide a puzzle like automation environment to trade using binary.com API version 3.

## Pre-installation
Ensure that your environment contains the following packages.
``` 
 - node >= 12.18.0
 - npm >= 6.14.4
 - git (for contribution)
 ```

## Getting Started
Recommended extensions to start contributing to the project:
``` 
 - Prettier
 - ESLint
 ```
 You can simply search for these extensions on VS Code and install them to start using.

**Note**: `node -v` and `sudo node -v` should be the same version.
## Installation

### 1. Setup the project on local machine

You will need to perform the following on your development machine:
1. In order to work with Deriv-Bot application, you must create your own version of this project. Please `fork the project` - https://github.com/deriv-com/binary-bot to your git account.
2. Change the current working directory to the location where you want the cloned directory.
3. Clone using `SSH`. Clone the forked repo using ```git clone [URL for the forked repo]```
4. Enter project directory ```cd binary-bot```
5. Run ```npm install``` 

    >**Note:** - [issue with installing packages](#q1)
### 2. Configuring Hosts file
In order to run our application for the first time, you need to configure your hosts file:

If you are using a UNIX based system `(Mac or Linux)`, Do the following:

1. Open terminal.
2. Open hosts file in your preferred text editor using ``` sudo vim /etc/hosts```.
3. Add a new entry pointing to ```127.0.0.1  localbot.binary.sx```
4. Save the file

For `Windows`:

 1. Run Microsoft Notepad as an administrator. 

 2. From Notepad, open the file: ```c:\Windows\System32\Drivers\etc\hosts```

 3. Add a new entry pointing to ```127.0.0.1 localbot.binary.sx```

 4. Save the file

### 3. Preparing environment variables
If you want to use *Google Drive features* in the project (**to Save/Load strategies**)
you need to create a file called `.env` at the project root with the following content:
```
GD_CLIENT_ID=GOOGLE_DRIVE_CLIENT_ID
GD_API_KEY=GOOGLE_DRIVE_API_KEY
GD_APP_ID=GOOGLE_DRIVE_APP_ID
```
Here comes useful links for more information on how to confgure your project
with Google Drive integration:
- [Enabling the Google Drive API](https://developers.google.com/drive/api/v3/enable-drive-api)
- [Creating API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
- [Generating Client ID](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)

### 4. Starting a Development Server
Make sure to set the endpoint for running the application on the localhost

 1. Run ```sudo npm start``` on the binarybot directory. This will open the application in your default browser.
 
     >**Note:** - [Getting Permission Denied Error](#q2)

2.  Navigate to ```http://localbot.binary.sx``` (Note that the protocol is ```http``` and not ```https```)

    >**Note:** - [Getting error "This site can’t be reached" on localhost](#q3)

3. And now you are ready with your setup. Login to the binary account using the Binary.com account credentials. Run the bot


## Pushing changes to github

1. Create a feature branch from master -  ```git checkout -b [branchName]```
2. Make your changes to the source code
3. Run test command to make sure your changes are correct
```npm run test```
4. Run `git fetch upstream master` and `git merge upstream/master` to update your branch and avoid conflicts
5. Push your changes to your forked repo:
```
git add .
git commit -m "describe your changes"
git push origin BRANCH_NAME
```
## Test link deployment

The deployment for test link is done automatically:

Upon creating PR, [Vercel](https://vercel.com/) will auto-generate a test link inside the PR. you can use that to preview the test link for the changes you have made.

## PR Guidelines

1. Use the `developer 1|developer 2/task_name` format for PR titles. (e.g.: `dev1|dev2/fixed_emoji_issue`, `dev1/added_superfast_jellyfish`)
    - Optional square bracket tag (e.g. `[WIP]`) can be at the end.
2. Use the appropriate package labels available on the repo to indicate which packages your PR modifies.
3. Use Draft PRs if you don't mean to request for reviews yet. [Read more here.](https://github.blog/2019-02-14-introducing-draft-pull-requests/)

## Release

Release to production:
    1. `git tag production_v20191205 -m 'release production'`
    2. `git push origin production_v20191205`

## To update to the latest version

```
git fetch upstream master
git merge upstream/master
```

## Optional Branding

```
Go to app.config.js file inside the src/directory of the project folder.
All the important branding settings are implemented in this file.
User can make changes to Deriv branding related logo, text and their visibility.
```
### Running with a specific endpoint **Use only if you know what you're doing**

```
ENDPOINT='wss://ws.binaryws.com/websockets/v3?l=en&app_id=1169' bot bot-example.js

```

To set the endpoint for running the application on the localhost. For this, Go to http://localbot.binary.sx/endpoint.html. Make sure the Server is set to blue.binaryws.com and O Auth App ID is 16014 Click submit

## Think you found a bug?

There's a chance that we already know about it and doing our best to fix it. To find out you can search our [GitHub issues](https://github.com/binary-com/binary-bot/issues)

Not satisfied yet? Please create a new issue, and explain to us what is the nature of the problem and how to reproduce [here](https://github.com/binary-com/binary-bot/issues/new)

## We'd love to hear from you

Please send us your inquiries through marketing@binary.com

## Sample Blocks

You can find some example blocks in the [`Examples`](/examples) folder.

**Disclaimer**: _All the files and codes in the above links are intended for educational and informational purposes only. They should not be construed as giving investment advice, and you should not rely on them as your singular factor in making or refraining from making any investment decisions. Binary.com accepts no liability whatsoever for any losses incurred by users in their trading. Binary options trading may incur losses as well as gains._


## FAQ

### <a name='q1'> 1. Issue with installing packages</a>
If you couldnt install binary bot with a different node version, try cleaning npm cache.
 - To clear a cache in npm, we need to run the ```npm cache clean --force``` command in our terminal.
 - Delete cache directory. The default cache directory is ~/.npm on Posix (mac or linux), or %AppData%/npm-cache on Windows.
 - Run ```rm -rf ~/.npm``` 
 - Run ```npm install```

### <a name='q2'> 2. Getting Permission Denied Error on localhost</a>
Try ```sudo npm start```instead of ```npm start```

### <a name='q3'>3. Cannot access the site</a>
 Make sure to use HTTP instead of HTTPS: https://localbot.binary.sx  -> http://localbot.binary.sx

