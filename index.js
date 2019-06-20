const colors = require('colors');
const HttpClient = require('./lib/client');

exports.deleteGithubReps = async function({
    username = '',
    password = '',
    reps
}) {
    if (!reps) {
        throw new Error('reps is required');
    }
    if (!Array.isArray(reps)) {
        reps = [reps];
    }

    if (reps.length == 0) {
        throw new Error('reps cant not be empty array');
    }

    const client = new HttpClient({
        headers: {
            'User-Agent': username
        },
        auth: {
            username: username,
            password: password
        }
    });

    // 校验账号密码是否正确
    console.log(colors.yellow('\n密码验证中...\n'));
    const response = await client.get('https://api.github.com/user');
    
    if (response.status === 200) {
        console.log(colors.green(`密码校验通过，开始删除 ${reps.join('，')} 仓库\n`));
    } else {
        console.log(colors.red('密码校验不通过，输入正确的账号和密码\n'));
    }

    console.log(colors.yellow('仓库删除中...\n'));

    const promises = [];
    for (let i = 0; i < reps.length; i++) {
        const rep = reps[i];
        const promise = client.delete(`https://api.github.com/repos/${username}/${rep}`);
        promises.push(promise);
    }
    try {
        const responses = await Promise.all(promises);
        const fails = [];
        const success = [];
        responses.forEach((item, index) => {
            if (item.status >= 300) {
                fails.push(reps[index]);
            } else {
                success.push(reps[index]);
            }
        });
        if (fails.length > 0) {
            console.log(colors.red(`${fails.join('、')} 仓库删除失败\n` ));
        } else {
            console.log(colors.green('成功删除所有仓库\n'));
        }
    } catch(err) {
        throw err;
    }
}