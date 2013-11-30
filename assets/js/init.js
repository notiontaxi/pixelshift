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

var inArray = function(array, needle) {
  var i = -1, index = -1
  for(var i = 0; i < array.length; i++) {
      if(array[i] == needle) {
          index = i
          break
      }
  }
  return index
};

var keyInAArray = function(array, needle) {
  var i = -1
  var index = -1

  for (var key in array) {
    i++
    if(key == needle) {
      index = i
      break
    }
  }

  return index
};

function aArrayUnique(array) {
    var a = array.concat();
    for(var keyA in array) {
        for(var keyB in array) {
            if(a[keyA] === a[keyB])
                a.splice(keyB, 1);
        }
    }

    return a;
};


__hasProp = {}.hasOwnProperty,
__extends = function(child, parent) { 
  for (var key in parent) { 
    if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; }; 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor(); 
    child.__super__ = parent.prototype; 
    return child; };  