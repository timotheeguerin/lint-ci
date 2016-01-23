# Lint-CI
[![Build Status](https://img.shields.io/travis/timcolonel/lint-ci/master.svg?style=flat-square)](https://travis-ci.org/timcolonel/lint-ci)
[![Lint-CI](https://lint-ci.io/timcolonel/lint-ci/offense.svg?branch=master)](https://lint-ci.io/timcolonel/lint-ci)
****IN DEV****

Lint-CI is a web app that check for style error in your repositories.
* Automated: Active the repository and then on every pull request the style will be checked
* Badges: Lint-CI provide 2 badges to add to your repositories
* Json api: Lint-CI is built with a JSON api which allow to interact externally with it.
 
Supported style checked:
* Rubocop(Ruby)
* Jshint(Javascript)
* tslint(Typescript)
* coffeelint(Coffeescript)


Installation:
```
git clone https://github.com/timcolonel/lint-ci

# Install dependencies
bundle install

# Setup config(See .sample.env for key to define)
rails g figaro:install # Create a config/application.yml file

# Run sidekiq(Must have a running redis instance)
sidekiq

# Run server
rails 
```
