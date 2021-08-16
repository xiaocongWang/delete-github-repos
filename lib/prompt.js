const inquirer = require('inquirer');

exports.usernamePrompt = function() {
    return new Promise((resolve) => {
        const questions = [
            {
                name: 'username',
                message: `Please input username:`,
                validate: (text) => {
                    return typeof text === 'string';
                }
            }
        ];
        inquirer
            .prompt(questions)
            .then(answer => resolve(answer.username))
    })
}

exports.tokenPrompt = function() {
    return new Promise((resolve) => {
        const questions = [
            {
                type: 'password',
                name: 'token',
                message: `Please input personal access token (how to create a token https://docs.github.com/cn/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token):`,
                validate: (text) => {
                    return typeof text === 'string';
                }
            }
        ];
        inquirer
            .prompt(questions)
            .then(answer => resolve(answer.token))
    })
}

exports.deleteReposPrompt = function(repos) {
    return new Promise((resolve) => {
        const questions = [
            {
                type: 'confirm',
                name: 'deleteRepos',
                message: `Do you confirm ${repos} to delete?`,
                validate: (text) => {
                    return text;
                }
            }
        ];
    
        inquirer
            .prompt(questions)
            .then(answer => resolve(answer.deleteRepos));
    })
    
}

exports.checkboxReposPrompt = function(choices,) {
    return new Promise((resolve) => {
        const questions = [
            {
                type: 'checkbox',
                message: 'Select Repos',
                name: 'repos',
                choices
            }
        ];
    
        inquirer
            .prompt(questions)
            .then(answers => resolve(answers.repos));
    })
    
}