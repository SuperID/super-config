/**
 * super-config
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var assert = require('assert');
var path = require('path');
var utils = require('lei-utils');


global.assert = assert;

exports.utils = utils;

exports.SuperConfig = require('../');

exports.configPath = function (name) {
  return path.resolve(__dirname, name);
};

exports.setEnv = function (name, value) {
  process.env[name] = value;
};
