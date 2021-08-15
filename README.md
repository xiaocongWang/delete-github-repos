# delete-github-repos

这是一个删除 github 仓库的命令行工具，支持单个及批量删除。

### 为什么会有这个工具

本人在早期 fork 以及创建了很多仓库，而这些仓库在实际中并没有发挥太大的用处，所以打算删除这些仓库。而 github 为了防止用户误删仓库，对删除操作做了比较繁琐的交互；这对于需要删除大量仓库的人来说不太友好，因此就诞生了这个工具。如果你也有删除仓库的需求，那么这个工具刚好适合你。

### 安装
```bash
npm i delete-github-repos -g
```
### 如何使用

工具包含两种使用方式

一、删除指定的仓库
```bash
delete-github-repos -u 'username:password' -r 'repo1, repo2, ...'
```
二、选择需要删除的仓库进行删除
```bash
delete-github-repos -u 'username:password'
```
