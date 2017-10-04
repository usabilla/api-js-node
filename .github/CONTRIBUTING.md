# Contributing

Thanks for being willing to contribute!

**Working on your first Pull Request?** You can learn how from this *free* series
[How to Contribute to an Open Source Project on GitHub][egghead]

## Project setup

You're going to need [`git`](https://git-scm.com/) to get the project, and [`node`](https://nodejs.org/en/) and
[`yarn`](https://yarnpkg.com/) to install dependencies and run scripts.

1. Fork and clone the repo
2. Run `yarn` to install dependencies
3. Run `yarn test` for testing
4. Run `yarn test:watch` for keeping tests running
4. Run `yarn lint` for linting
5. Run `yarn lint:fix` for auto fix linting errors
6. Run `yarn start` to start the development environment
7. Create a branch for your PR

## Committing and Pushing changes

This project uses [`semantic-release`][semantic-release] to do automatic releases and generate a changelog based on the
commit history. So we follow [a convention][convention] for commit messages. Please follow this convention for your
commit messages.

You can use `commitizen` to help you to follow [the convention][convention]

Once you are ready to commit the changes, please use the below commands

1. Run `git add <files to be comitted>` to stage changed files
2. Run `yarn commit` to start commitizen to commit those files

... and follow the instruction of the interactive prompt.

## Help needed

Please checkout [the issues](https://github.com/usabilla/api-js-node/issues)! Also, please watch the repo
and respond to questions/bug reports/feature requests! Thanks!

[egghead]: https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github
[semantic-release]: https://npmjs.com/package/semantic-release
[convention]: https://github.com/conventional-changelog/conventional-changelog-angular/blob/ed32559941719a130bb0327f886d6a32a8cbc2ba/convention.md
