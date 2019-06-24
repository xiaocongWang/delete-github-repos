const inquirer = require('inquirer');

exports.deleteReposPrompt = function(repos, callback) {
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
        .then(answer => callback(answer.deleteRepos));
}

exports.checkboxReposPrompt = function(choices, callback) {
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
        .then(answers => callback(answers.repos));
}