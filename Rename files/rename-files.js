#!/usr/bin/env node

const fs = require('fs');
const { argv } = require('yargs');
const fse = require('fs-extra');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk')

const dirPath = argv.dirPath;
if (!dirPath || dirPath.includes('C:')) return console.log('Plz provide a directory path, which is not in \'C\' drive, (--dirPath)');
if (!argv.fileName && !argv.A) return console.log('Plz provide a file name, or provide \'A\' flag to use same name as the parent folder, (--fileName, -A)');
argv.start = argv.start || 1;
argv.fileName = argv.fileName || `${dirPath.split('\\').pop()} -- ep`;

// fse.copySync(dirPath, path.join(dirPath, `..\\${dirPath.split('\\').pop()} old`));
let files = fs.readdirSync(dirPath) || []; 

const customSort = (arr = files) => [...arr].sort((a, b) => +a.match(/\d+(?=\D*\..+)/)?.join() - +b.match(/\d+(?=\D*\..+)/)?.join());

console.log(customSort());

const rename = (doCustomSort = false) => {
    let newNames = [];
    if (doCustomSort) files = customSort();
    const oldNamesPath = `C:\\Users\\Alpha\\Desktop\\Rename files Old\\${dirPath.split('\\').pop()}.txt`;
    if (!fs.existsSync(oldNamesPath)) fs.writeFileSync(oldNamesPath, '');
    fs.appendFileSync(oldNamesPath, JSON.stringify({names: files, time: new Date()}));

    files.forEach((c, i) => {
        const newName = `${dirPath}\\${argv.fileName} ${argv.start + i}.${argv.ext || c.split('.').slice(1).join('.')}`;
        newNames.push(newName)
        if (fs.existsSync(newName) || argv.newNames) return;
		fs.renameSync(`${dirPath}\\${c}`, newName);
    });

    console.log(argv.newNames? newNames : chalk.bold.hex('#0c2461').bgHex('#25CCF7')(`            \r\n  Renamed!  \r\n            `));
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

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

