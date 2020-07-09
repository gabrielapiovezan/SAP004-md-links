module.exports = () => {
    // ...
};

const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

const getFiles = (dir, files) => {
    const regex = new RegExp("\\" + ".md" + "$");
    if (dir.match(regex)) {
        return [dir];
    } else {
        return fs.readdirSync(dir).reduce(function(allFiles, file) {
            const name = path.join(dir, file);
            if (fs.statSync(name).isDirectory()) {
                getFiles(name, allFiles);
            } else if (file.match(regex)) {
                allFiles.push(name);
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
                href: link,
                text: text,
                file: file,
            };
        });
        return result;
    }
};

const mdLinks = (path, options) => {
    let objectInfoLinks = [];
    return new Promise((resolve, reject) => {
        getFiles(path)
            .map(searchlinks)
            .forEach((a) => (objectInfoLinks = objectInfoLinks.concat(a)));

        validate(objectInfoLinks).then((objectInfoLinks) => {
            console.log(objectInfoLinks);
            const status = {
                Total: objectInfoLinks.length,
                Unique: cleanRepeated(objectInfoLinks),
            };
            console.log(status);
        });

        resolve();
        reject("Error");
    });
};

const validate = (files) => {
    return new Promise((resolve, reject) => {
        const promises = files.map((file) => fetch(file.href));
        Promise.all(promises).then((response) => {
            const newArray = files.map((file, i) => {
                file.validate = `${response[i].statusText} ${response[i].status}`;
                return file;
            });
            resolve(newArray);
        });
    });
};

mdLinks("./files").then((result) => {
    //  console.log(result)
});

function cleanRepeated(files) {
    return [
        ...new Set(
            files.map((file) => {
                return file.href;
            })
        ),
    ].length;
}