window.DependenciesLoaded = new Promise(function(DependenciesLoadedResolve, DependenciesLoadedReject) {
  importScript("jquery").then(function() {
    importScript("popper").then(function() {
      $(function() {
        Promise.all([
          importScript("bootstrap"),
          /*importScript("slickslider"),*/
          /*importScript("youtube"),*/
          /*importScript("jqueryui")*/
        ]).then(function() {
          DependenciesLoadedResolve();

          /* Stuff here */
          SetupFormListeners();
          
        });
      });
    });
  });
});