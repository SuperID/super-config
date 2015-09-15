module.exports = function (ns, load) {
  load('xxx');
  ns('loaded._common.release', true);
  ns('loaded.config_1', '_common.release');
};
