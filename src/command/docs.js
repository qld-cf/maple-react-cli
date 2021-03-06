// 命令管理
const commander = require('commander');
// 命令行交互工具
const inquirer = require('inquirer');
// 命令行中显示加载中
const ora = require('ora');
const Git = require('../tools/git');
const cmd = require('node-cmd');
const fs = require('fs')
const nrc = require('node-run-cmd')
const os = require('os')

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

    this.study();

  }

  async study() {

    const startStudy = async () => {
      const choices = [
        'react',
        'electron',
        'typescript',
        'reactNative',
        'vue',
        'nodejs',
        'webpack',
      ]
      const questions = [
        {
          type: 'list',
          name: 'choice',
          message: '您要查看哪份文档？',
          choices,
        },
      ];
      const { choice } = await this.inquirer.prompt(questions);
      const platformSelect = (url) => {
        if (os.platform() === 'darwin') {
          return `open ${url}`
        } else if (os.platform() === 'win32') {
          return `cmd /c start ${url}`
        } else if (os.platform() === 'linux') {
          return `x-www-browser ${url}`
        }
      }
      cmd.run(platformSelect(`https://juejin.im/search?query=${choice}&type=all`))
      studyGoOn()
    }

    startStudy()

    const studyGoOn = async () => {
      const choices = ['继续', '学习? 学个屁.jpg']
      const questions = [
        {
          type: 'list',
          name: 'choice',
          message: '是否继续查看文档',
          choices,
        },
      ];
      const { choice } = await inquirer.prompt(questions);
      switch (choice) {
        case '继续':
          startStudy()
          break;
        case '不学了，学个屁':
          process.exit(-1);
          break;
        default:
          break;
      }
    }


  }
}
const D = new Download();
D.run();
