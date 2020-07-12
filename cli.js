#!/usr/bin/env node

const program = require("commander");
const package = require("./package.json");
const mdLinks = require("./index.js");
const chalk = require("chalk");
program.version(package.version);

program
    .option("-v, --validate [true]")
    .option("-s, --stats [true]")
    .parse(process.argv);

let path = program.args[0];
if (path) {
    mdLinks(path, { validate: program.validate, stats: program.stats }).then(
        (result) => {
            if (!program.stats) {
                result.forEach((object) => {
                    console.log(
                        chalk.bold(
                            `${chalk.hex("#CD5C5C")(object.file)} ${chalk.hex("#F08080")(
                object.href
              )} ${chalk.hex("#FFB6C1")(
                object.validate ? object.validate : ""
              )} ${chalk.hex("#FFC0CB")(object.text)}`
                        )
                    );
                });
            } else {
                console.log(
                    chalk.bold(
                        ` ${chalk.hex("#008080")("Total:")} ${chalk.hex("#008B8B")(
              result.Total
            )}\n` +
                        ` ${chalk.hex("#20B2AA")("Unique:")} ${chalk.hex("#66CDAA")(
                result.Unique
              )}`,
                        result.Broken ?
                        `\n ${chalk.hex("#40E0D0")("Broken:")}` +
                        ` ${chalk.hex("#7FFFD4")(result.Broken)}` :
                        ""
                    )
                );
            }
        }
    );
} else {
    mdLinks().then((result) => console.log(result));
}
program.parse(process.argv);