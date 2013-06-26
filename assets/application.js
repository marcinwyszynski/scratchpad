(function() {

  // Turn a date element into a string formatted like YYYY-MM-DD.
  var dateToHash = function(date) {
    var month = '' + (date.getMonth() + 1);
    var day = '' + date.getUTCDate();
    if (month.length == 1) month = '0' + month;
    if (day.length == 1) month = '0' + day;
    return [date.getFullYear(), month, day].join('-');
  };

  // Declare editor outside the scope for use in multiple event callbacks.
  var editor;

  // Create a default document key based on today's date.
  var documentKey = dateToHash(new Date());

  // If the URL contains a hash, use it as a document key.
  var getDocumentKeyFromUrl = function() {
    var urlElements = window.location.href.split('#');
    if (urlElements.length == 2) documentKey = urlElements[1];
    window.document.title = documentKey + ' | Scratchpad';
  };

  // Fiat lux.
  window.addEventListener('load', function() {
    getDocumentKeyFromUrl();

    // Make the URL show the document key.
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
  
  // Support for saving files.
  Mousetrap.bind('mod+s', function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var keyParts = documentKey.split('.');
    var extension = keyParts.length == 2 ? keyParts[1] : 'txt';
    var blob = new Blob([editor.getValue()], {
      type: 'text/plain;charset=utf-8'
    });
    saveAs(blob, [documentKey, extension].join('.'));
  });

})();