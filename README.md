# react-ts-template 脚手架

#### 使用
`npm i -g maple-react-cli`

`maple-react-cli init`

- 选择模板 'react-ts-template'
- 输入自定义的项目名
- 创建模板成功

[模板详情: react-ts-template](https://github.com/qld-cf/react-ts-template)


#### 实现


> 自己整理了一套日常用的模板，但每次初始化都比较麻烦，所以创建了一个工具并传到npm库，下面介绍实现过程


[github](https://github.com/qld-cf/maple-react-cli)

#### 一、准备模板

[react-ts-template](https://github.com/qld-cf/react-ts-template)

###### 一般放到github repos即可



#### 二、cli实现

###### 前提准备
- [命令行处理 commander](https://www.npmjs.com/package/commander)
- [axios](https://www.npmjs.com/package/axios)
-  [命令行交互工具 inquirer.js](https://github.com/SBoudrias/Inquirer.js#documentation)
-  [ora 命令行loading](https://www.npmjs.com/package/ora)

```
yarn add commander inquirer ora axios
```


1. 创建基本文件和目录结构
```

mkdir maple-react-cli && cd maple-react-cli && npm init // 创建目录
mkdir bin && cd bin // 创建bin文件夹
touch maple.js // 创建指令文件
```

2. 修改package.json, 添加入口
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
exports.token = 'abbc911fa35f9e6dcd725eb2f77288c9cf40284a'; // 避免请求限流

```

7. 获取github api token

> github -> settings -> developer settings -> personal access tokens -> generage new token

拷贝后到配置文件，token最好设置只读

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

#### 三、 cli运行

- 本地测试
```
npm i
npm link // 软链到全局npm，就可以使用maple-react-cli
maple-react-cli init
```

```
✔ 获取项目列表成功/Get repos successfully...

? 请选择你想要的模板/Choose template
react-ts-template

✔ 获取项目版本成功/Get repos version successfully...

? 请输入项目名称~/Please enter your project name l

✔ react脚手架初始化成功/React template init successfully

✔ now, please cd l && npm i && npm start by yourself
```

#### 推送到npmjs

1. [登录npmjs](https://www.npmjs.com/)
2. 还原镜像，避免推送错误
```
npm config set registry http://registry.npmjs.org
```
3. 按照提示添加npmjs用户信息： `npm adduser`
4. `npm publish`
5. 去npmjs搜索maple-react-cli




#### 使用
`npm i -g maple-react-cli`

`maple-react-cli init`

- 选择模板 'react-ts-template'
- 输入自定义的项目名
- 创建模板成功

##### githubApi请求错误
1. 403： 添加token
2. 401： 不要将token push到仓库，本地测试用；但是推送到npm需要token


[github](https://github.com/qld-cf/maple-react-cli)