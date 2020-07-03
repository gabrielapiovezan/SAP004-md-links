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