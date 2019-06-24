const HttpClient = require('../lib/client.js');

const client = new HttpClient();

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
