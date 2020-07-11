module.exports = (path, options) => {
    return new Promise((resolve, reject) => {
        resolve(mdLinks(path, options));
    });
};

const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

const mdLinks = (path, options) => {
    let objectInfoLinks = [];
    return new Promise((resolve, reject) => {
        getFiles(path)
            .map(searchlinks)
            .forEach((a) => (objectInfoLinks = objectInfoLinks.concat(a)));

        const stats = {
            Total: objectInfoLinks.length,
            Unique: cleanRepeated(objectInfoLinks),
            Broken: "",
        };
        if (options.validate && options.stats) {
            validateLinks(objectInfoLinks).then((objectInfoLinks) => {
                stats.Broken = objectInfoLinks
                    .map(broken)
                    .reduce((acc, cur) => acc + cur);
                resolve(stats);
            });
        } else if (options.validate && !options.stats) {
            resolve(validateLinks(objectInfoLinks));
        } else if (!options.validate && options.stats) {
            resolve(stats);
        } else {
            resolve(objectInfoLinks);
        }
    });
};
const getFiles = (dir, files) => {
    const regex = new RegExp("\\" + ".md" + "$");
    if (dir.match(regex)) {
        return [dir];
    } else {
        return fs.readdirSync(dir).reduce(function(allFiles, file) {
            const route = path.join(dir, file);
            console.log(route);
            if (fs.statSync(route).isDirectory()) {
                getFiles(route, allFiles);
            } else if (file.match(regex)) {
                allFiles.push(route);
            }
            return allFiles;
        }, files || []);
    }
};

const searchlinks = (file) => {
    const fileME = fs.readFileSync(`./${file}`, "utf-8");

    const re = /(\[\S.*\]\(https?:\/\/.*\))+/g;
    let myArray = fileME.match(re);
    if (myArray) {
        const result = myArray.map((a) => {
            const reText = /(\[\S.*\])+/g;
            const reLink = /(\(https?:\/\/.*\))+/g;
            let text = a.match(reText);
            let link = a.match(reLink);
            text = text[0].replace(/[\[\]\(\)]/g, "");
            link = link[0].replace(/[\[\]\(\)]/g, "");
            return {
                file: file,
                href: link,
                validate: "",
                text: text,
            };
        });
        return result;
    }
};

const broken = (file) => {
    return file.validate.includes("OK") ? 0 : 1;
};

const validateLinks = (files) => {
    return new Promise((resolve, reject) => {
        const promises = files.map((file) => fetch(file.href));
        Promise.all(promises).then((response) => {
            const newArray = files.map((file, i) => {
                file.validate = `${response[i].statusText} ${response[i].status}`;
                //    console.log(file);
                return file;
            });
            resolve(newArray);
        });
    });
};

function cleanRepeated(files) {
    return [
        ...new Set(
            files.map((file) => {
                return file.href;
            })
        ),
    ].length;
}