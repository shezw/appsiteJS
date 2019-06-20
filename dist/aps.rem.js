(function(){

  var ua = window['navigator']['userAgent'] || window['navigator']['vendor'] || window['opera'];
  if( /MicroMessenger/i.test(ua)){
    // 禁止微信调整字体大小
    if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {　　
        handleFontSize();
    } else {　　
        if (document.addEventListener) {
            document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
        } else if (document.attachEvent) {
            document.attachEvent("WeixinJSBridgeReady", handleFontSize);
            document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
        }
    }

    function handleFontSize() {
        // 设置网页字体为默认大小
        WeixinJSBridge.invoke('setFontSizeCallback', {
            'fontSize': 0
        });
        // 重写设置网页字体大小的事件
        WeixinJSBridge.on('menu:setfont', function () {
            WeixinJSBridge.invoke('setFontSizeCallback', {
                'fontSize': 0
            });
        });
    }
  }

  var isMobile   = /Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent);
  var rem_size   = 18.75;
  var rem_width  = parseInt(document.documentElement.clientWidth);


  if(rem_width>1900) {
    rem_width= 1280;
    rem_size = 36;
  }else if(rem_width>=720){
    rem_size = 36;
  }else if(rem_width>=300){
    rem_size = rem_width/20;
  }else{
    rem_size = 12;
  }

  document.documentElement.style.fontSize = rem_size+'px';

  if ( rem_width>=720 ) {
    document.documentElement.classList.add('mobilePreview');
    document.documentElement.style.width = '720px';
  }
  
  window.rem = rem_size;
  
})();
