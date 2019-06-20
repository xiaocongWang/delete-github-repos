const { deleteGithubReps } = require('../index');

deleteGithubReps({
    username: 'xiaocongwang',
    password: 'xxxxx',
    reps: ['lodash', 'atom']
})