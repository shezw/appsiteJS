/*============================================================================\
|@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@|\\
|@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@|\\\
|@@@@@@@@    @@@@@@@@@@@@@@@@@@@@@@@@@@@'     '@@@@   @@@@' @@@@@@@@@@@@@@@@@|\\\
|@@@@@@@      @@@@@@@@@@@@@@@@@@@@@@@@@    @@   @@@@@@@@o   @@@@@@@@@@@@@@@@@|\\\
|@@@@@@   o\  o@@@        @@@       '@@      ;@@@@@   @      @@@'  _  'o@@@@@|\\\
|@@@@@o   @@   @@@   @@@   @@   @@   !@@@@       @@   @@!   @@@   ''''  @@@@@|\\\
|@@@@@          @@   @@@   @@   @@   /@   @@@!   @@   @@!   @@@   @@@@@@@@@@@|\\\
|@@@@    @@@@    @        @@@       ,@@@._      @@@.  @@@.   @@@       @@@@@@|\\\
|@@@@@@@@@@@@@@@@@   @@@@@@@@   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@|\\\
|@@@@@@@@@@@@@@@@@   @@@@@@@@   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@|\\\
|@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ appsite.cn @@@|\\\
|@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ She ZhiWei @@@|\\\
|@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@|\\\
|============================================================================|\\\
|																			 |\\\
|	AppSite Front Core Functions											 |\\\
|	Copyright: Donsee.cn 2018.05 - 2018.09									 |\\\
|	Author	 : Sprite														 |\\\
|	Email	 : hello@shezw.com												 |\\\
| 																			 |\\\
 \===========================================================================\\\\
  \===========================================================================\\\
   \===========================================================================\\
*/

Aps.setting.language =    Aps.local.get('language') || (typeof(plus)!='undefined'?(({'zh-Hans-CN':'ZHCN','zh-Hant-CN':'ZHCN'})[plus.os.language]||'EN'):'EN');
Aps.setting.mui  = typeof mui != 'undefined'; 
Aps.setting.plus = typeof plus!= 'undefined';
// 
// Aps.gui        = { // ! 界面交互  # basic gui 
// 
// 	popup:function(title,content,type,optionsOrOkCall){
// 
// 		var options = ( typeof optionsOrOkCall == 'function' ) ? {} : (optionsOrOkCall || {} );
// 
// 		var _popup  = {};
// 			_popup.title      = title   || 0;
// 			_popup.type       = type    || 'alert';
// 			_popup.okText     = options.okTxt || i18n('OK');
// 			_popup.cancelText = options.cancelTxt || i18n('CANCEL');
// 
// 		var _okCall     = options.onOk || ( typeof optionsOrOkCall == 'function' ? optionsOrOkCall : 0 );
// 		var _cancelCall = options.onCancel || 0;
// 
// 		var popup  = VD(Aps.mixer.mix(ApsMd.core.popup,_popup));
// 		vdom('html','HTML').append(popup);
// 
// 		popup.find('.contents').html(content||'');
// 
// 		var _view        = popup.find('.view');
// 		var _okButton    = popup.find('.button.ok');
// 		var _cancelButton= popup.find('.button.cancel');
// 
// 		if( Aps.gui.animateOn ){
// 			_view.animateCss('pulseIn faster');
// 		}else{
// 			popup.fadeIn();
// 		}
// 
// 		var _close = function(){
// 			if( Aps.gui.animateOn ){
// 				_view.animateCss('pulseOut fast');
// 				popup.fadeOut();
// 			}else{
// 				popup.fadeOut();
// 			}
// 		}
// 
// 		var _ok = function(){
// 			if( !_okCall ){
// 				_close();
// 			}else if(_okCall){
// 				_okCall();_close();
// 			}
// 			return ;
// 		}
// 
// 		var _cancel = function(){
// 			( !_cancelCall || _cancelCall() ) && _close(); 
// 			return ;
// 		}
// 
// 		_okButton     && _okButton.click(_ok);		
// 		_cancelButton && _cancelButton.click(_cancel);
// 
// 	},
// 
// 	alert:  function( title,content,options){ this.popup(title,content,'alert',options); },
// 	confirm:function( title,content,options){ this.popup(title,content,'confirm',options); },
// 	form:   function( title,content,options){ this.popup(title,content,'form',options);	},
// 
// 	propup:function(title,content){
// 
// 		var _prop = VD(ApsMd.core.propup);
// 
// 		VD('html','HTML').append(_prop);
// 
// 		var _title    = _prop.find( '.ApsPropupMain h4' );
// 		var _propBg   = _prop.find( '.ApsPropupSpace' );
// 		var _propMain = _prop.find( '.ApsPropupMain' );
// 		var _closeBtn = _prop.find( '.ApsPropupClose' );
// 		var _container= _prop.find( '.ApsPropupMain .ApsPropupContent .row p' );
// 
// 		_title.html( title );
// 		_container.html( content );
// 
// 		if( Aps.gui.animateOn ){
// 			_prop.show();
// 			_propBg.fadeIn();
// 			_propMain.animate(ApsMd.animate.popIn,300);
// 		}else{
// 			_prop.fadeIn();
// 		}
// 		Aps.gui.onBlur('#VIEW');
// 
// 		var _close = function(){
// 
// 			if( Aps.gui.animateOn ){
// 				_propMain.animate(ApsMd.animate.popOut,300,function(){_prop.remove()});
// 				_propBg.fadeOut();
// 			}else{
// 				_prop.fadeOut();	    	
// 			}
// 			Aps.gui.noBlur('#VIEW');
// 		}
// 		_propBg.click(_close);		
// 		_closeBtn.click(_close);
// 	},
// 
// 	menu:function(title,menus,cancelTitle,cancelCall){ // menus [{'title','call':function(){}}]
// 
// 		var _menu = VD(ApsMd.core.menu);
// 
// 		VD('html','HTML').append(_menu);
// 
// 		var _title    = _menu.find( 'h4' );
// 		var _bg   = _menu.find( '.space' );
// 		var _main = _menu.find( '.main' );
// 		var _closeBtn = _menu.find( '.close' ).text(cancelTitle||'取消 Cancel');
// 		var _container= _menu.find( '.menus' );
// 
// 		_title.html( title );
// 
// 		_container.html( Aps.mixer.loop("<button>{{title}}</button>",menus) );
// 
// 		var _menus = _container.finds('button');
// 		var _close = function(){
// 			_main.animate(ApsMd.animate.slideOutBottom,300,function(){_menu.remove()});
// 			_bg.fadeOut();
// 			typeof cancelCall == 'function' && cancelCall();
// 		}
// 		_menus.on('click',function(vd){var idx = vd.index(); typeof menus[idx].call =='function' && menus[vd.index()].call(vd,vd.index());_close();});
// 
// 		_menu.show();
// 		_bg.fadeIn().on('click',_close);
// 		_main.animate(ApsMd.animate.slideInBottom,300);
// 
// 		_closeBtn.on('click',_close);
// 	},
// 
// }
Aps.router.open = function(link,options,callback){
	var WebviewStyle = options && options.styles ? options.styles : { popGesture: "close", bounce:'vertical',bounceBackground:'#ffffff',statusbar:{immersed:true}};
	mui.openWindow({
		url: (i18n&&Aps.router.i18n) ? ( link.indexOf('/')<2 && link.indexOf('./')>=0 ? link.replace('/','/'+Aps.setting.language+'_') : Aps.setting.language+'_'+link ) : link,
		id: link,
		styles: WebviewStyle,
		show: {	duration: 300 }
	});
};
Aps.router.close = function(delay){
	setTimeout(function() {
		mui.back();
		mui.targets.action = false;
	}, delay||0);	
};
Aps.router.switch = function(page) {
	var mainView = typeof main!='undefined' ? main:plus.webview.getWebviewById('main');
	mainView.loadURL(page);
};
Aps.router.view = Aps.router.open;
Aps.router.closeView = Aps.router.close;
Aps.router.setNav  = function(title,left,right){
	var navView = typeof nav!='undefined' ? nav :plus.webview.getWebviewById('nav');
	// navView.hide();
};
Aps.router.hideNav = function(){
	var navView = typeof nav!='undefined' ? nav :plus.webview.getWebviewById('nav');
	navView.hide();
};
Aps.router.showNav = function() {
	var navView = typeof nav!='undefined' ? nav :plus.webview.getWebviewById('nav');
	navView.show();
}
Aps.router.endPullToRefresh = function(page){
	var _view = plus.webview.getWebviewById(page);
	_view.setStyle({offset:'0px'});
	_view.endPullToRefresh();
}

Aps.metting = { // 会议系统 用于多个页面共存时共享事件和数据 主要混合开发

	timeInterval:1000,
	private_requests:{},
	private_messages:{},
	public_requests:{},
	public_messages:{},

	INTERVAL:0,

	init:function(id){
		this.privateId = id;
		this.INTERVAL = setInterval(function(){
			Aps.metting.progress(id);
		},this.timeInterval);
	},
	progress:function(id){
		this.private_requests = Aps.local.get(id+'_requests');
		// this.private_messages = Aps.local.get(id+'_messages');
		// this.public_requests  = Aps.local.get('public_requests');
		// this.public_messages  = Aps.local.get('public_messages');

		if(this.private_requests){ this.accept(this.private_requests); }

	},
	run:function(event){
		console.log(typeof event, event);
		// var program = 'function('+params+'){'+event+'('+params+')}';
		eval(event);
		// function(event+()+params)
	},
	accept:function(requests,origin){
		for (var i = 0; i < requests.length; i++) {
			this.run(requests[i]);
		}
		this.done(origin);
	},
	done:function(origin){
		var origin = origin || this.privateId;
		Aps.local.set(origin+'_requests',0);
	},
	request:function(target,event){
		var requests = Aps.local.get(target+'_requests') || [];
			requests.push(event);
		Aps.local.set(target+'_requests',requests);
	},
	exit:function(){
		clearInterval(Aps.metting.INTERVAL);
	},
};
if (window.plus) {
    typeof plusReady =='function' && plusReady();
} else{
    document.addEventListener('plusready',typeof plusReady =='function'?plusReady:null,false);
}

// Aps.pay ??
// Aps.share ??
// console.log(VL('[onclick]'));
VL('[onclick]') && VL('[onclick]').each(function(vd){ vd.click(vd.property('onclick')).removeAttr('onclick');});

