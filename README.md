# react-doc-md
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
First argument is the path to the file containing your React component(s).

Second argument is the base path from which the import path will be calculated.

If the file is named index.js the readme.md will be name readme.md. Otherwise the readme will be name filename.md to match your file.

The documentation needs to be wrapped between `<!-- doc-md-start -->` and `<!-- doc-md-end -->` for the replacement to work.

### Options

* `--to-console` will write the props table to the terminal instead of the file.
* `--force` Overwrite the current readme if it exists and start and end comments are missing..
* `--help` or `-h` display usage options
* `--version` or `-v` display version information
