// 命令管理
const commander = require('commander');
// 命令行交互工具
const inquirer = require('inquirer');
// 命令行中显示加载中
const ora = require('ora');
const Git = require('../tools/git');

class Download {
  constructor() {
    this.git = new Git();
    this.commander = commander;
    this.inquirer = inquirer;
    this.getProList = ora('获取项目列表/Get repos lists...');
    this.getTagList = ora('获取项目版本/Get repos version...');
    this.downLoad = ora('正在加速为您下载模板/Download module...');
  }

  run() {
    this.commander
      .command('download')
      .description('从远程下载代码到本地/Downloading...')
      .action(() => { this.download(); });

    this.commander.parse(process.argv);
  }

  async download() {
    let getProListLoad;
    let getTagListLoad;
    let downLoadLoad;
    let repos;
    let version;

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

    // 获取项目的版本, 这里默认选择确定项目的最近一个版本
    try {
      getTagListLoad = this.getTagList.start();
      // [{ name: version }] = await this.git.getProjectVersions(repo);
      const res = await this.git.getProjectVersions(repo);
      version = res[0].name;
      getTagListLoad.succeed('获取项目版本成功/Get repos version successfully...');
    } catch (error) {
      console.log(error);
      getTagListLoad.fail('获取项目版本失败.../Get repos version failed');
      process.exit(-1);
    }

    // 向用户咨询欲创建项目的目录
    const repoName = [
      {
        type: 'input',
        name: 'repoPath',
        message: '请输入项目名称~/Please enter your project name',
        validate(v) {
          const done = this.async();
          if (!v.trim()) {
            done('项目名称不能为空~/The project name can not be empty');
          }
          done(null, true);
        },
      },
    ];
    const { repoPath } = await this.inquirer.prompt(repoName);

    // 下载代码到指定的目录下
    try {
      downLoadLoad = this.downLoad.start();
      await this.git.downloadProject({ repo, version, repoPath });
      downLoadLoad.succeed('react脚手架初始化成功/React template init successfully');
      this.commander.command(`cd ${repoPath} && npm i && npm start`)
    } catch (error) {
      console.log(error);
      downLoadLoad.fail('下载代码失败.../Downloa failed');
    }
  }
}
const D = new Download();
D.run();
