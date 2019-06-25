#!/usr/bin/env node

const commander = require('commander');
const colors = require('colors');
const GithubTool = require('../lib/githubTool');
const { deleteReposPrompt, checkboxReposPrompt } = require('../lib/prompt');
const pkg = require('../package.json');

function separatedList(value) {
    return value
            .split(',')
            .filter(item => !!item)
            .map(item => item.trim());
}

commander
    .version(pkg.version, '-v, --version')
    .option('-u, --user <user:password>', 'USER:PASSWORD Github user and password')
    .option('-r, --repos <reposNames>', 'Repos need to delete, perhaps String or String of Array', separatedList)

commander.parse(process.argv);

let { user, repos } = commander;
const userInfo = user && user.split(':');

if (!user || userInfo.length !== 2) {
    console.error(`delete-github-repos: try 'delete-github-repos --help' for more information`);
    process.exit(1);
}

const [ username, password ] = userInfo;

const githubTool = new GithubTool(username, password);

async function getOwnerRepos() {
    try {
        const res = await githubTool.getOwnerRepos();
        const data = JSON.parse(res.data);

        if (data && data.length > 0) {
            const repos = [];
            data.forEach((item) => {
                repos.push(item.name);
            });
            return repos;
        }
        return [];
    } catch(err) {
        console.error(colors.red(err.toString()));
        process.exit(1);
    }
}

async function deleteRepos(answer, repos) {
    if (answer) {
        // 开始校验账号密码是否正确
        console.log(colors.yellow('\n密码验证中...\n'));
        if (await githubTool.checkUser()) {
            console.log(colors.green(`密码校验通过，开始删除 ${repos.join('，')} 仓库\n`));
        } else {
            console.log(colors.red('密码校验不通过，输入正确的账号和密码\n'));
            process.exit(1);
        };

        // 开始删除仓库
        try {
            // 部分删除失败的
            const fails = await githubTool.deleteRepos(repos);

            if (fails.length > 0) {
                console.log(colors.red(`${fails.join('、')} 仓库删除失败\n` ));
            } else {
                console.log(colors.green('成功删除所有仓库\n'));
            }
        } catch(err) {
            console.log(colors.red(err.toString()));
            process.exit(1);
        }
    }
}

// 如果 repos 不存在，则去拉取所有仓库，并且让用户选择删除哪些
if (!repos) {
    // 开始加载所有仓库
    console.log(colors.yellow('\n加载所有仓库中...\n'));
    getOwnerRepos().then(repos => {
        if (repos.length === 0) {
            console.log(colors.green('您没有自己的拥有仓库\n'));
            process.exit(1);
        } else {
            const choices = repos.map(item => ({ name: item }))
            checkboxReposPrompt(choices, (answers) => {
                if (answers.length > 0) {
                    deleteReposPrompt(answers, (isDelete) => {
                        deleteRepos(isDelete, answers);
                    });
                } else {
                    process.exit(1);
                }
            });
        }
    });
} else if (repos && repos.length > 0) {
    deleteReposPrompt(repos, (answer) => {
        deleteRepos(answer, repos);
    });
}