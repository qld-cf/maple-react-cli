// 命令管理
const commander = require('commander');
// 命令行交互工具
const inquirer = require('inquirer');
// 命令行中显示加载中
const ora = require('ora');
const Git = require('../tools/git');
const cmd = require('node-cmd');
const fs = require('fs')

class Download {
  constructor() {
    this.git = new Git();
    this.commander = commander;
    this.inquirer = inquirer;
    this.getProList = ora('获取项目列表/Get repos lists...');
    this.getTagList = ora('初始化中...');
    this.getLocalPro = ora('正在安装依赖,请耐心等待...');
    this.getDownloadPkg = ora('正在安装依赖...');
    this.downLoad = ora('正在加速为您下载模板/Download module...');
  }

  run() {
    this.download();
  }

  async download() {
    let getTagListLoad;
    let downLoadLoad;
    let reposObj;
    let curProject;
    let getLocalProLoad;

    const choices = [
      'react-web-tpl',
      'electron-react-tpl',
      'koa2-websocket',
    ]
    const questions = [
      {
        type: 'list',
        name: 'choice',
        message: '选一个APP类型来初始化您的项目~',
        choices,
      },
    ];
    const { choice } = await this.inquirer.prompt(questions);
    const chooseTpl = async (choice) => {
      return await this.git.getProjectVersions(choice)
    }

    // 获取模板类型
    try {
      getTagListLoad = this.getTagList.start();
      // [{ name: version }] = await this.git.getProjectVersions(repo);
      const res = await chooseTpl(choice);
      if (res.items) {
        reposObj = res.items.filter(e => e.name === choice)[0]
        getTagListLoad.succeed('准备拉取代码...');
      } else {
        getTagListLoad.fail('未找到仓库');
        process.exit(-1);
      }
    } catch (error) {
      console.log(error);
      getTagListLoad.fail('获取项目版本失败');
      process.exit(-1);
    }

    // 向用户咨询欲创建项目的目录
    const _repoName = [
      {
        type: 'input',
        name: 'repoPath',
        message: '请输入您本地初始化的项目名~',
        validate(v) {
          curProject = v;
          const done = this.async();
          // 验证文件夹是否存在
          fs.exists(v, function (exists) {
            if (exists) {
              console.log('项目名已存在了呀')
              process.exit(-1);
            } else {
              if (!v.trim()) {
                console.log('项目名不能为空')
                process.exit(-1);
              }
              done(null, true);
            }
          });

        },
      },
    ];

    const repoName = [
      {
        type: 'input',
        name: 'repoPath',
        message: '请输入您本地初始化的项目名~',
        validate(v) {
          curProject = v;
          const done = this.async();
          // 验证文件夹是否存在
          fs.exists(v, async function (exists) {
            if (exists) {
              console.log('项目名已存在，请重试')
              await inquirer.prompt(_repoName);
            } else {
              if (!v.trim()) {
                console.log('项目名不能为空，请重试')
                await inquirer.prompt(_repoName);
              }
              done(null, true);
            }
          });

        },
      },
    ];
    const { repoPath } = await this.inquirer.prompt(repoName);

    // 下载代码到指定的目录下
    try {
      downLoadLoad = this.downLoad.start();
      const res = await this.git.downloadProject(reposObj.clone_url, repoPath);
      if (!res) {
        console.error('error')
        process.exit(-1);
      }
      downLoadLoad.succeed('拉取代码成功')
      getLocalProLoad = this.getLocalPro.start()
      cmd.get(
        `
              cd ${curProject}
              npm i
          `,
        async function (err, data, stderr) {
          if (!err) {
            getLocalProLoad.succeed('安装依赖成功~')
            const choices = ['yes', 'no']
            const questions = [
              {
                type: 'list',
                name: 'choice',
                message: '是否运行项目？',
                choices,
              },
            ];
            const { choice } = await inquirer.prompt(questions);
            if (choice === 'yes') {
              cmd.get(
                `
                      cd ${curProject}
                      npm start
                  `,
                function (err, data, stderr) {
                }
              )
              setTimeout(() => {
                console.log('恭喜~项目启动成功~请稍候...')
              }, 800);
            } else {
              getLocalProLoad.succeed('已退出，如有需要请手动运行');
              process.exit(-1);
            }
          } else {
            getLocalProLoad.fail('设置无效', err);
          }
        }
      )

    } catch (error) {
      console.log(error);
      downLoadLoad.fail('操作失败...');
    }
  }
}
const D = new Download();
D.run();
