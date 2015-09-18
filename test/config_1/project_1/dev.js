module.exports = function (ns, load) {

  ns('loaded.project_1.dev', true);

  ns('random.value', Math.random());

  if (ns.env.has('group')) {
    switch (ns.env('group')) {
      case 1:
        ns('loaded.group1', true);
        break;
      case 2:
        ns('loaded.group2', true);
        break;
    }
  }

};
