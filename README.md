## Open Source license

Copyright (c) 2014 Studio 24 Ltd

Licensed under the MIT License, see LICENSE.md

## Requirements

* [SASS] (http://sass-lang.com/)
* [Node.js](http://nodejs.org/)
* [Bower](http://bower.io/)
* [Grunt](http://gruntjs.com/)

## URLs

Access the data visualisation tool via the scenario URL, the initial example is: /sybil-logic-bomb

## Build instructions

### Grunt

Grunt is used to compile and minify JS, build SASS into CSS and concatanate and minify CSS.

    # This will compile all files, and should be run before starting any work, or before any deployment
    grunt build

    # This is the shorthand for "grunt watch", which will watch all files and run compilation tasks when certain files change
    grunt watch

## Installation

### SASS

The SASS installation guide can be found here: http://sass-lang.com/install

### JavaScript packages

The starter kit uses [Bower](http://bower.io/) to load JavaScript dependencies. To install dependencies run:

    bower install

This kit also uses [Grunt](http://gruntjs.com/) to automate tasks. To install Grunt modules run:

    sudo npm install

This will create a new "node_modules" folder in the source directory.

## Deployment

### Publishing to staging

Publish dist files to staging site via rsync:

    # cd to project root folder
    rsync -e "ssh" -ptrv dist/ studio24@scaramanga.studio24.net:/var/www/studio24/dev.studio24.net/live/web/data-visualisation
