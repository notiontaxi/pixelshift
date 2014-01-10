/*
ImageProcessingMenubarStrategy class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define(['js/strategies/ImageProcessingStrategy'], function(ImageProcessingStrategy) {

var ImageProcessingMenubarStrategy, _ref, module,


  module = function() {}
  ImageProcessingMenubarStrategy = (function(_super){
  __extends(ImageProcessingMenubarStrategy, ImageProcessingStrategy)
// --------------------------------------


    function ImageProcessingMenubarStrategy(canvases, imageProcessor){
      ImageProcessingMenubarStrategy.__super__.constructor(canvases, imageProcessor)
    }


    ImageProcessingMenubarStrategy.prototype.init = function(){
        this.initializeTools()
        this.appendToMenuBar(this.label, this.name)
        this.addMenuBarAction(this.name)
    }

    ImageProcessingMenubarStrategy.prototype.addMenuBarAction = function(name){
      $(".action-menu-"+name).click(
      function(event, ui){
        event.stopPropagation()
        event.preventDefault()
        $(".dropdown").removeClass("open")
        $("."+name+"-controls").slideToggle()
      })

      $("."+name+"-controls").click(function(){
        $(this).slideToggle()
      }).children().click(function(e) {
        return false; // prevent childs to do this action
      })
    }     

    ImageProcessingMenubarStrategy.prototype.initializeTools = function(){
      console.error("initalizeTools() not implementet jet")
    }

    ImageProcessingMenubarStrategy.prototype.setOnChangeAction = function(action, obj){
      this.onChangeAction = action
      this.refObj = obj
    }

    ImageProcessingMenubarStrategy.prototype.initializeDefaultSlider = function(name, value, min, max){

      this.okButton = $("#"+name+"-ok")
      this.nokButton = $("#"+name+"-nok")

      // brightness slider
      $( "#"+name+"-slider" ).slider(
        {
          range: "min",
          value: value,
          min: min,
          max: max,
          slide: function( event, ui ) {
            $( "#"+name+"-slider-output" ).html(ui.value)
            this.currentValue = ui.value
            this.changed = true

            this.okButton.show()
            this.nokButton.show()

            if(!!this.onChangeAction)
              this.onChangeAction(this.refObj, true)

          }.bind(this)
        }
      )

      this.okButton.hide()
      this.okButton.removeClass('hidden')
      this.okButton.click(
        function(event, ui){
          this.execute(null, false)
          // reset all values to 0
          this.currentValue = 0
          $( "#"+name+"-slider" ).slider({value: this.currentValue})
          $( "#"+name+"-slider-output" ).html(0)
          this.changed = false

          this.okButton.hide()
          this.nokButton.hide()
          
        }.bind(this)
      )

      this.nokButton.hide()
      this.nokButton.removeClass('hidden')
      // set all values to 0 and repaint with remaining filters
      this.nokButton.click(
        function(event, ui){

          this.currentValue = 0
          $( "#"+name+"-slider" ).slider({value: 0})
          $( "#"+name+"-slider-output" ).html(0)

          if(!!this.onChangeAction)
            this.onChangeAction(this.refObj, true)

          this.okButton.hide()
          this.nokButton.hide()

          this.changed = false
        }.bind(this)
      )
    }

    /**
    * Regular Menu bar
    */
    ImageProcessingMenubarStrategy.prototype.appendToMenuBar = function(label, name){
      this.appendToLGMenuBar(label, 'action-menu-'+name, 'image-actions-list')
      this.appendToSDMenuBar(label, 'action-menu-'+name, 'image-actions-list-sd')  
    }


    

    ImageProcessingMenubarStrategy.prototype.appendToLGMenuBar = function(text, className, typeName){
      var li = $('<li/>')

      var a = $('<a/>', 
            {
                href: '#'
              , text: text
              , class: className
            }
          ).appendTo(li)

      li.appendTo('.'+typeName)
    }

    ImageProcessingMenubarStrategy.prototype.appendToSDMenuBar = function(text, className, typeName){

      var li = $('<li/>');
      var button = $('<button/>', 
            {
                text: text
              , class: className+' btn btn-default small-menu-btn'
            }
          ).appendTo(li)

      var span = $('<span/>', 
          {
            class: '' // later be used for icons
          }
        ).appendTo(button)

      li.appendTo('.'+typeName)
    }



// --------------------------------------
    return ImageProcessingMenubarStrategy
  })()
  return module.exports = ImageProcessingMenubarStrategy
})