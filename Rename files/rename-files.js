#!/usr/bin/env node

const fs = require('fs');
const { argv } = require('yargs');
const fse = require('fs-extra');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');
if (argv.showHelp || Object.keys(argv).length < 3) {
	return console.log({
		'--dirPath': {
			type: 'String',
			required: true,
			description:
				'The path of the directory for which u want to rename files. (any path in C drive is not allowed for safety purposes)',
		},
		'--fileName': {
			type: 'String',
			required: 'Yes if -A flag is not present, else no',
			description:
				'Chooses initial name of the file, to rename all files after. e.g --fileName=File would index all files like File -- ep 1, File -- ep 2...',
		},
		'-A': {
			type: 'Boolean',
			required: 'Yes if --fileName is not present, else no',
			description: 'Sets fileName equal to the name of the current folder',
		},
		'--start': {
			type: 'Number',
			required: false,
			description: 'starts the index count from the specified number',
		},
		'--showHelp': {
			type: 'Boolean',
			required: false,
			description: 'Shows all the available arguments with their description',
		},
		'--singleExt': {
			type: 'Boolean',
			required: false,
			description: 'Only renames the files the has a single extension. e.g it wont rename test.dev.env',
		},
		'--newNames': {
			type: 'Boolean',
			required: false,
			description: 'Shows the new names the will be given after renaming the files, but doesnt rename the files.',
		},
		'--ext': {
			type: 'String',
			required: false,
			description: 'sets the extension of the new renamed files, the default will be the existing one',
		},
		'--contains': {
			type: 'String',
			required: false,
			description: 'only renames the files that includes that specific word or characters (case sensitive)',
		},
		'--stop': {
			type: 'Number',
			required: false,
			description: 'only renames files up to the specified number',
		},
		'--startIndex': {
			type: 'Number',
			required: false,
			description: 'Starts renaming files at the specified index',
		},
		'--stopIndex': {
			type: 'Number',
			required: false,
			description: 'only renames the files up to the specified index',
		},
		fromFile: {
			type: 'String',
			required: false,
			description: 'Renames the files in a folder in the order of the selected txt file in that folder',
		},
	});
}

const dirPath = argv.dirPath;
if (!dirPath)
	return console.log(chalk.white.bgRed("Plz provide a directory path, which is not in 'C' drive, (--dirPath)"));
if (!argv.fileName && !argv.A)
	return console.log(
		chalk.white.bgRed(
			"Plz provide a file name, or provide 'A' flag to use same name as the parent folder, (--fileName, -A)"
		)
	);
argv.start = argv.start || 1;
argv.fileName = argv.fileName || `${dirPath.split('\\').pop()} -- ep`;

// fse.copySync(dirPath, path.join(dirPath, `..\\${dirPath.split('\\').pop()} old`));
let files = fs.readdirSync(dirPath) || [];
let txtFile = files.find(c => /^.*\.txt$/.test(c));
if (argv.fromFile) console.log(txtFile);
if (argv.singleExt) files = files.filter(c => c.match(/\./g).length == 1);
if (argv.contains) files = files.filter(c => new RegExp(argv.contains, 'g').test(c));

let customSort = (arr = files) =>
	[...arr].sort((a, b) => +a.match(/\d+(?=\D*\..+)/)?.join() - +b.match(/\d+(?=\D*\..+)/)?.join());
if (argv.fromFile && txtFile)
	customSort = () =>
		fs.readFileSync(`${argv.dirPath}\\${argv.fromFile === 'auto' ? txtFile : argv.fromFile}`, 'utf-8').split(',');

console.log(customSort().map((c, i) => `${c}  <===== ${i}`));

const rename = (doCustomSort = false) => {
	let newNames = [];
	if (doCustomSort) files = customSort();
	const oldNamesPath = `C:\\Users\\Alpha\\Desktop\\Rename files Old\\${dirPath.split('\\').pop()}.txt`;
	if (!fs.existsSync(oldNamesPath)) fs.writeFileSync(oldNamesPath, '');
	fs.appendFileSync(oldNamesPath, JSON.stringify({ names: files, time: new Date() }));

	files.forEach((c, i) => {
		if (!fs.existsSync(`${dirPath}\\${c}`))
			c = fs.existsSync(`${dirPath}\\${c.replace(/\s/g, '+')}`) ? c.replace(/\s/g, '+') : null;
		if (!c) return;
		const newName = `${dirPath}\\${argv.fileName} ${+argv.start + i}.${
			argv.ext || c.split('.').slice(1).join('.')
		}`;
		newNames.push(newName);
		if (fs.existsSync(newName) || argv.newNames) return;
		fs.renameSync(`${dirPath}\\${c}`, newName);
	});

	console.log(
		argv.newNames
			? newNames
			: chalk.bold.hex('#0c2461').bgHex('#25CCF7')(`            \r\n  Renamed!  \r\n            `)
	);
};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

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
