#!/usr/bin/env node

const commander = require('commander');
const colors = require('colors');
const GithubTool = require('../lib/githubTool');
const { usernamePrompt, tokenPrompt, deleteReposPrompt, checkboxReposPrompt } = require('../lib/prompt');
const pkg = require('../package.json');

function separatedList(value) {
    return value
            .split(',')
            .filter(item => !!item)
            .map(item => item.trim());
}

commander
    .version(pkg.version, '-v, --version')
    .option('-r, --repos <reposNames>', 'Repos need to delete, perhaps String or String of Array', separatedList)

commander.parse(process.argv);

const { repos } = commander;

let githubTool;

init();

async function init() {
    const username = await usernamePrompt();

    let token = await tokenPrompt();

    githubTool = new GithubTool(username, token);

    // token 校验
    console.log(colors.yellow('\ntoken 验证中...\n'));

    const isTrue = await githubTool.checkUser(username);

    // 如果校验不通过则直接退出
    if (!isTrue) {
        console.log(colors.red('token 校验失败\n'));
        process.exit(1);
    }

    if (isTrue) {
        // 如果 repos 不存在，则去拉取所有仓库，并且让用户选择删除哪些
        if (!repos) {
            // 开始加载所有仓库
            console.log(colors.yellow('\n验证成功，加载所有仓库中...\n'));
            const repos = await getOwnerRepos();

            if (repos.length === 0) {
                console.log(colors.green('您没有自己的拥有仓库\n'));
                process.exit(1);
            } else {
                const choices = repos.map(item => ({ name: item }))
                const answers = await checkboxReposPrompt(choices);
                if (answers.length > 0) {
                    const isDelete = await deleteReposPrompt(answers);
                    isDelete && deleteRepos(answers);
                } else {
                    process.exit(1);
                }
            }
        } else if (repos && repos.length > 0) {
            const isDelete = await deleteReposPrompt(repos);
            isDelete && deleteRepos(repos);
        }
    }
}

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

async function deleteRepos(repos) {
    console.log(colors.green(`开始删除 ${repos.join('，')} 仓库\n`));
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