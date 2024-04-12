#!/usr/bin/env node

const { execSync } = require('child_process');

const runCommand = (command) => {
    try {
        execSync(`${command}`, { stdio: 'inherit' });
    } catch (e) {
        console.error(`Failed to execute ${command}`, e);
        return false;
    }
    return true;
}

// Retrieve the repository name from the command line arguments
const repoName = process.argv[2];
if (!repoName) {
    console.error('Please specify the project name: npx @monsterapi/whisper-playground <project-name>');
    process.exit(1);
}

const gitCheckoutCommand = `git clone --depth 1 https://github.com/Dheeraj-Bhandari/MonsterAPI-Whisper-Playground ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

console.log(`Cloning the repository with name ${repoName}...`);
const checkedOut = runCommand(gitCheckoutCommand);
if (!checkedOut) process.exit(-1);

console.log(`Installing dependencies for ${repoName}...`);
const installedDeps = runCommand(installDepsCommand);
if (!installedDeps) process.exit(-1);

console.log("Congratulations! You are ready to start.");
console.log(`Follow these commands to get started:\n`);
console.log(`cd ${repoName}`);
console.log(`npm start`);
