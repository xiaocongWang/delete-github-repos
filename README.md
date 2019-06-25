# delete-github-repos

这是一个使用命令行删除 github 仓库的工具，支持单个及批量删除。

### 安装
```bash
 npm i delete-github-repos
```
### 如何使用

此命令包含两种使用方式。

一、指定要删除的库，进行删除
```bash
delete-github-repos -u 'username:password' -r 'repo1, repo2, ...'
```
二、支持用户选择需要删除的库，进行删除
```bash
delete-github-repos -u 'username:password'
```
执行以上命令会加载所有的仓库，用户进行选择需要删除的仓库，进而删除。
