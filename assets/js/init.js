  require.config({
      baseUrl: 'assets/js/lib',
      paths: {
            jquery: 'js/jquery-1.9.1'
          , templates: '../../templates'
          , js: '../'
      }
  });

  // workaround for older safari versions
  if(!Function.prototype.bind){
    Function.prototype.bind = function (bind) {
        var self = this;
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return self.apply(bind || null, args);
        };
    };    
  }