# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/
$(document).on 'ready page:load', ->

  $('#input-file').fileinput
    uploadUrl: "/photos/create",
    maxFileSize: 1024,
    maxFilesNum: 10,
    validateInitialCount: true,
    overwriteInitial: false,
    showUpload: false,
