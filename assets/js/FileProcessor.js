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
  }

  FileProcessor.prototype.loadFileFromFilesystem = function(src, callback, callbackObj){
    var img = new Image
    img.src = src
    img.onload = function() {
        callback(img, callbackObj)
    }
  }

  // found here: http://muaz-khan.blogspot.de/2012/10/save-files-on-disk-using-javascript-or.html
  FileProcessor.prototype.saveBlobToDisk = function(blobURL, fileName) {
    var reader = new FileReader();
    reader.readAsDataURL(blobURL);
    reader.onload = function (event) {
        var save = document.createElement('a');
        save.href = event.target.result;
        save.target = '_blank';
        save.download = fileName || 'unknown file';

        var event = document.createEvent('Event');
        event.initEvent('click', true, true);
        save.dispatchEvent(event);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
  }

  // found here: http://muaz-khan.blogspot.de/2012/10/save-files-on-disk-using-javascript-or.html
  FileProcessor.prototype.saveFileUrlToDisk = function(fileURL, fileName){

  // for non-IE
  if (!window.ActiveXObject) {
      var save = document.createElement('a');
      save.href = fileURL;
      save.target = '_blank';
      save.download = fileName || fileURL;
      var evt = document.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0,
          false, false, false, false, 0, null);
      save.dispatchEvent(evt);
      (window.URL || window.webkitURL).revokeObjectURL(save.href);
  }

  // for IE
  else if ( !! window.ActiveXObject && document.execCommand)     {
      var _window = window.open(fileURL, "_blank");
      _window.document.close();
      _window.document.execCommand('SaveAs', true, fileName || fileURL)
      _window.close();
  }

  }

  FileProcessor.prototype.saveCanvasToDisk = function(canvas){

    var dataURL = canvas.toDataURL();
    /*
    var data = atob( dataURL.substring( "data:image/png;base64,".length ) ),
        asArray = new Uint8Array(data.length);

    for( var i = 0, len = data.length; i < len; ++i ) {
        asArray[i] = data.charCodeAt(i);    
    }

    var blob = new Blob( [ asArray.buffer ], {type: "image/png"} );    
    */
    this.saveFileUrlToDisk(dataURL, 'myImage.png')
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
          //console.log("load");
        });  
        
        this.reader.addEventListener("loadend", function(event) {
          //console.log("loaded");
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
