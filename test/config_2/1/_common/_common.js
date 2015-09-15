module.exports = function (ns, load) {

  ns('versions', ['dev', 'release']);

  ns('loaded._common._common', true);

  ns('loaded.config1', '_common._common');
  ns('loaded.config2', '_common._common');
  ns('loaded.config3', '_common._common');

  ns('loaded.config4', '_common._common');
  ns('loaded.config5', '_common._common');
  ns('loaded.config6', '_common._common');
  ns('loaded.config7', '_common._common');

};
