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

"use strict";
if(!Aps){var Aps = {}};
if(!ApsMd){var ApsMd = {}};
if(!CONFIGS){var CONFIGS = {}};

/* 核心组件(必要) */
window.vdom = window.VD = function( selector,hash ){ return selector ? Aps.dom.get(selector,hash) : this; };
window.vlist= window.VL = function( selector,hash ){ return selector ? Aps.dom.list(selector,hash) : this; };
// window.vnew = window.VN = function( type,id,classes,attrs ){ return type ? Aps.dom.create(type,id,classes,attrs) : this; }; 
window.i18n  = function( code , params ){ return params ? (ApsMd.locale[Aps.setting.language][code](params)||code) : (ApsMd.locale[Aps.setting.language][code]||code); }

Aps.fn = function(obj) { // ! 内核组件  # core factory 
	var fn = {
		options: {
			'update': 0,
			'expire': 0,
			'before': 0,
			'callback': 0,
			'errorCall': 0,
			'url': CONFIGS.apihost,
			'bindList': [],
			'requesttype': 'POST',
			'loadingtype': 'Window',
			'parameters': {
				'parameters': [],
				'action': '',
			},
			'headers':{},
		},
		/* 重置配置 */
		resetOptions: function() {
			this.options = {
				'update': 0,
				'expire': 0,
				'before': 0,
				'callback': 0,
				'errorCall': 0,
				'url': CONFIGS.apihost,
				'bindList': [],
				'requesttype': 'POST',
				'loadingtype': 'Window',
				'parameters': {
					'parameters': [],
					'action': '',
				},
				'headers':{},
			}
		},
		/* 强制更新 */
		setUpdate: function() {
			this.options.update = true;
		},
		/* 跨域请求 */
		setCros: function() {
			this.options.cros = 1;
		},
		/* 请求地址 */
		setUrl: function(url) {
			this.options.url = url
		},
		/* 设置过期 */
		setExpire: function(expire) {
			this.options.expire = expire;
		},
		/* 设置参数 */
		setParams: function(params) {
			this.options.parameters.parameters = params;
		},
		/* 设置头信息 */
		setHeaders: function(headers){
			this.options.headers = headers;
		},
		/* 前置函数 */
		setBefore: function(before) {
			this.options.before = before;
		},
		/* 设置回调 */
		setCallback: function(callback) {
			this.options.callback = callback;
		},
		/* 错误回调 */
		setErrorCall: function(errorCall) {
			this.options.errorCall = errorCall;
		},
		/* 设置配置 */
		setOptions: function(key, value) {
			this.options[key] = value;
		},
		/* 添加参数 */
		addParams: function(key, value) {
			if (typeof key == 'object') {
				for( let k in key){ this.options.parameters.parameters[k] = key[k]; }
			}else{
				this.options.parameters.parameters[key] = value;
			}
		},
		/* 添加头部 */
		addHeaders: function(key, value) {
			if (typeof key == 'object') {
				for( let k in key){ this.options.headers[k] = key[k]; }
			}else{
				this.options.headers[key] = value;
			}
		},
		/* 保存属性 */
		setProperty: function(key, value) {
			Aps.local.set(key, value);
			this[key] = value;
		},
		/* 移除属性 */
		removeProperty: function(key) {
			Aps.local.remove(key);
			delete this[key];
		},
		/* 设置事件 */
		setAction: function(action) {
			if (CONFIGS.apimode == 'RESTFUL') {
				this.setUrl(APILIST.getApiUrl(action));
			} else {
				this.options.parameters.action = action;
			}
		},

		post:function( api, call, params, option ){

			var expire    = option ? (option.expire    || 3600 ) : 3600 ;
			var needLogin = option ? (option.needLogin || 0    ) : 0    ;
			var collect   = option ? (option.collect   || 0    ) : 0    ;
			var update    = option ? (option.update    || 0    ) : 0    ;
			var gajax     = option ? (option.gajax     || 0    ) : 0    ;
			var url       = option ? (option.url       || 0    ) : 0    ;

			this.resetOptions();
			this.setAction(api);
			this.setParams(params||{});

			if( typeof call == 'object'){
				var callback  = call.success || null;
				var errorCall = call.error || null;
			}else if(typeof call== 'function'){
				var callback  = call || null;
			}

			if ( needLogin ) {
				if( !Aps.user.forcedLogin() ) return;
				this.addHeaders('userid', Aps.user.userid );
				this.addHeaders('token', Aps.user.token );
			}
			if ( update ) {
				this.setUpdate();
			}
			if (gajax) {
				this.setOptions('gajax',1);
			}
			if ( collect ) {
				this.setOptions('collect',collect);
			}
			if ( url ) {
				this.setOptions('url',url);
			}
			if ( errorCall ) {
				this.setErrorCall(errorCall);
			}

			this.setOptions('requesttype','POST');
			this.setExpire(expire);
			this.setCallback(callback);

			this.addHeaders('language', Aps.setting.language );
			Aps.cajax.request(this.options);

		},

		get:function(url,call,params,option){

			var expire    = option ? (option.expire    || 3600 ) : 3600 ;
			var needLogin = option ? (option.needLogin || 0    ) : 0    ;
			var update    = option ? (option.update    || 0    ) : 0    ;
			var gajax     = option ? (option.gajax     || 0    ) : 0    ;

			this.resetOptions();
			this.setUrl(url);
			this.setParams(params||{});
			if( typeof call == 'object'){
				var callback = call.success || null;
				var errorCall = call.error || null;
			}else if(typeof call== 'function'){
				var callback  = call || null;
			}

			if ( needLogin ) {
				if( !Aps.user.forcedLogin() ) return;
				this.addHeaders('userid', Aps.user.userid );
				this.addHeaders('token', Aps.user.token );
			}
			if ( update ) {
				this.setUpdate();
			}
			if (gajax) {
				this.setOptions('gajax',1);
			}

			this.setOptions('requesttype','GET');
			this.setExpire(expire);
			this.setCallback(callback);
			this.setErrorCall(errorCall||0);
			this.addHeaders('language', Aps.setting.language );
			Aps.cajax.request(this.options);

		},

		// vlist:window.vlist,
		_listen:Aps._listen,
	};
	for (var k in fn) {
		obj[k] = obj[k]||fn[k];
	}

	return obj;
};
Aps.dom   = { // ! dom操作 快捷方式 VD,vdom 虚拟元素 ,VL,vlist 虚拟列表
	vmap:{},
	styles:{css:{}},
	vdom:window.vdom,
	init:function(){
		var vd = function( selector,hash ){ return selector ? Aps.dom.get(selector,hash) : this; };
		window.vdom = vd;
		this.vdom   = window.vdom;
	},
	vf:{
		addClass:function(name){
			if (name.indexOf(' ')>-1){ 
				var list = name.split(' ');
				for( var k in list){ this.el.classList.add(list[k]); }
			}else if(typeof name=='object'){
				for( var k in name){ this.el.classList.add(name[k]); }
			}else{
				if(!name) return this;
				this.el.classList.add(name);
			}
			return this;
		},
		hasClass:function(name){
			return this.el.classList.value.indexOf(name)>-1;
		},
		removeClass:function(name){
			if (name.indexOf(' ')>-1){ 
				var list = name.split(' ');
				for( var k in list){ this.el.classList.remove(list[k]); }
			}else{
				this.el.classList.remove(name);
			}
			return this;
		},
		toggleClass:function(name){
			if(this.hasClass(name)){
				this.removeClass(name);
			}else{
				this.addClass(name);
			}
			return this;
		},
		css:function(name,value){
			if(!value){return this.el.style[name];}
			this.el.style[name] = value;
			return this;
		},
		styles:function(styles){
			for(var k in styles){
				this.el.style[k] = styles[k];
			}
			return this;
		},
		setAttr:function(attrs){
			if (typeof attrs!=='object') return;
			for(var k in attrs){
				this.attr(k,attrs[k]);
			}
			return this;
		},
		id:function(id){
			if(id){ this.el.id=id; }
			return id?this:this.el.id;
		},
		has:function(name){
			return this[name]!==null && this[name]!==undefined;
		},
		attr:function(name,value){
			if (value) { this.el.setAttribute(name,value); }
			return typeof value!=='undefined' ? this : this.el.getAttribute(name);
		},
		disable:function(){
			return this.attr('disabled','disabled');
		},
		enable:function(){
			return this.removeAttr('disabled');
		},
		removeAttr:function(name){
			this.el.removeAttribute(name);
			return this;
		},
		text:function(text){
			if (text) { this.el.textContent = text; }
			return text ? this : this.el.textContent; 
		},
		html:function(html){
			if (typeof html =='object' && html._vdom){ html = html.HTML();}else if(typeof html=='object'){ html=VD(html).HTML();}
			if (html) { this.el.innerHTML = html; }
			return html ? this : this.el.innerHTML; 
		},
		HTML:function(html){
			if (typeof html =='object' && html._vdom){ html = html.HTML();}else if(typeof html=='object'){ html=VD(html).HTML();}
			if (html) { this.el.outerHTML = html; }
			return html ? this : this.el.outerHTML; 
		},
		append:function(html){
			if (typeof html == 'object' && html._vdom) {
				this.el.appendChild(html.el);
			}else{
				this.append(VD(html));
			}
			return this;
		},
		prepend:function(html){
			if (typeof html == 'object') {
				if(this.el.hasChildNodes()){ 
					this.el.insertBefore(html.el,this.el.firstChild); 
				}else{ 
					return this.append(html); 
				} 
			}else{
				this.prepend(VD(html));
			}
			return this;
		},
		empty:function(){
			this.el.innerHTML = '';
			return this;
		},
		remove:function(){
			this.el.remove();
			if( this.hash ) delete vdom[this.hash];
			this.clearDom();
			delete this;
			return this||0;
		},
		clearDom:function(){
			for(var k in this){
				this[k]=null;
			}
		},
		value:function(v){
			var staticDom = " SELECT OPTION INPUT RADIO CHECKBOX".indexOf(this.el.tagName)<=0;
			if (v){ this.el[staticDom?'innerHTML':'value']=v; }
			return v? this : this.el[staticDom?'innerHTML':'value'];
		},
		property:function(k,v){
			if(v!==undefined && v!==null){ this.el[k]=v;}
			return (v!==undefined && v!==null) ? this : this.el[k];
		},
		show:function(){
			this.el.style.display = '';
			return this;
		},
		hide:function(){
			this.el.style.display = 'none';
			return this;
		},
		fadeIn:function(call){
			this.show();
			this.animate(ApsMd.animate.fadeIn,0,call);
			return this;
		},
		fadeOut:function(call){
			let self = this;
			this.animate(ApsMd.animate.fadeOut,300,function(){ self.remove();if(typeof call=='function'){call();} });
			return this;
		},
		focus:function(){
			this.el.focus();
			return this;
		},
		blur:function(){
			this.el.blur();
			return this;
		},
		toggle:function(show){
			this.el.style.display = this.el.style.display=='none'?'':'none';
			return this;
		},
		index:function(){
			return 
			selector ? 
			Array.from(this.parent().finds(selector)).indexOf(this.el) : 
			Array.from(this.parent().el.children).indexOf(this.el);
		},
		find:function(selector,list){
			return list? vlist(this.selector+' '+selector): vdom(this.selector+' '+selector);
		},
		child:function(selector,list){
			return list? vlist(this.selector+'>'+selector): vdom(this.selector+'>'+selector);
		},
		finds:function(selector){
			return this.find(selector,1);
		},
		childs:function(selector){
			return this.child(selector,1);
		},
		parent:function(){
			return VD(this.el.parentNode);
		},
		brothers:function(selector){

		},
		on:function(event,call,options){
			var vd = this;
			this.el.addEventListener(event,function(e){call(vd,e);},options);
			return this;
		},
		off:function(event,call){
			var vd = this;
			this.el.removeEventListener(event,function(e){call(vd,e);});
			return this;
		},
		one:function(event,call,options){
			if (options){ options.once=true; }else{ options={once:true}};
			var vd = this;
			this.el.addEventListener(event,function(e){call(vd,e);},options);
			return this;
		},
		click:function(call,options){
			return this.on(Aps.setting.plus?'tap':'click',call,options);
		},
		fingerTouchFns:{
			run:function(vd,eventname){
				if (vd.tCalls[eventname]){
					for(var i in vd.tCalls[eventname]){
						vd.tCalls[eventname][i](vd);
					}
				}
			},
			_start:function(vd,e){
				vd.tData.X_ = e.touches[0].clientX; 
				vd.tData.Y_ = e.touches[0].clientY; 
				vd.tData.T_ = e.timeStamp;
				vd.tData.tap = vd.tData.longpress = 1;
				this.run(vd,'start');
				// if(vd.tCalls.start){  }
				// console.log('Touch start.',vd.tData.X_,vd.tData.Y_,vd.tData.T_);
			},
			_move:function(vd,e){
				vd.tData._x  = vd.tData.x; 
				vd.tData._y  = vd.tData.y;
				vd.tData._t  = vd.tData.t;
				vd.tData.x   = e.touches[0].clientX; 
				vd.tData.y   = e.touches[0].clientY; 
				vd.tData.t   = e.timeStamp;
				var interval = (vd.tData.t - vd.tData._t) / 1000;
				var vx       = (vd.tData.x - vd.tData._x) / interval;
				var vy       = (vd.tData.y - vd.tData._y) / interval;
				var angle    = vy ? Math.abs(vx/vy) : 10;

				vd.tData.ax  = (vx-vd.tData.vx) / interval / 1000;
				vd.tData.ay  = (vy-vd.tData.vy) / interval / 1000;
				vd.tData.vx  = vx;
				vd.tData.vy  = vy;
				vd.tData.distanceX = vd.tData.x-vd.tData.X_;
				vd.tData.distanceY = vd.tData.y-vd.tData.Y_;
				
				vd.tData.tap = vd.tData.longpress = 0;
				vd.tData.duration = vd.tData.t-vd.tData.T_;

				vd.tData._up   = vy<0 && angle<1.62;
				vd.tData._down = vy>0 && angle<1.62;
				vd.tData._left = vx<0 && angle>0.62;
				vd.tData._right= vx>0 && angle>0.62;

				this.run(vd,'move');

				// console.log('Touch moving. last   :',vd.tData._x,vd.tData._y);
				// console.log('Touch moving. current:',vd.tData.x,vd.tData.y,vd.tData.t,vd.tData.duration);
				// console.log(' Intvl: ',interval);
				// console.log(' V: ',vd.tData.vx,vd.tData.vy,' A: ',vd.tData.ax,vd.tData.ay);
				// console.log(' Angle: ',angle);
				// console.log(' Rotation: ',vd.tData._up,vd.tData._down,vd.tData._left,vd.tData._right);
			},
			_end:function(vd,e){
				vd.tData._X = vd.tData.x||vd.tData.X_; 
				vd.tData._Y = vd.tData.y||vd.tData.Y_;
				vd.tData._T = e.timeStamp;
				vd.tData.duration = vd.tData._T-vd.tData.T_;

				var distanceX = vd.tData._X-vd.tData.X_ , distanceY = vd.tData._Y-vd.tData.Y_;
				var angle   = (distanceX) ? Math.abs(distanceX/distanceY) : 10;

				vd.tData.up   = distanceY<0 && angle<1.62;
				vd.tData.down = distanceY>0 && angle<1.62;
				vd.tData.left = distanceX<0 && angle>0.62;
				vd.tData.right= distanceX>0 && angle>0.62;
				vd.tData.tap  = vd.tData.tap && vd.tData.duration>vd.tData.conf.tap[0] && vd.tData.duration<vd.tData.conf.tap[1];
				vd.tData.longpress= vd.tData.longpress && vd.tData.duration>vd.tData.conf.longpress[0] && vd.tData.duration<vd.tData.conf.longpress[1];
				
				vd.tData.up   && !vd.tData.lockY && this.run(vd,'up');
				vd.tData.down && !vd.tData.lockY && this.run(vd,'down');
				vd.tData.left && !vd.tData.lockX && this.run(vd,'left');
				vd.tData.right&& !vd.tData.lockX && this.run(vd,'right');
				vd.tData.tap  && this.run(vd,'tap');
				vd.tData.longpress && this.run(vd,'longpress');

				(vd.tData.up && vd.tData.left) && this.run(vd,'upleft');
				(vd.tData.up && vd.tData.right) && this.run(vd,'upright');
				(vd.tData.down && vd.tData.left) && this.run(vd,'downleft');
				(vd.tData.down && vd.tData.right) && this.run(vd,'downright');

				this.run(vd,'end');
				// console.log('Touch end.',vd.tData._X,vd.tData._Y,vd.tData._T);
				// console.log(' Angle: ',angle);
				// console.log(' Rotation: ',vd.tData.up,vd.tData.down,vd.tData.left,vd.tData.right);
			},
			_cancel:function(vd,e){
				vd.tData._X = vd.tData.x||vd.tData.X_; 
				vd.tData._Y = vd.tData.y||vd.tData.Y_;
				vd.tData._T = e.timeStamp;
				this.run(vd,'cancel');
				// console.log('Touch canceled.',vd.tData._X,vd.tData._Y,vd.tData._T);			
			}
		},
		onTouch:function(eventname,call){ // For finger touch
			var listeningIndex = function(list,cal){ if(list==false){return -1;}for(var k in list){if(cal==list[k]) return k;} return -1; };
			var vd   = this;
			var conf = { tap:[50,350],longpress:[500,2000], }; 
			vd.tData = vd.tData || {
				_start:function(vd,e){Aps.dom.vf.fingerTouchFns._start(vd,e);},
				_move:function(vd,e){Aps.dom.vf.fingerTouchFns._move(vd,e);},
				_end:function(vd,e){Aps.dom.vf.fingerTouchFns._end(vd,e);},
				_cancel:function(vd,e){Aps.dom.vf.fingerTouchFns._cancel(vd,e);},
				conf:conf,
				X_:null,Y_:null,T_:null,       // start point
				_X:null,_Y:null,_T:null,       // end point
				x:null,y:null,t:null,          // moving point
				_x:null,_y:null,_t:null,       // moving point cache
				tap:0,doubletap:0,longpress:0, // touch mode
				up:0,down:0,left:0,right:0,    // rotation
				_up:0,_down:0,_left:0,_right:0,// rotation cache
				ax:0,ay:0,                     // Acceleration
				vx:0,vy:0,                     // Velocity speed
				duration:0,
			};
			vd.tCalls = vd.tCalls || {};
			vd.tCalls[eventname] = vd.tCalls[eventname] || [];
			if(listeningIndex(vd.tCalls[eventname],call)==-1){ vd.tCalls[eventname].push(call); }

			this.on('touchstart',vd.tData._start);
			this.on('touchmove',vd.tData._move);
			this.on('touchend',vd.tData._end);
			this.on('touchcancel',vd.tData._cancel);
			return this;
		},
		offTouch:function(eventname,call){
			var listeningIndex = function(list,cal){ if(list==false){ return -1;} for(var k in list){if(cal==list[k]){return k;}} return -1; };
			var vd   = this;
			if(!eventname && !call){ 
				this.off('touchstart',vd.tData._start);
				this.off('touchmove',vd.tData._move);
				this.off('touchend',vd.tData._end);
				this.off('touchcancel',vd.tData._cancel);
				return this;
			}
			vd.tCalls = vd.tCalls || {};
			vd.tCalls[eventname] = vd.tCalls[eventname] || [];
			var idx = listeningIndex(vd.tCalls[eventname],typeof call=='string'? call :call.toString());
			if(idx>-1){ vd.tCalls[eventname][idx]=0; }
			return this;
		},
		onMultiTouch:function(){}, // For Multy Touch 
		offMultiTouch:function(){}, 
		animate:function(animate,optionsOrDuration,callback){ 
		// 使用css3动画来解决js动画性能问题
		// 
		// animate /* 动画脚本 {name:name,frames:{...}} */
		// 
		// optionsOrDuration /*  */ 
		// 
			if(typeof animate!='object'){ console.error('animate needs to be object struct! {name:name,frames:{}}, Current type is', typeof animate ); return animate;}
			var createAnimateCss = function(frames,name){
				var wkcss = " transform backface-visibility transform-origin box-sizing";
				var css = "@keyframes "+name+"{";
				if (typeof frames=="string"){ return frames; }
				for( var k in frames ){
					css += k+'%{';
						for( var m in frames[k]){
							css += m+":"+frames[k][m]+";";
						}
					css += "}";
				}
				css += "}\n";

				css += "@-webkit-keyframes "+name+"{";
				if (typeof frames=="string"){ return frames; }
				for( var k in frames ){
					css += k+'%{';
						for( var m in frames[k]){
							css += ((wkcss.indexOf(m)>0?"-webkit-"+m:m)+":")+frames[k][m]+";";
						}
					css += "}";
				}
				css += "}\n";
				return css;
			};

			var animateHASH = 'Aps_'+Aps.dom.storagehash.hash(JSON.stringify([animate,duration,options]));

			var options  = typeof optionsOrDuration =='object' ? optionsOrDuration : {}; 
			var duration = typeof optionsOrDuration =='object' ? (optionsOrDuration.duration || 500)+"ms" : (optionsOrDuration || 500)+"ms"; 
			var animatename  = typeof animate == 'object' ? animate.name : ( animate || "bounce");

			var delay    = options.delay    ? options.delay+"ms" : '0ms' ;
			var count    = options.count    || 1 ;	
			var end      = options.end      || 'backwards';
			var alternate= options.alternate|| 'normal';
			var transformorigin = options.transformorigin|| '';
			var speed    = animate.curve    || 'ease-out';

			if(typeof speed=='object'){ speed = "cubic-bezier("+speed[0]+","+speed[1]+","+speed[2]+","+speed[3]+","+")" ;}
			if(options.infinite){ count = 'infinite'; };			

					// modern broswers
			var css = "{ animation-name:" + animatename+";animation-duration:" + duration+";animation-timing-function: " + speed+";animation-delay: " + delay+";animation-iteration-count: " + count+";animation-direction: "+alternate+";"
					+ "animation-fill-mode: "+end+";"
					+ (transformorigin?"transform-origin: "+transformorigin+";":"");

					// webkit broswers
				css+= "-webkit-animation-name:" + animatename+";-webkit-animation-duration:" + duration+";-webkit-animation-timing-function:" + speed+";-webkit-animation-delay:" + delay+";-webkit-animation-iteration-count:" + count+";-webkit-animation-direction:" + alternate+";"
					+ "-webkit-animation-fill-mode: "+end+";"
					+ (transformorigin?"webkit-transform-origin: "+transformorigin+";":"");
				css+= "}\n";

			var animateCLASS = Aps.dom.styles.css[animateHASH] ? animateHASH : Aps.dom.style(animateHASH,css+createAnimateCss(animate.frames,animate.name));

			this.animateCSS(animateCLASS,1,callback);
			return this;
		},
		animateCSS:function(animationName,customMode, callback) {
			var animationEnd = (function(el) {
				var animations = {
					animation: 'animationend',
					OAnimation: 'oAnimationEnd',
					MozAnimation: 'mozAnimationEnd',
					WebkitAnimation: 'webkitAnimationEnd',
				};

				for (var t in animations) {
				if (el.style[t] !== undefined) {
				return animations[t];
				}
			}
			})(document.createElement('div'));

			this.addClass((customMode?'':'animated ' )+ animationName).one(animationEnd, function(vd) {
				vd.removeClass((customMode?'':'animated ' )+ animationName);
				if (typeof callback === 'function') callback();
			});

			return this;
		},
		animateCss:function(animationName, callback) {
			return this.animateCSS(animationName,0,callback);
		},
		transform:function(data){

			var transform = "";
			// data.matrix && this.css(); // matrix 
			data.move  && ( transform += "translate( "+data.move.x+"," +data.move.y+" )" ); // -?px - ?px
			data.scale && ( transform += "scale("     +data.scale.x+","+data.scale.y+")" ); // 0-?
			data.skew  && ( transform += "skew("      +data.skew.x+"," +data.skew.y+")" );  // 0-180deg
			data.rotate&& ( transform += "rotate("+data.rotate+")" ); // -?-?deg
			this.styles({"transform":transform});
			return this;
		},
		transformDefault:function(){

		},
		onBlur:function(range){
			this.css("filter","blur("+range+")");
			return this;
		},
		noBlur:function(){
			this.css('filter','blur(0)').css('filter','unset');
			return this;
		},
		loading:function(){ this.loadStatus = 1; return this;},
		loaded:function(){ this.loadStatus = 0; return this;},
		isLoad:function(){return this.loadStatus || 0; },
		listen:function(keys,notify){
			/* 开启监听模式 */
			var self = this;
			self._data || (self._data = {});
			/* 监听通知  Redefine notify function */
			self._notify = notify || self._notify || function(key,val){
				console.info('_notify:',key,val);
			};

			if(typeof keys=='undefined') return null;
			if(typeof keys=='string'){ keys = [keys];}

			for( var k in keys){
				let key = keys[k];
				let v = self[key];
				Object.defineProperty(self,key,{
					enumerable: true,
					configurable: false,
					get: function() {
						return self._data[key];
					},
					set: function(val) {
						self._notify(key,val);
						self._data[key] = val;
					}
				});
				self._data[key] = v;
			}
			return self;
		}
	},
	vm:function(el,selector,hash){ // v dom
		// console.log(el,selector,hash);
		if(hash && VD[hash]) return VD[hash];
		var m = {
			el:el,
			_vdom:1,
			selector:0,
			loadStatus:0,
			hash:hash||Aps.dom.uuid(),	
		};
		for(var k in Aps.dom.vf){ m[k] = Aps.dom.vf[k];}
		if(!m.id()){ m.id(m.hash); }
		m.selector = (selector||'') + (m.id()?('#'+m.id()):'');
		if( m.hash){ if (!window.VD) this.init(); VD[hash] = m;}
		return hash ? VD[hash] : m;
	},
	vl:function(list,hash){
		var vlist = {
			_vlist:1,
			list:list,
			vdf:function(funcname){
				var args = arguments;
				this.list.forEach(function(vdom){vdom[funcname](args[1],args[2],args[3])});
				return this||0;
			},		
			each:function(call){
				if(typeof call!=='function') console.error('Invalid Inner function type:', typeof call);
				this.list.forEach(function(vd){call(vd)});
			},
			on:function(evt,call){
				if(typeof call!=='function') console.error('Invalid Inner function type:', typeof call);
				this.list.forEach(function(vd){vd.on(evt,function(e){ call(vd);})});
			},
			addClass:function(name){ return this.vdf('addClass',name); },
			removeClass:function(name){ return this.vdf('removeClass',name); },
			remove:function(name){ return this.vdf('remove'); },
			// each:function(func){
			// 	this.list.forEach(function(vdom){
			// 		if(typeof func == 'function') func(vdom);
			// 	});
			// 	return this||0;
			// },
		};
		if(hash) this.vdom[hash]=vlist;
		return hash?this.vdom[hash]:vlist;
	},
	get:function(selector,hash){
		if(typeof selector=='object'){
			if ( selector.hash ) {
				return selector;
			}else{
				var dom = selector;
				selector = '';
			}
		}else if(typeof selector=='string'){
			if(selector.indexOf('.')*selector.indexOf('#')!==0 && "a,abbr,address,area,article,aside,audio,b,base,big,blockquote,body,br,button,canvas,caption,code,col,colgroup,command,dd,div,dl,dt,em,embed,fieldset,footer,form,frame,frameset,h1,h2,h3,h4,h5,h6,head,header,hr,html,i,iframe,img,input,label,legend,li,link,map,mark,menu,menuitem,meta,nav,ol,optgroup,option,output,p,param,pre,progress,q,rp,script,section,select,small,source,span,strong,style,sub,summary,sup,table,tbody,td,textarea,tfoot,th,thead,time,title,tr,track,tt,ul,var,video,wbr".indexOf(selector)==-1){
				return Aps.dom.create(selector,hash);
			}
			var dom = document.querySelector(selector) ;
		};
		return dom ? this.vm(dom,selector,hash) : 0;
	},
	list:function(selector,hash){
		var list = [];
		var all  = document.querySelectorAll(selector);
		if (all.length>0) {
			all.forEach(function(d){
				list.push(Aps.dom.vm(d,selector));
			})
		}
		return all.length>0 ? this.vl(list) : 0;
	},
	new:function(htmlString,hash){
		var parser = new DOMParser();
		var el     = this.parse(htmlString);
		return this.vm(el,null,hash);
		// return this.vm(html,hash);
	},
	create:function(type,id,classes,attrs){
		var id = id || this.uuid();
		if(!classes && !attrs){
			this.vm(this.parse(type),'#'+id,id).id(id);
		}else{
			var el = document.createElement(type);
			this.vm(el,'#'+id,id).id(id).addClass(classes).setAttr(attrs);
		}
		return vdom[id];
	},
	parse:function(htmlString){
		var template = document.createElement('template');
		template.innerHTML = htmlString.trim();
		return template.content.firstChild;
	},
	style:function(hash,css){
		var name = hash.indexOf('.')<0 && hash.indexOf('#')<0 ? '.'+hash : hash;
		var toCss = function(list){
			var css = "";
			for( let k in list){
				// css += k+'{' + list[k] + "} \n";
				css += k+' ' + list[k] + " \n";
			}
			return css;
		};
		if(!this.styles.el){
			this.styles.el = document.createElement('style');
			this.styles.el.type = 'text/css';
			this.styles.el.id   = 'ApsStyles';
			document.head.appendChild(this.styles.el);
		}
		if (css) {
			this.styles.css[name] = css;
			vdom('#ApsStyles').html(toCss(this.styles.css));
		}
		return hash||css ? hash : '';
	},
	storagehash: {
		I64BIT_TABLE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split(''),
		hash: function(origin) {
			var hash = 5381;
			var i = origin.length - 1;
			if (typeof origin == 'string') {
				for (; i > -1; i--) {
					hash += (hash << 5) + origin.charCodeAt(i)
				}
			} else {
				for (; i > -1; i--) {
					hash += (hash << 5) + origin[i]
				}
			}
			var value = hash & 0x7FFFFFFF;
			var retValue = '';
			do {
				retValue += Aps.dom.storagehash.I64BIT_TABLE[value & 0x3F]
			} while (value >>= 4);
			return retValue;
		},
		valueSort: function(obj, value) {
			var list = Object.keys(obj).sort(function(a, b) {
				return value ? (obj[a] > value && obj[a] - obj[b]) : obj[a] - obj[b]
			});
			return list;
		}
	},
	uuid:function(){
		var i = "g_" + (new Date()).getTime()+parseInt(Math.random()*1000);//弹窗索引
		return vdom("#"+i) ? this.uuid() : i;
	},
};

Aps.local = { // ! 浏览器本地存储 扩展数据类型  # localstorage Adv Api 
	/* 存储数据 */
	set: function(key, value) {
		var type = typeof value;
		var v = JSON.stringify({
			v: value,
			t: type
		});
		localStorage.setItem(this.unikey(key), v);
		return 1;
	},
	/* 读取数据 */
	get: function(key) {
		var data = localStorage.getItem(this.unikey(key)) || 0,
			res = data ? JSON.parse(data).v : undefined;
		return res;
	},
	/* 单次读取 */
	once: function(key) {
		var data = this.get(this.unikey(key));
		this.remove(this.unikey(key));
		return res;
	},
	/* 删除数据 */
	remove: function(key) {
		localStorage.removeItem(this.unikey(key));
		return 1;
	},
	/* 检测数据 */
	has: function(key) {
		return localStorage.getItem(this.unikey(key)) ? 1 : 0;
	},
	/* 清空数据 */
	removeAll: function(arr) {
		for (var i = 0; i < arr.length; i++) {
			var k = this.unikey(arr[i]);
			localStorage.removeItem(k);
		}
	},
	unikey:function(key){
		return CONFIGS.appid ? CONFIGS.appid+'_'+key : key;
	}
};
Aps.io = { // 混合开发 本地存储
	private_path:typeof plus!=='undefined'?plus.io.PRIVATE_DOC:null,
	public_path: typeof plus!=='undefined'?plus.io.PUBLIC_DOCUMENTS:null,
	public_downloads: typeof plus!=='undefined'?plus.io.PUBLIC_DOWNLOADS:null,

	public:function(sCall,fCall){

	},
	private:function(sCall,fCall){

	},
	downloads:function(sCall,fCall){

	},
	toURL:function(file){
		return plus.io.convertLocalFileSystemURL(file);
	},
	toFileURL:function(url){
		return plus.io.convertAbsoluteFileSystem(url);
	}
};

Aps.cache = { // ! 数据缓存 主要自动处理数据请求的缓存以及相关过期  # data cache with auto expire 
	init: function() {
		this.max = 100;
		this.list = Aps.local.get('CACHELIST') || {};
		this.collect = Aps.local.get('CACHECOLLECT') || {};
		this.count = this.list.length;
		this.time = Math.round(new Date().getTime() / 1000);
		return this;
	},
	has: function(cacheid) {
		this.refresh();
		return (typeof(this.list[cacheid]) !== 'undefined') ? (parseInt(this.list[cacheid]) > this.time || this.remove(cacheid)) : this.remove(cacheid);
	},
	add: function(cacheid, data, expire, update, collect) {
		if (!update) {
			this.list[cacheid] = expire + Math.round(new Date().getTime() / 1000);
		}
		if (collect) {
			this.addToCollect(cacheid,collect);
		}
		Aps.local.set('CACHELIST', this.list);
		Aps.local.set('CACHE_' + cacheid, data);
		this.checkMax();
		this.refresh();
		return this;
	},
	get: function(cacheid) {
		var data = Aps.local.get('CACHE_' + cacheid);
		if (!data){ return 0; };
		return typeof(data.status) !== 'undefined' || typeof(data.code) !== 'undefined' ? data : 0;
	},
	update: function(cacheid, data, expire) {
		this.add(cacheid, data, expire, 1);
		return this;
	},
	remove: function(cacheid) {
		delete this.list[cacheid];
		Aps.local.set('CACHELIST', this.list);
		Aps.local.remove('CACHE_' + cacheid);
		this.refresh();
		return 0;
	},
	removeAll: function(arr) {
		for (var i = 0; i < arr.length; i++) {
			this.remove(arr[i]);
		}
		Aps.local.set('CACHELIST', this.list);
		this.refresh();
		return this;
	},
	clear: function() {
		for (var key in this.list) {
			Aps.local.remove('CACHE_' + this.list[key]);
		}
		Aps.local.remove('CACHELIST');
		this.list = {};
		this.refresh();
		return this;
	},
	addToCollect:function(cacheid,collect){
		if (this.collect[collect]) {
			this.collect[collect][cacheid]=1;
		}else{
			this.collect[collect]={};
			this.collect[collect][cacheid]=1;
		}
		Aps.local.set('CACHECOLLECT',this.collect);
	},
	clearCollect:function(collect){
		for( var k in this.collect[collect]){
			this.remove(k);
		}
		delete this.collect[collect];
		Aps.local.set('CACHECOLLECT',this.collect);
	},
	clearExpired: function() {
		this.refresh();
		var now = Math.round(new Date().getTime() / 1000);
		var expireList = Aps.dom.storagehash.valueSort(this.list, now);
		this.removeAll(expireList);
	},
	refresh: function() {
		this.time = Math.round(new Date().getTime() / 1000);
		this.count = Object.keys(this.list).length;
		this.list = Aps.local.get('CACHELIST') || {};
		// this.collect = Aps.local.get('CACHECOLLECT') || {};
		return this;
	},
	checkMax: function() {
		this.refresh();
		if (this.count >= (this.max - (this.max) / 5)) {
			var olderList = Aps.dom.storagehash.valueSort(this.list, 0);
			olderList = olderList.slice(0, parseInt((this.count) / 5) - 1);
			this.removeAll(olderList);
		}
	},

};
Aps.worker = { // ! 异步功能处理

};
Aps.cajax = { // ! 缓存异步请求  # ajax request with auto cache data & forced update 
	parseParam: function(param,key) {
		var paramStr = "",type = typeof param;
		if (type == 'string' || type == 'number' || type == 'boolean') { paramStr += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(param); }
		else { for(var i in param){ var k = key == null ? i : key + "[" + i + "]"; paramStr += '&' + this.parseParam(param[i], k); }; }
		return paramStr.substr(1);
	},
	socket: function(url,opts){

	},
	ajax  : function(url,opts){
		var _ = new XMLHttpRequest();
		// console.log(opts.callback);
		// console.log(opts.errorCall);
		// INIT
		_.open(opts.requesttype,opts.url,!opts.useSync);

		if(opts.headers){ for(var k in opts.headers){ _.setRequestHeader(k,opts.headers[k]); } }
		if(opts.requesttype=='POST'){ _.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); } /* Set Content-Type by POST */

		_.withCredentials = true;
		_.timeout = opts.timeout || 2000;

		// PROGRESS 
		// onloadstart, onprogress, onabort, onerror, onload, ontimeout, onloadend, onreadystatechange
		// 0 unsent  1 opened  2 heades received  3 loading  4 done

		// RESPONSE
		/* XMLHttpRequestResponseType */ // "", "arraybuffer", "blob", "document", "json", "text"
		_.onreadystatechange = function(){
			if( _.readyState === 4 ){
				if(_.status==200){
					var CTYPE = _.responseType || _.getResponseHeader('Content-Type') ;
					if(typeof opts.callback == 'function') opts.callback(CTYPE=='json'||CTYPE.indexOf('json')>-1?JSON.parse(_.responseText):_.responseText);
					// console.log('Network Success. Server Code:',_.status);
				}else{
					// if(typeof opts.errorCall== 'function'){ opts.errorCall(_.status); }
					console.error('Network Error. Server Code:',_.status,typeof opts.errorCall,opts.errorCall);
				}
			}
		};
		// SEND
		_.send(opts.parameters?Aps.cajax.parseParam(opts.parameters):null);
	},

	/* 获取缓存 */
	getData: function(d) {
		return d.content || d.data;
	},
	/* 获取状态 */
	getStatus: function(d) {
		return d.code || d.status || 0;
	},
	/* 获取消息 */
	getMessage: function(d) {
		return d.message || d.msg;
	},
	/* 是否成功 */
	successful: function(d) {
		return d.status == 0 || d.code == 200;
	},
	/* 请求数据 */
	request: function(options) {
		// console.log(options);
		/* 请求模式 */
		var reuqestMode = options.mode        || 'ajax';
		var apimode     = CONFIGS.apimode     || 'AppSite'; // ? RESTFUL 
		var update      = options.update      || 0; /* 强制更新 */
		var url         = options.url         || 0; /* 请求地址 */
		var headers     = options.headers     || 0; /* Head参数 */
		var parameters  = options.parameters  || 0; /* 请求参数 */
		var before      = options.before      || 0; /* 前置函数 */
		var callback    = options.callback    || 0; /* 回调函数 */
		var errorCall   = options.errorCall   || 0; /* 失败回调 */
		var collect     = options.collect     || 0; /* 绑定列表 */
		var requesttype = options.requesttype || 'POST'; /* 请求类型 */
		var loadingtype = options.loadingtype || 'Window'; /* 加载类型 */
		var useCORS     = options.useCORS     || 0; /* 跨域请求 */
		var useSync     = options.useSync     || 0; /* 同步请求 */
		var expire      = (options.expire     || options.expire === 0) ? options.expire : 1 * 3; /* 有效时间 */
		var request = {  /* 请求参数 */
			'url': url,
			'parameters': parameters,
			'requesttype': requesttype,
		};
		var gajax      = options.gajax        || 0;  /* 常规模式 */
		var cacheid = Aps.dom.storagehash.hash(JSON.stringify(request)); /* 缓存ID  */

		Aps.cache = (typeof(Aps.cache.list) == 'undefined') ? Aps.cache.init() : Aps.cache.refresh();
		if ( Aps.cache.has(cacheid) && !update && !gajax ) {
			if (typeof callback == 'function') {
				var data = Aps.cache.get(cacheid);
				if (typeof(data.status) !== 'undefined' || data.code == '200') { callback(Aps.cache.get(cacheid), '200'); }
				else { options.update = 1; Aps.cajax.request(options); }
			}
		} else {
			
			if (typeof before == 'function'){ before(); }/* Aps.debugger.add('before not set.')*/

			options.callback = function(data,status){
				Aps.cache.remove(cacheid);
				!gajax && Aps.cache.add(cacheid, data, expire, update, collect);
				if (typeof callback == 'function') { callback(data, status);}
			};
			if(typeof callback =='function'){ options.callback  = function(data,status){ Aps.cache.remove(cacheid);!gajax && Aps.cache.add(cacheid, data, expire, update, collect); callback(data, status); } }else{  Aps.cache.remove(cacheid);!gajax && Aps.cache.add(cacheid, data, expire, update, collect);  }
			if(typeof errorCall=='function'){ options.errorCall = function(status){ errorCall(status); } }
			Aps.cajax.ajax(url,options);
		}
	}
};

Aps.query = { // ! 对于浏览器头的携带信息进行管理  # simply 
	params:null, 
	parse:function(){
		if(this.params){return this.params;}
		var match,pl = /\+/g,search = /([^&=]+)=?([^&]*)/g, decode = function(s) { return decodeURIComponent(s.replace(pl, " ")); }, query = window.location.search.substring(1),urlParams = {};
		while (match = search.exec(query))
		urlParams[decode(match[1])] = decode(match[2]);
		this.params = urlParams;
		return this.params;
	},
	toString:function(){
		if(!this.params){return '';}
		var s = '',i=0;
		for(var k in this.params){ s+= (i==0?'?':'&')+k+'='+this.params[k]; i++; }
		return s;
	},
	/* 设置 */
	set:function(arr,val){
		this.parse();
		if(val){ this.params[arr] = val; } 
		else{ for (var i in arr) { this.params[i] = arr[i]; } }
		history.replaceState({}, CONFIGS.appname||'AppSite', location.origin + location.pathname + this.toString());
	},
	/* 获取数据 */
	get: function(key) {
		this.parse();
		return this.params[key] || null;
	},
	/* 移除 */
	remove: function(arr) {
		this.parse();
		if(typeof arr=='string'){ delete this.params[arr];}
		else{ for (var i in arr) { delete this.params[arr[i]]; }}
		history.replaceState({}, CONFIGS.appname||'AppSite', location.origin + location.pathname + this.toString());
	},
	/* 清空 */
	clear: function() {
		history.replaceState({}, CONFIGS.appname||'AppSite', location.origin + location.pathname);
	},
	/* 当前页地址 */
	currentPage: function() {
		return location.pathname;
	},
	/* 当前页 */
	currentPageName: function(terminal) {
		var terminal = terminal || 'mobile';
		return ((location.origin + location.pathname).replace(CONFIGS.fronthost + terminal + '/', '')).replace('.html', '');
	},
	/* 页面检测 */
	isPage: function(page) {
		return location.pathname == CONFIGS.frontPath + page;
	},
};

/* 交互组件 */

Aps.setting    = Aps.fn({ // ! 设置和属性  

	visited:     Aps.local.get('visited')  || 0 ,
	version:     Aps.local.get('version')  || 0 ,
	device:      Aps.local.get('device')   || 'html5',
	language:    Aps.local.get('language') || (typeof(plus)!='undefined'?(({'zh-Hans-CN':'ZHCN','zh-Hant-CN':'ZHCN'})[plus.os.language]||'EN'):'EN'),
	broswer:     '',
	frontEnv:    /mobile/i.test(location.href) ? 'mobile' : 'web',
	isMobile     :/Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent),
	isWeixin     :/MicroMessenger/i.test(window['navigator']['userAgent'] || window['navigator']['vendor'] || window['opera']),
	visit        :function(){ Aps.setting.setProperty('visited',true);},
	isVisited    :function(){ return Aps.setting.visited; },
	unvisit      :function(){ Aps.setting.visited = 0; Aps.local.remove('visited'); },
	checkVersion :function(){  },
	setUpdated   :function(){
		if( !Aps.local.get('update') || Aps.local.get('update')!==CONFIGS.version ){
			Aps.cache.clear();
			Aps.local.set('update',CONFIGS.version);
		}
	}, 
	setLanguage: function(lang){
		this.setProperty('language',lang);
	},
	checkLocale: function(){

		if(typeof plus != 'undefined'){
			this.setProperty('language',locale[plus.os.language]||'EN');
		}
		return this.language;
	},
	checkVisit:function(successCall,failedCall){
		if (Aps.setting.isVisited()) {
			if (typeof successCall== 'function') {
				successCall();
			}
		}else{
			if (typeof failedCall == 'function') {
				failedCall();
			}
		}
	},
});
Aps.mixer      = { // ! 混合器 目前结构不太理想 后期优化 # core 

	// 混合
	mix:function(module,data){

		data.LANG = Aps.setting.language;

		var pregCondition = /\:\:([^\:\:]+)?\:\:/ig;
		var pregInner     = /\[\[([^\]\]]+)?\]\]/ig;
		var res           = module;
		var ifStruct      = this.getIfStruct(module);
		var notStruct     = this.getNotStruct(module);

		for( var i in ifStruct ){

			var condition = ifStruct[i].match(pregCondition)[0].replace('::','').replace('::','');
			if (condition.indexOf('=')>0){
				var ifCondition = condition.split('=');
				var key = ifCondition[0];
				var val = ifCondition[1];

				if (typeof data[key] == 'undefined' || data[key]!==val) {
					res = res.replace('[if['+ifStruct[i]+']if]','');
				}else{
					res = res.replace('[if[::'+condition+'::','').replace(']if]','');
				}

			}else{

				if (typeof data[condition] == 'undefined' || data[condition]==='' || data[condition]===null || !data[condition] ){
					res = res.replace('[if['+ifStruct[i]+']if]','');
				}else{
					res = res.replace('[if[::'+condition+'::','').replace(']if]','');
				}
			}
		}

		for( var i in notStruct ){

			var condition = notStruct[i].match(pregCondition)[0].replace('::','').replace('::','');

			if (typeof data[condition] !== 'undefined' && data[condition]>0 ) {
				res = res.replace('[not['+notStruct[i]+']not]','');
			}else{
				res = res.replace('[not[::'+condition+'::','').replace(']not]','');
			}
		}

		var struct     = this.getStruct(module);
		var loopStruct = this.getLoopStruct(module);
		var fdata      = this.flatData(data);
		// var ldata      = this.loopData(data);

		for (var i in struct) {

			var mkey = '{{'+struct[i]+'}}';
			res = this.replaceAll(res,mkey,fdata[struct[i]]||fdata[struct[i]]===0?fdata[struct[i]]:'');

		}

		for (var i in loopStruct) { 

			var condition = loopStruct[i].match(pregCondition)[0].replace('::','').replace('::','');
			var keys      = loopStruct[i].match(pregInner);
			var loop      = '';

			if ( typeof data[condition] !== 'undefined' ) {

				for (var j = 0; j < data[condition].length; j++) {

					if (typeof data[condition][j]=='undefined' && data[condition]!==null ){ data[condition][j].idx = j;}
					loop += loopStruct[i].replace('::'+condition+'::','');

					for( var k in keys ) {

						var key = keys[k].replace('[[','').replace(']]','');
						loop =  data[condition][j][key]||data[condition][j][key]==0 ? loop.replace('[['+key+']]',data[condition][j][key]) : loop.replace('[['+key+']]',data[condition][j]);

					}
				}

				res = res.replace('{loop{'+loopStruct[i]+'}loop}',loop||'');

			}else{

				res = res.replace('{loop{::'+condition+'::'+loopStruct[i]+'}loop}','');

			}
		}

		return res;
	},

	// 循环输出
	loop:function(module,data){

		var final = '';

		for (var i in data ) {
			data[i]['loopIdx'] = this.getLoopIdx(i);
			data[i]['idx'] = i;
			final += this.mix(module,data[i]);
		}
		return final;
	},

	getLoopIdx:function(i){
		var i   = parseInt(i);
		var idx = 'loopItem';
			idx += (i+1)%2==0  ? ' loop2th' : '';
			idx += (i+1)%3==0  ? ' loop3th' : '';
			idx += (i+1)%4==0  ? ' loop4th' : '';
			idx += (i+1)%5==0  ? ' loop5th' : '';
			idx += (i+1)%6==0  ? ' loop6th' : '';
			idx += (i+1)%8==0  ? ' loop8th' : '';
			idx += (i+1)%12==0 ? ' loop12th': '';
		return idx;
	},

	getStruct:function(module){

		var preg = /\{\{([^\}\}]+)?\}\}/g;
		var stru = module.match(preg);

		if (stru) {
			for (var i in stru ) {
				stru[i] = stru[i].replace('{{','');
				stru[i] = stru[i].replace('}}','');
			}
		}
		return stru;

	},

	getLoopStruct:function(module){

		var preg = /\{loop\{([^\}\}]+)?\}loop\}/g;
		var stru = module.match(preg);

		if (stru) {
			for (var i in stru ) {
				stru[i] = stru[i].replace('{loop{','');
				stru[i] = stru[i].replace('}loop}','');
			}	    	
		}

		return stru;

	},

	getIfStruct:function(module){

		var preg = /\[if\[[^\]]*\]if\]/g;
		var stru = module.match(preg);

		if (stru) {
			for (var i in stru ) {
				stru[i] = stru[i].replace('[if[','');
				stru[i] = stru[i].replace(']if]','');
			}	    	
		}

		return stru;

	},

	getNotStruct:function(module){

		var preg = /\[not\[[^\]]*\]not\]/g;
		var stru = module.match(preg);

		if (stru) {
			for (var i in stru ) {
				stru[i] = stru[i].replace('[not[','');
				stru[i] = stru[i].replace(']not]','');
			}	    	
		}

		return stru;

	},


	flatData:function(data,prefix){

		var flatData = {};
		var tempData = [];

		for( var k in data ){

			var key = prefix ? prefix+'.'+k : k ;
			var val = data[k];

			if ( typeof data[k] == 'object' ) {

				tempData.push(this.flatData(data[k],key));

			}else{

				flatData[key] = val;
			}
		}

		if (tempData.length>0) {

			for (var i in tempData ) {

				for( var j in tempData[i] ){

					var key = j;
					var val = tempData[i][j];

					flatData[key] = val;

				}
			}
		}

		return flatData;
	},

	replaceAll:function(res,FindText, RepText){

		var preg = "/"+FindText+"/g";
		return res.replace(eval(preg),RepText);

	},

	setChildValue:function(obj,stringStruct,value){

		if (typeof stringStruct!=='string' ){
			return obj;
		}
		if ( stringStruct.indexOf('.')<=0 ){
			obj[stringStruct] = value;
		}

		var arr = stringStruct.split('.');

		if (arr.length>2) {
			obj[arr[0]]=this.setChildValue(obj[arr[0]]||{},stringStruct.replace(arr[0]+'.',''),value);
		}else{
			if (obj[arr[0]]) {
				obj[arr[0]][arr[1]]=value;
			}else{
				obj[arr[0]]={};
				obj[arr[0]][arr[1]]=value;				
			}
		}

		return obj;
	},

	// conver data to struct data
	conver:function(struct,data) {

	}

}
ApsMd.core = { // ! 组件dom模版(核心功能)

	loading:{
		local:"<div class='ApsLocalLoading'><i class='ApsIcon I-load color-primary rotation'></i>"+i18n('LOADING')+"</div>",
		transptant:"<div class='loading transptant'><div class='logo rotation'><i class='ApsIcon I-load color-primary'></i></div></div>",
		global:"<div class='ApsGlobalLoading mask'><div class='logo rotation'><i class='ApsIcon I-load color-primary'></i></div>"+i18n('LOADING')+"</div>",
	},
	notice:{
		point:"<i class='ApsNotice'></i>",
	},
	toast:"<div class='ApsToast'><div class='ApsToast-message shadow'></div></div>",
	propup:"<div class='ApsPropup'><div class='ApsPropupSpace'></div><div class='ApsPropupMain shadow'><i class='ApsPropupClose ApsIcon I-error color-red normalshadow'></i><h4 class='page-media-title'></h4><div class='ApsPropupContent'><div class='row'><p></p></div><div class='pageMain'></div></div></div></div>",
	popup:"<div class='ApsPopup'><div class='view'><div class='title'>{{title}}</div><div class='contents'><p [if[::type=form::class='ApsPopupForm']if]>{{content}}</p></div><div class='buttons'>[if[::type=confirm::<a class='button cancel'>{{cancelText}}</a>]if]<a class='button ok'>{{okText}}</a></div></div></div>",
	menu:"<div class='ApsMenu'><div class='space'></div><div class='main'><h4 class='title'></h4><div class='menus'></div><div class='close'></div></div></div>",
	quickLogin:{
	full:"\
	<div class='ApsLogin'>\
		<div class='prop normalshadow'>\
		<div onclick='Aps.user.quickLoginClose();' class='closeBtn normalshadow'><i class='ApsIcon I-error color-red'></i></div>\
		<div class='ApsSwitch centerLayout'>\
		<div onclick='Aps.switcher.change(this);' class='ApsSwitchs current' tag='instant'>"+i18n('INSTANT')+"</div>\
		<div onclick='Aps.switcher.change(this);' class='ApsSwitchs' tag='regist'>"+i18n('REGIST')+"</div>\
		<div onclick='Aps.switcher.change(this);' class='ApsSwitchs' tag='login'>"+i18n('LOGIN')+"</div>\
		</div>\
		<div class='ApsSwitchMain current fadeInRight animated fast' tag='instant'>\
		<div class='form'>\
		[if[::mobileLogin::\
		<input class='input-text' type='tel' name='mobile' id='ApsMobile' placeholder='"+i18n('MOBILE')+"'>\
		<input class='input-text code' type='tel' name='verifyCode' id='ApsVerifyCode' placeholder='"+i18n('VERIFY_CODE')+"'>\
		<input type='button' onclick='Aps.user.requestMobileCode();' class='button bg-primary requestCode' name='requestCode' id='ApsRequestCode' value='"+i18n('SEND_CODE')+"'>\
		<button class='fullButton bg-primary color-white' onclick='Aps.user.mobileLogin();' >"+i18n('CONTINUE')+"</button>\
		]if]\
		[if[::emailLogin::\
		<input type='tel' class='input-text' name='email' id='ApsEmail' placeholder='Email Address' value=''>\
		<input type='tel' class='input-text code' placeholder='"+i18n('VERIFY_CODE')+"' name='verifycode' id='ApsEmailCode'>\
		<input type='button' onclick='Aps.user.requestEmailCode();' class='button bg-primary requestCode' name='requestCode' id='ApsRequestCode' value='"+i18n('SEND_CODE')+"'>\
		<button class='fullButton bg-primary color-white' onclick='Aps.user.emailLogin();' >"+i18n('CONTINUE')+"</button>\
		]if]\
		[if[::wechatLogin::<button class='fullLineButton color-green line-green' onclick='Aps.user.wechatLogin();' type='button'><i class='ApsIcon I-wechat'></i>"+i18n('LOGIN_WECHAT')+"</button>]if]\
		[if[::facebookLogin::<button class='fullLineButton color-blue line-blue' onclick='Aps.user.facebookLogin();' type='button'><i class='ApsIcon I-facebook'></i>"+i18n('LOGIN_FACEBOOK')+"</button>]if]\
		</div>\
		</div>\
		<div class='ApsSwitchMain fadeInRight animated fast' tag='regist'>\
		<div class='form regist'>\
		<div class='field require valid' fieldtype='input' length=64 fieldname='nickname' checktype='nickname'>\
		<input class='mainfield' type='text' name='nickname' placeholder='"+i18n('NICKNAME')+"'>\
		</div>\
		[if[::CURRENT_LANGUAGE=ZHCN::<div class='field require valid' fieldtype='input' length=32 fieldname='mobile' checktype='mobile'><input class='mainfield' type='text' name='mobile'  placeholder='"+i18n('MOBILE')+"'></div>]if]\
		[if[::CURRENT_LANGUAGE=EN::<div class='field require valid' fieldtype='input' length=64 fieldname='email' checktype='email'><input class='mainfield' type='text' name='email' placeholder='"+i18n('EMAIL_ADDRESS')+"'></div>]if]\
		<div class='field require valid' fieldtype='input' length=32 fieldname='password' checktype='password'>\
		<input class='mainfield' type='password' name='password' placeholder='"+i18n('PASSWORD')+"'>\
		</div>\
		<div class='field require valid' fieldtype='input' length=32 fieldname='confirmPassword' checktype='password'>\
		<input class='mainfield' type='password' name='confirmPassword' placeholder='"+i18n('REPASSWORD')+"'>\
		</div>\
		<button class='fullButton bg-primary color-white' onclick='Aps.user.regist();' type='button'>"+i18n('CONTINUE')+"</button>\
		</div>\
		</div>\
		<div class='ApsSwitchMain fadeInRight animated fast' tag='login'>\
		<div class='form login'>\
		<div class='field require valid' fieldtype='input' length='32' fieldname='account'>\
		<input class='mainfield' type='text' name='account' placeholder='"+i18n('LOGIN_ACCOUNT')+"'>\
		</div>\
		<div class='field require valid' fieldtype='input' length='32' fieldname='password' checktype='password'>\
		<input class='mainfield' type='password' name='password' placeholder='"+i18n('PASSWORD')+"'>\
		</div>\
		<button class='fullButton bg-primary color-white' onclick='Aps.user.passwordLogin();' type='button'>"+i18n('CONTINUE')+"</button>\
		</div>\
		</div>\
		</div>\
	</div>\
	",
	email:"\
	<div class='ApsLogin'>\
		<div class='prop normalshadow'>\
		<div onclick='Aps.user.quickLoginClose();' class='closeBtn normalshadow'><i class='ApsIcon I-error color-red'></i></div>\
		<div class='row'><input type='tel' class='input-text' name='email' id='ApsEmail' placeholder='Email Address' value='></div>\
		<div class='row'>\
		<input type='tel' class='input-text code' placeholder='Verify Code' name='verifycode' id='ApsEmailCode'>\
		<input type='button' onclick='Aps.user.requestEmailCode();' class='button bg-primary requestCode' name='requestCode' id='ApsRequestCode' value='Send Code'>\
		</div>\
		<div class='row'><input type='button' onclick='Aps.user.emailLogin();' class='button bg-primary disabled' name='login' id='ApsLogin' value='Sign In'></div>\
		[if[::wechatLogin::<button class='fullLineButton color-green line-green' onclick='Aps.user.wechatLogin();' type='button'><i class='ApsIcon I-wechat'></i> Sign In with Wechat</button>]if]\
		[if[::facebookLogin::<button class='fullLineButton color-blue line-blue' onclick='Aps.user.facebookLogin();' type='button'><i class='ApsIcon I-facebook'></i> Sign In with Facebook</button>]if]\
		</div>\
	</div>\
	",
	mobile:"\
	<div class='ApsLogin'>\
		<div class='prop normalshadow'>\
			<div onclick='Aps.user.quickLoginClose();' class='closeBtn normalshadow'><i class='ApsIcon I-error color-red'></i></div>\
			<div class='form'>\
				<input class='input-text' type='tel' name='mobile' id='ApsMobile' placeholder='Mobile'>\
				<input class='input-text code' type='tel' name='verifyCode' id='ApsVerifyCode' placeholder='Verify Code'>\
				<input type='button' onclick='Aps.user.requestMobileCode();' class='button bg-primary requestCode' name='requestCode' id='ApsRequestCode' value='Send Code'>\
				<button class='fullButton bg-primary color-white' onclick='Aps.user.mobileLogin();' type='button'>Contuinue</button>\
				[if[::wechatLogin::<button class='fullLineButton color-green line-green' onclick='Aps.user.wechatLogin();' type='button'><i class='ApsIcon I-wechat'></i> Sign In with Wechat</button>]if]\
				[if[::facebookLogin::<button class='fullLineButton color-blue line-blue' onclick='Aps.user.facebookLogin();' type='button'><i class='ApsIcon I-facebook'></i> Sign In with Facebook</button>]if]\
			</div>\
		</div>\
	</div>\
	",
	password:"\
	<div class='login'>\
		<div class='form login'>\
			<div class='field require valid' fieldtype='input' length='32' fieldname='account'>\
				<input class='mainfield' type='text' name='account' placeholder='Account'>\
			</div>\
			<div class='field require valid' fieldtype='input' length='32' fieldname='password' checktype='password'>\
				<input class='mainfield' type='password' name='password' placeholder='Password'>\
			</div>\
			<button class='fullButton bg-primary color-white' onclick='Aps.user.passwordLogin();' type='button'>Contuinue</button>\
			[if[::wechatLogin::<button class='fullLineButton color-green line-green' onclick='Aps.user.wechatLogin();' type='button'><i class='ApsIcon I-wechat'></i> Sign In with Wechat</button>]if]\
			[if[::facebookLogin::<button class='fullLineButton color-blue line-blue' onclick='Aps.user.facebookLogin();' type='button'><i class='ApsIcon I-facebook'></i> Sign In with Facebook</button>]if]\
			</div>\
		</div>\
	</div>\
	",
	},
	page:"[if[:cover:::<div class='pageCover'><img src='{{cover}}!cover'></div>]if]<div class='contents'>{{introduce}}</div>",
	view:"<div class='VIEW' id='{{viewid}}'></div>",

	cityPicker:"\
	<section id='areaLayer' class='express-area-box'>\
	<header><h3>选择地区</h3><a id='backUp' class='back' href='javascript:void(0)' title='返回'></a><a id='closeArea' class='close' href='javascript:void(0)' title='关闭'></a></header>\
	<article id='areaBox'><ul id='areaList' class='area-list'></ul></article>\
	</section>\
	<div id='areaMask' class='mask'></div>\
	",
	security:"\
	<div class=\"ApsPopup\">\
	<div class=\"view security\">\
		<div class=\"securityKey\" onclick=\"SECURITY.press(this);\" key=\"4\"></div>\
		<div class=\"securityKey\" onclick=\"SECURITY.press(this);\" key=\"1\"></div>\
		<div class=\"securityKey\" onclick=\"SECURITY.press(this);\" key=\"9\"></div>\
		<div class=\"securityKey\" onclick=\"SECURITY.press(this);\" key=\"3\"></div>\
		<div class=\"securityKey\" onclick=\"SECURITY.press(this);\" key=\"7\"></div>\
		<div class=\"securityKey\" onclick=\"SECURITY.press(this);\" key=\"6\"></div>\
		<div class=\"securityKey\" onclick=\"SECURITY.press(this);\" key=\"5\"></div>\
		<div class=\"securityKey\" onclick=\"SECURITY.press(this);\" key=\"2\"></div>\
		<div class=\"securityKey\" onclick=\"SECURITY.press(this);\" key=\"8\"></div>\
		\
		<div class=\"progress\"><div class=\"bar bg-primary\"></div></div>\
	</div>\
	</div>\
	",
};

Aps.gui        = { // ! 界面交互  # basic gui 
	icon:{
		info:"<i class='ApsIcon color-blue I-messege'></i> ",
		loading:"<i class='ApsIcon color-blue I-loading rotation'></i> ",
		warning:"<i class='ApsIcon color-orange I-warning'></i> ",
		success:"<i class='ApsIcon color-green I-success'></i> ",
		failed:"<i class='ApsIcon color-red I-error'></i> ",
	},
	animateOn:CONFIGS.animatecss||1,
	toucheEvt:0,

	smoothing:function(vd,options,calls){

		if(vd._vlist){ // vdom list
			for (var i = 0; i < vd.list.length; i++){ Aps.gui.smoothing(vd.list[i],options);} return;
		}

		var getTranslate = function(transformCSS){
			var translate = transformCSS.match(/translate([^\)]+)?/ig)[0].replace("translate(","").split(",");
			return {x:parseInt(translate[0].replace('px','')),y:parseInt(translate[1].replace('px',''))};
		}

		var options = options || {blur:1,lockX:0,lockY:0,backup:1,ending:0};
		var lockX   = options.lockX || 0;
		var lockY   = options.lockY || 0;
		var backup  = options.backup|| 0;
		var ending  = options.ending|| 0;
		var scale   = options.scale || 0;
		var rotate  = options.rotate|| 0;
		var skew    = options.skew  || 0;
		var blur    = options.blur  || 0;

		vd.onTouch('start',function(_vd){
			if(_vd.css('transform')){ 
				var from = getTranslate(_vd.css('transform'));
				_vd.tData.transX = from.x;_vd.tData.transY = from.y;
			}
		});

		vd.onTouch('move',function(_vd){
			var moving = {};
			moving.move={
				"x":(lockX?"0px":((_vd.tData.x-_vd.tData.X_+(_vd.tData.transX||0))+"px")),
				"y":(lockY?"0px":((_vd.tData.y-_vd.tData.Y_+(_vd.tData.transY||0))+"px"))
			};
			if(scale){
				var sc = Math.pow((Math.abs(_vd.tData.x-_vd.tData.X_+(_vd.tData.transX||0))+Math.abs(_vd.tData.y-_vd.tData.Y_+(_vd.tData.transY||0)))/10,1/4)*scale;
				moving.scale={"x":sc,"y":sc};
			}

			_vd.transform(moving);
			if(blur){ _vd.onBlur(((Math.abs(_vd.tData.distanceX)+Math.abs(_vd.tData.distanceY))*blur)/75+"px"); }
		});
		vd.onTouch('right',function(_vd){
			_vd.styles({
				"transition":"all 0.2s ease-out 0ms",
				"filter":"blur(0px)",
				"transform":"translate(0px,0px)",
			});
		});
		vd.onTouch('left',function(_vd){
			ending && _vd.styles({
				"transition":"all 0.2s ease-out 0ms",
				"filter":"blur(0px)",
				"transform":"translate("+ending.x+","+ending.y+")",
			});
		});
		vd.onTouch('end',function(_vd){
			// backup && _vd.styles({
			// 	"transition":"all 0.2s ease-out 0ms",
			// 	"filter":"blur(0px)",
			// 	"transform":"translate(0px,0px)",
			// });
			// ending && _vd.styles({
			// 	"transition":"all 0.2s ease-out 0ms",
			// 	"filter":"blur(0px)",
			// 	"transform":"translate("+ending.x+","+ending.y+")",
			// });
			backup && !ending && setTimeout(function(){
				_vd.styles({
					"transition":"",
					"filter":"",
					"transform":"",
				})
			},300);
			// _vd.onBlur("0px");
		});
	},

	dragging:function(vd){

	},

	localLoad:{
		start   :function(containerOrSelector,append){
			var loading = VD(ApsMd.core.loading.local);
			loading.animate(ApsMd.animate.fadeInDown);
			return append ? vdom( containerOrSelector ||'.app').loading().append(loading) : vdom( containerOrSelector ||'.app').loading().prepend(loading); 
		},
		success :function(containerOrSelector,txt,delay){
			var loading = vdom( containerOrSelector ||'.app').loaded().find('.ApsLocalLoading:not(.removing)').html(Aps.gui.icon.success+ (txt||i18n('LOADING_SUC'))).addClass('removing');
			setTimeout(function(){
				loading.animateCss('pullOutUp fastest',function(){ loading.remove();}); 
			},delay||1000);
		},
		failed   :function(containerOrSelector,txt,delay){
			var loading = vdom( containerOrSelector ||'.app').loaded().find('.ApsLocalLoading:not(.removing)').html(Aps.gui.icon.failed+ (txt ||i18n('LOADING_FAL'))).addClass('removing');
			setTimeout(function(){
				loading.animateCss('fadeOut faster',function(){ loading.remove();}); 
			},delay||2500);
		},
		cancel  :function(containerOrSelector){
			var loading = vdom( containerOrSelector ||'.app').loaded().find('.ApsLocalLoading:not(.removing)').addClass('removing');
			loading.animateCss('pullOutUp fastest',function(){ loading.remove();}); 
		}
	},
	globalLoad:{
		start:function(txt){
			if (VD('html','HTML').isLoad()){ Aps.gui.toast(i18n('LOADING')); return; };
			VD(ApsMd.core.loading.global,'G_LOADING').html(Aps.gui.icon.loading+txt||i18n('LOADING'));
			VD('html','HTML').loading().append(VD.G_LOADING);
		},
		success:function(txt,delay){
			VD('html','HTML').loaded();
			VD.G_LOADING.html(Aps.gui.icon.success+(txt||i18n('SUCCESS')));
			setTimeout(function(){ VD.G_LOADING.fadeOut(); },delay||1500);
		},
		failed:function(txt,delay){
			VD('html','HTML').loaded();
			VD.G_LOADING.html(Aps.gui.icon.failed+(txt||i18n('FAILED')));
			setTimeout(function(){ VD.G_LOADING.fadeOut(); },delay||2500);
		},
		cancel:function(){
			VD('html','HTML').loaded();
			VD.G_LOADING.fadeOut();
		}
	},

	errorFocus:function(el){
		this.animateOn ? vdom(el).animateCss('errorFocus slow') : vdom(el).addClass('errorFocus');
		vdom(el).focus();	
	},
	toast:function(title,status,delay){
		var msg = VD(ApsMd.core.toast);
		vdom('html','HTML').append(msg);
		msg.find( '.ApsToast-message' ).html( Aps.gui.icon[status||'info'] + (title || i18n('ERROR')) );
		// Aps.gui.animateOn ? msg.animateCss('fadeInDown faster') : msg.fadeIn();
		msg.fadeIn();
		setTimeout(function(){
			// Aps.gui.animateOn
			// ? msg.animate('fadeOutUp faster',function(){ msg.remove(); })
			// : msg.fadeOut();
			msg.fadeOut();
		},delay||3000);
	},
	submiting:function(title,status){
		var msg = VD(ApsMd.core.toast);
		vdom('html','HTML').append(msg);
		msg.find( '.ApsToast-message' ).html( Aps.gui.icon[status||'loading'] + (title ||i18n('SUBMITING')) );
		Aps.gui.animateOn ? msg.animateCss('fadeInDown faster') : msg.fadeIn();
	},
	submitProgress:function(title,progress){
		if (!vdom('.ApsToast')) {
			var msg = VD(ApsMd.core.toast);
			vdom('html','HTML').append(msg);
			vdom('.ApsToast').find( '.ApsToast-message' ).html( Aps.gui.icon[status||'loading'] + (title ||'提交中...') );
		}
		if (!vdom('.progress')) {
			vdom('.ApsToast').append("<div class='progress'><div class='progressBar bg-primary'></div></div>");
		}
		vdom('.progress .progressBar').attr('style','width:'+progress+'%;');
	},
	submited:function(title,status,delay){
		vlist( '.ApsToast' ).remove();
		var msg = VD(ApsMd.core.toast);
		vdom('html','HTML').append(msg);
		msg.find( '.ApsToast-message' ).html( Aps.gui.icon[status||'success'] + (title || i18n(status=='success'?'SUBMIT_SUC':'SUBMIT_FAL')) );
		setTimeout(function(){
			// Aps.gui.animateOn
			// ? msg.animateCss('fadeOutUp faster',function(){ msg.remove(); })
			// : msg.remove();
			msg.fadeOut();
		},delay?2500:1500);
	},

	cityPicker:function(){
		var cityPicker = ApsMd.core.cityPicker;
		vdom('body').append(cityPicker);
	},

	popup:function(title,content,type,optionsOrOkCall){

		var options = ( typeof optionsOrOkCall == 'function' ) ? {} : (optionsOrOkCall || {} );

		var _popup  = {};
			_popup.title      = title   || 0;
			_popup.type       = type    || 'alert';
			_popup.okText     = options.okTxt || i18n('OK');
			_popup.cancelText = options.cancelTxt || i18n('CANCEL');

		var _okCall     = options.onOk || ( typeof optionsOrOkCall == 'function' ? optionsOrOkCall : 0 );
		var _cancelCall = options.onCancel || 0;

		var popup  = VD(Aps.mixer.mix(ApsMd.core.popup,_popup));
		vdom('html','HTML').append(popup);

		popup.find('.contents').html(content||'');

		var _view        = popup.find('.view');
		var _okButton    = popup.find('.button.ok');
		var _cancelButton= popup.find('.button.cancel');

		if( Aps.gui.animateOn ){
			_view.animateCss('pulseIn faster');
		}else{
			popup.fadeIn();
		}

		var _close = function(){
			if( Aps.gui.animateOn ){
				_view.animateCss('pulseOut fast');
				popup.fadeOut();
			}else{
				popup.fadeOut();
			}
		}

		var _ok = function(){
			if( !_okCall ){
				_close();
			}else if(_okCall){
				_okCall();_close();
			}
			return ;
		}

		var _cancel = function(){
			( !_cancelCall || _cancelCall() ) && _close(); 
			return ;
		}

		_okButton     && _okButton.click(_ok);		
		_cancelButton && _cancelButton.click(_cancel);

	},

	alert:  function( title,content,options){ this.popup(title,content,'alert',options); },
	confirm:function( title,content,options){ this.popup(title,content,'confirm',options); },
	form:   function( title,content,options){ this.popup(title,content,'form',options);	},

	onBlur:function( selector ){
		var _vd = VD(selector);
		_vd = _vd.hasClass('noBlur m') ? _vd.toggleClass('onBlur').toggleClass('noBlur') : _vd.addClass('onBlur m');
	},
	noBlur:function( selector ){
		var _vd = VD(selector);
		_vd = _vd.removeClass('onBlur').removeClass('noBlur');
	},

	propup:function(title,content){

		var _prop = VD(ApsMd.core.propup);

		VD('html','HTML').append(_prop);

		var _title    = _prop.find( '.ApsPropupMain h4' );
		var _propBg   = _prop.find( '.ApsPropupSpace' );
		var _propMain = _prop.find( '.ApsPropupMain' );
		var _closeBtn = _prop.find( '.ApsPropupClose' );
		var _container= _prop.find( '.ApsPropupMain .ApsPropupContent .row p' );

		_title.html( title );
		_container.html( content );

		if( Aps.gui.animateOn ){
			_prop.show();
			_propBg.fadeIn();
			_propMain.animate(ApsMd.animate.popIn,300);
		}else{
			_prop.fadeIn();
		}
		Aps.gui.onBlur('#VIEW');

		var _close = function(){

			if( Aps.gui.animateOn ){
				_propMain.animate(ApsMd.animate.popOut,300,function(){_prop.remove()});
				_propBg.fadeOut();
			}else{
				_prop.fadeOut();	    	
			}
			Aps.gui.noBlur('#VIEW');
		}
		_propBg.click(_close);		
		_closeBtn.click(_close);
	},

	menu:function(title,menus,cancelTitle,cancelCall){ // menus [{'title','call':function(){}}]

		var _menu = VD(ApsMd.core.menu);

		VD('html','HTML').append(_menu);

		var _title    = _menu.find( 'h4' );
		var _bg   = _menu.find( '.space' );
		var _main = _menu.find( '.main' );
		var _closeBtn = _menu.find( '.close' ).text(cancelTitle||'取消 Cancel');
		var _container= _menu.find( '.menus' );

		_title.html( title );

		_container.html( Aps.mixer.loop("<button>{{title}}</button>",menus) );

		var _menus = _container.finds('button');
		var _close = function(){
			_main.animate(ApsMd.animate.slideOutBottom,300,function(){_menu.remove()});
			_bg.fadeOut();
			typeof cancelCall == 'function' && cancelCall();
		}
		_menus.on(Aps.setting.plus?'tap':'click',function(vd){var idx = vd.index(); typeof menus[idx].call =='function' && menus[vd.index()].call(vd,vd.index());_close();});

		_menu.show();
		_bg.fadeIn().on(Aps.setting.plus?'tap':'click',_close);
		_main.animate(ApsMd.animate.slideInBottom,300);

		_closeBtn.on(Aps.setting.plus?'tap':'click',_close);
	},

	stretch:function(selector,controler){
		var vd = VD(selector);
		var cr = controler ? VD(controler) : vd.parent().find('span');
		vd.toggleClass('closed');
		cr.find('span') && cr.find('span').text(vd.hasClass('closed')?'展开':'收起');
		cr.find('.ApsIcon').toggleClass('I-bottom').toggleClass('I-top');
	}

}
Aps.router     = Aps.fn({ // ! 路由控制  # router 
	params:0,
	mode:'general',
	i18n: CONFIGS.i18n || 0,
	setMode:function(mode){ this.mode = mode; },
	open:function(link,options,callback){
		// wx.navigateTo

		location.href=(i18n&&Aps.router.i18n) ? ( link.indexOf('/')<2 && link.indexOf('./')>=0 ? link.replace('/','/'+Aps.setting.language+'_') : Aps.setting.language+'_'+link ) : link;
	},

	then:function(call,data){
		if( typeof call == 'function' ) call(data);
	},

	init: function( page, params, call ){

		var viewid = 'v_'+(new Date().getTime());

		this.params = params||{};
		this.params.viewid = viewid;
		this.params.LANG = Aps.setting.language;

		this.get(page,function(data){Aps.router.initCall(data).then(call);},params,{gajax:1});
	},

	initCall: function( data ){

		vlist('.targetView') && vlist('.targetView').remove();

		var params = Aps.router.params || {};
		var viewid = params.viewid || 'view';

		VD(Aps.mixer.mix(ApsMd.core.view,params),viewid).addClass('targetView');
		vdom('body').append(vdom[viewid].html(Aps.mixer.mix(data,params)));

		return this;
	},

	switch:function(link,i18n) {  // i18n 
		// wx.switchTab

		location.href = i18n==-1 ? link : (i18n&&Aps.router.i18n) ? ( link.indexOf('/')<2 && link.indexOf('./')>=0 ? link.replace('/','/'+Aps.setting.language+'_') : Aps.setting.language+'_'+link ) : link;

	},

	back: function(step, delay) {

		var step = step || -1;

		setTimeout(function() {
			history.go(step);
		}, delay);

	},

	view: function( page, params, call ){

		var viewid = 'v_'+(new Date().getTime());

		this.params = params||{};
		this.params.viewid = viewid;

		if ( typeof page!='object' && !page.url ) {
			VD(Aps.mixer.mix(ApsMd.core.view,this.params),viewid);
			VD('html','HTML').append(VD[viewid].html(Aps.mixer.mix(page,this.params)));
			VD[viewid].animate(ApsMd.animate.slideInRight,250);
		}else{
			this.get(page.url,{success:function(data){Aps.router.viewCall(data).then(call,data);},error:function(status){Aps.gui.toast('Network Error:'+status);}},params,{expire:0});
		}

	},

	viewCall: function( data ){

		var params = Aps.router.params || {};
		var viewid = params.viewid || 'view';

		var _view  = VD(Aps.mixer.mix(ApsMd.core.view,params),viewid);
		VD('html','HTML').append(_view.html(Aps.mixer.mix(data,params)));
		_view.animate(ApsMd.animate.slideInRight,250);

		return this;
	},

	closeView: function(viewid, before ){

		typeof then == 'function' && before();
		VD[viewid||'view'].animate(ApsMd.animate.slideOutRight,200);
		setTimeout(function(){
			VD[viewid||'view'].remove();
		},200);

	},
	
	newWindow:function( url, params, options, responseCall ){
		// use JS API postMessage

		var options= options || {};
		var width  = options.width||375; //弹出窗口的宽度;
		var height = options.height||667; //弹出窗口的高度;
		var top    = options.top ||( window.screen.availHeight-30-height )/2; //获得窗口的垂直位置;
		var left   = options.left||( window.screen.availWidth-10-width )/2; //获得窗口的水平位置;        
		var origin = options.origin || "*";

		var _window = window.open(url,'_blank',"height="+height+", width="+width+", top="+top+", left="+left+", menubar=no,location=no,resizable=no,scrollbars=yes,status=no");  
	
		var k = 0;
		var _link  = setInterval(function(){
			_window.postMessage('hello',origin);
			if (k>19){ clearInterval(_link);}
			k++;
		},500);

		var _linkDone = function(){

			clearInterval(_link);
			_window.postMessage(params,origin);

		};

		var _response = function(message){

			if(message.data=='ok'){
				clearInterval(_link);
				_linkDone();
			}
			if (typeof responseCall=='function'){
				responseCall(message);
			}
		};

		window.addEventListener('message',_response,origin);

	},

	close: function(delay) {

		setTimeout(function() { Aps.router.back(); }, delay||0);

	},

	reload: function() { // wx.reLaunch

		location.reload();

	},
});

Aps.queue      = { // ? 队列(同步阻塞/异步非阻塞) # queue(B/NB)  默认同步
	/*
		队列主要用于多步关联函数的自动执行处理
		队列间可以共用和修改关联数据 this.params
		非阻塞队列主要用于 事件通知回调,便于模块化开发 防止过度封装代码冗余
	*/
	list:[],
	nlist:{},
	len:0,
	cur:0,
	params:0,
	init:function(list,params,non){
		var self   = this || Aps.queue;
		var non    = non  || 0;
		self.params = params || 0;
		if (typeof list =='string') {
			self.in(list,non);
			self.run();
		}else if(typeof list=='object'){
			for(var k in list){
				self.in(list[k],none);
			}
			self.run();
		}else{
			console.error('Unvalid list');
			console.log("String for single Function, eg: Aps.queue.init('Aps.swip.init');");
			console.log("Object for Functions, eg: Aps.queue.init(['Aps.swip.init','Aps.switcher.init']);");
		}
	},
	in:function(name) {
		this.len++;
		this.list.push(name);
	},
	out:function() {
		this.cur++;
		this.len--;
		this.list.splice(1);
	},
	run:function(){
		if(this.list.length==0) return;
		this.params = this.list[0](this.params) || 0;
	},
	next:function(){

	},
	skip:function(){
		this.out();
	},
	skipTo:function(idx){
		this.stop();
	},
	stop:function(name) {

	},
};

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

/* 基础组件 */
Aps.filters    = { // 请求过滤器
	action:  0,   // 请求动作
	params:  Aps.local.get('filterParams') || {},  // 提交服务器的数据项
	options: Aps.local.get('filterOptions') || {},  // 请求设置项

	selectFilter:function(el){

		var c = VD(el);
		c.siblings().removeClass('current');
		c.addClass('current');
		this.setParams(c.attr('filters'));
		Aps.scrollView.refresh();

	},

	setParams:function(params){

		var params = typeof params=='string' ? this.parse(params) : params; 

		for( var k in params ){

			this.params[k] = params[k];
		}
	},

	setAction:function(action){

		this.action = action || 'activeList';

	},

	removeParams:function(key){

		delete this.params[key];
		// Aps.scrollView.refresh();

	},

	setOptions:function(options){

		var options = typeof options=='string' ? this.parse(options) : options; 

		for( var k in options ){

			this.options[k] = options[k];
		}
	},

	parse:function(params){

		var f  = params.split(',');
		var ff = {};
		for(var i in f){
			var fff = f[i].split(':');
			ff[fff[0]] = /^[0-9]+$/.test(fff[1]) ? parseInt(fff[1]) :fff[1];
		}

		return ff;
	},

	clearParams:function(){

		if (this.params.time) {
			var time = this.params.time;
		}
		this.params = {time:time};

	},

	resetOptions:function(){

		this.options = {};

	}, 
};

Aps.p3d = { // 伪3d dom元素

	fns:{

		move:function(x,y,z,t,c){
		
			// var x = typeof x =='number' ?  : null;
			// var y = typeof y =='number' ?  : null;
			// var z = typeof z =='number' ?  : null;
			var t = t || 500;
			var c = c || 'ease-out';

			var ts = "transform "+t+"ms "+c;

			typeof x =='number' && ( this.p_transform.translateX = x+"px" );
			typeof y =='number' && ( this.p_transform.translateY = y+"px" );
			typeof z =='number' && ( this.p_transform.translateZ = z+"px" );

			this.css('transition',ts);
			this.css('transform',this.stringify3d());

			return this;
		},

		rotate:function(x,y,z,t,c){
		
			// var x = x || 0;
			// var y = y || 0;
			// var z = z || 0;
			var t = t || 500;
			var c = c || 'ease-out';

			var ts = "transform "+t+"ms "+c;

			typeof x =='number' && ( this.p_transform.rotateX = x+"deg" );
			typeof y =='number' && ( this.p_transform.rotateY = y+"deg" );
			typeof z =='number' && ( this.p_transform.rotateZ = z+"deg" );

			this.css('transition',ts);
			this.css('transform',this.stringify3d());

			return this;
		},

		scale:function(x,y,z,t,c){

			var t = t || 500;
			var c = c || 'ease-out';

			var ts = "transform "+t+"ms "+c;

			typeof x =='number' && ( this.p_transform.scaleX = x );
			typeof y =='number' && ( this.p_transform.scaleY = y );
			typeof z =='number' && ( this.p_transform.scaleZ = z );

			this.css('transition',ts);
			this.css('transform',this.stringify3d());

			return this;
		},

		transform:function(translate,rotate,scale,t,c){

			var t = t || 500;
			var c = c || 'ease-out';

			var ts = "transform "+t+"ms "+c;

			translate && typeof translate.x =='number' && ( this.p_transform.translateX = translate.x+"px" );
			translate && typeof translate.y =='number' && ( this.p_transform.translateY = translate.y+"px" );
			translate && typeof translate.z =='number' && ( this.p_transform.translateZ = translate.z+"px" );
			rotate    && typeof rotate.x    =='number' && ( this.p_transform.rotateX    = rotate.x+"deg" );
			rotate    && typeof rotate.y    =='number' && ( this.p_transform.rotateY    = rotate.y+"deg" );
			rotate    && typeof rotate.z    =='number' && ( this.p_transform.rotateZ    = rotate.z+"deg" );
			scale     && typeof scale.x     =='number' && ( this.p_transform.scaleX     = scale.x );
			scale     && typeof scale.y     =='number' && ( this.p_transform.scaleY     = scale.y );
			scale     && typeof scale.z     =='number' && ( this.p_transform.scaleZ     = scale.z );

			this.css('transition',ts);
			this.css('transform',this.stringify3d());

			return this;

		},

		parse3d:function(){
			var _t = this.css('transform') ? this.css('transform').split(' ') :null;
			if(!_t) return;
			var _trans = {};
			for(var i in _t){
				let tmp = _t[i].split('(');
				_trans[tmp[0]] = tmp[1].replace(')','');
			}
			// this.p3d || (this.p3d={});
			this.p_transform = _trans;
		},

		stringify3d:function(){

			var transform = "";
			for( var k in this.p_transform){

				transform += k+"("+this.p_transform[k]+") ";

			}
			return transform;
		},

	},

	bind:function(vd){

		for(var k in this.fns){
			vd[k] = Aps.p3d.fns[k];
		}

	},

	new:function(x,y,z,r,g,b,a){

		var x = x || 400;
		var y = y || 244;
		var z = z || 300;
		var r = r || 100;
		var g = g || 220;
		var b = b || 220;
		var a = a || 1;

		var p3d = VD('<div class="p3d" style="width: '+x+'px;height: '+y+'px; transform: rotateX(-120deg) rotateY(0deg) rotateZ(45deg);"></div>');

		this.bind(p3d);

		var sides = {};

			sides.ft = "position:absolute;background:rgba("+(r-50)+","+(g-50)+","+(b-50)+","+a+");width: "+x+"px;height: "+y+"px;"+
						"transform: translateX(0px) translateZ("+(z/2)+"px);";
			sides.f1 = "position:absolute;background:rgba("+(r-10)+","+(g-10)+","+(b-10)+","+a+");width: "+y+"px;height: "+z+"px;"+
						"transform: rotateZ(-90deg) rotateX(90deg) translateX("+((z-y)/2)+"px) translateZ("+(y/2)+"px);";
			sides.f2 = "position:absolute;background:rgba("+(r-20)+","+(g-20)+","+(b-20)+","+a+");width: "+x+"px;height: "+z+"px;"+
						"transform: rotateZ(0deg)   rotateX(90deg) translateX(0px) translateZ("+(z/2)+"px);";
			sides.f3 = "position:absolute;background:rgba("+(r-30)+","+(g-30)+","+(b-30)+","+a+");width: "+x+"px;height: "+z+"px;"+
						"transform: rotateZ(180deg) rotateX(90deg) translateX(0px) translateZ("+(y-(z/2))+"px);";
			sides.f4 = "position:absolute;background:rgba("+(r-40)+","+(g-40)+","+(b-40)+","+a+");width: "+y+"px;height: "+z+"px;"+
						"transform: rotateZ(90deg) rotateX(90deg) translateX(-"+((z-y)/2)+"px) translateZ("+(x-(y/2))+"px);";
			sides.fb = "position:absolute;background:rgba("+(r-0 )+","+(g-0 )+","+(b-0 )+","+a+");width: "+x+"px; height: "+y+"px;"+
						"transform: rotateX(180deg) translateZ( "+(z/2)+"px );";

		for(var side in sides ){

			var layer = document.createElement('div');
			layer.style = sides[side];
			p3d.el.appendChild(layer);

		}

		p3d.parse3d();
		return p3d;
	},

};

Aps.canvas  = Aps.fn({ // CANVAS 绘制

	new:function(w,h,type){

		var _vd = VD('<canvas>This is a canvas Dom. Check your broswer Version.</canvas>');
		_vd.canvas = _vd.el.getContext(type||'2d');
		_vd.property('width' , w);
		_vd.property('height' ,h);

		return _vd;

	},

});


Aps.switcher   = Aps.fn({ // 列表切换  # switcher 

	size:CONFIGS.listSize || 6,
	originTop:0,

	init:function(selector,scroller,stationay){

		var selector   = selector  || '.ApsSwitch';
		var scroller   = scroller  || 'window';
		var stationay  = stationay || 0;
		var _switcher  = VD(selector); if (!_switcher) return;
		var _container = _switcher.find('.container'); if (!_container) return;

		_switcher.offsetTop = _switcher.parent().property('offsetTop');
		_switcher.originTop = _switcher.property('offsetTop');
		_switcher.wrapperH  = _switcher.find('.wrapper').property('clientHeight');

		_switcher.finds('.switchs').on(Aps.setting.plus?'tap':'click',function(vd){
			Aps.switcher.change(_switcher,vd);
		});

		if (_switcher.find('.dropButton')) {
			_switcher.find('.dropButton').on(Aps.setting.plus?'tap':'click',function(vd){
				vd.parent().addClass('dropDown');
				vd.parent().css('scrollX',0);
			});
		}

		if( !_switcher.find('.switchs.current') ) _switcher.find('.switchs').addClass('current');
		if( !_switcher.find('.mains.current') ) _switcher.find('.mains').addClass('current');

		if(!stationay){

			var _scroller = VD(scroller);

			_scroller.on('scroll',function() { // 滑屏贴顶
				var top = _scroller.property('scrollY')||_scroller.property('scrollTop')||0;
				// console.log('scrolling',top,_switcher.originTop);
				if (top>=_switcher.originTop+1) {
				// console.log(_switcher,top);
					_switcher.addClass('float').find('.wrapper').css('top',_switcher.offsetTop+'px');
					_container.css('margin-top',_switcher.wrapperH+'px');
					// _switchMain.addClass('float');
				}else{
					_switcher.removeClass('float').css('top',"0px");
					_container.css('margin-top','0');
					// _switchMain.removeClass('float');
				}
			});
			// console.log(_scroller);
		}

	},

	change:function(switcher,vd){

		var tag = vd.attr('tag');
		var idx = vd.index();

		switcher.removeClass('dropDown');
		switcher.currentTag = tag;

		Aps.switcher.swipeTo(switcher,idx);

		switcher.finds('.switchs').each(function(_vd){
			if (tag && _vd.attr('tag')===tag) {
				_vd.addClass('current');
			}else{
				_vd.removeClass('current');
			}
		});

		switcher.finds('.mains').each(function(_vd){

			if (_vd.attr('tag')==switcher.currentTag) {
				_vd.addClass('current');
				if(_vd.hasClass('inited')) return;
				
				var tag     = _vd.attr('tag')    || 0;
				var target  = _vd.attr('target') || 0;
				var call    = _vd.attr('call')   || 0;
				var append  = _vd.attr('append') || 0;
				var inited  = _vd.attr('inited') || 0;
				var page    = parseInt(_vd.attr('page')) || 1;
				var size    = parseInt(_vd.attr('size')) || 10;

				var filters = _vd.attr('filters')|| 0;
				var options = _vd.attr('options')|| 0;
				Aps.filters.clearParams();
				Aps.filters.setParams({page:page,size:size});

				if (filters) { Aps.filters.setParams(filters); }
				if (options) { Aps.filters.setOptions(options); }

				if ( call && !inited ) {
					_vd.attr('inited',1);
					Aps.switcher.post(target,Aps.contents[call],Aps.filters.params,Aps.filters.options);
				}
			}else{
				_vd.removeClass('current');
			}

		});

	}, 

	swipeTo:function(_switcher,idx){

		// var _switcher = current.parent().parent();
		var _list     = _switcher.finds('.switchs');
		var current   = _list.list[idx];
		// console.log(_switcher,_list);
		
		if (idx>2) {
			_switcher.css('scrollLeft',current.property('offsetLeft')-_list[2].property('offsetLeft'));	
		}else{
			_switcher.css('scrollLeft',0);
		}

	},

	refreshTags:function(selector){

		var _con = VD(selector);
		if (!_con) return;
		var wrapper = VD(selector+' .ApsSwitchWapper');
		var target  = wrapper.attr('target');
		var filters = wrapper.attr('filters') || 0;

		this.post(target,this.refreshTagsCall,filters?this.setParams(Aps.filters.parse(filters)):null);
	},

	refreshTagsCall:function(data){

		if(!data) return;
		VD('.ApsSwitchMain').remove();
		VD('.ApsSwitchWapper').html(Aps.switcher.generateTags(Aps.cajax.getData(data)));
		VD('.content.container').append(Aps.switcher.generateSwithMain(Aps.cajax.getData(data)));

		Aps.switcher.setTagDict(Aps.cajax.getData(data));

		Aps.scrollView.init();
	},

	setTagDict:function(list){

		var dict = {};

		for( var k in list ){ dict[list[k].id] = list[k].name;	}

		Aps.local.set('tagDict',dict);
	},

	generateTags:function(list){

		var tags = '';

		for( var k in list ){ tags += "<div onclick=\"Aps.switcher.change(this);\" tag=\"tag"+list[k].id+"\" class=\"ApsSwitchs "+(k>0?'':'current')+"\">"+list[k].name+"</div>" ; }

		return tags;
	},

	generateSwithMain:function(list){

		var wrapper = VD('.ApsSwitchWapper');
		var api     = wrapper.attr('api');
		var call    = wrapper.attr('call');
		var append  = wrapper.attr('append');
		var filters = wrapper.attr('filters') || 0;

		var switchMains = '';

		for( var k in list ){

			switchMains 
			+= "<div tag=\"tag"
			+  list[k].id+"\" class=\"ApsSwitchMain ApsScrollView "+(k>0?'':'current')+"\" "
			+  "target=\""+api+"\" "
			+  "size=\""+Aps.switcher.size+"\" "
			+  "call=\""+call+"\" "
			+  "append=\""+append+"\" "
			+  "filters=\""+(filters ? filters+",":"")+"type:"+list[k].id+"\""
			+  ">"
			+  ApsMd.core.loading.local
			+  "</div>" ;

		}

		return switchMains;
	},

});

Aps.scrollView = Aps.fn({ // 滚动视图  # scrollView 

	last:0,
	loading:0,

	isLoading:function(id){
		return id?!!Aps.scrollView['loading_'+id]:!!Aps.scrollView.loading;
	},

	startLoading:function(id){
		Aps.scrollView[id?'loading_'+id:'loading']=1;
	},

	endLoading:function(id){
		Aps.scrollView[id?'loading_'+id:'loading']=0;
	},

	refresh:function(selector,update,silence){
		// 存在滚动列表时 添加滚动事件

		var selector = selector || '.ApsScrollView';
		if(!VD(selector)) return;

		var update   = update   || 0;
		var silence  = silence  || 0;
		var list     = VD(selector+'.current');

		list.removeAttr('inited');

		var tag     = list.attr('tag')    || 0;
		var target  = list.attr('target') || 0;
		var call    = list.attr('call')   || 0;
		var append  = list.attr('append') || 0;
		var inited  = list.attr('inited') || 0;
		var page    = 1;
		var size    = parseInt(list.attr('size')) || 10;
		var max     = parseInt(list.attr('max'))  || 10;

		var filters = list.attr('filters') || 0;
		var options = list.attr('options') || 0;
		Aps.filters.setParams({page:page,size:size});

		if (filters) { Aps.filters.setParams(filters); }
		if (options) { Aps.filters.setOptions(options); if(update){ Aps.filters.options.update=1; }   }

		Aps.gui.localLoad.start(selector,1);
		Aps.scrollView.startLoading();
		Aps.scrollView.post(target,silence?null:Aps.contents[call],Aps.filters.params,Aps.filters.options);

	},

	init:function(selector){

		Aps.scrollView.refresh(selector);

		var selector = selector || '.ApsScrollView';
		if(!VD(selector)) return;

		var list = VD(selector+'.current') || VD(selector);
		var doc  = document.documentElement;

		var windowHeight = window.innerHeight;

		window.onscroll = null;
		window.onscroll = function(){

			var scrollTop = window.scrollY;

			if( Aps.scrollView.isLoading() || scrollTop<Aps.scrollView.last || list.hasClass('loaded')){ 
				Aps.scrollView.last = scrollTop;
				return;
			};

			if(scrollTop+windowHeight+10 >= document.documentElement.scrollHeight && scrollTop > 50){
				Aps.scrollView.startLoading(selector);
				Aps.scrollView.next(selector);
			}
		};
	},
	next:function(selector){

		var selector = selector || '.ApsScrollView';
		if(!VD(selector)) return;
		var list = VD(selector+'.current') || VD(selector);

		var tag     = list.attr('tag')    || 0;
		var target  = list.attr('target') || 0;
		var call    = list.attr('call')   || 0;
		var append  = list.attr('append') || 0;
		var inited  = list.attr('inited') || 0;
		var filters = list.attr('filters')|| 0;
		var options = list.attr('options')|| 0;
		var page    = parseInt(list.attr('page')) || 1;
		var size    = parseInt(list.attr('size')) || 10;
		var max     = parseInt(list.attr('max'))  || 10;

		Aps.filters.setParams({page:page+1,size:size});

		if (filters) { Aps.filters.setParams(filters); }
		if (options) { Aps.filters.setOptions(options); }

		if(page<max){

			Aps.gui.localLoad.start(selector,1);
			Aps.scrollView.post(target,Aps.contents[append],Aps.filters.params,Aps.filters.options);

		}else{
			list.addClass('loaded');
			Aps.gui.toast(i18n('LOADED_ALL'));
			// Aps.gui.localLoad.success(selector);
		}

	},

});
Aps.checker    = { // 检查器   # core 

	checkUser : function(){
		//获取用户登陆信息
		if(Aps.query.get('userid') && Aps.query.get('token') && Aps.query.get('expire')){

			Aps.user.setProperty('userid'      , Aps.query.get('userid') );
			Aps.user.setProperty('token'       , Aps.query.get('token')  );
			Aps.user.setProperty('tokenexpire' , Aps.query.get('expire') );

			Aps.user.init();

			Aps.query.remove(['userid','token','expire']);

			Aps.router.open(location.origin+location.pathname+Aps.query.toString(),'new');

		};
	},

	checkOpenId : function(){
		//获取微信openid
		if(Aps.query.get('wxOpenid')){
			Aps.user.setProperty('openid',Aps.query.get('wxOpenid'));
			Aps.user.init();
			Aps.query.remove(['wxOpenid']);
		};
	},

	checkPromoter : function(){
		//获取推广人信息  
		if(Aps.query.get('promoterid') && Aps.query.get('promoteduration') ){

			Aps.promotion.setProperty('promoterid',Aps.query.get('promoterid')); // 个人推广
			// Aps.promotion.setProperty('promotertype',Aps.query.get('promotertype')); // 渠道商推广
			Aps.promotion.setProperty('promoteexpire',parseInt((new Date()).getTime()/1000)+parseInt(Aps.query.get('promoteduration')));
			Aps.promotion.init();

			Aps.query.remove(['promoterid','promoteduration']);
		};
	},

	checkBroswer : function(){

		var ua = window['navigator']['userAgent'] || window['navigator']['vendor'] || window['opera'];
		var broswer = 'html5';

		// Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile broswers
		if( /iPhone|iPod|iPad/.test(ua) ) broswer = 'ios';
		// if( /Android/.test(ua) )          broswer = 'android';
		if( /MicroMessenger/i.test(ua) )  broswer = 'wx';
		if( /Silk|BlackBerry|Opera Mini|IEMobile/.test(ua) ) broswer = 'other';

		// Checks for ie
		if( !!navigator.userAgent.match(/MSIE/i) || !!navigator.userAgent.match(/Trident.*rv:11\./) )  broswer = 'ie';

		Aps.setting.broswer = broswer;
		VD('body').addClass(broswer);

	},

	checkDevice:function(){

		if (Aps.setting.isMobile ) {
			if(Aps.setting.frontEnv == 'web' && window.outerWidth<720 ) location.href = location.href.replace('/web/','/mobile/') ;
		}else{
			if (Aps.setting.frontEnv== 'web' && window.outerWidth<640) {
				location.href = location.href.replace('/web/','/mobile/') ;
			}
			// if(Aps.setting.frontEnv == 'mobile') location.href = location.href.replace('/mobile/','/web/');
		}
		
	},

	checkHeaderUserCenter:function(){

		if (!Aps.user.islogin()) return;
		var userArea = document.querySelector('.userCenter');
		if(!userArea) return;

		userArea.innerHTML= "<div onclick=\"Aps.router.switch('personal.html');\" class=\"white smallButtons bg-primary\">个人中心</div><div onclick=\"Aps.user.logout();\" class=\"white smallButtons bg-lightgray\">退出登录</div>";

	},

	checkHeaderNav:function(){
		
		if (document.querySelector('.headerNav')!==null) {

			var currentPage = Aps.query.currentPageName('web');

			document.querySelectorAll('.headerNav .content li').forEach(function(li){

				if (li.getAttribute('page')==currentPage) {li.classList.add('focus');}

			});
		}
	},

	checkBarTab:function(){
		
		if (VD('.bar')) {

			var currentPage = Aps.query.currentPageName('web');

			VL('.bar ul li').each(function(vd){

				if (vd.attr('page')==currentPage) {
					vd.addClass('current');
				}
			});
		}
	},

	checkPcUser:function(){

		if (!Aps.local.get('personalInfo')) return;

		var user = Aps.local.get('personalInfo');

		VD('.bar .avatar img').attr('src',user.head);
		VD('.bar h5').text(user.nickname);


	},

	checkTabbar:function() {
		
		if (VD('.tabBar')) {

			var currentPage = Aps.query.currentPageName('mobile');

			VL('.tabBar a li').each(function(vd){

				if (vd.attr('page')==currentPage) {

					var icon = vd.find('img');
					vd.addClass('current');
					icon.attr('src',icon.attr('src').replace('.png','Focus.png'));

				}
			});
		}
	} };
Aps.counter    = { // 计数器   # counter 

	plusBtn:0,
	negatBtn:0,
	input:0,
	max:1,
	min:1,
	current:1,

	init:function() {
		this.input    = VD('#ApsCounterInput');
		this.plusBtn  = VD('#ApsCounterPlus');
		this.negatBtn = VD('#ApsCounterNegative');
		this.current  = parseInt(this.input.val()) || 1;
		this.max      = parseInt(this.input.attr('max')) || 1 ;
		this.min      = parseInt(this.input.attr('min')) || 1 ;
		this.check();
	},

	plus:function() {

		if (this.current>=this.max) return;
		this.current += 1;
		this.input.val(this.current);
		this.check();
	},

	negative:function() {

		if (this.current<=this.min) return;
		this.current -= 1;
		this.input.val(this.current);
		this.check();
	},

	check:function() {

		if (this.current>this.min) {
			this.negatBtn.removeClass('disabled');
		}else{
			this.negatBtn.addClass('disabled');
		}
		if (this.current<this.max) {
			this.plusBtn.removeClass('disabled');
		}else{
			this.plusBtn.addClass('disabled');
		}
		
	},

	countdown:function(id,count){ // 进行倒计时

		var txt = VD('#'+id).value();

		VD('#'+id).addClass('waited').attr('disabled','disabled');
		var i = count;
		var timer = setInterval(function(){
			if(i== 0){
				clearInterval(timer);
				vd('#'+id).removeClass('waited').removeAttr('disabled').value(txt);

			}else{
				vd('#'+id).value(i);
				--i;
			}
		},1000);

	}, 
};
Aps.converter  = { // 转换器   # conver status code to description 

	lang:CONFIGS.lang||'ZHCN',
	setLang      :function( lang ){ this.lang=lang; },
	translate:function( code ){
		return ApsMd.locate[this.lang][code];
	},
	exchange:function( cate,code ){
		return ApsMd.dict[cate][code];
	} 
};

Aps.record     = Aps.fn({ // ? 统计 

	click  :function(type,id){ this.submit(type,id,'click'); },
	play   :function(type,id){ this.submit(type,id,'play'); },
	view   :function(type,id){ this.submit(type,id,'view'); },
	display:function(type,id){ this.submit(type,id,'display'); },

	submit:function(itemtype,itemid,action,callback){

		this.resetOptions();
		this.setAction(action||'click');
		this.setParams({
			itemtype:itemtype,
			itemid:itemid,
			userid:Aps.user.userid||'guest'
		});

		if (callback){ this.setCallback(callback); }

		Aps.cajax.request(this.options);

	},

});

Aps.former     = Aps.fn({ // ? 表单 

	form:{  },

	generateForm   :function(obj){ // 创建表单
		var formid = obj.name||'unNameForm';
		Aps.dom.create('div',formid,['setting','form']);
		for ( var k in obj ){ if (k !== 'name'){ vdom[formid].append(Aps.former.generateField(obj[k])); }}
		return vdom[formid]; 
	},
	
	/*
		表单数据范例Demo
		{
			! name:'demo',
			! valid:1,
			! require:1,
			! length:255,
			! fieldtype:'select', 'input' , 'radio' ...
			? label:'Select Questions:',
			? inputtype:'tel',
			? checktype:'mobile', 'phone' , 'email' , 'idnumber' ...
			? hide:0,
			? formname:'from',
			? notice:'Please read this notice',
			? onclick:'',
			? placeholder:'',
			? options:[{value:}],
			? value:1
		}

	 */

	generateField  :function(opt){        // 生成表单项 

		var require       = opt.require ? 'require' : '' ;      // ! 必填      # is required     
		var valid         = opt.valid   ? 'valid' : 'invalid' ; // ! 有效      # is valid  field
		var length   	  = opt.length        || 255 ;          // ! 限制字长   # max length      
		var fieldname     = opt.name          || 0 ;            // ! 字段名称   # field title
		var fieldtype     = opt.fieldtype     || 0 ;            // ! 字段类型   # fieldtype 
		var inputtype     = opt.inputtype     || '';            // ? 字段类型   #       
		var checktype     = opt.checktype     || '';            // ? 检查类型   #  
		var hide          = opt.hide          || 0 ;            // ? 隐藏      # is hidden field
		var label         = opt.label         || 0 ;            // ? 提示标签   # label
		var formname      = opt.formname      || '';            // ? 表名称     #  
		var notice        = opt.notice        || '';            // ? 字段提示   # notice       
		var onclick       = opt.onclick       || '';            // ? 点击事件   # onclick event
		var placeholder   = opt.placeholder   || '';            // ? 字段内提示 # 
		var options       = opt.options || [];                  // ? 选项列表   # select opt list      
		var value         = opt.value   || opt.default || '';   // ? 字段值    # value or default 

		var fieldid  = 'f_'+fieldname;

		Aps.dom.create('div',fieldid,[require,valid,'field'],{
				fieldtype:fieldtype,
				fieldname:fieldname,
				checktype:checktype,
				length:length,
				form:formname,
				style:hide?'display:none;':'',
			}
		);

		if (label) {
			vdom[fieldid].append(
				Aps.dom.create('label','l_'+fieldname,'',{for:'m_'+formname+fieldname}).html(label)
			);
		}

		switch (fieldtype){
			case 'text':
			vdom[fieldid].append(
				Aps.dom.create('span','m_'+formname+fieldname,['mainfield',fieldname])
			);
			case 'input':
			case 'button':
			case 'textarea':
			case 'select':
			vdom[fieldid].append(
				Aps.dom.create(fieldtype,'m_'+formname+fieldname,['mainfield',fieldname],{
					placeholder:placeholder,
					value:value,
					type:inputtype,
				})
			);
			break;

			case 'radio':
			var checked     = Object.keys(options).length ==1 ? 'checked' : '';
			case 'checkbox':
			for (var key in options){

				vdom[fieldid].append(
					Aps.dom.create('label','l_'+formname+fieldname+key,fieldtype+'label',{
						for:'o_'+formname+fieldname+key
					}).append(
						Aps.dom.create('input','o_'+formname+fieldname+key,fieldtype+'input',{
							type:fieldtype,
							name:fieldname,
							value:key,
							checked:checked
						})
					).append(
						options[key].label
					)
				);
			}
			break;
		}

		switch(fieldtype){
			case 'textarea':
			case 'text':
			vdom['m_'+formname+fieldname].html(value);
			break;
			case 'select':
			vdom['m_'+formname+fieldname].append(
				Aps.dom.create('option','o_default','',{
					disabled:'disabled',
					selected:'selected',
				})
			);
			for (var key in options){
				var selected = value && value==key ? 'selected' : '';
				vdom['m_'+formname+fieldname].append(
					Aps.dom.create('option','o_'+formname+fieldname+key,fieldtype+'option',{
							name:fieldname,
							value:key,
							selected:selected
						}).append(
						options[key].label
					)
				);
			}
			break;
		}

		if (notice) {
			vdom[fieldid].append(Aps.former.generateNotice(notice));
		}

		return vdom[fieldid];
	},
	generateNotice :function(notice){         // 生成提示 

		var type = notice.type;

		return type=='propup' ? "<span class='important' onclick="+'"'+"Aps.gui.propup('"+notice.title+"','"+notice.content+"')"+'"'+">"+notice.label+"</span>" : "<p>"+notice.content+"</p>"; 
	},

	checkForm      :function(list,passRequire){           // 检查表单 

		var isVlist = list._vlist || 0;
		var list = isVlist ? list.list : list || 0;
		if(!list) throw TypeError(list);

		var len  = list.length;
		var ok   = 0;

		for (var i = 0; i < list.length; i++) {
			if(this.checkField(list[i],passRequire||0)){
				ok++;
			}else{
				break;
			}
		}

		return ok==len ? this.form : 0;

	},
	checkField     :function(field,passRequire){          // 检查字段 
		
		// console.log(field);
		var passRequire  = passRequire || 0;
		var require      = field.hasClass('require') && field.hasClass('valid');
		var type         = field.attr('fieldtype');
		var	name         = field.attr('fieldname');
		var	formname     = field.attr('form');
		var checktype    = field.attr('checktype') || 0;
		var label        = field.find('label');
		var length       = parseInt(field.attr('length'));
		var placeholder  = field.find('.mainfield').attr('placeholder') ;

		var valid        = field.hasClass('valid') ? true : false;

		switch (type){
			case 'input':
			case 'select':
			var value = field.find('.mainfield').value();
			break;
			case 'radio':
			var value = field.find('input:checked')?field.find('input:checked').value():'';
			break;
			case 'checkbox':
				if(field.finds('input:checked')){
					var v = [];
					field.finds('input:checked').each(function(target){
						v.push(target.value());
					});
					value = v;
					// value = JSON.stringify(v);
				}else{
					value = '';
				}
			break;
			case 'text':
			var value = field.find('span').text();
			break;
			case 'textarea':
			var value = field.find('textarea').el.value;
			break;
			case 'summernote':
			var value = field.find('.note-editable.panel-body').html();
			break;

			case 'number':
			var value = parseFloat(field.find('.mainfield').value());
			break;
		}

		// if (typeof(value)!=='string') {
		// 	var value = '';
		// }

		if (!passRequire && require && (!value || value == '' || value== ' ')) {

			Aps.gui.alert(
				i18n('WRONG_INPUT'),
				i18n('FIELD_REQUIRE',{txt:(label?label.text():placeholder)}),
				{onOk:function(){ field.find('.mainfield').focus();}}
			);
			return false;

		}else{

			if (!valid) {
				// this.form[name]=value;
				return true;	
			}

			if (length<value.length) {	

				Aps.gui.alert(i18n('WRONG_INPUT'),i18n('WRONG_LENGTH',{txt:(label.text()||placeholder),length:length}));
				field.find(type).focus();

				return false;
			}

			if(this.checkType(value,checktype,field.find(type))){
				if (value) {
					if (name.indexOf('.')>0) {
						this.form = Aps.mixer.setChildValue(this.form,name,value);
					}else{
						this.form[name] = value;
					}
				}
				return value ? value : true;
			
			}

		} },
	checkType      :function(value,type,el){  // 输入类型 验证
		return type ? Aps.former['check_'+type](value,el):1;
	},
	check_mobile    :function(value,el){       // 手机号 验证 
		var  mobilePreg = /^1[3|4|5|6|7|8][0-9]\d{8}$/i;
		if (value == "" || !mobilePreg.test(value)){
			Aps.gui.alert(i18n('WRONG_MOBILE'),i18n('WRONG_MOBILE_MSG'),{
				onOk:function(v){
					VD(el).animateCss('errorFocus slow').focus();
				}
			});
			return false;    
		}else{
			return true;
		} },
	check_code      :function(value,el){       // 验证码 验证 

		var codePreg = /^\d{4,}$/;
		if ( value == "" || !codePreg.test(value)){
			Aps.gui.alert(i18n('WRONG_VCODE'),i18n('WRONG_VCODE_MSG'),{
				onOk:function(v){
					VD(el).focus();
				}
			});
			return false;    
		}else{
			return true;
		} },
	check_password  :function(value,el){       // 验证码 验证 

		if ( value == "" || value.length<6){
			Aps.gui.alert(i18n('WRONG_PASS'),i18n('WRONG_PASS_MSG'),{
				onOk:function(v){
					VD(el).focus();
				}
			});
			return false;    
		}else{
			return true;
		} },	
	check_idNumber  :function(value,el){       // 身份证 验证 

		var idPreg = /^\d{15}(\d{2}[A-Za-z0-9])?$/;

		if ( value == "" || !idPreg.test(value) ){
			Aps.gui.alert(i18n('WRONG_IDNUMBER'),i18n('WRONG_IDNUMBER_MSG'),{
				onOk:function(v){
					VD(el).focus();
				}
			});
			return false;    
		}else{
			return true;
		} },
	check_email     :function(value,el){       // 邮箱 验证 

		var mailPreg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

		if ( value == "" || !mailPreg.test(value) ){
			Aps.gui.alert(i18n('WRONG_EMAIL'),i18n('WRONG_EMAIL_MSG'),{
				onOk:function(v){
					VD(el).focus();
				}
			});
			return false;    
		}else{
			return true;
		}	},
	check_nickname:function(value,el){       // 普通名称 验证 

		var preg = /^[\u8e00-\u9fa5A-Za-z0-9-_]*$/;

		if ( value == "" || !preg.test(value) ){
			Aps.gui.alert(i18n('WRONG_NICKNAME'),i18n('WRONG_NICKNAME_MSG'),{
				onOk:function(v){
					VD(el).focus();
				}
			});
			return false;    
		}else{
			return true;
		} },

	confirm        :function(data,delay){     // 提交确认 

		Aps.gui.submited();
		
		if (data.status!==0) {

			Aps.gui.toast( Aps.cajax.getMessage(data) );

		}else{

			Aps.gui.toast(i18n('SUCCESS'));
			Aps.user.connect(true);
			setTimeout(function(){	
				
				var call = Aps.former.options.call;

				if ( call && typeof call == 'string' ) {

					Aps.router.open(call,'new');

				}else if( call && typeof call == 'function' ){

					Aps.former.options.callParams.push(data.content);

					call(Aps.former.options.callParams);

				}else{

					Aps.router.reload();  
				
				}

			},delay||2000);
		} }, });



Aps.user       = Aps.fn({ // ! 用户对象  

	// Stuct & data
	userid:       Aps.local.get('userid') ,
	openid:       Aps.local.get('openid') ,
	token:        Aps.local.get('token')  ,
	avatar:       Aps.local.get('avatar')  ,
	nickname:     Aps.local.get('nickname')  ,
	tokenexpire:  parseInt(Aps.local.get('tokenexpire')) ,
	quickLoginOn: 1,
	quickLoginMode:{
		emailLogin:    Aps.setting.language=='EN' || CONFIGS.emailLogin || 0,
		mobileLogin:   Aps.setting.language=='ZHCN' || CONFIGS.mobileLogin || 0,
		wechatLogin:   CONFIGS.wechatLogin || 0,
		facebookLogin: CONFIGS.facebookLogin || 0,
	},

	init:function(){

		this.userid       = Aps.local.get('userid') ;
		this.openid       = Aps.local.get('openid') ;
		this.token        = Aps.local.get('token')  ;
		this.tokenexpire  = parseInt(Aps.local.get('tokenexpire'));

	},

	// check 
	islogin          :function(){ return this.userid; },
	checkTokenExpire :function(){ if (this.isTokenExpired()){this.clearUser();}else if(this.isTokenAlmostExpired()){ this.updateToken(); } },
	checkOpenId      :function(){ return this.openid || this.getOpenid(); },
	isTokenExpired   :function(){

		var now    = parseInt((new Date()).getTime()/1000);	
		var expire = this.tokenexpire ? this.tokenexpire : 0;
		return now>this.tokenexpire;
	},

	isTokenAlmostExpired:function(){

		var now = parseInt((new Date()).getTime()/1000);	
		var almost = (this.tokenexpire-now)<=CONFIGS.tokenRefreshCycle;
		return almost<0;
	},

	hasOpenid:function(){ return this.openid; },
	setOpenid:function(openid){ this.setProperty('openid',openid); },
	getOpenid:function(update){

		if ( update ) location.href = CONFIGS.urihost+'getWxOpenid?callbackurl='+location; 
		if ( this.openid ){ return this.openid; }
		location.href = CONFIGS.urihost+'getWxOpenid?callbackurl='+location; 
	},

	updateToken:function(){

		this.resetOptions();
		this.setOptions({needLogin:1});
		// this.setParams({'userid':this.userid,'token':this.token});
		this.setAction('updateToken');
		this.setCallback(this.updateTokenCallback);
		this.setExpire(45*24*3600);

		Aps.cajax.request(Aps.user.options);

	},

	getUserid:function(){

		if ( this.userid==false || typeof(this.userid)=='undefined' ) {

			this.quickLoginOn && Aps.user.quickLogin('.app');
			return false;
		}
		return this.userid;
	},

	getToken:function(){

		if (this.token==false || typeof(this.token)=='undefined') {

			Aps.user.quickLogin('.app');
			return false;

		}

		return this.token;		

	},

	connect:function(update){

		Aps.user.init();

		if( Aps.user.userid ){

			Aps.user.post('getUserProfile',Aps.user.statusConfirm,{},{needLogin:1,expire:7200,update:update||0});
		}
	},

	fingerOauth:function(sCall,fCall,message){

		if(typeof plus=='undefined'){
			Aps.gui.toast(i18n('FINGER_NOT_SUPPORT'),'warning',2000);
			return;
		}

		if(typeof plus!=='undefined' && plus.fingerprint.isSupport()&&plus.fingerprint.isEnrolledFingerprints()){

			plus.fingerprint.authenticate(function(){
				if( typeof sCall == 'function' ){ sCall(); }
			}, function(){
				if( typeof fCall == 'function' ){ fCall(); }
			}, {
				message:message||i18n('NEED_FINGER_OAUTH')
			});
		}else if(typeof plus!=='undefined' && !plus.fingerprint.isSupport()){
			Aps.gui.toast(i18n('FINGER_NOT_SUPPORT'),'warning',2000);
		}else{
			if( typeof sCall == 'function' ){ sCall(); }
		}
	},

	checkNewNotification:function(update){

		if(Aps.user.userid){

			Aps.user.post('checkNewNotification',Aps.user.notificationConfirm,{},{needLogin:1,expire:1200,update:update||0});

		}
	},

	readNotification:function(all,notificationid){

		Aps.user.forcedLogin();

		var all = all || 0;
		var notificationid = notificationid || 0;

		var params = {
			'userid':Aps.user.userid,
			'token':Aps.user.token,
		}

		if (notificationid) {
			var notification = vdom('#'+notificationid+' .notice');
			if (notification) {
				params.notificationid = notificationid;
				notification.animateCss('pullOutUp fastest',function(){ notification.remove();}); ;
			}
		}

		all && vdom('.notice') && (params.readall = 1);

		Aps.user.post('readNotification',all?Aps.user.readAllNotificationConfirm:Aps.user.notificationConfirm,params,{expire:1200,update:update||0});

	},

	//	set state & callback

	clearUser:function(){

		Aps.local.remove('userid');
		Aps.local.remove('token');
		Aps.local.remove('tokenexpire');
		// Aps.local.remove('openid');

	},

	updateTokenCallback:function(data,status){

		if(Aps.cajax.successful(data)){

			var params = {
				'userid':data.content.userid,
				'token' :data.content.token,
				'expire':data.content.expire,
			};

			Aps.user.setProperty('userid',params.userid);
			Aps.user.setProperty('token',params.token);
			Aps.user.setProperty('tokenexpire',params.expire);

			Aps.user.refresh();
		}

	},

	readNotificationConfirm:function(data){

		Aps.debugger.add('ok');

	},

	readAllNotificationConfirm:function(data){

		if (Aps.cajax.successful(data)) {

			Aps.gui.toast('Read all success.');
			Aps.contents.listMessage(1,15,'messageList',1);
		
		}else{

			Aps.gui.toast(Aps.cajax.getMessage(data));

		}

	},

	logout:function(){

		if(!Aps.user.userid){ Aps.gui.toast(i18n('NEED_LOGIN'),i18n('WARNING'));return; };

		Aps.gui.confirm(i18n('SIGN_OUT'),i18n('CONFIRM_OUT'),{
			onOk:function(){
				Aps.user.clearUser();
				Aps.router.close();
			},
		});

	},

	statusConfirm:function(data,status){

		if (data.status!==0){ // 状态检测失败

			Aps.user.clearUser();
			Aps.user.quickLogin('.app');
			Aps.gui.toast(Aps.cajax.getMessage(data));

		}
	},

	notificationConfirm:function(data){

		if (Aps.cajax.successful(data)){ // 有新消息

			if (vdom('.tabBar')) {
				vdom('.tabBar .tabs.my').append(ApsMd.core.notice.point);
			}
			if (vdom('.setting')) {
				vdom('.settings.notification').append(ApsMd.core.notice.point);
			}
		}else{

			if (vdom('.tabBar .tabs .notice')) {
				vdom('.tabBar .tabs .notice').remove();
			}
			if (vdom('.setting .settings .notice')) {
				vdom('.setting .settings .notice').remove();
			}
		}
	},

	personalCenter:function(update){

		if( Aps.user.userid ){

			Aps.user.post('getUserProfile',Aps.user.personalCenterCall,{},{needLogin:1,expire:7200,update:update||0});
		
		}else{
			Aps.user.quickLogin();
		}
	},

	personalCenterCall:function( data ) {

		if(Aps.cajax.successful(data)){

			var personal = vdom('.personal');
			var user = Aps.cajax.getData(data);

			personal.find('.avatar img').attr('src',(user.avatar?user.avatar+'!avatar':CONFIGS.defaultAvatar));
			personal.find('.nickname').text(user.nickname||i18n('DEFAULT_NAME'));
			personal.find('.verifyinfo span').text(ENCRYPT.middle(user.mobile||user.email||''));
			vdom('#logOut').attr('onclick','Aps.user.logout()').find('.title').text(i18n('SIGN_OUT'));

			if(ACCOUNT.safeMode){
				vdom('.safeMode').addClass('active');
			}

		}else{

			vdom('#logOut').attr('onclick','Aps.user.quickLogin()').find('.title').text(i18n('SING_IN'));
			Aps.gui.toast(data.message);
		}
	},

	updateInfo:function(){

		if(!this.forcedLogin()) return;
		var form = Aps.former.checkForm(vlist('.field.valid'));
		if (!form){ return; };
		this.post('updateUserInfo',this.updateInfoCall,form,{needLogin:1,update:1});

	},

	updateInfoCall:function(data){

		if (!Aps.cajax.successful(data)){
			if (data.status==9999) { Aps.user.quickLogin(); }else{ Aps.gui.toast(data.message||'Network Error!',data.status?'success':'warning'); }
			return;
		}else{
			Aps.gui.toast(data.message||'Saved!','success');
			Aps.metting.request('my',"Aps.user.personalCenter(1);");
		}

		// Aps.queue.in(Aps.user.personalInfo(1));
		
	},

	personalInfo:function(update){

		Aps.user.post('getUserProfile',Aps.user.personalInfoCall,{},{needLogin:1,expire:7200,update:update||0});

	},

	personalInfoCall:function(data){

		if (!Aps.cajax.successful(data)){
			if (data.status==9999) { Aps.user.quickLogin(); }else{ Aps.gui.toast(data.message||'Network Error!',data.status?'success':'warning'); }
			return;
		}

		vdom('#content').html(Aps.mixer.mix(ApsMd.page.personal,data.content));

	},

	mobileConfirm:function(){

		var form = Aps.former.checkForm(vlist('.field.valid'));
		Aps.contents.send(form,'mobileConfirm');

	},

	mobileCodeRequest:function(mobile){ // 申请验证码

		this.post('requestMobileCode',this.sendCallback,{mobile:mobile},{expire:30});
	},

	emailCodeRequest:function(email){ // 申请验证码

		this.post('requestEmailCode',this.sendCallback,{email:email},{expire:30});
	},

	mobileLoginRequest:function(mobile,code){ // 验证身份

		this.post('mobileLogin',this.loginCallback,{code:code,mobile:mobile},{expire:30});
	},

	emailLoginRequest:function(email,code){ // 验证身份

		this.post('emailLogin',this.loginCallback,{code:code,email:email},{expire:30});
	},

	requestMobileCode:function(){

		var m = vdom('#ApsMobile');
		if(Aps.former.check_mobile(m.value(),m.el)){
			Aps.user.mobileCodeRequest(m.value());
		}

	},

	requestEmailCode:function(){

		var m = vdom('#ApsEmail');
		if(Aps.former.check_email(m.value(),m.el)){
			Aps.user.emailCodeRequest(m.value());
		}

	},

	mobileLogin:function(){

		var m = vdom('#ApsMobile');
		var c = vdom('#ApsVerifyCode');

		if(Aps.former.check_mobile(m.value(),m.el) && Aps.former.check_code(c.value(),c.el)){
			Aps.user.mobileLoginRequest(m.value(),c.value());
		}

	},

	emailLogin:function(){

		var m = vdom('#ApsEmail');
		var c = vdom('#ApsEmailCode');

		if(Aps.former.check_email(m.value(),m.el) && Aps.former.check_code(c.value(),c.el)){
			Aps.user.emailLoginRequest(m.value(),c.value());
		}

	},

	regist:function(){

		var form = Aps.former.checkForm(vlist('.form.regist .field.valid'));
		if(!form) return;
		if(form.confirmPassword!==form.password){
			Aps.gui.alert(i18n('WRONG_PASS'),i18n('PASS_NOTMATCH'));
			return;
		}

		delete form.confirmPassword;

		Aps.user.post('regist',Aps.user.loginCallback,form,{update:1});

	},

	passwordLogin:function(){

		var form = Aps.former.checkForm(vlist('.form.login .field.valid'));
		if(!form) return;

		Aps.user.post('passwordLogin',Aps.user.loginCallback,form,{update:1});
	},

	wechatLogin:function(rediect){
		var device      = Aps.setting.isMobile ? 'mobile' : 'pc';
		var callbackUrl = rediect || location.href;
		location.href = CONFIGS.wxhost+'?device='+device+'&callbackurl='+callbackUrl;
	},

	quickLogin:function(selector,mode){

		var selector = selector || 'body';
		var mode     = mode     || 'full';

		if(!vdom('.ApsLogin')){

			vdom(selector).append(vdom.vm_quickLogin||VD(Aps.mixer.mix(ApsMd.core.quickLogin[mode],Aps.user.quickLoginMode),'vm_quickLogin'));
			var login = vdom('.ApsLogin');

			Aps.gui.animateOn
			? login.find('.prop').animateCss('fadeInRight fast').show()
			: login.fadeIn(500);
		}
	},

	quickLoginClose:function(exit){ 

		var login = vdom('.ApsLogin');

		Aps.gui.animateOn
		? login.find('.prop').animateCss('fadeOutLeft faster',function(){ login.fadeOut(); })
		: login.fadeOut();
	},

	sendCallback:function(data,status){

		if(Aps.cajax.successful(data)){

			Aps.gui.toast(Aps.cajax.getMessage(data));
			Aps.counter.countdown('ApsRequestCode',60);
			VD('#ApsVerifyCode').focus();

		}else{

			Aps.gui.toast(Aps.cajax.getMessage(data));
		}
	},

	loginCallback:function(data,status){

		if(Aps.cajax.successful(data)){

			var data = Aps.cajax.getData(data); 
			var params = {
				'userid':data.userid || data.id,
				'token':data.token   || data.token,
				'expire':data.expire || data.expire,
			};

			Aps.gui.toast(i18n('LOGIN_SUC'));

			Aps.user.setProperty('userid',params.userid);
			Aps.user.setProperty('token',params.token);
			Aps.user.setProperty('tokenexpire',params.expire);

			if(VD('.ApsLogin')){ // Not Quick Login process
				Aps.router.switch('./index.html',-1);
				// location.href = 'category.html';
				return;
			}

			Aps.user.quickLoginClose();

			setTimeout(function(){	

				Aps.router.reload(); 

			},1500);

		}else{
			Aps.gui.alert(i18n('LOGIN_FAL'),Aps.cajax.getMessage(data));
		}
	},

	forcedLogin:function(back){

		var back = back || 0;

		if( !Aps.user.islogin() ){

			Aps.gui.confirm(i18n('AUTHORATION'),i18n('NEED_LOGIN'),{
				onOk:function(){
					vdom('.ApsPopup').remove();
					Aps.user.quickLoginOn ? Aps.user.quickLogin() : Aps.router.open('login.html');
				},
				onCancel:function(){
					return back && Aps.router.back() || 1;
				},
			});
			return ;
		}else{
			return 1;
		}
	},

	suggest:function(){

		var suggestion = Aps.former.checkForm(vlist('.form .field.valid'));

		if (!suggestion){
			// console.log(suggestion);
			return;
		}

		Aps.contents.send(suggestion,'sendSuggest',Aps.contents.suggestCall,{needLogin:1});

	},

});
Aps.promotion  = Aps.fn({ // ? 推广中心  

	promoterid:      Aps.local.get('promoterid') ,
	promoteexpire:   Aps.local.get('promoteexpire'),

	init:function(){

		this.promoterid     = Aps.local.get('promoterid') || 0;
		this.promoteexpire  = Aps.local.get('promoteexpire') || 0 ;

	},

	clear:function(){

		Aps.local.remove('promoterid');
		Aps.local.remove('promoteexpire');

	},

	set:function(id,type,duration){

		this.setProperty('promoterid',id);
		this.setProperty('promoteexpire',parseInt((new Date()).getTime()/1000)+parseInt(duration));

	},

	check:function(){

		this.init();
		if ( typeof(this.promoterid)=='undefined' || this.promoterid==='' ) return false; // 是否有id

		if ( this.promoteexpire < parseInt((new Date()).getTime()/1000) ){

			this.clear();
			return false;
		} // 是否过期 过期清除当前推广人信息

		if ( this.promoterid === USER.userid ) {

			this.clear();
			return false;

		} // 推广人和用户是同一人

		return true;
	},


	createDownloadImage:function(element){

		html2canvas(document.getElementById('post'),{scale:1,useCORS:true,}).then(function(canvas){

			var data = canvas.toDataURL("image/jpg");
			VD(element).html("<img src="+data+">");

			Aps.gui.submited('生成成功,请长按图片保存到手机 或 直接分享给朋友!');

		});

	},

	getCommission:function(id,type){

		this.post('getCommission',this.initCommission,{id:id,type:type},{expire:60});
	},

	initCommission:function(data,status){

		if (data.status==0) {

			VD('.commission').text(data.content);
			VD('.promotePatch').show();	

		}

	}, 
});

Aps.order      = Aps.fn({ // ? 订单  

	newOrder:function(itemId,itemType,callback){

		var preorder  = Aps.local.once('preorder');

		var orderInfo = preorder || {itemId:itemId,itemType:itemType}||0;
		Aps.local.set('orderInfo',orderInfo);

		this.setParams({
			'itemId':itemId,
			'itemType':itemType,
		});

		Aps.local.set('orderInfo',{
			'itemId':itemId,
			'itemType':itemType,
		});

		if ( typeof registid == 'string') {

			this.options.parameters.parameters.registid = registid;

		}

		if (Aps.promotion.check()) {

			this.options.parameters.parameters.promoterid = Aps.promotion.promoterid;
		
		}

		this.setAction('');
		this.setUpdate();
		this.setCallback();
		this.setExpire(1);
		Aps.cajax.request(this.options);
		this.post('newOrder',(callback ||Aps.pay.wxJsApiPay),{id:id,type:type},{expire:1});

	},
});

Aps.pay        = Aps.fn({ // ? 支付  

	orderInfo:Aps.local.get('orderInfo') || {},
	iapChannel:0,
	IAPOrders:[],

	pointPay:function(data){

		console.log('pointPay');

	},

	IAP:function(){

		if(!plus) return;
		plus.payment.getChannels(function(channels){
			for( var k in channels){
				if (channel[i].id == 'appleiap') {
					iapChannel = channel[i];
					iapChannel.requestOrder(IAPOrders, function(event) {
						for (var index in event) {
							var OrderItem = event[index];
							outLine("Title:" + OrderItem.title + "Price:" + OrderItem.price + "Description:" + OrderItem.description + "ProductID:" + OrderItem.productid);
						}
					}, function(errormsg) {
						outLine("获取支付通道失败：" + errormsg.message);
					});
				}
			}
		});
		// this.
		// 1443042313

	},

	wxJsApiPay:function(data){

		VD('button').attr('disabled','disabled');

		if (Aps.user.openid==false) {
			Aps.user.getOpenid();
		}

		if (Aps.cajax.successful(data)) {

			this.resetOptions();
			this.setParams({
				'orderid':data.content,
				'openid':Aps.user.openid,
			});
			this.setAction('wxJsapiPay');
			this.setCallback( this.wxJsApiPayCall );
			this.setExpire(3);

			Aps.cajax.request(this.options);

		}else if(data.status==520){

			Aps.gui.toast(Aps.cajax.getMessage(data));

			setTimeout(function(){	

				if ( Aps.pay.orderInfo.itemType = 'event' ) { // 如果是公开课报名页面

					Aps.router.back(-1);
				
				}else{

					Aps.router.reload(); 

				}

			},2500);

		}else{

			Aps.user.quickLogin('.app');
			Aps.gui.toast(Aps.cajax.getMessage(data));

		}
	},

	wxJsApiPayCall:function(data){

		Aps.debugger.add('微信支付回调:');

		if (Aps.cajax.successful(data)) {

			var payment = data.content;

			WeixinJSBridge.invoke(
				'getBrandWCPayRequest',{
					"appId"    :String( payment.appId ),
					"timeStamp":String( payment.timeStamp ),
					"nonceStr" :String( payment.nonceStr ),
					"package"  :String( payment.package ),
					"signType" :String( payment.signType ),
					"paySign"  :String( payment.paySign )
				},
				function(res){

				Aps.debugger.add('微信返回消息');

					 if(res.err_msg == "get_brand_wcpay_request:ok" ){ // 支付成功

						Aps.gui.toast('支付成功');

						Aps.debugger.add('支付成功');

						setTimeout(function(){

							if (  Aps.pay.orderInfo.itemType = 'event') { // 如果是公开课报名页面

								Aps.router.back(-1);
							
							}else if(  Aps.pay.orderInfo.itemType = 'vippackage' ){ // 购买会员

								Aps.router.open('myVip.html','new');

							}else{

								Aps.router.reload(); 

							}

						},2500);

					 }else{

						Aps.debugger.add('支付取消');

						// 支付失败 或 取消支付
						// 关闭支付窗口
						Aps.gui.alert('支付失败','请重新支付或查看其他课程.');

						VD('button').removeAttr("disabled");;
					 
					 }

				}
			);

		}else if(data.status==520){

			Aps.gui.toast(Aps.cajax.getMessage(data));

			setTimeout(function(){	

				if ( Aps.query.currentPage()=='eventRegist.html' ) { // 如果是公开课报名页面

					Aps.router.back(-1);
				
				}else{

					Aps.router.reload(); 

				}
			  
			},2500);

		}else{

			Aps.gui.toast(Aps.cajax.getMessage(data));
			VD('button').removeAttr("disabled");;
		
		}
	}, });
Aps.uploader   = Aps.fn({ // ! 上传器 # aliOss # core 

	mode:'oss',
	galleryMd:"\
		<div class='banners swipe-slide uploaderGallery uploaderGallery_{{idx}}'>\
		<img src='{{url}}'>\
		<div onclick=\"Aps.uploader.upFile({{idx}});\" class='uploaderControl up'><i class='ApsIcon Aps-up'></i> 上移</div>\
		<div onclick=\"Aps.uploader.downFile({{idx}});\" class='uploaderControl down'><i class='ApsIcon Aps-down'></i> 下移</div>\
		<div onclick=\"Aps.uploader.removeFile({{idx}});\" class='uploaderControl remove'><i class='ApsIcon Aps-close'></i> 删除</div>\
		</div>\
		",
	videosMd:"\
		<div class='banners swipe-slide uploaderGallery uploaderVideo_{{idx}}'>\
		<video controls width='100%' src=\"{{url}}\">浏览器不支持视频标签，请使用现代浏览器如：Chrome,360极速,Safari,Firefox...</video>\
		<div onclick=\"Aps.uploader.upFile({{idx}},'videos');\" class='uploaderControl up'><i class='ApsIcon Aps-up'></i> 上移</div>\
		<div onclick=\"Aps.uploader.downFile({{idx}},'videos');\" class='uploaderControl down'><i class='ApsIcon Aps-down'></i> 下移</div>\
		<div onclick=\"Aps.uploader.removeFile({{idx}},'videos');\" class='uploaderControl remove'><i class='ApsIcon Aps-close'></i> 删除</div>\
		</div>\
		",		
	gallery:[],
	galleryList:[],
	videos:[],
	videosList:[],

	types:{

		image:{
			title:'image',
			extensions: "jpg,gif,png,bmp,jpeg",
			max: '10mb',
		},
		video:{
			title:'video',
			extensions: "mp4,mov,mpg",
			max: '500mb',
		},
		audio:{
			title:'audio',
			extensions: "mp3,ogg,wav",
			max: '100mb',
		},
		document:{
			title : "document",
			extensions : "pdf,pptx,xlsx,numbers,key,pages,docx,doc,xls",
			max: '100mb',
		}
	},

	avatarUploaded:function( data ){

		var url = data.code ? CONFIGS.reshost+data.data : data.content.url;

		vdom('#ApsUploadImage img').attr('src',url);
		vdom('#ApsUploadImageUrl').value(url);

	},

	mediaUploaded:function(data,params){

		var url = data.content.url;

		vdom(params.preview).attr('src',url);
		vdom(params.input).value(url);

	},

	galleryUploaded:function(data,params){

		Aps.uploader.gallery = Aps.uploader.gallery || [];
		Aps.uploader.gallery.push({
			url:data.content.url,
		});

		var galleryList = vdom(params.input).value();
		galleryList = galleryList ? JSON.parse(galleryList) : [];
		Aps.uploader.galleryList.push(data.content.url);

		Aps.uploader.refreshGalleryPreview();

	},

	videosUploaded:function(data,params){

		Aps.uploader.videos = Aps.uploader.videos || [];
		Aps.uploader.videos.push({
			url:data.content.url,
		});

		var videosList = vdom(params.input).value();
		videosList = videosList ? JSON.parse(videosList) : [];
		Aps.uploader.videosList.push(data.content.url);

		Aps.uploader.refreshVideosPreview();

	},

	galleryInit:function(){

		var gallery = vdom('#gallery') ? JSON.parse(vdom('#gallery').value()) : 0;
		Aps.uploader.galleryList = gallery;
		Aps.uploader.gallery = [];

		if (gallery){
			for (var i = 0; i < gallery.length; i++) {
				Aps.uploader.gallery.push({url:gallery[i]});
			}
		}

		Aps.uploader.refreshGalleryPreview();

	},

	videosInit:function(){

		var videos = vdom('#videos') ? JSON.parse(vdom('#videos').value()) : 0;
		Aps.uploader.videosList = videos;
		Aps.uploader.videos = [];

		if (videos){
			for (var i = 0; i < videos.length; i++) {
				Aps.uploader.videos.push({url:videos[i]});
			}
		}

		Aps.uploader.refreshVideosPreview();

	},

	refreshGalleryPreview:function(clear){
		vdom('#galleryList').empty();
		vdom('#gallery').el.value= '';
		if (clear) { return; }
		var list = Aps.mixer.loop(Aps.uploader.galleryMd,Aps.uploader.gallery);
		vdom('#galleryList').html(list);
		vdom('#gallery').value(JSON.stringify(Aps.uploader.galleryList));
	},

	refreshVideosPreview:function(clear){
		vdom('#videosList').empty();
		vdom('#videos').el.value= '';
		if (clear) { return; }
		var list = Aps.mixer.loop(Aps.uploader.videosMd,Aps.uploader.videos);
		vdom('#videosList').html(list);
		vdom('#videos').value(JSON.stringify(Aps.uploader.videosList));
	},

	upFile:function(idx,type){

		var type = type || 'gallery';

		if (idx==0) { return;}

		var before = Aps.uploader[type][idx-1];
		var beforeL = Aps.uploader[type+'List'][idx-1];

		Aps.uploader[type][idx-1] = Aps.uploader[type][idx];
		Aps.uploader[type][idx] = before;
		Aps.uploader[type+'List'][idx-1] = Aps.uploader[type+'List'][idx];
		Aps.uploader[type+'List'][idx] = beforeL;

		type=='gallery' 
			? Aps.uploader.refreshGalleryPreview()
			: Aps.uploader.refreshVideosPreview();
	},

	downFile:function(idx,type){

		var type = type || 'gallery';

		if (idx==Aps.uploader[type].length-1) { return;}

		var after = Aps.uploader[type][idx+1];
		var afterL = Aps.uploader[type+'List'][idx+1];

		Aps.uploader[type][idx+1] = Aps.uploader[type][idx];
		Aps.uploader[type][idx] = after;
		Aps.uploader[type+'List'][idx+1] = Aps.uploader[type+'List'][idx];
		Aps.uploader[type+'List'][idx] = afterL;


		type=='gallery' 
			? Aps.uploader.refreshGalleryPreview()
			: Aps.uploader.refreshVideosPreview();
	},

	removeFile:function(idx,type){

		var type = type || 'gallery';

		vdom('#fileList div:nth-child('+(idx+1)+')').remove();

		if(Aps.uploader[type].length <=1){ 
			Aps.uploader[type] = []; 
			Aps.uploader[type+'List'] = [];
			Aps.uploader.refreshGalleryPreview(1);
			return; 
		}
		var g  = [];
		var gl = [];
		for(var k in Aps.uploader[type]){
			if (k!=parseInt(idx)) {
				g.push({url:Aps.uploader[type][k].url});
				gl.push(Aps.uploader[type+'List'][k]);
			}
		}
		Aps.uploader[type]     = g;
		Aps.uploader[type+'List'] = gl;

		type=='gallery' 
			? Aps.uploader.refreshGalleryPreview()
			: Aps.uploader.refreshVideosPreview();

	},

	/**
	 * @param type               # 上传方式 
	 * @param options.mode       # 默认为阿里oss
	 * @param options.type       # upload file type 上传文件类型
	 * @param options.container  # 上传组件的容器id
	 * @param options.selector   # 浏览文件触发选择器 无则不显示
	 * @param options.fileList   # 上传文件列表选择器 无则不显示
	 * @param options.image      # 上传图片的预览选择器 无则不显示
	 * @param options.audio      # 上传音频的预览选择器 无则不显示
	 * @param options.video      # 上传视频的预览选择器 无则不显示
	 * @param options.gallery    # 上传相册的相册预览 选择器 无则不显示

	 Calls
	 * @param options.Postinit   
	 * @param options.FilesAdded 
	 * @param options.BeforeUpload
	 * @param options.UploadProgress 
	 * @param options.FileUploaded    
	 * @param options.Error  

	 * @param callParams         # 上传回调需要传递的参数
	 */

	init:function(type,options,callParams){

		Aps.uploader.mode = options.mode || 'oss';
		var options = options || {
			type:'image',
			selector:'brosweFile',
			container:'uploadContainer',
			gallery:0,
		};

		var uploader = new plupload.Uploader({
			browse_button :        options.selector, // 上传按钮id
			container :            document.getElementById(options.container), // 上传容器
			runtimes :            'html5,flash,silverlight,html4', // 上传环境
			multi_selection :      options.multi ? true : false, // 是否支持批量上传
			unique_names :         true, // 是否自动生成唯一文件名
			url :  Aps.uploader.mode =='oss' ? CONFIGS.apihost : APILIST.getApiUrl('uploadServer'), // 上传地址

			filters: {
			  mime_types : [ // 支持的文件类型
			  { 
				title :       Aps.uploader.types[options.type].title,
				extensions :  Aps.uploader.types[options.type].extensions }, 
			  ],
			  max_file_size : Aps.uploader.types[options.type].max, //最大只能上传10mb的文件
			  prevent_duplicates : false, //不允许选取重复文件
			},

			init: {
				PostInit: function() {   // 
					if (typeof options.PostInit == 'function'){ options.PostInit(uploader); }
					if (options.uploadBtn){
						document.querySelector(options.uploadBtn).onclick = function() {
							OSS.set_upload_param(uploader, '', false);
							return false;
						};
					}
				},

				FilesAdded: function(up, files ) {  // 添加文件

					if (options.fileList) { // 显示进度条
						plupload.each(files, function(file) {
							jQuery(options.fileList).append('<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b><div class="progress"><div class="progress-bar" style="width: 0%"></div></div></div>');
						});
					}
					if (!options.uploadBtn){ // 没有上传按钮则进行快速上传
						if (Aps.uploader.mode=='oss')  OSS.set_upload_param(uploader, '', false, options.type);
						up.start();
					}
					if (typeof options.FilesAdded == 'function'){ options.FilesAdded(uploader); }
				},

				BeforeUpload: function(up, file) {

					Aps.gui.submiting('开始上传...');
					if (Aps.uploader.mode=='oss'){ OSS.set_upload_param(up, file.name, true, options.type);}; 
					if (typeof options.BeforeUpload == 'function'){ options.BeforeUpload(uploader); }
				},

				UploadProgress:function(up, file) {

					if (options.progress) {

						var d = document.getElementById(file.id);
						d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
						var prog = d.getElementsByTagName('div')[0];
						var progBar = prog.getElementsByTagName('div')[0];
						progBar.style.width= file.percent+'%';
						progBar.setAttribute('aria-valuenow', file.percent);
		
					}else{
						Aps.gui.submitProgress('上传中...',file.percent);
					}
					if (typeof options.UploadProgress == 'function'){ options.UploadProgress(uploader); }

				},

				FileUploaded: function(up, file, info) {
					if (info.status == 200){

						Aps.gui.submited('上传完成');
						var res = JSON.parse(info.response);	// 将回调返回的数据转换成json对象
						if (typeof options.FileUploaded == 'function'){ options.FileUploaded(res,callParams||0); }

					}else if (info.status == 203){ Aps.gui.submited('上传失败，请重试','failed');
					}else{ Aps.gui.submited('上传失败，请重试','failed'); } 

				},

				Error: function(up, err) {
					if (err.code == -600) { Aps.gui.submited("选择的文件太大了");				  
					}else if (err.code == -601) { Aps.gui.submited("选择的文件后缀不对");
					}else if (err.code == -602) { Aps.gui.submited("这个文件已经上传过一遍了");
					}else { Aps.gui.submited("Error xml:" + err.response); }

					if (typeof options.Error == 'function'){ options.Error(uploader); }
				}
			}
		});

		uploader.init(); 

	},

	simpleUpload:function(selector,options,uploadedCall,callParams){

		Aps.uploader.mode = options.mode || 'oss';;
		var type     = options.type || 'image';

		var uploader = new plupload.Uploader({
		  browse_button :        selector||'brosweFile',                   // 上传按钮id
		  container :            document.getElementById(options.container||'uploadContainer'), // 上传容器

		  runtimes :            'html5,flash,silverlight,html4',             // 上传环境
		  multi_selection :      false,                                      // 是否支持批量上传
		  unique_names :         true,                                       // 是否自动生成唯一文件名
		  url :  Aps.uploader.mode =='oss' ? CONFIGS.apihost : APILIST.getApiUrl('uploadServer'), // 上传地址

		  filters: {
			  mime_types : [ // 支持的文件类型
			  { 
				title :       Aps.uploader.types[type].title,
				extensions :  Aps.uploader.types[type].extensions }, 
			  ],
			  max_file_size : Aps.uploader.types[type].max, //最大只能上传10mb的文件
			  prevent_duplicates : false, //不允许选取重复文件
		  },

		  init: {
			  PostInit: function() {   // 

			  },

			  FilesAdded: function(up, files, type) {  // 添加文件

				plupload.each(files, function(file) {
					jQuery(options.progress||'#uploadProgress').html('<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b><div class="progress"><div class="progress-bar" style="width: 0%"></div></div></div>');
				});
				if (Aps.uploader.mode=='oss')  OSS.set_upload_param(uploader, '', false, type);
				up.start();

			  },

			  BeforeUpload: function(up, file) {

				if (Aps.uploader.mode=='oss') OSS.set_upload_param(up, file.name, true, type); 

			  },

			  UploadProgress: function(up, file) {

			  	// console.log(up,file);
				Aps.gui.submitProgress('开始上传...',file.percent);

			  },

			  FileUploaded: function(up, file, info) {
				  if (info.status == 200){

					  Aps.gui.submited('上传完成');

					  var res = JSON.parse(info.response);  // 将回调返回的数据转换成json对象

					  if(typeof uploadedCall=='function'){uploadedCall(res,callParams||0);};

				  }
				  else if (info.status == 203){
					  Aps.gui.submited('上传失败，请重试');
				  }else{
					  Aps.gui.submited('上传失败，请重试');
				  } 
			  },

			  Error: function(up, err) {
				  if (err.code == -600) {
					  Aps.gui.submited("选择的文件太大了");
				  
				  }else if (err.code == -601) {

					  Aps.gui.submited("选择的文件后缀不对");
				  
				  }else if (err.code == -602) {

					  Aps.gui.submited("这个文件已经上传过一遍了");
				  
				  }else {
					  Aps.gui.submited("Error xml:" + err.response);
				  }
			  }
		  }
		});

		uploader.init(); 

	}, 

	initSummernoteUploader:function(selector){
		 
		var summerNoteImageBtn = function(){

			jQuery('.note-toolbar.panel-heading .note-insert button').each(function(){

				if (jQuery(this).attr('data-event') == 'uploadImage') {

					jQuery(this).attr('id','summerNoteImageBtn');
				}
			});
		};

		var summerNoteUploader = Aps.uploader.init('summerNote',{
			selector:'summerNoteImageBtn',
			container:'summerNote',
			type:'image',
			multi:true,
			fileList:'.note-toolbar',
			PostInit:function(uploader){
				document.getElementById('summerNoteImageBtn').onclick = function() {
					OSS.set_upload_param(uploader, '', false);
					return false;
				};
			},


		});

		var summerNoteUploader = function(){
			
			var uploader = new plupload.Uploader({
				runtimes :            'html5,flash,silverlight,html4',          // 上传环境
				browse_button :       'summerNoteImageBtn',                     // 上传按钮id
				container :            document.getElementById('summerNote'),   // 上传容器
				multi_selection :      true,                                    // 是否支持批量上传
				unique_names :         true,                                    // 是否自动生成唯一文件名
				url :  Aps.uploader.mode =='oss' ? CONFIGS.apihost : APILIST.getApiUrl('uploadServer'), // 上传地址

				filters: {
				  mime_types : [ // 支持的文件类型
				  { title : "image",    extensions : "jpg,gif,png,bmp,jpeg" }, 
				  // { title : "video",    extensions : "mp4,mov,mpg" },
				  // { title : "audio",    extensions : "mp3,ogg,wav" },
				  // { title : "document", extensions : "pdf,pptx,xlsx,numbers,key,pages,docx,doc,xls" },
				  ],
				  max_file_size : '10mb', //最大只能上传10mb的文件
				  prevent_duplicates : false, //不允许选取重复文件
				},

				init: {
				  PostInit: function() {   // 
					  // document.getElementById('ossfile_1').innerHTML = '';
					  document.getElementById('summerNoteImageBtn').onclick = function() {
						  OSS.set_upload_param(uploader, '', false);
						  return false;
					  };
				  },

				  FilesAdded: function(up, files) {  // 添加文件
					  plupload.each(files, function(file) {
							jQuery('#summerNoteImageBtn').parent().parent().append('<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
						  +'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
						  +'</div>');
					  });
					  up.start();
				  },

				  BeforeUpload: function(up, file) {
					  // OSS.check_object_radio();
					  OSS.set_upload_param(up, file.name, true);
				  },

				  UploadProgress: function(up, file) {
					var d = document.getElementById(file.id);
					d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
					var prog = d.getElementsByTagName('div')[0];
					var progBar = prog.getElementsByTagName('div')[0];
					progBar.style.width= file.percent+'%';
					progBar.setAttribute('aria-valuenow', file.percent);
				  },

				  FileUploaded: function(up, file, info) {
					  if (info.status == 200){

						  var res = JSON.parse(info.response);  // 将回调返回的数据转换成json对象
					  
						  // console.log(res);  //把res打印到控制台 查看回调是否有效

							var Editor = jQuery.summernote.eventHandler.modules.editor;
							var editable = jQuery('.note-editable.panel-body');

							Editor.insertImage(editable, res.content.url+'!middle', res.content.name);

							jQuery('#'+file.id).remove();
							// var d = document.getElementById(file.id);

					  }
					else if (info.status == 203){
						alert('上传失败，请重试');
					}else{
						alert('上传失败，请重试');
					}
				},

				  Error: function(up, err) {
					  if (err.code == -600) {
						  alert("选择的文件太大了");
					  
					  }else if (err.code == -601) {

						  alert("选择的文件后缀不对");
					  
					  }else if (err.code == -602) {

						  alert("这个文件已经上传过一遍了");
					  
					  }else {
						  alert("Error xml:" + err.response);
					  }
				  }
				}
			  });

			uploader.init(); 
		};

		var checkSummernote = setInterval(function(){ if (vdom(selector||'.note-editor')) {

				clearInterval( checkSummernote );

				summerNoteImageBtn();
				summerNoteUploader();

			} }, 100);

	},
});
Aps.jssdk      = Aps.fn({ // ? 微信jssdk  

	apiList:[
		'onWXDeviceBluetoothStateChange', 'onWXDeviceStateChange',
		'openProductSpecificView', 'addCard', 'chooseCard', 'openCard',
		'translateVoice', 'getNetworkType', 'openLocation', 'getLocation',
		'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone',
		'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'closeWindow', 'scanQRCode', 'chooseWXPay',
		'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem',
		'startScanWXDevice', 'stopScanWXDevice', 'onWXDeviceBindStateChange', 'onScanWXDeviceResult', 'onReceiveDataFromWXDevice',
		'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice',
		'openWXDeviceLib', 'closeWXDeviceLib', 'getWXDeviceInfos', 'sendDataToWXDevice', 'disconnectWXDevice', 'getWXDeviceTicket', 'connectWXDevice',
	],

	getConf:function(data,apiList){

		return {
			"debug"    :false,
			"appId"    :String(data.content.appId),
			"timestamp":String(data.content.timestamp),
			"nonceStr" :String(data.content.nonceStr),
			"signature":String(data.content.signature),
			"jsApiList":apiList ||Aps.jssdk.apiList,
		};

	},

	init:function(callback){

		if (Aps.setting.device=='wx') {

			this.setParams({
				url:location.href,
			});
			this.setAction('getJssdkConfig');
			this.setCallback(Aps.jssdk[callback]);
			this.setExpire(3600);
			Aps.cajax.request(this.options);

		}
	},

	share:function(data,status){

		var conf = Aps.jssdk.getConf(data,['onMenuShareAppMessage','onMenuShareTimeline']);

		wx.config(conf);

		wx.ready(function(){
			
			wx.onMenuShareAppMessage(Aps.share.getParams());
			wx.onMenuShareTimeline(Aps.share.getParams('timeline'));

		});

	},

	hideOption:function(data,status){
	 
		var conf = Aps.jssdk.getConf(data,['hideOptionMenu']);

		wx.config(conf);

		wx.ready(function(){
			
			wx.hideOptionMenu();

		// 在这里调用 API
		});
	  
	} });
Aps.share      = Aps.fn({ // ? 分享( 二维码分享需要jQ Qrcode )  #share 

	init:function(title,description,image,link) {

		this.setParams({
			title:title||CONFIGS.appname,
			desc:description||CONFIGS.slogan,
			link:link,
			imgUrl:image,
			appName:CONFIGS.appname, 
			wxAppid:CONFIGS.wxappid, 
			imageWidth:250,
			imageHeight:250,
		});

		return this.options.parameters.parameters;
	},

	getParams:function(mode){

		return this.options.parameters.parameters;

	},

	generateLink:function() {
			
		if (Aps.user.userid) {

			Aps.query.set('promoterid',Aps.user.userid);
			Aps.query.set('promoteduration',7*24*3600);

			return (location.origin+location.pathname+Aps.query.toString()).replace('/web/','/mobile/');

		}else{
			return location.href;
		}
	},

	generateQrcode:function(url){

		var url = url || Aps.share.generateLink(); 

		return Aps.qrcode.toImage(url);

	},

	propShare:function(url){

		var url = url || Aps.share.generateLink(); 

		VD('body').append(VD('<div></div>').attr('id','postContainer').css({'width':0,'height':0,'overflow':'hidden'}));
		VD('#postContainer').append(
			VD('<div></div>').attr('id','post').addClass('content post')
			.append(VD('.swiperContainer').HTML())
			.append(VD('.pageInfo').HTML())
			.append(Aps.share.generateQrcode(url))
		);

		html2canvas(document.getElementById('post'),{scale:1,useCORS:true,}).then(function(canvas){
			VD('#postContainer').remove();
			var data = canvas.toDataURL("image/jpg"); var img = new Image();
			img.src = data;
			VD('.ApsPropupContent p').html(img);
		});
	} 
});
Aps.player     = Aps.fn({ // ? 播放器 基于mediaelement  

	init:function(){

		var
			lang               = this.getQueryStringValue('lang') || 'zh-CN',
			stretching         = this.getQueryStringValue('stretching') || 'auto',
			languageSelector   = document.querySelector('select[name=lang]'),
			stretchingSelector = document.querySelector('select[name=stretching]'),
			sourcesSelector    = document.querySelectorAll('select[name=sources]'),
			sourcesTotal       = sourcesSelector.length
		;

		mejs.i18n.language(lang);

		var mediaElements = document.querySelectorAll('video, audio'), i, total = mediaElements.length;

		for (i = 0; i < total; i++) {
			new MediaElementPlayer(mediaElements[i], {
				stretching: stretching,
				pluginPath: '../plugins/mediaelement/',
				success: function (media) {
					var renderer = document.getElementById(media.id + '-rendername');

					media.addEventListener('loadedmetadata', function () {
						var src = media.originalNode.getAttribute('src').replace('&amp;', '&');
						if (src !== null && src !== undefined) {
							renderer.querySelector('.src').innerHTML = '<a href="' + src + '" target="_blank">' + src + '</a>';
							renderer.querySelector('.renderer').innerHTML = media.rendererName;
							renderer.querySelector('.error').innerHTML = '';
						}
					});

					media.addEventListener('error', function (e) {
						renderer.querySelector('.error').innerHTML = '<strong>Error</strong>: ' + e.message;
					});
				}
			});
		}

	},

	getQueryStringValue:function(key) {
		return decodeURIComponent(location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
	}, });
Aps.map        = Aps.fn({ // ? 地图组件 基于高德jssdk  

	center:[110.3411189,20.03997361],
	resizeEnable:true,
	zoom:14,
	list:[],
	current:{},
	marks:[],
	map:0,

	init:function(containerId,options){

		var containerId = containerId || 'MAP';
		var options = options || { resizeEnable:this.resizeEnable,center:this.center,zoom:this.zoom };
		this.map = new AMap.Map(containerId,options);    
		this.clear();  // 清除地图覆盖物

	},
	clear:function(){

		this.map.clearMap();  // 清除地图覆盖物

	},

	focus:function(idx){

		this.clear();
		this.setCurrent(Aps.searchbar.res[idx]);
		this.addMarks([this.current]);
		this.map.setCenter(this.current.location);
		this.map.setZoom(16);
		this.refreshView();

	},

	setCurrent:function(data){

		this.current = data;
		this.current.location = this.converLocation(data.location);

		if (VD('.pageInfo').length>0) {
			// VD('.pageInfo .name').text(this.current.name);
		}

	},

	setMarkList:function(list){

		var indexList = {};

		for( var i=0; i<list.length; i++ ){

			indexList[list[i]['id']] = {};

			for ( var key in list[i] ){

				indexList[list[i]['id']][key] = key!=='location'?list[i][key]:this.converLocation(list[i][key]);

			}
		}

		this.list = indexList;
	},

	addMarks:function(data){

		Aps.gui.globalLoad.start();
		// console.log(data);
		var list = data.data ? data.data.list : data;

		Aps.map.clear();  // 清除地图覆盖物

		Aps.map.listToMarks(list);
		Aps.map.setMarkList(list);

		for(var key in Aps.map.marks ){
			new AMap.Marker({
			  map: Aps.map.map,
			  title:Aps.map.marks[key].id,
			  position: [Aps.map.marks[key].position[1], Aps.map.marks[key].position[0]],
			  offset: new AMap.Pixel(-12, -36)
		}).on(Aps.setting.plus?'tap':'click',Aps.map.markSelect);
		}

		Aps.map.map.setFitView();
		Aps.gui.globalLoad.success();

	},

	listToMarks:function(list){

		var marks = [];

		for( var key in list){

			marks.push({
				id:list[key].id,
				position:this.converLocation(list[key].location)
			});
		}

		this.marks = marks;
	},

	refreshView:function(index,listmode){

		var listmode = listmode || 0;
		var current  = listmode ? this.list[index] : this.current;

		VD('.pageInfo .name').html(current.name);
		VD('.pageInfo .address span').html(current.address);
		VD('.pageInfo .open span.open_time').html(current.open_time);
		VD('.pageInfo .open span.close_time').html(current.close_time);
		VD('.pageInfo .countRoom span').html(current.countRoom||0);
		VD('.pageInfo .countActive b').html(current.countActive||0);
		VD('.navi').attr('onclick',"Aps.router.open('"+this.navUri(current)+"');");
		VD('#venueDetail').attr('onclick',"Aps.router.open('venueDetail.html?venueid="+current.id+"');")
		// console.log(MAP.list[venueid].name);

	},

	navUri:function(options){

		return encodeURI("https://uri.amap.com/navigation?to="+options.location[1]+","+options.location[0]+","+(options.name||'目的地')+"&mode=car")

	},

	markSelect:function(mapEvent){
		var venueid = mapEvent.target.getTitle();
		Aps.map.map.setCenter(mapEvent.target.getPosition());
		// mapEvent.target.setIcon('https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png');
		Aps.map.map.setZoom(16);
		Aps.map.refreshView(venueid,1);
	},

	converLocation:function( location, mirror ){

		var mirror = mirror || 0;
		var location = (typeof location =='string') ? location.split(",") : location;

		if (mirror) {

			var mlocation = [locate[1],locate[0]];
			location = mlocation;

		}
		return location;

	} });
Aps.swip       = Aps.fn({ // ! 滑动列表 

	time:0,

	option:{

		selector:'#swiperContainer',
		pagination:'.swiper-pagination',
		autoplay:3500,
		speed:500,

	},

	init:function(option){

		var option   = option || this.option;
		var selector = option.selector || '#swiperContainer';

		if (VD(selector)) {
			var swpier  = new Swiper(option.selector||'#swiperContainer',option);
		}
	},
});
Aps.searchbar  = Aps.fn({ // ! 搜索条  
	
	needLogin:1,
	switcher:1,
	delay:  500,
	time:   500,
	timer:  0,
	bar:    vdom('.ApsSearchBar'),
	input:  vdom('.ApsSearchBar .ApsSearchInput'),
	result: vdom('.ApsSearchResult'),

	actionDict:{
		searchAccount:i18n('ACCOUNTS'),
		searchAttachment:i18n('ATTACHMENTS'),
	},

	res:{},
	filters:Aps.local.get('searchFilters')||{},

	startTimer:function(){

		this.clearTimer();
		this.timer =setInterval(function(){
			if(Aps.searchbar.time<=0){
				clearInterval(Aps.searchbar.timer);
				Aps.searchbar.isInputDone() && Aps.searchbar.search();
				Aps.searchbar.clearTimer();
			}else{
				Aps.searchbar.time -= 100;
			}
		},100);

	},

	clearTimer:function(){
		clearInterval(this.timer);
		this.time = this.delay;		
	},

	isInputDone:function(){

		return this.time<=0 && vdom('#ApsSearchInput').value().length>1;

	},

	isInputEmpty:function(){

		return vdom('#ApsSearchInput').value().length==0;

	},

	init:function(action){

		Aps.filters.action = action || 'searchAccount';

		if (!vdom('.ApsSearchBar')) return;

		vdom('.ApsSearchBar .ApsSearchInput').on('input',function(e){
			if(Aps.searchbar.isInputDone()){
				Aps.searchbar.search();
			}else if(Aps.searchbar.isInputEmpty()){
				Aps.searchbar.clear();
			}else{
				Aps.searchbar.startTimer();
			}
		});
		return this;
	},

	blur:function(){

		vdom('.ApsSearchBar').removeClass('searching'); 

	},

	changeAction:function(action){

		Aps.filters.setAction(action);
		// vdom('#ApsActionList').hide();
		vlist('#ApsActionList li').removeClass('current');
		vdom('#ApsCurrentAction').text(this.actionDict[action]);
		vdom('#ApsActionList li.'+action).addClass('current');

	},

	clear:function(){
		vdom('.ApsSearchBar').removeClass('searching'); 
		vdom('.ApsSearchBar .ApsSearchInput').value('');
		vdom('.ApsSearchBar .ApsSearchResult').html("<div class='emptyInfo'>No result.</div>");
	},

	search:function(){

		vdom('.ApsSearchBar').addClass('searching');

		this.setAction(Aps.filters.action);
		this.setParams({keyword:vdom('.ApsSearchBar .ApsSearchInput').value(),page:1,size:25});
		if (this.needLogin){
			this.addHeaders({'userid':Aps.user.userid,'token':Aps.user.token});
		}
		this.setCallback(this.searchCall);
		this.setExpire(30);

		Aps.gui.localLoad.start('.ApsSearchResult');
		Aps.cajax.request(this.options);

	},
	searchCall:function( data ){

		Aps.contents.listCall(data,'search',0,0,'search');
		// var list = Aps.cajax.getData(data);
		// vdom((Aps.searchbar.switcher?'.ApsSwitchMain.current':'.searchResult'),'searchList');

		// vdom.searchList.html(Aps.mixer.loop(ApsMd.core.searchResult,list));

	}, });

Aps.qrcode      = {

	options:{
		render		: "image",
		width		: 256,
		height		: 256,
		typeNumber	: -1,
		correctLevel	: typeof QRErrorCorrectLevel!='undefined' ? QRErrorCorrectLevel.H : 2,
        background      : "#ffffff",
        foreground      : "#000000"
	},
	toCanvas:function(text,options){
		var options = options || this.options;
			options.text = text;
		var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
		qrcode.addData(text);
		qrcode.make();

		// create canvas element
		var canvas	= document.createElement('canvas');
		canvas.width	= options.width;
		canvas.height	= options.height;
		var ctx		= canvas.getContext('2d');

		// compute tileW/tileH based on options.width/options.height
		var tileW	= options.width  / qrcode.getModuleCount();
		var tileH	= options.height / qrcode.getModuleCount();

		// draw in the canvas
		for( var row = 0; row < qrcode.getModuleCount(); row++ ){
			for( var col = 0; col < qrcode.getModuleCount(); col++ ){
				ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
				var w = (Math.ceil((col+1)*tileW) - Math.floor(col*tileW));
				var h = (Math.ceil((row+1)*tileH) - Math.floor(row*tileH));
				ctx.fillRect(Math.round(col*tileW),Math.round(row*tileH), w, h);  
			}	
		}
		// return just built canvas
		return canvas;
	},
	toImage:function(text){

		var image = new Image();
		// image.className = 'qrcode';
		image.src  = this.toCanvas(text).toDataURL("image/png");
		return image;
	}

};


/** 数据请求 **/
Aps.contents    = Aps.fn({ // ! 内容处理 

	/*
	render list to listContainer
	data     @object
	type     @string
	append   @boolean || @int 0,1  # ture for append to list or false for replace
	options  @array 
		options.mode      @string 
		options.emptyInfo @string 
		options.animate   @object {delay:@int,animate:@string} || @int  
	parallel @string      # name @string  or with serial manner )
	callback @string      # callback function
	*/

	listCall:function( data, type, append, options, parallel , callback ){

		Aps.scrollView.endLoading(parallel||0);

		var listContainer = 'listContainer'+(parallel?'_'+parallel:'');
		var selector  = parallel?'.parallel_'+parallel:'.ApsScrollView.current'; 

		if (!Aps.cajax.successful(data)){
			if (data.status==9999) { 
				Aps.user.quickLogin(); 
			}else{
				// Aps.gui.toast(data.message||'Network Error!',data.status?'success':'warning');
				Aps.gui.localLoad.failed(selector,data.message,3000);
			}
			return;
		}

		Aps.gui.localLoad.success(selector);

		var CONTAINER = VD(selector,listContainer);

		var res       = Aps.cajax.getData(data);

		var domList   = '';
		var list      = res.list;
		var max       = res.navi.max  || 1;
		var page      = res.navi.page || 1;
		var size      = res.navi.size || 12;

		var append    = append        || 0; 
		var type      = type          || 'search'; 
		var animate   = options.animate   || 0;
		var mode      = options.mode      || 'general';
		var emptyInfo = options.emptyInfo || 'No result.';

		var animateIn = function(idx,animate){ 
			var animate = animate || 'fadeInRight faster';
			CONTAINER.append(VD['list'+idx]); 
			VD['list'+idx].addClass('animated '+animate);
		};

		!append && CONTAINER.empty();

		if(list && list.length>0){

			for (var i in list ) {
				
				if (type=='account') {
					list[i].color       = Aps.converter.exchange('categoryColor',list[i].category.title);
					list[i].icon        = Aps.converter.exchange('categoryIcon',list[i].category.title);
					list[i].description = list[i].description;
					list[i].name        = list[i].name ? ENCRYPT.middle(list[i].name) : '';
					list[i].remark1     = list[i].attachments[0]?list[i].attachments[0].value:0;
					list[i].remark2     = list[i].attachments[1]?list[i].attachments[1].value:0;
				}
				if (type=='category') {
					list[i].color       = Aps.converter.exchange('categoryColor',list[i].title);
					list[i].icon        = Aps.converter.exchange('categoryIcon',list[i].title);
					list[i].name        = Aps.converter.exchange('categoryName',list[i].title);
				}

				// if (ACCOUNT.safeMode) {
				// 	list[i].description = list[i].description?ENCRYPT.middle(list[i].description):'';
				// }

				list[i]['_'+list[i]['title']] = 1;
				VD(Aps.mixer.mix( ApsMd.list[type][mode] ,list[i]),'list'+type+list[i].id);

				animate 
				? setTimeout(animateIn,(animate.delay||50)*i,type+list[i].id,animate.animate)
				: CONTAINER.append(vdom['list'+type+list[i].id]);
				
			}

			CONTAINER.attr('max',max).attr('page',page).attr('inited','inited');

		}else{

			CONTAINER.append('<p class="emptyInfo">'+emptyInfo+'</p>').attr('inited','inited');
			CONTAINER.attr('max',1).attr('page',page);

		}

		Aps.switcher.clear();
		if (typeof callback=='string') {
			callback();
		}


	},
	searchCall:function( data ){
		Aps.contents.listCall( data,'search','general',0,'No result',0 ); 
	},
	detailCall:function( data, type, callback ){

		if (!Aps.cajax.successful(data)){ 
			Aps.gui.toast(data.message);
			if (data.status==9999) {
				Aps.user.quickLogin();
			}
			return;
		}
		var detail  = Aps.cajax.getData(data);
		detail['_'+Aps.converter.exchange('category',detail['categoryid'])] = 1;

		if (typeof callback!=='undefined') {
			callback(detail);
		}else{
			VD('#content').html(Aps.mixer.mix( ApsMd.page[type],detail ));
		}

	},

	send:function( form, target, call, options ){ 

		var options = options || {};

		if ( typeof(form)=='object') {

			Aps.gui.submiting(i18n('SUBMITING'));

			this.resetOptions();
			this.setAction(target);
			this.setParams(form);

			if ( options.needLogin ) {
				if( !Aps.user.forcedLogin() ) return;
				this.addHeaders('userid', Aps.user.userid );
				this.addHeaders('token', Aps.user.token );
			}

			this.setCallback(call);
			this.setExpire(10);

			Aps.cajax.request(this.options);
		}else{
			return false;
		}
	},

	sendCall:function( data, type, txt ){

		if (!Aps.cajax.successful(data)) { Aps.gui.submited(Aps.cajax.getMessage(data),'failed'); return; }

		Aps.gui.submited(Aps.cajax.getMessage(data),'success',3500);

	},

	suggestCall:function( data ){

		if (!Aps.cajax.successful(data)) { Aps.gui.submited(Aps.cajax.getMessage(data),'failed'); return; }

		Aps.gui.submited(Aps.cajax.getMessage(data),'success',3500);

		setTimeout(function(){
			Aps.router.close();
		},3500);

	},

	checkCall:function( data,type,txt ){

		var txt      = txt || '收藏';
		var btn      = VD('#'+type+'Btn');
		var typecode = parseInt(btn.attr('typecode'));
		var object_id= parseInt(btn.attr('object_id'));
		var status   = data.code ? 1 : 0;
		var icon     = btn.children('i');
		var text     = btn.children('span');

		btn.attr('onclick',"Aps.contents."+type+"(this,"+typecode+","+object_id+");");

		!status
		? icon.removeClass('icon-collect-line').addClass('icon-collect') 
			&& text.text('已'+txt) 
		: icon.removeClass('icon-collect').addClass('icon-collect-line') 
			&& text.text(''+txt+'') 
		;
	},

	apiTest:function(api,params,login,update,serverUrl){
		this.post(api,this.apiTestCall,params,(login||update||serverUrl)?{needLogin:login||0,update:update||0,url:serverUrl||0}:0);
	},

	apiTestCall:function(data){

		if (Aps.cajax.successful(data)) {
			console.log(data);
		}else{
			console.log(Aps.cajax.getMessage(data));
			Aps.gui.toast(Aps.cajax.getMessage(data));
		}
	},

	collect:function(el,type,id){

		if(!Aps.user.forcedLogin()) return;

		var status = VD(el).hasClass('enabled') ? 1 : 0;

		if (!status) {
			this.post('collect',this.sendCall,{object_id:id,type:type,member_id:Aps.user.userid},{update:1});
		}else{
			this.post('cancelCollect',this.sendCall,{object_id:id,type:type,member_id:Aps.user.userid},{update:1});
		}
	},

	check:function(mode,type,id){

		if(!Aps.user.forcedLogin()) return;
		var mode = mode || 'collect';
		var type = type || 'venue';
		var typecode = type=='active'?1:2;
		var id   = id   || 1;

		VD('#'+mode+'Btn').attr('typecode',typecode).attr('object_id',id);
		this.post(mode+'Check',Aps.contents[mode+'Check'],{object_id:id,type:typecode,member_id:Aps.user.userid},{update:1});

	},

	thumb:function(el,type,id){

		if(!Aps.user.forcedLogin()) return;

		var status = VD(el).hasClass('enabled') ? 1 : 0;

		if (!status) {
			// Aps.contents.unThumb(type,id);
		}else{
			// Aps.contents.thumb(type,id);
		}

	},

});


(function(){  // 组件初始化

	// Aps.rem();
	Aps.switcher.init();
	
	if (Aps.setting.isWeixin){ document.documentElement.classList.add('wx'); }
	// Aps.cache.init();
	// Aps.cache.clear();
	// Aps.checker.checkBroswer();
	// ACCOUNT.checkLevel();
	// Aps.checker.checkDevice();

	// Aps.searchbar.init();
	})();



