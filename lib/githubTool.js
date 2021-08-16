const HttpClient = require('./client');

class GithubTool {
    constructor(username, token) {
        this.username = username;
        this.client = new HttpClient({
            headers: {
                'User-Agent': username,
                'Authorization': `token ${token}`
            }
        });
    }

    async checkUser(username) {
        try {
            const response = await this.client.get('https://api.github.com/user');
            if (response.status === 200) {
                return true;
            }
            return false;
        } catch(err) {
            console.error(err);
        }
    }

    async getOwnerRepos() {
        try {
            const response = await this.client.get(`https://api.github.com/users/${this.username}/repos`);
            if (response.status === 200) {
                return response;
            }
            return {};
        } catch(err) {
            console.error(err);
        }
    }

    deleteRepos(repos) {
        return new Promise((resolve, reject) => {
            if (!repos) {
                reject(new Error('repos is required'));
            }
            if (!Array.isArray(repos)) {
                repos = [repos];
            }
        
            if (repos.length == 0) {
                reject(new Error('repos cant not be empty array'));
            }
    
            const promises = [];
            for (let i = 0; i < repos.length; i++) {
                const rep = repos[i];
                const promise = this.client.delete(`https://api.github.com/repos/${this.username}/${rep}`);
                promises.push(promise);
            }

            Promise.all(promises).then((responses) => {
                const fails = [];
                responses.forEach((item, index) => {
                    if (item.status >= 300) {
                        fails.push(repos[index]);
                    }
                });
                resolve(fails);
            }).catch(err => reject(err));
        })
    }
}

module.exports = GithubTool;