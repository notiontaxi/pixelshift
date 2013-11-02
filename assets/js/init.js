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

__hasProp = {}.hasOwnProperty,
__extends = function(child, parent) { 
  for (var key in parent) { 
    if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; }; 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor(); 
    child.__super__ = parent.prototype; 
    return child; };  