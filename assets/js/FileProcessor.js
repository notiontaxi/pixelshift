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
    this.callback = callback;
    this.callbackObj = callbackObj;
    event.stopPropagation()
    event.preventDefault()

    var files = event.dataTransfer.files

    // event will be called, when reader finished reading (see method getFileReader())
    this.reader.readAsText(files[0])
  }


  FileProcessor.prototype.checkFileReaderSupport = function(){
    return window.File && window.FileList && window.FileReader;
  }


  FileProcessor.prototype.parseFile = function(content){
    return this.createCarDataSet(this.textToArray(content));
  }


  FileProcessor.prototype.createCarDataSet = function(values){
    if(!!values)
    {
      var carDatas = Array();

      for(var i = 1; i < values.length; i++)
        carDatas.push(new window.CarData(values[i]))

      return new window.DataSet(carDatas)
    }
  }

  FileProcessor.prototype.textToArray = function(text){

    var lines = text.replace(/\r\n/g, "\n").split("\n");
    if(this.checkContent(lines[0])){
      var result = Array();

      for(var i = 0; i < lines.length; i++)
        result.push(lines[i].split('\t'));

      return result;
    }
    else
      return undefined;

  }


  FileProcessor.prototype.checkContent = function(checkMe){
    var cleaned = checkMe.replace(/\t/g, '');
    return cleaned == "CarManufacturerMPGCylindersDisplacementHorsepowerWeightAccelerationModel YearOrigin";
  }

 
  FileProcessor.prototype.getFileReader = function(){
    if (!this.reader)
    {
      if(this.checkFileReaderSupport()){
        this.reader = new FileReader();

        this.reader.addEventListener("load", function(event) {
        });  
        
        this.reader.addEventListener("loadend", function(event) {
          this.callback(this.parseFile(event.target.result), this.callbackObj);
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
