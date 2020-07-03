module.exports = () => {
    // ...
};

var path = require("path");
var fs = require("fs");

function getFiles(dir, files_, fileType) {
    var regex = fileType ? new RegExp("\\" + fileType + "$") : "";

    return fs.readdirSync(dir).reduce(function(allFiles, file) {
        var name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, allFiles, fileType);
        } else if (file.match(regex)) {
            allFiles.push(name);
        }
        return allFiles;
    }, files_ || []);
}
const files = getFiles("./", "", ".md");
//console.log(files);

files.forEach((file) => {
    var fileME = fs.readFileSync(`./${file}`, "utf-8");
    var re = /(\[\S.*\]\(https?:\/\/.*\))+/g;
    let myArray = fileME.match(re);
    result = myArray.map((a) => {
        var reText = /(\[\S.*\])+/g;
        var reLink = /(\(https?:\/\/.*\))+/g;
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
// var fs = require("fs");
// var readMe = fs.readFileSync("README.md", "utf-8");

// var re = /(\[\S.*\]\(https?:\/\/.*\))+/g;

// let myArray = readMe.match(re);

// result = myArray.map((a) => {
//     var reText = /(\[\S.*\])+/g;
//     var reLink = /(\(https?:\/\/.*\))+/g;
//     let text = a.match(reText);
//     let link = a.match(reLink);
//     text = text[0].replace(/[\[\]\(\)]/g, "");
//     link = link[0].replace(/[\[\]\(\)]/g, "");
//     return {
//         text: text,
//         link: link,
//     };
// });
// console.log(result);