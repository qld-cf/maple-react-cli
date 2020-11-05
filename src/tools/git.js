// const download = require('download-git-repo');
// const request = require('./request');
// const { orgName } = require('../../config');

// class Git {
//   constructor() {
//     this.orgName = orgName;
//   }

//   /**
//    * 获取项目模板列表
//    */
//   getProjectList() {
//     return request(`/users/${this.orgName}/repos`);
//   }

//   /**
//    * 获取版本列表
//    * @param {String} repo 项目名称
//    */
//   getProjectVersions(repo) {
//     return request(`/repos/${this.orgName}/${repo}/tags`);
//   }

//   /**
//    * 下载 github 项目
//    * @param {Object} param 项目信息 项目名称 项目版本 本地开发目录
//    */
//   downloadProject({ repo, version, repoPath }) {
//     return new Promise((resolve, reject) => {
//       download(`${this.orgName}/${repo}#${version}`, repoPath, (err) => {
//         if (err) reject(err);
//         resolve(true);
//       });
//     });
//   }
// }

// module.exports = Git;


const download = require('download-git-repo');
const request = require('./request');
const { token } = require('../../config');
const { gitRepo } = require('../../package.json');


class Git {
  constructor() {
  }

  /**
   * 获取项目模板列表
   */
  getProjectList() {
    return request('/projects?simple=true');
  }

  /**
   * 获取指定项目
   * @param {String} repo 项目名称
   */
  getProjectVersions(repo) {
    return request(`search/repositories?q=${repo}+user:${gitRepo}`);
  }

  /**
   * 下载 github 项目
   * @param {Object} param 项目url 本地开发目录
   */
  downloadProject(repos, repoPath) {
    return new Promise((resolve, reject) => {
      download(`direct:${repos}`, repoPath, { clone: true }, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }
}

module.exports = Git;
