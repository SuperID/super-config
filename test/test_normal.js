/**
 * super-config
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var support = require('./support');


describe('SuperConfig', function () {

  it('#1 一个paths，加载common项目和版本', function () {
    support.setEnv('APP_VERSION', 'dev');
    var config = new support.SuperConfig({
      paths: support.configPath('config_1'),
      project: 'project_1'
    });
    var c = config.getProject('project_1');
    assert.ok(c.get('loaded._common._common'));
    assert.ok(c.get('loaded._common.dev'));
    assert.ok(c.get('loaded.project_1._common'));
    assert.ok(c.get('loaded.project_1.dev'));
  });


});

