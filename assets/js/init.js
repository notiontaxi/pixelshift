// GLOBALS

  // VARS
  window.isSmallDevice = false
  var greyPanelsAreHidden = true

  // FUNCTIONS

  function testIfTouchDevice() {
    return ('ontouchstart' in window) || ('onmsgesturechange' in window) // IE10
  }
  window.isTouchDevice = testIfTouchDevice()

  function hideGreyPanels(){
    $('#grey-panel').hide()
    $('#grey-panel-menu').hide() 
    greyPanelsAreHidden = true
  }

  function showGreyPanels(){
    greyPanelsAreHidden = false
    updateGreyPanels()
    $('#grey-panel').show()
    $('#grey-panel-menu').show()
  }

  function updateGreyPanels(){

    if(!greyPanelsAreHidden){

      $('#grey-panel').css({
          "width":  $('#container').css('width')
        , "height": $('#container').css('height')
        , "left": $('#container').offset().left+"px"
        , "top": $('#container').offset().top+"px"
      })

      if(!window.isSmallDevice){
        var device = window.outerWidth < 992 ? 'small' : 'big'
        $('#grey-panel-menu').css({
            "width":  $('.menu-bar.'+device+'-device').css('width')
          , "height": $('.menu-bar.'+device+'-device').css('height')
          , "left": $('.menu-bar.'+device+'-device').offset().left+"px"
          , "top": $('.menu-bar.'+device+'-device').offset().top+"px"
        }) 
      }  
    }
  }


// DEP MANAGEMENT
  require.config({
      baseUrl: 'assets/lib',
      paths: {
            templates: '../templates'
          , js: '../js'
          , home: '../'
          , lib: '.'
      }
  });


// INHERITANCE
__hasProp = {}.hasOwnProperty,
__extends = function(child, parent) { 
  for (var key in parent) { 
    if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; }; 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor(); 
    child.__super__ = parent.prototype; 
    return child; };  


// HACKS


  // Mobile
  // no elastic scrolling
  // document.body.addEventListener('touchmove', function (event) {
  //     event.preventDefault()
  // }, false)

  $('.modalbox-overlay').hide()

  // hide while it is not in use
   jQuery.mobile.autoInitializePage = false


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










// Helper

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

  function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value) 
}

