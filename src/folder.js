import fs from "fs";

let files_folder = [];
fs.readdirSync('./files/').forEach((file) => {
    files_folder.push(file)
})

console.log('files_folder: ', files_folder);