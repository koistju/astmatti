# Astmatti App
This is the official repository of the Sense4Health Astmatti smartphone app.


## git Workflow
### Branching Model
There are three main branches:

* `master`: Contains only final releases,
* `release`: contains only feature-freezed release candidates. Hotfixes are still possible, and
* `develop`: main development branch.

The code flow hierarchy is: `feature-*` => `develop` => `release` => `master`.

Pushing on these branches requires:

1. Reviewed pull requests from `feature-*` branches (see below), and
2. commits are signed using PGP.

Work is only to be done on `feature-*` branches, see below.


### Feature Branches
Fore quality and certification reasons, every change entering the `develop` branch (and higher) needs to be reviewed (a requirement that is enforced by the branching rules on GitHub). To facilitate this, all development must be done using feature branches. The basic workflow is:

1. Start from the development branch
    
    ```
    $ git status
    On branch develop
    Your branch is up to date with 'origin/develop'.
    
    nothing to commit, working tree clean
    ```

2. Create a new feature branch
    
    ```
    $ git checkout -b feature-XYZ
    Switched to a new branch 'feature-XYZ'
    ```

3. Do your development, sign your commits using (see [these instructions](https://help.github.com/articles/signing-commits-with-gpg/) for setting up signed commits)
    
    ```
    $ git commit -S
    [...]
    ```

4. Push your code
    
    ```
    $ git push -u origin feature-XYZ
    [...]
    ```

5. Create a [pull request](https://github.com/Sense4Health/astmatti/compare?expand=1)

