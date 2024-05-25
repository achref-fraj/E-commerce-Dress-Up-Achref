(function(d, m){
  var kommunicateSettings = 
      {"appId":"aee568c733644e4afc6867c74b56990c","popupWidget":true,"automaticChatOpenOnNavigation":true};
  var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
  s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
  var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
  window.kommunicate = m; m._globals = kommunicateSettings;
})(document, window.kommunicate || {});
