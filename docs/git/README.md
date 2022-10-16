# Git

## General

### Adequately configure the commit authorship

You should at least set your name and email address correctly. As commits are communications tools, knowing who made a specific change can help you in the future.

#### Configure your Git username/email

You typically configure your global username and email address after installing Git. However, you can do so now if you missed that step or want to make changes. After you set your global configuration, repository-specific configuration is optional.

Git configuration works the same across Windows, macOS, and Linux.

##### To set your global username/email configuration:

1. Open the command line.
2. Set your username:
   git config --global user.name "FIRST_NAME LAST_NAME"
3. Set your email address:
   git config --global user.email "MY_NAME@example.com"

### Branch Naming

We agreed to have this convention for branch naming in the entire frontend repositories

`{OWNER_NAME}/{TASK_ID}/{BRANCH_TITLE}`

-   `OWNER_NAME`: is the developer name that working on it

-   `TASK_ID`: would refer to id of the task in the task manager app which is currently Redmine.

-   `BRANCH_TITLE`: branch name that would be a feature, bugfix or hotfix

Example:

`ako/54641/proof_of_ownership`

### Commit only related work

Do you know what S from [SOLID](https://en.wikipedia.org/wiki/SOLID) stands for? Yeah, [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle). You can apply this principle for commits, not only to the code. You should commit the least amount of lines that make sense together.

This practice helps when digging into the codebase, like when using `git log` or `git blame`.

### Commit message guidelines

We have a precise rules over how our git commit messages can be formatted. This leads to more **readable messages** that are easy to follow when looking through the **project history**.

Each commit message will consists of **type** and **subject**:

```sh
<type>|<...other_types>: <subject>
```

#### Commit Type

Must be one of the following:

-   **build**: Changes that affect the build system or external dependencies (example scopes: gatsby config, gatsby browser, gatsby node, or gatsby ssr)
-   **chores**: Add or Changes on packages or external dependencies
-   **ci**: Changes to our CI configuration files and scripts (example scopes: Docker, nginx conf)
-   **docs**: Documentation only changes
-   **feat**: A new feature
-   **fix**: A bug fix
-   **perf**: A code change that improves performance
-   **refactor**: A code change that neither fixes a bug nor adds a feature
-   **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
-   **text**: Adding text or updating text only
-   **empty**: Rare cases for re-deploying when deployment server is down
-   **revert**: A commit reverts a previous commit
