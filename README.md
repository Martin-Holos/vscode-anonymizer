## ANO - Anonymizer DSL

This folder contains an LSP for the anonymization language "ano".

## Generating the Antlr4 typescript parser
* To generate the Antlr/Typescript parser you need Java installed on the path
* see the `antlr\run_ano_gen.cmd` file for running the Antlr generator
* when succeeding the generated code will appear in src/parser

## Running the LSP
* `npm install` to initialize the project
* `npm run build` to generate the Antlr4 typescript parser code and compile the LSP
* run the extension
  * open this folder in VS Code and press `F5`
  * this will open the `[Extension Development Host]` window, running the extension:
* in the extension  
  * Open an ".ano" document
  * There is a sample file `antlr/test/erasme.ano`
  * The extension will colorize and supply text-hovers and syntax completion
