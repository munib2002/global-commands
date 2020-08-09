const fs = require('fs');
const { argv } = require('yargs');
const fse = require('fs-extra');
const path = require('path');

module.exports = () => {
    const dirPath = argv.dirPath;
    if (!dirPath || dirPath.includes('C:')) return console.log('Plz provide a directory path, which is not in \'C\' drive, (--dirPath)');
    if (!argv.fileName && !argv.A) return console.log('Plz provide a file name, or provide \'A\' flag to use same name as the parent folder, (--fileName, -A)');
    argv.start = argv.start || 1;
    argv.fileName = argv.fileName || `${dirPath.split('\\').pop()} -- ep`;

    fse.copySync(dirPath, path.join(dirPath, `..\\${dirPath.split('\\').pop()} old`));
    const files = fs.readdirSync(dirPath) || [];
    console.log(files.sort((a,b) => +b.match(/\d*/)[0] - (+a.match(/\d*/)[0])));
    files.forEach((c, i) => {
        const newName = `${dirPath}\\${argv.fileName} ${argv.start + i}.${argv.ext || c.split('.').slice(1).join('.')}`;
        if (fs.existsSync(newName)) return;
        fs.renameSync(`${dirPath}\\${c}`, newName);
    });
}