# delete-github-repos

这是一个删除 github 仓库的命令行工具，支持单个及批量删除。

### 安装
```bash
npm i delete-github-repos
```
### 如何使用

此命令包含两种使用方式。

一、指定需要删除的仓库
```bash
delete-github-repos -u 'username:password' -r 'repo1, repo2, ...'
```
二、用户可以选择需要删除的库
```bash
delete-github-repos -u 'username:password'
```
执行以上命令会加载所有的仓库，用户选择需要删除的仓库后进行删除。
