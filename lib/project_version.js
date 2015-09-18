/**
 * SuperConfig
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var utils = require('lei-utils');
var createNamespace = require('lei-ns').Namespace;
var debug = require('debug')('super-config:project_version');


function ConfigBase (superConfig, project, version) {
  this._superConfig = superConfig;
  this._project = project;
  this._version = version;
  this.ns = createNamespace();
  debug('new: %s[%s]', project, version);
}

ConfigBase.prototype._loadFinish = function () {
  this.ns('version', this._version);
  if (!this.has('versions')) {
    throw new Error('missing config field `versions`');
  }
  if (!Array.isArray(this.ns('versions'))) {
    throw new Error('config field `versions` must be an array');
  }
}

ConfigBase.prototype.getProject = function (project, version) {
  return this._superConfig.getProject(project, version || this._version);
};

ConfigBase.prototype.projects = function () {
  return this._superConfig.projects();
};

ConfigBase.prototype.all = function () {
  return this.ns();
};

ConfigBase.prototype.get = function (name) {
  var value = this.ns(name);
  if (typeof value === 'undefined') throw new Error('config [' + this._project + '.' + this._version + '] ' + name + ' is undefined');
  return value;
};

ConfigBase.prototype.set = function (name, value) {
  return this.ns(name, value);
};

ConfigBase.prototype.has = function (name) {
  var value = this.ns(name);
  return (typeof value !== 'undefined');
};

ConfigBase.prototype.versions = function () {
  return this._superConfig.versions(this._project);
};

ConfigBase.prototype.versionExists = function (version) {
  return (this.versions().indexOf(version) !== -1);
};

ConfigBase.prototype.getVersionName = function () {
  return this._version;
};

ConfigBase.prototype.getProjectName = function () {
  return this._project;
};


function simpleWrapNS (ns) {
  var strictNS = function (a, b) {
    if (arguments.length === 1) {
      return strictNS.get(a);
    } else {
      return strictNS.set(a, b);
    }
  };
  strictNS.get = function (a) {
    var ret = ns(a);
    if (typeof ret === 'undefined') {
      throw new Error('config `' + a + '` is undefined');
    }
    return ret;
  };
  strictNS.set = function (a, b) {
    return ns(a, b);
  };
  strictNS.has = function (a) {
    var ret = ns(a);
    return (typeof ret === 'undefined') ? false : true;
  };
  strictNS.all = function () {
    return ns();
  };
  return strictNS;
}


/**
 * 从指定路径中加载配置
 */
function ConfigFromPath (superConfig, project, version) {
  ConfigFromPath.super_.call(this, superConfig, project, version);

  var strictNS = simpleWrapNS(this.ns);
  strictNS.env = simpleWrapNS(createNamespace(superConfig.getEnvConfig()));

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

  var loadedFiles = Object.keys(loaded);
  if (loadedFiles.length < 1) {
    throw new Error('cannot find any config files for ' + project + '.' + version);
  } else {
    loadedFiles.forEach(function (f) {
      delete require.cache[f];
    });
  }

  this._loadFinish();
  debug('done');
}

utils.inherits(ConfigFromPath, ConfigBase);


exports.ConfigBase = ConfigBase;
exports.ConfigFromPath = ConfigFromPath;
