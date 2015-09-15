# super-config
配置文件加载器

## 安装

```bash
$ npm install super-config-loader --save
```

## 使用方法


```javascript
var SuperConfig = require('super-config-loader');

var config = new SuperConfig({
    envName: '用于获取当前版本的环境变量名，默认APP_VERSION',
    envConfigName: '用于获取当前额外配置信息的环境变量名，默认APP_CONFIG',
    project: '项目名，默认无',
    paths: '当前配置文件目录，默认为["./config"]，依次从这些目录中加载配置文件',
    commonProject: '公共配置项目名，默认_common',
    commonVersion: '公共配置版本名，默认_common'
});

// 获取指定项目的配置（版本号从环境变量APP_VERSION中获取）
console.log(config.getProject('my_project'));
// 获取指定项目的配置，指定版本号
console.log(config.getProject('my_project', 'v1'));
// 返回项目列表数组
console.log(config.projects());

// 操作配置对象--------------------------------------------------
var c = config.getProject('my_project', 'v1');
// 获得指定配置项，如果配置项不存在会抛出异常
console.log(c.get('a.b.c'));
// 检查指定配置项是否存在
console.log(c.defined('a.b.c'));
// 取所有配置，返回一个对象
console.log(c.all());
// 更改配置
c.set('a.b.c.d', 'new value');
// 取当前项目的所有版本列表，返回数组
console.log(c.versions());
// 取当前配置的项目名称
console.log(c.getProjectName());
// 取当前配置的版本名称
console.log(c.getVersionName());
// 检查当前项目指定版本是否存在
console.log(c.versionExists('v2'));
// 取其他项目的配置对象（与当前配置的版本相同）
console.log(c.getProject('project_2'));
// 取其他项目的配置对象，指定版本名称
console.log(c.getProject('project_2', 'v2'));
// 返回项目列表数组
console.log(c.projects());
```

如果指定项目及版本的配置文件不存在，抛出异常并结束程序。


## 文件结构

基本格式：`config/{project}/{version}.js` ，比如：`config/SIDServer/production.js`

在载入配置文件时，会依次按照配置的`paths`路径，检查以下文件是否存在并加载：

```
{path}/{common_Project}/{common_version}.js
{path}/{common_project}/{version}.js
{path}/{project}/{common_version}.js
{path}/{project}/{version}.js
```

其中：

+ `{path}`为当前配置的根目录
+ `{common_project}`为公共的项目名称，默认为`_common`
+ `{common_version}`为公共的版本名称，默认为`_common`
+ `{project}`为当前的项目名称
+ `{version}`为当前的版本名称

如果存在相同的配置项，则后加载的配置会覆盖先加载的。

每个配置文件的格式如下：

```javascript
module.exports = function (ns, load) {

  // 设置配置
  ns('a.b.c.d', '12345');
  // 引用配置
  ns('a.b.c.e', ns('a.b.c.d') + '789');

  // 判断配置项是否已存在
  if (ns.defined('a.b.c.d')) {
    ns('a.b.c.f', 555);
  }

  // 读取通过环境变量传递过来的额外配置
  // 比如 APP_CONFIG={"group":"1"}
  // 必须为一个正确的JSON字符串，可以通过ns.env访问解析出来的对象
  if (ns.env.group === '1') {
    ns('isGroup1', true);
  }

  // 载入同目录下的其他版本文件
  load('v2');

};
```

详细使用方法可以参考`test`目录下的测试文件。


## License

```
The MIT License (MIT)

Copyright (c) 2015 SuperID | 一切只为简单登录

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
