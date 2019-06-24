const GithubTool = require('../lib/githubTool');

const githubTool = new GithubTool({ username: 'xiaocongwang', password: 'xxxxxxx' });

githubTool.deleteRepos(['111', '222']);

githubTool.getOwnerRepos();

githubTool.checkUser();
