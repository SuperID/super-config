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

  it('#2 多个paths，加载common项目和版本', function () {
    support.setEnv('APP_VERSION', 'dev');
    var config = new support.SuperConfig({
      paths: [support.configPath('config_2/1'), support.configPath('config_2/2')],
      project: 'project_1'
    });
    var c = config.getProject('project_1');
    assert.ok(c.get('loaded._common._common'));
    assert.ok(c.get('loaded._common.dev'));
    assert.ok(c.get('loaded.project_1._common'));
    assert.ok(c.get('loaded.project_1.dev'));
    assert.ok(c.get('loaded.2._common._common'));
    assert.ok(c.get('loaded.2._common.dev'));
    assert.ok(c.get('loaded.2.project_1._common'));
    assert.ok(c.get('loaded.2.project_1.dev'));
  });

  it('#3 多个paths，加载common项目和版本，覆盖相同配置项', function () {
    support.setEnv('APP_VERSION', 'dev');
    var config = new support.SuperConfig({
      paths: [support.configPath('config_2/1'), support.configPath('config_2/2')],
      project: 'project_1'
    });
    var c = config.getProject('project_1');
    assert.equal(c.get('loaded.config1'),'_common.dev');
    assert.equal(c.get('loaded.config2'),'project_1._common');
    assert.equal(c.get('loaded.config3'),'project_1.dev');
    assert.equal(c.get('loaded.config4'),'_common2._common');
    assert.equal(c.get('loaded.config5'),'_common2.dev');
    assert.equal(c.get('loaded.config6'),'project_2._common');
    assert.equal(c.get('loaded.config7'),'project_2.dev');
  });

  it('#4 自动缓存已加载过的配置', function () {
    support.setEnv('APP_VERSION', 'dev');
    var config = new support.SuperConfig({
      paths: support.configPath('config_1'),
      project: 'project_1'
    });
    var c = config.getProject('project_1');
    var v = c.get('random.value');
    assert.equal(config.getProject('project_1').get('random.value'), v);
  });

  it('#5 测试额外配置envConfig', function () {
    support.setEnv('APP_VERSION', 'dev');

    try {
      support.setEnv('APP_CONFIG', 'dev');
      var config = new support.SuperConfig({
        paths: support.configPath('config_1'),
        project: 'project_1'
      });
      var c = config.getProject('project_1');
      throw new Error('解析env出错，此处应该抛出异常');
    } catch (err) {}

    support.setEnv('APP_CONFIG', JSON.stringify({group: 1}));
    var config = new support.SuperConfig({
      paths: support.configPath('config_1'),
      project: 'project_1'
    });
    var c = config.getProject('project_1');
    assert.ok(c.get('loaded.group1'));
  });

  it('#6 更改envVersion和envConfigName名字', function () {
    support.setEnv('APP_VERSION', 'xxx');
    support.setEnv('APP_CONFIG', '');
    support.setEnv('NEW_VERSION', 'dev');
    support.setEnv('NEW_CONFIG', JSON.stringify({group: 2}));
    var config = new support.SuperConfig({
      paths: support.configPath('config_1'),
      project: 'project_1',
      envName: 'NEW_VERSION',
      envConfigName: 'NEW_CONFIG'
    });
    var c = config.getProject('project_1');
    var v = c.get('random.value');
    assert.equal(config.getProject('project_1').get('random.value'), v);
    assert.ok(c.get('loaded.group2'));
  });

  it('#7 在配置文件中使用load()', function () {
    support.setEnv('APP_VERSION', 'release');
    var config = new support.SuperConfig({
      paths: support.configPath('config_1'),
      project: 'project_1'
    });
    var c = config.getProject('project_1');
    assert.ok(c.get('loaded._common._common'));
    assert.ok(c.get('loaded._common.dev'));
    assert.ok(c.get('loaded._common.release'));
    assert.ok(c.get('loaded.project_1._common'));
    assert.ok(c.get('loaded.project_1.dev'));
    assert.ok(c.get('loaded.project_1.release'));
    assert.equal(c.get('loaded.config_1'),'_common.release');
  });

});

