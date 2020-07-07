module.exports = () => {
    // ...
};

const path = require("path");
const fs = require("fs");

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

        return result.filter((a) => true);
    }
};

const mdLinks = (path, options) => {
    let objectInfoLinks = [];
    return new Promise((resolve, reject) => {
        getFiles(path)
            .map(searchlinks)
            .forEach((a) => (objectInfoLinks = objectInfoLinks.concat(a)));

        // console.log(objectInfoLinks);
        //    map(searchlinks)); //.map(searchlinks);
        //  console.log(objectInfoLinks);
        if (options) {
            objectInfoLinks.forEach((a) => {
                validate(a.href).then((response) => console.log(response));
                //    console.log(status);
                //    status.statusCode;
            });
        }
        resolve();
        reject("Error");
        // const result = getFiles(path).map(searchlinks);
        // console.log(result);
    });
};

const validate = (file) => {
    const fetch = require("node-fetch");
    return fetch(file);

    // const https = require("https");
    // return https.get(file, (res) => {
    // return res.statusCode;
    //   });
};
//validate();
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