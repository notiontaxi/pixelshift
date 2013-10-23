/*
Router class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

require([], function() {

  function Router(){

  }

  Router.prototype.navigate = function(){

    var location = $(window.location).attr('href').split('#')[1];

    if(!location)
      $('#welcome').click()
    else  
      $('#'+location).click()
  }

  Router.prototype.bindEvents = function(){
    $('#welcome').click({locationClassPath: 'js/Welcome'}, this.changeLocationTo)
    $('#task_outline').click({locationClassPath: 'js/Outline'}, this.changeLocationTo)
  }  

  Router.prototype.changeLocationTo = function(event){
    require([event.data.locationClassPath], function(ShowMe) {
      var showMe = new ShowMe()
      showMe.renderAndAppendTo('#container')
    })
  }

  var router = new Router()
  router.bindEvents()
  router.navigate()

})