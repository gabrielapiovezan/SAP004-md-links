#!/usr/bin/env node

const program = require("commander");
const package = require("./package.json");
const mdLinks = require("./index.js");
program.version(package.version);

program
    .option("-v, --validate [true]")
    .option("-s, --stats [true]")
    .parse(process.argv);

let path = program.args[0];
mdLinks(path, { validate: program.validate, status: program.stats }).then(
    (result) => {
        console.log(result);
    }
);

program.parse(process.argv);