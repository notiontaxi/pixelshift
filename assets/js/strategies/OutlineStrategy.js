/*
Class for outline and threshold class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['text!templates/task-outline.html','js/strategies/ImageProcessingStrategy'], function(contentTemplate, ImageProcessingStrategy) {

var OutlineStrategy, _ref, module,


  module = function() {}
  OutlineStrategy = (function(_super){
  __extends(OutlineStrategy, ImageProcessingStrategy)
// --------------------------------------

  OutlineStrategy.NAME = 'outline'

    function OutlineStrategy(canvasOrigin, canvasStage, canvasShown,imageProcessor){
      this.name = OutlineStrategy.NAME
      OutlineStrategy.__super__.constructor(canvasOrigin, canvasStage ,canvasShown, imageProcessor, ImageProcessingStrategy.TYPE_MENU)

      // render templates
      $(".controls-wrapper").append($(contentTemplate))
      this.init()
    }


    OutlineStrategy.prototype.updateThreshold = function(threshold){

      var imgDataLeft = this.canvasOrigin.getFullImageData()

      // compute threshold automatically, if not set          multiplycation cause input is 0-100
      if(typeof threshold === 'undefined'){
        threshold = this.imageProcessor.computeThreshold(imgDataLeft)
        this.processedImageData = this.imageProcessor.processThreshold(threshold, imgDataLeft)
        this.canvasOrigin.putImageData(this.processedImageData)
        this.canvasOrigin.drawClones()
      }else{
        threshold*=2.55
        this.processedImageData = this.imageProcessor.processThreshold(threshold, imgDataLeft)
        this.canvasStage.draw(this.processedImageData)
        //this.canvasStage.copyToClones()
      }

      return threshold
    }

    OutlineStrategy.prototype.appendToMenuBar = function(){
      this.appendToLGMenuBar('Bitmap Tool', 'action-menu-outline', 'image-actions-list')
      this.appendToSDMenuBar('Bitmap Tool', 'action-menu-outline', 'image-actions-list-sd')  
    }      

    OutlineStrategy.prototype.addMenuBarAction = function(){
      $(".action-menu-outline").click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $(".dropdown").removeClass("open")
        $(".outline-controls").slideToggle()
      })

      $(".outline-controls").click(function(){
        $(this).slideToggle()
      }).children().click(function(e) {
        return false; // prevent childs to do this action
      });
    }
     



    OutlineStrategy.prototype.initializeTools = function(){

      // threshold slider
      $( "#slider-0" ).slider(
        {
          range: "min",
          value: 50,
          min: 0,
          max: 100,
          slide: function( event, ui ) {
            $( "#slider-0-output" ).html(ui.value);
            this.updateThreshold(ui.value)
          }.bind(this)
        }
      );

      // Automatic threshold button
      $("#action-automatic-threshold").click(
        function(event, ui){
          var treshhold = this.updateThreshold()/2.55
          $( "#slider-0" ).slider('option',{value: Math.round(treshhold)});
          $( "#slider-0-output" ).html(Math.round(treshhold));
        }.bind(this)
      )


      // Outline button
      $("#action-dilation").click(
        function(event, ui){
          var newImg = this.imageProcessor.processDilation(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageWidth())
          this.canvasOrigin.putImageData(newImg)
          this.canvasOrigin.drawClones()
        }.bind(this)
      )   

      // Outline button
      $("#action-erosion").click(
        function(event, ui){
          var newImg = this.imageProcessor.processErosion(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageWidth())
          this.canvasOrigin.putImageData(newImg)
          this.canvasOrigin.drawClones()
        }.bind(this)
      )   

      // Outline button
      $("#action-outline").click(
        function(event, ui){
          var newImg = this.imageProcessor.processOutline(this.canvasOrigin.getImageData(), this.canvasOrigin.getImageData() ,this.canvasOrigin.getImageWidth())
          this.canvasOrigin.putImageData(newImg)
          this.canvasOrigin.drawClones()
        }.bind(this)
      )

      $("#threshold-ok").click(
        function(event, ui){
          if(!!this.processedImageData)
            this.canvasOrigin.putImageData(this.processedImageData)
        }.bind(this)
      )

      $("#threshold-nok").click(
        function(event, ui){
          this.canvasOrigin.drawClones()
        }.bind(this)
      )

    }



// --------------------------------------
    return OutlineStrategy
  })()
  return module.exports = OutlineStrategy
})