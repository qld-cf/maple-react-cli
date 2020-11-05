# react-ts-template 脚手架

## 快速拉取代码，下载依赖，运行项目一气呵成

#### 使用

`> npm i -g maple-react-cli`

`> maple-react-cli`

```
? 请选择您接下来的操作 选择模板类型
? 选一个APP类型来初始化您的项目~ react-web-tpl
✔ 初始化中..
✔ 准备拉取代码...
? 请输入您本地初始化的项目名~ dd
✔ 拉取代码成功
✔ 安装依赖成功~
? 是否运行项目？ yes
恭喜~项目启动成功~请稍候...
```

[模板 1 详情: react-web-tpl ](https://github.com/qld-cf/react-web-tpl)
[模板 2 详情: electron-react-tpl ](https://github.com/qld-cf/electron-react-tpl)

#### 实现

#### 一、准备模板

[模板 1 详情: react-web-tpl ](https://github.com/qld-cf/react-web-tpl)

###### 一般放到 github repos 即可

#### 二、具体的 cli 工具实现流程

###### 前提准备

- [命令行处理 commander](https://www.npmjs.com/package/commander)
- [axios](https://www.npmjs.com/package/axios)
- [命令行交互工具 inquirer.js](https://github.com/SBoudrias/Inquirer.js#documentation)
- [ora 命令行 loading](https://www.npmjs.com/package/ora)
- [下载 github 项目 download-git-repo](https://www.npmjs.com/package/download-git-repo)

```
yarn add commander inquirer ora axios
```

1. 创建基本文件和目录结构

```

mkdir maple-react-cli && cd maple-react-cli && npm init // 创建目录
mkdir bin && cd bin // 创建bin文件夹
touch maple.js // 创建指令文件
```

2. 修改 package.json, 添加入口

```
  "bin": {
    "maple-react-cli": "./bin/maple.js" // 关键命令行
  },
```

3. maple.js

```

#!/usr/bin/env node // shell要以node方式来解析文件
require('../src');

```

4. 准备如下的目录结构，进行命令行解析和构建，下载等

```
|————bin --------------------- 命令行入口
| |————maple.js  -------------
|————config ------------------ 配置
| |————index.js  ------------- github api
|————src ---------------------
| |————command  --------------
| | |————init.js  ------------ 命令行解析
| |————tools  ---------------- 工具
| | |————git.js  ------------- 获取模板信息
| | |————request.js  --------- 请求封装
| |————index.js  ------------- 解析入口
|————README.md  --------------- 项目描述文件
```

5. src/index.js

```
// 接收命令行参数, 提供基础信息提示功能
const commander = require('commander');

// 内部模块
const { existsSync } = require('fs');
const { resolve } = require('path');
const { version } = require('../package.json');

// 命令行颜色
require('colors');

commander.version(version)
  .parse(process.argv);

const [todo = ''] = commander.args;

if (existsSync(resolve(__dirname, `command/${todo}.js`))) {
  require(`./command/${todo}.js`);
} else {
  console.log(`未知指令/Valid - 加上init来初始化项目吧/Please add 'init' after the command`.red,
  );
  process.exit(-1);
}

```

6. 配置 config/index.js

```
//  github api 基础地址
exports.baseURL = 'https://api.github.com';
// github 组织名称
exports.orgName = 'qld-cf'; // 可改为你的仓库
exports.token = ''; // 避免请求限流

```

7. 获取 github api token

> github -> settings -> developer settings -> personal access tokens -> generage new token

拷贝后到配置文件，token 最好设置只读

8. command/init.js

###### 命令和文件名一致，便于拓展其他命令和解耦

```
...
    // 获取所在项目组的所有可开发项目列表
    try {
      getProListLoad = this.getProList.start();
      repos = await this.git.getProjectList();
      getProListLoad.succeed('获取项目列表成功/Get repos successfully...');
    } catch (error) {
      console.log(error);
      getProListLoad.fail('获取项目列表失败/Get repos failed...');
      process.exit(-1);
    }

    // 向用户咨询他想要开发的项目
    if (repos.length === 0) {
      console.log('\n可以开发的项目数为 0, 肯定是配置错啦~~\n'.red);
      process.exit(-1);
    }
    const choices = repos.map(({ name }) => name);
    const questions = [
      {
        type: 'list',
        name: 'repo',
        message: '请选择你想要的模板/Choose template',
        choices,
      },
    ];
    const { repo } = await this.inquirer.prompt(questions);
...
```

###### 工具类可执行查看功能，主要封装接口；

###### 至此，工具初始化流程结束

#### 三、 cli 运行

- 本地测试

```

// 测试软链到全局使用
> npm i
> npm link // 软链到全局npm，就可以使用maple-react-cli
> maple-react-cli init
// 项目内测试
> node bin/maple.js
```

#### 推送到 npmjs

1. [登录 npmjs](https://www.npmjs.com/)
2. 还原镜像，避免推送错误

```
npm config set registry http://registry.npmjs.org
```

3. 按照提示添加 npmjs 用户信息： `npm adduser`
4. `npm publish`
5. 去 npmjs 搜索 maple-react-cli

#### 使用

`npm i -g maple-react-cli`

`maple-react-cli`

- 选择模板 'react-ts-template'
- 输入自定义的项目名
- 创建模板成功

##### githubApi 请求错误

1. 403： 添加 token
2. 401： 不要将 token push 到仓库，本地测试用；但是推送到 npm 需要 token

#### 修改指定下载的仓库名

```
// src/tools/git.js
const { gitRepo } = require('../package.json');
/**
  * 获取指定项目
  * @param {String} repo 项目名称
  */
getProjectVersions(repo) {
  return request(`search/repositories?q=${repo}+user:${gitRepo}`);
}
```

[github](https://github.com/qld-cf/maple-react-cli)
