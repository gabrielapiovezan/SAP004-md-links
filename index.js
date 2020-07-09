module.exports = () => {
    // ...
};

const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

const getFiles = (dir, files) => {
    const regex = new RegExp("\\" + ".md" + "$");
    if (dir.match(regex)) {
        //se a direção contém um regex
        return [dir];
    } else {
        return fs.readdirSync(dir).reduce(function(allFiles, file) {
            //pega arquivos e pastas em um array

            const routes = path.join(dir, file); // rota até o ultimo diretório
            if (fs.statSync(routes).isDirectory()) {
                getFiles(routes, allFiles); // se tem arquivos dentro do diretório, recursão
            } else if (file.match(regex)) {
                // se o arquivo for md
                allFiles.push(routes); //acumulador acrescenta o arquivo md
            }
            return allFiles; // retorna o acumulador
        }, files || []); //valor inicial
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
            //  console.log(objectInfoLinks);
            const status = {
                Total: objectInfoLinks.length,
                Unique: cleanRepeated(objectInfoLinks),
                Broken: objectInfoLinks.map(broken).reduce((acc, cur) => acc + cur),
            };
            //  console.log(status);
        });

        resolve();
        reject("Error");
    });
};

const broken = (file) => {
    return file.validate.includes("OK") ? 0 : 1;
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