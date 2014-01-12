/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task-vectorizer.html', 'js/strategies/ImageProcessingMenubarStrategy'], function(contentTemplate, ImageProcessingMenubarStrategy) {

var VectorizerStrategy, _ref, module,


  module = function() {}
  VectorizerStrategy = (function(_super){
    __extends(VectorizerStrategy, ImageProcessingMenubarStrategy);
// --------------------------------------

    VectorizerStrategy.NAME = 'vectorizer'
    VectorizerStrategy.LABEL = 'Vectorizer'

    function VectorizerStrategy(canvases, imageProcessor){    
      this.name = VectorizerStrategy.NAME
      VectorizerStrategy.__super__.constructor(canvases, imageProcessor)
      // render templates
        
      $(".controls-wrapper").append($(contentTemplate))
      this.init()
      this.filled = true
    }

    VectorizerStrategy.prototype.appendToMenuBar = function(){
      this.appendToLGMenuBar('Vectorizer', 'action-menu-vectorizer', 'image-actions-list')
      this.appendToSDMenuBar('Vectorizer', 'action-menu-vectorizer', 'image-actions-list-sd')  
    }   


    VectorizerStrategy.prototype.initializeTools = function(){

      // Automatic threshold button
      $("#action-compute-paths").click(
        function(event, ui){
          var result = this.imageProcessor.processPathFinding(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageWidth())
          this.canvasStage.paths = result.paths
          this.canvasStage.pathType = 'none'
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
      $("#action-hide-paths").click(
        function(event, ui){
          this.canvasStage.pathType = 'none'
          this.canvasStage.draw()
        }.bind(this)
      )
      $("#action-toggle-filled").click(
        function(event, ui){
          this.filled = !this.filled
          this.canvasStage.filling = this.filled
          this.canvasStage.draw()
        }.bind(this)
      )            

      $( "#alpha-limit-slider" ).slider(
        {
          range: "min",
          value: 0.55,
          min: 0.1,
          max: 2.0,
          step: 0.01,
          slide: function( event, ui ) {
            $( "#alpha-limit-slider-output" ).html(ui.value)
          this.canvasStage.alpha = ui.value
          this.canvasStage.draw()

          }.bind(this)
        }
      )   

      $( "#curve-limit-slider" ).slider(
        {
          range: "min",
          value: 1.0,
          min: 0.1,
          max: 1.4,
          step: 0.01,
          slide: function( event, ui ) {
            $( "#curve-limit-slider-output" ).html(ui.value)
          this.canvasStage.curveLimit = ui.value
          this.canvasStage.draw()
          }.bind(this)
        }
      )               

    }

    VectorizerStrategy.prototype.cancel = function(event, ui){    

    }


// --------------------------------------
    return VectorizerStrategy
  })()
  return module.exports = VectorizerStrategy
})