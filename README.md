# super-config
配置文件加载器

## 使用方法

### 依赖

在 `SIDServer` 和 `SIDAdmin` 这类级别的项目的 `package.json` 中添加依赖 `"@superid/config": "latest"`

每次 `deploy` 时均会安装最新版本的 `@superid/config`

其他模块如 `@superid/orm` 在初始化时需要加载 `@superid/config` 来取得配置，但由于 `@superid/orm` 是需要在 `SIDServer` 这样的项目中
使用，因此其 `package.json` 文件中不需要声明对 `@superid/config` 的依赖。

### 部署

设置运行环境 `NODE_ENV=development` 来指定配置文件版本，比如：

+ `development` 本地开发环境
+ `production` 服务器生产环境（默认）
+ `production-server1` server1服务器的生产环境
+ `v1` v1版本生产环境
+ `test` 内部测试环境

程序中使用配置：

```javascript
// 载入配置，会自动根据 NODE_ENV 加载指定的配置
var config = require('@superid/config');

// 设置当前项目名
config.setProject('SIDServer');

// 读取当前项目配置项
console.log(config.get('web.port'));
// 判断配置项是否被设置
console.log(config.defined('web.port'));
// 设置当前项目配置项
config.set('web.port', 3001);
// 取得当前项目主版本列表
console.log(config.versions());
// 取得其他项目的版本列表
console.log(config.versions('SIDAdmin'));

// 取得其他项目的配置项（与当前项目相同版本）
console.log(config.getProject('SIDAdmin').get('web.port'));
// 设置其他项目的配置项（与当前项目相同版本）
config.getProject('SIDAdmin').set('web.port', 3001);

// 取得其他项目的配置项（指定版本）
console.log(config.getProject('SIDAdmin', 'v1').get('web.port'));
// 设置其他项目的配置项（指定版本）
config.getProject('SIDAdmin', 'v1').set('web.port', 3001);

// 取得所有项目列表
console.log(config.projects());
```

如果指定项目及版本的配置文件不存在，抛出异常并结束程序。


## 文件结构

基本格式：`config/{project}/{version}.js` ，比如：`config/SIDServer/production.js`

其中`version`为`_default.js`
