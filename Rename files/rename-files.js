#!/usr/bin/env node

const fs = require('fs');
const { argv } = require('yargs');
const fse = require('fs-extra');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const dirPath = argv.dirPath;
if (!dirPath || dirPath.includes('C:')) return console.log('Plz provide a directory path, which is not in \'C\' drive, (--dirPath)');
if (!argv.fileName && !argv.A) return console.log('Plz provide a file name, or provide \'A\' flag to use same name as the parent folder, (--fileName, -A)');
argv.start = argv.start || 1;
argv.fileName = argv.fileName || `${dirPath.split('\\').pop()} -- ep`;

fse.copySync(dirPath, path.join(dirPath, `..\\${dirPath.split('\\').pop()} old`));
let files = fs.readdirSync(dirPath) || []; 

const customSort = (arr = files) => [...arr].sort((a, b) => +a.match(/\d+(?=\..+)/)[0] - +b.match(/\d+(?=\..+)/)[0]);

console.log(customSort());

const rename = (doCustomSort = false) => {
    let newNames = [];
    if (doCustomSort) files = customSort();
    files.forEach((c, i) => {
        const newName = `${dirPath}\\${argv.fileName} ${argv.start + i}.${argv.ext || c.split('.').slice(1).join('.')}`;
        newNames.push(newName)
        if (fs.existsSync(newName)) return;
		fs.renameSync(`${dirPath}\\${c}`, newName);
    });
    console.log(chalk.bold.hex('#0c2461').bgHex('#25CCF7')(`            \r\n  Renamed!  \r\n            `));
}

rl.question(chalk.bold.hex('#F8EFBA')("Input 'y' to rename in the above order: "), ans => {
    if (ans != 'y') {
        console.log(files);
        rl.question(chalk.bold.hex('#F8EFBA')("Input 'y' to rename in the above order: "), ans => {
            if (ans == 'y') rename();
            rl.close();
        });
    } else {
        rename(true);
        rl.close();
    }
});