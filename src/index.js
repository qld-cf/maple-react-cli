// // 接收命令行参数, 提供基础信息提示功能
// const commander = require('commander');

// // 内部模块
// const { existsSync } = require('fs');
// const { resolve } = require('path');
// const { version } = require('../package.json');

// require('colors');

// commander.version(version)
//   .parse(process.argv);

// const [todo = ''] = commander.args;

// // if (existsSync(resolve(__dirname, `command/${todo}.js`))) {
// require(`./command/init.js`);
// // } else {
// //   console.log(
// //     `
// //       你输入了未知指令/Valid - 加上init来初始化项目吧/Please add 'init' after the command
// //     `.red,
// //   );
// //   process.exit(-1);
// // }


// 接收命令行参数, 提供基础信息提示功能
const commander = require('commander');

// 内部模块
const { existsSync } = require('fs');
const { resolve } = require('path');
const { version } = require('../package.json');
const inquirer = require('inquirer');

require('colors');

// commander.version(version)
//   .parse(process.argv);

// const [todo = ''] = commander.args;


const init = async function () {
  const choices = ['选择模板类型', '查看前端文档', '更多功能待添加...']
  const questions = [
    {
      type: 'list',
      name: 'choice',
      message: '请选择您接下来的操作',
      choices,
    },
  ];
  const { choice } = await inquirer.prompt(questions);
  switch (choice) {
    case '选择模板类型':
      if (existsSync(resolve(__dirname, `command/tplTypes.js`))) {
        require(`./command/tplTypes.js`);
      }
      break;
    case '查看前端文档':
      if (existsSync(resolve(__dirname, `command/docs.js`))) {
        require(`./command/docs.js`);
      }
      break;
    case '更多功能待添加...':
      console.log(
        `
          欢迎issue提供建议~ https://github.com/qld-cf/maple-react-cli
        `.blue,
      );
      process.exit(-1);
      break;
    default:
      if (existsSync(resolve(__dirname, `command/tplTypes.js`))) {
        require(`./command/docs.js`);
      }
      break;
  }
}
init()
