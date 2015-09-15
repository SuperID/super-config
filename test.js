/**
 * 测试
 */

var SuperConfig = require('./');
var config = new SuperConfig({
  paths: ['./dev_examples/config1'],
  project: 'SIDServer'
});

console.log(config);
