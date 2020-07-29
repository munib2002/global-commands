#!/usr/bin/env node
const fs = require('fs');
const { argv } = require('yargs');

const dirFolder = argv.dirPath || 'D:\\';
let dirName;

for (let i = 0; true; i++) {
    let name = (argv.dirName || 'Test Folder') + (i ? ` ${i}` : '');
    if (fs.existsSync(`${dirFolder}\\${name}`)) continue;
    dirName = name;
    break;
}

const dirPath = `${dirFolder}\\${dirName}`;
const count = isNaN(parseInt(argv.count)) ? 1 : parseInt(argv.count);

fs.mkdirSync(dirPath);

for (let z = 1; z <= count; z++) {
    const fileName = `${argv.fileName || 'testFile'} ${z}.${argv.ext || 'txt'}` 
	const filePath = `${dirPath}\\${fileName}`;
    fs.writeFileSync(filePath, `${z}`);
}
