module.exports = function (ns, load) {

  ns('loaded.project_1.dev', true);

  ns('random.value', Math.random());

  if (ns.env.group === 1) {
    ns('loaded.group1', true);
  }

};
