/**
 * SuperConfig
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var createNamespace = require('lei-ns').Namespace;
var debug = require('debug')('super-config:project_version');


function ProjectVersionConfig (superConfig, project, version) {
  this._superConfig = superConfig;
  this._project = project;
  this._version = version;

  debug('ProjectVersionConfig: %s[%s]', project, version);

  var ns = createNamespace();
  this.ns = ns;

  var strictNS = function (a, b) {
    if (arguments.length === 1) {
      var ret = ns(a);
      if (typeof ret === 'undefined') throw new Error('config `' + a + '` is undefined');
      return ret;
    } else {
      return ns(a, b);
    }
  };
  strictNS.defined = function (a) {
    var ret = ns(a);
    return (typeof ret === 'undefined') ? false : true;
  };
  strictNS.all = function () {
    return ns();
  };
  strictNS.env = superConfig.getEnvConfig();

  var files = superConfig._resolvePaths(project, version);
  var loaded = {};
  var generateLoad = function (f) {
    return function (otherVersion) {
      debug('load(%s) in %s', otherVersion, f);
      var dir = path.dirname(f);
      var otherFile = path.resolve(dir, otherVersion + '.js');
      if (loaded[otherFile]) {
        throw new Error('load(' + version + ') conflict in file ' + f);
      }
      try {
        require(otherFile)(strictNS, generateLoad(otherFile));
      } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
          throw new Error('load(' + version + ') fail in file ' + f);
        } else {
          throw err;
        }
      }
    };
  };
  files.forEach(function (f) {
    debug('load %s', f);
    var init = require(f);
    loaded[f] = true;
    if (typeof init !== 'function') {
      throw new Error('bad config file format, `module.exports` must be a function: ' + f);
    }
    init(strictNS, generateLoad(f));
  });

  ns('version', version);

  if (!strictNS.defined('versions')) {
    throw new Error('missing config field `versions`');
  }
  if (!Array.isArray(ns('versions'))) {
    throw new Error('config field `versions` must be an array');
  }

  debug('done');
}

ProjectVersionConfig.prototype.getProject = function (project, version) {
  return this._superConfig.getProject(project, version);
};

ProjectVersionConfig.prototype.projects = function () {
  return this._superConfig.projects();
};

ProjectVersionConfig.prototype.all = function () {
  return this.ns();
};

ProjectVersionConfig.prototype.get = function (name) {
  var value = this.ns(name);
  if (typeof value === 'undefined') throw new Error('config [' + this._project + '.' + this._version + '] ' + name + ' is undefined');
  return value;
};

ProjectVersionConfig.prototype.set = function (name, value) {
  return this.ns(name, value);
};

ProjectVersionConfig.prototype.defined = function (name) {
  var value = this.ns(name);
  return (typeof value !== 'undefined');
};

ProjectVersionConfig.prototype.versions = function () {
  return this._superConfig.versions(this._project);
};

ProjectVersionConfig.prototype.versionExists = function (version) {
  return (this.versions().indexOf(version) !== -1);
};

ProjectVersionConfig.prototype.getVersionName = function () {
  return this._version;
};

ProjectVersionConfig.prototype.getProjectName = function () {
  return this._project;
};

module.exports = ProjectVersionConfig;
