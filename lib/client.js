const http = require('follow-redirects').http;
const https = require('follow-redirects').https;
const Agent = require('agentkeepalive');
const HttpsAgent = require('agentkeepalive').HttpsAgent;
const URL = require('url');
const qs = require('qs');
const ms = require('ms');
const utils = require('../utils/index');

const agent = new Agent({ maxSockets: 1000 });
const httpsAgent = new HttpsAgent({ maxSockets: 1000 });

const timeout = ms('10s');

/**
 * 基于 http.request 封装的客户端
 * @timeout 响应超时时间
 * @headers 请求头
 * @agent http request agent 对象
 * @httpsAgent https request agent 对象
 */
module.exports = class HttpClient {
    constructor(config) {
        const defaultConfig = {
            timeout,
            agent,
            httpsAgent
        }
        this.config = utils.defaults(defaultConfig, config);
    }

    /**
     * 
     * @param url
     * @param onfig 可覆盖全局配置的超时时间
     * @param timeout 设置超时时间
     * @param headers 请求头
     * @param params 请求参数
     * @param data 发送给服务端数据， 支持 对象字面量，字符串，Buffer，Stream -- 如果是 json 字符串，会将其解析成对象字面量，否则，转换成 Buffer
     * @param contentType 以什么方式发送至服务端，支持 x-www-form-urlencoded、json. 默认 json 方式
     * @param agent http request agent 对象
     * @param auth 授权账号密码
     * @param httpsAgent https request agent 对象
     */
    _request(url, config) {
        return new Promise((resolve, reject) => {
            const mergedConfig = utils.defaults({}, this.config, config);
            const headers = mergedConfig.headers || {};
            const contentType = config.contentType || 'json';
            let data = mergedConfig.data;
            let timer;
            let isPlainObject = false;

            // 对 data 数据做处理，data
            if (data && !utils.isStream(data) && !Buffer.isBuffer(data)) {
                if (typeof data === 'string') {
                    try {
                        data = JSON.parse(data);
                        isPlainObject = true;
                    } catch(e) {
                        data = new Buffer(data, 'utf-8');
                    }
                } else {
                    isPlainObject = true;
                }
            }

            if (contentType === 'json') {
                headers['Content-Type'] = 'application/json';
                if (isPlainObject) {
                    data = JSON.stringify(data);
                }
            } else if (contentType === 'x-www-form-urlencoded') {
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
                if (isPlainObject) {
                    data = qs.stringify(data);
                }
            }

            const parsed = URL.parse(url);
            const protocol = parsed.protocol || 'http:';
            const isHttps = protocol === 'https:';
            const transport = isHttps ? https : http;
            const agent = isHttps ? mergedConfig.httpsAgent : mergedConfig.agent;

            // HTTP basic authentication
            let auth = undefined;
            if (mergedConfig.auth) {
                const username = mergedConfig.auth.username || '';
                const password = mergedConfig.auth.password || '';
                auth = username + ':' + password;
            }

            const params = qs.stringify(mergedConfig.params) ? (`${parsed.path.indexOf('?') === -1 ? '?' : '&'}${qs.stringify(mergedConfig.params)}`) : '';

            const options = {
                method: mergedConfig.method || 'GET',
                path: `${parsed.path}${params}`,
                headers,
                hostname: parsed.hostname,
                port: parsed.port,
                agent,
                auth
            }

            const req = transport.request(options, resposeHandle);

            function resposeHandle(res) {
                if (req.aborted) {
                    return;
                }
                
                // 请求返回后，清除定时器
                clearTimeout(timer);
                timer = null;

                const response = {
                    status: res.statusCode,
                    statusTxt: res.statusMessage,
                    headers: res.headers
                }

                const chunks = [];
                let size = 0;
                res.on('data', (chunk) => {
                    chunks.push(chunk);
                    size += chunk.length;
                });

                res.on('end', () => {
                    const bufs = Buffer.concat(chunks, size);
                    const responseData = bufs.toString('utf8');
                    response.data = responseData;
                    resolve(response);
                });

                res.on('error', (err) => {
                    if (req.aborted) {
                        return;
                    }
                    reject(err);
                });
            }

            // 超时处理
            if (mergedConfig.timeout && !timer) {
                timer = setTimeout(() => {
                    // 终止请求
                    req.abort();
                    reject(new Error('请求超时'));
                }, mergedConfig.timeout);
            }

            // 错误处理
            req.on('error', (err) => {
                // 如果请求已终止，则不处理
                if (req.aborted) {
                    return;
                }
                reject(err);
            });
            
            // 发送回数据
            if (utils.isStream(data)) {
                data.pipe(req);
            } else {
                req.end(data);
            }
        });
    }
    get(url, config = {}) {
        config.method = 'GET';
        return this._request(url, config);
    }
    post(url, config = {}) {
        config.method = 'POST';
        return this._request(url, config);
    }
    delete(url, config = {}) {
        config.method = 'DELETE';
        return this._request(url, config);
    }
}