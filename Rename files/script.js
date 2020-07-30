const fs = require('fs');
const { argv } = require('yargs');

module.exports = () => {
    const dirPath = argv.dirPath;
    if (!dirPath || dirPath.includes('C:')) return console.log('Plz provide a directory path, which is not in \'C\' drive, (--dirPath)');
    if (!argv.fileName && !argv.A) return console.log('Plz provide a file name, or provide \'A\' flag to use same name is the parent folder, (--fileName, -A)');
    argv.start = argv.start || 1;
    argv.fileName = argv.fileName || `${dirPath.split('\\').pop()} -- ep`;
    const files = fs.readdirSync(dirPath) || [];
    files.forEach((c, i) => {
        fs.renameSync(`${dirPath}\\${c}`, `${dirPath}\\${argv.fileName} ${ argv.start + i}.${argv.ext || c.split('.').slice(1).join('.')}`);
    });
}