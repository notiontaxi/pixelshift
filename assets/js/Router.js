/*
Router class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

require([], function() {

  function Router(){

  }

  Router.prototype.navigate = function(location){

    // extract the location i.e. .../index.html#welcome ->welcome 
    if(!location)
      var location = $(window.location).attr('href').split('#')[1];

    // simulate location click OR refer to welcome if location wasn't set
    if(!location)
      $('#welcome').click()
    else  
      $('#'+location).click()
  }

  Router.prototype.bindEvents = function(){
    $('#welcome').click({locationClassPath: 'js/Welcome'}, this.changeLocationTo)
    $('#image-processing').click({locationClassPath: 'js/ImageProcessing'}, this.changeLocationTo)
  } 

  Router.prototype.changeLocationTo = function(event){
    require([event.data.locationClassPath], function(ShowMe) {
      var showMe = new ShowMe('#container')
    })
  }

  var router = new Router()
  router.bindEvents()
  router.navigate('image-processing')

})