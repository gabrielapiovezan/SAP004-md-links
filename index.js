module.exports = () => {
    // ...
};

const path = require("path");
const fs = require("fs");

function getFiles(dir, files, fileType) {
    const regex = fileType ? new RegExp("\\" + fileType + "$") : "";

    return fs.readdirSync(dir).reduce(function(allFiles, file) {
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, allFiles, fileType);
        } else if (file.match(regex)) {
            allFiles.push(name);
        }
        return allFiles;
    }, files || []);
}
const files = getFiles("./", "", ".md");
//console.log(files);

files.forEach((file) => {
    const fileME = fs.readFileSync(`./${file}`, "utf-8");
    const re = /(\[\S.*\]\(https?:\/\/.*\))+/g;
    let myArray = fileME.match(re);
    result = myArray.map((a) => {
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
    console.log(result);
});