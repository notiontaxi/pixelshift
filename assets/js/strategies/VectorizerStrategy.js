/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task-vectorizer.html', 'js/strategies/ImageProcessingStrategy'], function(contentTemplate, ImageProcessingStrategy) {

var VectorizerStrategy, _ref, module,


  module = function() {}
  VectorizerStrategy = (function(_super){
    __extends(VectorizerStrategy, ImageProcessingStrategy);
// --------------------------------------

    VectorizerStrategy.NAME = 'vectorize'

    function VectorizerStrategy(containerIdentifier,canvasOrigin, canvasStage, canvasShown,imageProcessor){    
      this.name = VectorizerStrategy.NAME
      VectorizerStrategy.__super__.constructor(canvasOrigin, canvasStage, canvasShown, imageProcessor, ImageProcessingStrategy.TYPE_MENU)
      // render templates
        
      $(".controls-wrapper").append($(contentTemplate))
      this.init()
    }

    VectorizerStrategy.prototype.appendToMenuBar = function(){
      this.appendToLGMenuBar('Vectorizer', 'action-menu-vectorizer', 'image-actions-list')
      this.appendToSDMenuBar('Vectorizer', 'action-menu-vectorizer', 'image-actions-list-sd')  
    }   

    VectorizerStrategy.prototype.addMenuBarAction = function(){
      $(".action-menu-vectorizer").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $(".dropdown").removeClass("open")
        $(".vectorizer-controls").slideToggle()
      })

      $(".vectorizer-controls").click(function(){
        $(this).slideToggle()
      }).children().click(function(e) {
        return false; // prevent childs to do this action
      });
    }


    VectorizerStrategy.prototype.initializeTools = function(){

      // Automatic threshold button
      $("#action-compute-paths").click(
        function(event, ui){
          var result = this.imageProcessor.processPathFinding(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageWidth())
          this.canvasStage.paths = result.paths
          this.canvasStage.pathType = 'full'
          $("#path-count").html(result.message)
        }.bind(this)
      )
      $("#action-show-full-paths").click(
        function(event, ui){
          this.canvasStage.pathType = 'full'
          this.canvasStage.draw()
        }.bind(this)
      )  
      $("#action-show-straight-paths").click(
        function(event, ui){
          this.canvasStage.pathType = 'straight'
          this.canvasStage.draw()
        }.bind(this)
      ) 
      $("#action-show-allowed-paths").click(
        function(event, ui){
          this.canvasStage.pathType = 'allowed'
          this.canvasStage.draw()
        }.bind(this)
      )     

    }


// --------------------------------------
    return VectorizerStrategy
  })()
  return module.exports = VectorizerStrategy
})