/**
 * 载入配置文件
 */

var path = require('path');
var fs = require('fs');
var createNamespace = require('lei-ns').Namespace;
var ProjectVersionConfig = require('./project_version');
var debug = require('debug')('super-config:main');



/**
 * 创建SuperConfig实例
 *
 * @param {Object} options
 */
function SuperConfig (options) {
  this._cacheConfig = {};
  this._cacheProjects = null;
  this._cachePaths = {};
  this._cacheEnvConfig = null;
  if (options) this.setOption(options);
}

/**
 * 设置
 *
 * @param {Object} options
 *   - {String} envName 用于获取当前版本的环境变量名，默认APP_VERSION
 *   - {String} envConfigName 用于获取当前额外配置信息的环境变量名，默认APP_CONFIG
 *   - {String} project 项目名，默认无
 *   - {String} paths 当前配置文件目录，默认为['./config']，依次从这些目录中加载配置文件
 *   - {String} commonProject 公共配置项目名，默认_common
 *   - {String} commonVersion 公共配置版本名，默认_common
 */
SuperConfig.prototype.setOption = function (options) {
  this._options = options = options || {};
  this._envName = options.envName || 'APP_VERSION';
  this._envConfigName = options.envConfigName || 'APP_CONFIG';
  this._commonProject = options.commonProject || '_common';
  this._commonVersion = options.commonVersion || '_common';
  this._paths = options.paths || ['./config'];
  if (!Array.isArray(this._paths)) {
    if (typeof this._paths === 'string') {
      this._paths = [this._paths];
    } else {
      throw new Error('`paths` must be an array');
    }
  }
  this._paths = this._paths.map(function (f) {
    return path.resolve(f);
  });
  if (options.project) {
    this.setProject(options.project);
  }
  this.getEnvConfig();
};

SuperConfig.prototype._resolvePaths = function (project, version) {
  var key = project + ':' + version;
  if (!this._cachePaths[key]) {
    var versions = [];
    versions.push([this._commonProject, this._commonVersion]);
    versions.push([this._commonProject, version]);
    versions.push([project, this._commonVersion]);
    versions.push([project, version]);
    var list = [];
    this._paths.forEach(function (dir) {
      versions.forEach(function (item) {
        var f = path.resolve(dir, item[0], item[1]) + '.js';
        if (fs.existsSync(f)) {
          list.push(f);
        }
      });
    });
    this._cachePaths[key] = list;
  }
  return this._cachePaths[key];
};

/**
 * 取得所有项目列表
 *
 * @return {Array}
 */
SuperConfig.prototype.projects = function () {
  function readdir (dir) {
    return fs.readdirSync(dir).map(function (n) {
      var f = path.resolve(dir, n);
      var s = fs.statSync(f);
      return s.isDirectory() ? n : false;
    }).filter(function (n) {
      return n;
    });
  }
  function addTo (obj, list) {
    list.forEach(function (n) {
      obj[n] = true;
    });
  }
  if (!this._cacheProjects) {
    var names = {};
    this._paths.forEach(function (dir) {
      addTo(names, readdir(dir));
    });
    delete names[this._commonProject];
    this._cacheProjects = Object.keys(names);
    Object.freeze(this._cacheProjects);
  }
  return this._cacheProjects.slice();
};

/**
 * 获取环境变量提供的额外配置信息
 *
 * @return {Object}
 */
SuperConfig.prototype.getEnvConfig = function () {
  if (!this._cacheEnvConfig) {
    var json = process.env[this._envConfigName];
    if (json) {
      try {
        this._cacheEnvConfig = JSON.parse(json);
      } catch (err) {
        throw new Error('JSON parse `env.' + this._cacheEnvConfig + '` error:\n' + json);
      }
    } else {
      this._cacheEnvConfig = {};
    }
    Object.freeze(this._cacheEnvConfig);
  }
  return this._cacheEnvConfig;
};

/**
 * 设置当前的项目
 *
 * @param {String} name
 */
SuperConfig.prototype.setProject = function (name) {
  this._project = name;
  this._version = process.env[this._envName];
  if (!this._version) {
    throw new Error('cannot get version name from `env.' + this._envName + '`');
  }
  return this.getProject(this._project, this._version);
};

/**
 * 取指定项目版本配置
 *
 * @param {String} project
 * @param {String} version
 * @return {Object}
 */
SuperConfig.prototype.getProject = function (project, version) {
  version = version || this._version;
  var key = project + ':' + version;
  if (!this._cacheConfig[key]) {
    this._cacheConfig[key] = new ProjectVersionConfig(this, project, version);
  }
  return this._cacheConfig[key];
};

/**
 * 获取指定项目的版本列表
 *
 * @param {String} project
 * @return {Array}
 */
SuperConfig.prototype.versions = function (project) {
  project = project || this._project;
  return this.getProject(project).get('versions').slice();
};


module.exports = SuperConfig;
