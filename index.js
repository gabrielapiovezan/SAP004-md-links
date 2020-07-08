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
        if (options) {
            objectInfoLinks.map((linkInfo) => {
                validate(linkInfo.href)
                    .then((result) => (linkInfo.validate = result))
                    .then(() => console.log(linkInfo));
            });
        }
        resolve();
        reject("Error");
    });
};

const validate = (file) => {
    return new Promise((resolve, reject) => {
        fetch(file).then((response) =>
            resolve(`${response.statusText} ${response.status}`)
        );
    });
};

mdLinks("./files", true).then((result) => {
    //  console.log(result)
});

// const test = () => {
//     return new Promise((resolve, reject) => {
//         resolve("resolvida");
//         reject("erro");
//     });
// };
//test().then((result) => console.log(result));