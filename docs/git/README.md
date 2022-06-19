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

### Know the tool. Don’t be afraid of using it

As I said, git is powerful. There are tons of commands. You can learn new tricks reading [git docs](https://git-scm.com/doc) on the web or using the man pages. By running `git help -a`, you can check the most useful ones.

Here is a list of the ones I use very often:

-   `git cherry-pick`
-   `git diff` and `git apply`
-   `git stash`
-   `git bisect`
