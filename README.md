# react-doc-md

[![npm version](https://img.shields.io/npm/v/%40rianbotha%2Freact-doc-md.svg?style=flat)](https://www.npmjs.com/package/%40rianbotha%2Freact-doc-md)
[![Known Vulnerabilities](https://snyk.io/test/github/rianbotha/react-doc-md/badge.svg?targetFile=package.json)](https://snyk.io/test/github/rianbotha/react-doc-md?targetFile=package.json)

Generate readme.md files for React components using [react-docgen][].

[react-docgen]: https://github.com/reactjs/react-docgen

## Installation
```
npm i -g @rianbotha/react-doc-md
```

## Usage
Run the following command in the terminal to replace or create a `readme.md` in the same directory.
```
doc-md path/to/index.js path
```
The first argument is the path to the file containing your React component(s) or a glob. It can be a comma separated list.

> Note: Globs needs to be wrapped in quotes.

The second argument is the base path from which the import path will be calculated.

If the file is named index.js the readme.md will be name readme.md. Otherwise the readme will be name filename.md to match your file.

The documentation needs to be wrapped between `<!-- doc-md-start -->` and `<!-- doc-md-end -->` for the replacement to work.

### Options

* `--exclude` A filename or glob to exclude. You can comma separate a list. Make sure to wrap globs in quotes.
* `--to-console` will write the props table to the terminal instead of the file.
* `--force` Overwrite the current readme if it exists and start and end comments are missing.
* `--help` or `-h` display usage options
* `--version` or `-v` display version information
