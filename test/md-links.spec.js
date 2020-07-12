const mdLinks = require("../index.js");
const route = "./test";

const mockLinks = [{
        file: "test/FolderTest/test.md",
        href: "https://developer.mozilla.org/pt-BR/",
        text: "MDN web docs",
    },
    {
        file: "test/FolderTest/test.md",
        href: "http://stack.desenvolvedor.expert/",
        text: "EXPERT JS Stack",
    },
    {
        file: "test/FolderTest/test.md",
        href: "https://nodejs.org/en/",
        text: "Nodejs",
    },
    {
        file: "test/FolderTest/test.md",
        href: "http://google.com.br/teste",
        text: "Link Quebrado",
    },
    {
        file: "test/test2.md",
        href: "https://nodejs.org/en/",
        text: "Nodejs",
    },
];

describe("Retornos esperados da função mdLinks", () => {
    it("Retorno do array de objetos com : [{ href, text, file }]", () => {
        return expect(mdLinks(route)).resolves.toEqual(mockLinks);
    });
    it("Retorno do array de objetos com : [{ href, text, file, status, ok }]", () => {
        newMockLinks = mockLinks.map((a) => {
            a.validate = "OK 200";
            return a;
        });
        newMockLinks[3].validate = "Not Found 404";
        return expect(mdLinks(route, { validate: true })).resolves.toEqual(
            newMockLinks
        );
    });
    it("Retorno do objeto com:{Total:n, Unique:n}", () => {
        return expect(mdLinks("./test/test2.md", { stats: true })).resolves.toEqual({
            Total: 1,
            Unique: 1,
        });
    });
    it("Retorno do objeto com:{Total:n, Unique:n, Broken:n}", () => {
        return expect(
            mdLinks(route, { stats: true, validate: true })
        ).resolves.toEqual({
            Total: 5,
            Unique: 4,
            Broken: 1,
        });
    });
    it("Falha na requisição", () => {
        return expect(mdLinks()).rejects.toThrow(TypeError);
    });
});