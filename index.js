const HttpClient = require('./lib/client');

exports.deleteGithubReps = function({
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

    const client = new HttpClient({
        headers: {
            'User-Agent': username
        },
        auth: {
            username: username,
            password: password
        }
    });

    for (let i = 0; i < reps.length; i++) {
        const rep = reps[i];
        client.delete(`https://api.github.com/repos/${username}/${rep}`);
    }
}