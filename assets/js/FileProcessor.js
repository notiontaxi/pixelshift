/*
FileProcessor class

Florian Wokurka (2013)
https://github.com/notiontaxi
*/

"use strict"

define([], function() {

  var FileProcessor, module;
  module = function() {}
  FileProcessor = (function(){
// --------------------------------------


  function FileProcessor(){
    this.reader = this.getFileReader()
  }


  FileProcessor.prototype.processFile = function(event, callback, callbackObj){
    event.stopPropagation()
    event.preventDefault()

    this.callback = callback;
    this.callbackObj = callbackObj;

    var files = event.dataTransfer.files
    this.img = new Image
    this.img.src = URL.createObjectURL(files[0])
    this.callback(this.img, this.callbackObj);
    // event will be called, when reader finished reading (see method getFileReader())
    //this.reader.readAsText(files[0])

  }

  FileProcessor.prototype.loadFileFromFilesystem = function(src, callback, callbackObj){
    var img = new Image
    img.src = src
    img.onload = function() {
        callback(img, callbackObj)
    }
  }

  FileProcessor.prototype.checkFileReaderSupport = function(){
    return window.File && window.FileList && window.FileReader;
  }


  FileProcessor.prototype.parseFile = function(content){
    return this.createCarDataSet(this.textToArray(content));
  }

 
  FileProcessor.prototype.getFileReader = function(){
    if (!this.reader)
    {
      if(this.checkFileReaderSupport()){
        this.reader = new FileReader();

        this.reader.addEventListener("load", function(event) {
          console.log("load");
        });  
        
        this.reader.addEventListener("loadend", function(event) {
          console.log("loaded");
          this.callback(this.img, this.callbackObj);
        }.bind(this)); 


        return this.reader;
      }
      else
        alert("Your browser does not support File API");
        return undefined;
    }
    return this.reader;
  }




// --------------------------------------
    return FileProcessor
  })()
  return module.exports = FileProcessor
})
