const HttpClient = require('../lib/client.js');

const client = new HttpClient();

// 生成 auth
client.post('https://api.github.com/authorizations', {
    data: {
        scopes: ['delete_repo'],
        note: 'with delete repo scope'
    },
    // github 接口必须要有 User-Agent 请求头
    headers: {
        'User-Agent': 'xiaocongwang'
    },
    auth: {
        username: 'xiaocongwang',
        password: 'xxxxxxx'
    }
}).then((res) => {
    console.log(res);
})


// 删除某一仓库
client.delete('https://api.github.com/repos/xiaocongwang/mysql', {
    headers: {
        'User-Agent': 'xiaocongwang'
    },
    auth: {
        username: 'xiaocongwang',
        password: 'xxxxxx'
    }
})
