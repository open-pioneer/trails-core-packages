# Release Process

This document explains which steps need to be performed when creating a release for the Open Pioneer Trails core packages and other repositories using the same workflow.

For a description of how to publish an Open Pioneer Trails package in general, refer to https://github.com/open-pioneer/trails-starter/blob/main/docs/tutorials/HowToPublishAPackage.md.

## Background information

[Changesets](https://github.com/changesets/changesets) are used to manage pending changes.
When contributing to a repository using this workflow, developers should create the appropriate changeset files for their changes.

For the release of the Open Pioneer Trails core packages, github actions have been implemented so that only a few manual steps (see below) are necessary to perform a release.

The release will be performed for all packages that contain changes or have a dependency on a package that changed.

During the release the following things are automatically done:

-   Write changelog files and increment package versions using changesets
-   Build packages and publish to npm public registry
-   Create GitHub Releases for the published packages

Currently, there is no process for publishing only single packages
(as packages usually depend on each other, there is no use case for publishing a single package).
If publishing a single package is actually needed, refer to the changeset documentation about
how to exclude other packages for a release.
However, this is quite complicated and should only be done if absolutely necessary.

## Steps to perform a release:

-   Check if all contents of main branch may be released (regarding content and technical aspects).
-   Check that all packages contain CHANGELOG.md files and that changeset entries are created for all
    changes, even completely new packages.
-   Check all changeset entries regarding the version that will be release.
    In particular, take care that no major release is done accidentally.
    > Tip: you can use `pnpm changeset status` locally to get an overview, or skim through the release pull request.
-   Check that the build of the last commit performed successfully (is green)
    and that the last commit is included in the [RELEASE] pull request created by changesets.
-   Main step: Merge the [RELEASE] pull request.
-   When all github actions of the merged pull request are done, check that all published packages have been
    uploaded to the npm public registry and GitHub releases have been created for these packages.
