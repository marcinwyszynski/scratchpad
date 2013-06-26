(function() {

  var dateToHash = function(date) {
    var month = '' + (date.getMonth() + 1);
    var day = '' + date.getUTCDate();
    if (month.length == 1) month = '0' + month;
    if (day.length == 1) month = '0' + day;
    return [date.getFullYear(), month, day].join('-');
  };

  var editor;
  var documentKey = dateToHash(new Date());

  var getDocumentKeyFromUrl = function() {
    var urlElements = window.location.href.split('#');
    if (urlElements.length == 2) documentKey = urlElements[1];
    window.document.title = documentKey + ' | Scratchpad';
  };

  window.addEventListener('load', function() {
    getDocumentKeyFromUrl();
    window.history.replaceState(null, null, '#' + documentKey);

    // Set up the editor.
    editor = CodeMirror(document.body, {
      lineNumbers: true,
      lineWrapping: true,
      value: localStorage[documentKey] || '',
    });

    // Save changes as they happen in the editor to the local storage.
    editor.on('change', function() {
      localStorage[documentKey] = editor.getValue();
    });
  });
  
  // When the hash is changed, pull and display the corresponding data.
  window.addEventListener('hashchange', function() {
    getDocumentKeyFromUrl();
    editor.setValue(localStorage[documentKey] || '');
  });

})();