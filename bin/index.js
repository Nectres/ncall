#!/usr/bin/env node

const { isAbsolute } = require("path");
const cmd = process.argv[2] ?? "index.js/main"
let parts = cmd.split("/") ?? "index.js/main";
let method = parts[parts.length - 1];
let path = parts.slice(0, parts.length - 1).join("/");
method ??= "main";
path = isAbsolute(path) ? path : "./" + path;
console.log(path);
import(path).then((mod) => {
    try {
        let args = process.argv.slice(3).map(val => {
            if (val.startsWith("--"))
                return val.slice(2);
            let identifier = val[val.length - 1].toLowerCase();
            val = val.slice(0, val.length - 1);
            switch (identifier) {
                case "n":
                    return Number(val)
                case "i":
                    return parseInt(val);
                case "f":
                    return parseFloat(val);
                case "j":
                    return JSON.parse(val);
                default:
                    return val;
            }
        });
        (mod[method])(...args)
    } catch (err) {
        const noFn = err.message.search(/is not a function/g) != -1
        if (noFn)
            console.error(`Error: No function named "${method}" in "${path}"`)
        else console.error(err)
    }
}).catch((err) => console.error(err))