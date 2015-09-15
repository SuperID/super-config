/**
 * 测试
 */

var SuperConfig = require('./');
var config = new SuperConfig({
  paths: ['./dev_examples/config1'],
  project: 'SIDServer'
});

console.log(config);
console.log(config.projects());
console.log(config.versions());
console.log(config.versions('DeveloperCenter'));
console.log(config.getProject('SIDServer').all());
