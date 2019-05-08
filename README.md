# react-props-md-table
This tiny tool uses [react-docgen][] to generate markdown tables of the props of a React component.

[react-docgen]: https://github.com/reactjs/react-docgen

## Installation
```
npm i -g @rianbotha/react-props-md-table
```

## Usage
Run the following command in the terminal to replace the props table in `readme.md` in the same directory.
```
props-table path/to/SomeComponent.js
```

The props table in the file needs to be wrapped between `<!-- props-table-start -->` and `<!-- props-table-end -->` for the replacement to work.

### Options

* `--to-console` will write the props table to the terminal instead of the file.
* `--force` will write the props table at the end of the readme if no table wrapped by comments is found. The readme.md will be created if it doesn't exist.
* `--help` or `-h` display usage options
* `--version` or `-v` display version information
