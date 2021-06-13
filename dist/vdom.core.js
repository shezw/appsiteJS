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
|	Copyright: appsite.cn 2018.05 - 2021.06									 |\\\
|	Author	 : Sprite														 |\\\
|	Email	 : hello@shezw.com												 |\\\
| 																			 |\\\
 \===========================================================================\\\\
  \===========================================================================\\\
   \===========================================================================\\
*/

"use strict";
if(!Aps){var Aps = {}}
if(!ApsMd){var ApsMd = {};}

window.defined = function( object ){ return !(typeof object === 'undefined' || object === null); };
window.vdom = window.VD = function( selector,hash ){ return selector ? Aps.dom.get(selector,hash) : this; };
window.vlist= window.VL = function( selector,hash ){ return selector ? Aps.dom.list(selector,hash) : this; };

ApsMd.animate = { // ? 动画模板
    fadeIn:{
        name:'fadeIn',
        frames:{
            0:{opacity:0}
            // 100:{opacity:1}
        }
    },
    fadeOut:{
        name:'fadeOut',
        frames:{
            // 0:{opacity:1},
            100:{opacity:0}
        }
    },
    fadeInDown:{
        name:'fadeInDown',
        frames:{
            0:{ opacity:0,transform:"translate3d(0, -15%, 0)"},
            50:{ opacity:1,transform:"translate3d(0, 2%, 0)"},
            100:{ opacity:1,transform:"translate3d(0, 0, 0)"}
        }
    },
    fadeInUp:{
        name:'fadeInUp',
        frames:{
            0:{ opacity:0,transform:"translate3d(0, 15%, 0)"},
            50:{ opacity:1,transform:"translate3d(0, -2%, 0)"},
            100:{ opacity:1,transform:"translate3d(0, 0, 0)"}
        }
    },
    fadeOutDown:{
        name:'fadeOutDown',
        frames:{
            0:{ opacity:1,transform:"translate3d(0, 0, 0)"},
            50:{ opacity:1,transform:"translate3d(0, 2%, 0)"},
            100:{ opacity:0,transform:"translate3d(0, -150%, 0)"}
        },
        curve:"ease-in"
    },
    fadeOutUp:{
        name:'fadeOutUp',
        frames:{
            0:{ opacity:1,transform:"translate3d(0, 0, 0)"},
            50:{ opacity:1,transform:"translate3d(0, -2%, 0)"},
            100:{ opacity:0,transform:"translate3d(0, 150%, 0)"}
        },
        curve:"ease-in"
    },
    popIn:{
        name:'popIn',
        frames:{
            0:{transform:"scale(0.5)",opacity:0},
            70:{transform:"scale(1.05)",opacity:1},
            100:{transform:"scale(1)",opacity:1}
        },
        // curve:"cubic-bezier(0, 1.57, 0.7, 1.26)"
        curve:"ease-out"
    },
    popOut:{
        name:'popOut',
        frames:{
            0:{transform:"scale(1)",opacity:1},
            30:{transform:"scale(1.05)",opacity:1},
            80:{transform:"scale(0.5)",opacity:0},
            100:{transform:"scale(0)",opacity:0}
        }
        // curve:"cubic-bezier(0.4,-0.14, 0.68, 0.19)"
    },
    slideInRight:{
        name:'slideInRight',
        frames:{
            0:{transform:"translate(100%,0)"},
            100:{transform:"translate(0,0)"}
        },
        curve:"cubic-bezier(0.215, 0.61, 0.355, 1)"
    },
    slideInBottom:{
        name:'slideInBottom',
        frames:{
            0:{transform:"translate(0,100%)"},
            100:{transform:"translate(0,0)"}
        },
        curve:"cubic-bezier(0.215, 0.61, 0.355, 1)"
    },
    slideInLeft:{
        name:'slideInLeft',
        frames:{
            0:{transform:"translate(-100%,0)"},
            100:{transform:"translate(0,0)"}
        },
        curve:"cubic-bezier(0.215, 0.61, 0.355, 1)"
    },
    slideOutBottom:{
        name:'slideOutBottom',
        frames:{
            0:{transform:"translate(0,0)"},
            100:{transform:"translate(0,120%)"}
        },
        curve:"ease-out"
    },
    slideOutRight:{
        name:'slideOutRight',
        frames:{
            0:{transform:"translate(0,0)",filter:"blur(0)"},
            100:{transform:"translate(100%,0)",filter:"blur(1rem)"}
        },
        curve:"cubic-bezier(0.215, 0.61, 0.355, 1)"
    },
    onBlur:function(){
        return {
            name:'onBlur',
            frames:{
                0:{ filter:"blur(0px)" },
                100:{ filter:"blur(5px)" }
            },
            count:2
        }
    }
};

Aps.dom   = { // ! dom操作 快捷方式 VD,vdom 虚拟元素 ,VL,vlist 虚拟列表
    styles:{css:{}},
    vdom:window.vdom,
    init:function(){
        window.vdom = function (selector, hash) {
            return selector ? Aps.dom.get(selector, hash) : this;
        };
        this.vdom   = window.vdom;
    },
    vf:{
        addClass:function(name){
            if (name.indexOf(' ')>-1){
                var list = name.split(' ');
                for( var k in list){ this.el.classList.add(list[k]); }
            }else if(typeof name=='object'){
                for( var i in name){ if(name.hasOwnProperty(i)) this.el.classList.add(name[i]); }
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
        toggleAttr:function(attributeName,attributeValue){
            if(this.attr(attributeName)){
                return this.removeAttr(attributeName);
            }else{
                return this.attr(attributeName, defined(attributeValue) ? attributeValue : attributeName);
            }
        },
        css:function(name,value){
            if(!value){return this.el.style[name];}
            this.el.style[name] = value;
            return this;
        },
        styles:function(styles){
            for(var k in styles){
                if( !styles.hasOwnProperty(k) ) { continue; }
                this.el.style[k] = styles[k];
            }
            return this;
        },
        setAttr:function(attrs){
            if (typeof attrs!=='object') return;
            for(var k in attrs){
                if( !attrs.hasOwnProperty(k) ) { continue; }
                this.attr(k,attrs[k]);
            }
            return this;
        },
        id:function(id){
            if(id){ this.el.id=id; }
            return id?this:this.el.id;
        },
        has:function(name){
            return defined(this[name]);
        },
        attr:function(name,value){
            if (value) { this.el.setAttribute(name,value); }
            return defined(value) ? this : this.el.getAttribute(name);
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
            if (defined(text)) { this.el.textContent = text; }
            return defined(text) ? this : this.el.textContent;
        },
        html:function(html){
            if (typeof html =='object' && html._vdom){ html = html.HTML();}else if(typeof html=='object'){ html=VD(html).HTML();}
            if (defined(html)) { this.el.innerHTML = html; }
            return defined(html) ? this : this.el.innerHTML;
        },
        HTML:function(html){
            if (typeof html =='object' && html._vdom){ html = html.HTML();}else if(typeof html=='object'){ html=VD(html).HTML();}
            if (defined(html)) { this.el.outerHTML = html; }
            return defined(html) ? this : this.el.outerHTML;
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
                if( !this.hasOwnProperty(k) ) { continue; }
                this[k]=null;
            }
        },
        value:function(v){
            var staticDom = " SELECT OPTION INPUT RADIO CHECKBOX TEXTAREA".indexOf(this.el.tagName)<=0;
            if ( defined(v) ){ this.el[staticDom?'innerHTML':'value']=v; }
            return defined(v) ? this : this.el[staticDom?'innerHTML':'value'];
        },
        clearValue:function(){
            this.el.value = null;
            return this;
        },
        property:function(k,v){
            if(defined(v)){ this.el[k]=v;}
            return defined(v) ? this : this.el[k];
        },
        show:function(){
            this.el.style.display = this._display || 'block';
            this.addClass('show');
            return this;
        },
        hide:function(){
            this._display = this.el.style.display;
            this.removeClass('show');
            this.el.style.display = 'none';
            return this;
        },
        fadeIn:function(call){
            this.show();
            this.animate(ApsMd.animate.fadeIn,0,call);
            return this;
        },
        fadeOut:function(call){
            var self = this;
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
            if( typeof show == 'boolean' ){
                show && this.show();
                !show && this.hide();
            }else{
                this.el.style.display==='none' ? this.show() : this.hide();
            }
            return this;
        },
        index:function(selector){
            return selector ?
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

        /* EventListener */
        /*
            事件注册多数情况下通用
            可以为同一事件注册多个响应函数、一个函数可以复用多个元素和非元素
         */
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
        once:function(event,call,options){
            if (options){ options.once=true; }else{ options={once:true}}
            var vd = this;
            this.el.addEventListener(event,function(e){call(vd,e);},options);
            return this;
        },

        click:function(call,options){
            return this.on(Aps.setting.isMobile?'tap':'click',call,options);
        },
        tap:function(call,options){
            return this.on(Aps.setting.isMobile?'tap':'click',call,options);
        },

        /* document Event Listener */
        // onabort,onanimationend,onanimationiteration,onanimationstart,onauxclick,onbeforecopy,onbeforecut,onbeforepaste,onblur,oncancel,oncanplay,oncanplaythrough,onchange,onclick,onclose,oncontextmenu,oncopy,oncuechange,oncut,ondblclick,ondrag,ondragend,ondragenter,ondragleave,ondragover,ondragstart,ondrop,ondurationchange,onemptied,onended,onerror,onfocus,onformdata,onfullscreenchange,onfullscreenerror,ongotpointercapture,oninput,oninvalid,onkeydown,onkeypress,onkeyup,onload,onloadeddata,onloadedmetadata,onloadstart,onlostpointercapture,onmousedown,onmouseenter,onmouseleave,onmousemove,onmouseout,onmouseover,onmouseup,onmousewheel,onpaste,onpause,onplay,onplaying,onpointercancel,onpointerdown,onpointerenter,onpointerleave,onpointermove,onpointerout,onpointerover,onpointerrawupdate,onpointerup,onprogress,onratechange,onreset,onresize,onscroll,onsearch,onseeked,onseeking,onselect,onselectionchange,onselectstart,onstalled,onsubmit,onsuspend,ontimeupdate,ontoggle,ontransitionend,onvolumechange,onwaiting,onwebkitanimationend,onwebkitanimationiteration,onwebkitanimationstart,onwebkitfullscreenchange,onwebkitfullscreenerror,onwebkittransitionend,onwheel
        /*
            HTML Dom提供事件绑定,在某些情况下EventListener无法获取事件时(如插件修改字段值)，使用bind可以获取到
            只能绑定Dom支持的事件
         */
        bind:function( event, call ) {

            this.el[event] = call;
            return this;
        },
        unBind:function( event ) {
            this.el[event] = null;
            return this;
        },

        trigger:function( event ){
            this.el.dispatchEvent( new Event(event||'click') );
        },

        animate:function(animate,optionsOrDuration,callback){
            // 使用css3动画来解决js动画性能问题
            //
            // animate /* 动画脚本 {name:name,frames:{...}} */
            //
            // optionsOrDuration /*  */
            if(typeof animate!='object'){ console.error('animate needs to be object struct! {name:name,frames:{}}, Current type is', typeof animate ); return animate;}
            var createAnimateCss = function(frames,name){
                var wkcss = " transform backface-visibility transform-origin box-sizing";
                var css = "@keyframes "+name+"{";
                if (typeof frames=="string"){ return frames; }
                for( var f in frames ){
                    if( !frames.hasOwnProperty(f) ) { continue; }
                    css += f+'%{';
                    for( var n in frames[f]){
                        if( !frames[f].hasOwnProperty(n) ) { continue; }
                        css += n+":"+frames[f][n]+";";
                    }
                    css += "}";
                }
                css += "}\n";

                css += "@-webkit-keyframes "+name+"{";
                if (typeof frames=="string"){ return frames; }
                for( var k in frames ){
                    if( !frames.hasOwnProperty(k) ) { continue; }
                    css += k+'%{';
                    for( var m in frames[k]){
                        if( !frames[k].hasOwnProperty(m) ) { continue; }
                        css += ((wkcss.indexOf(m)>0?"-webkit-"+m:m)+":")+frames[k][m]+";";
                    }
                    css += "}";
                }
                css += "}\n";
                return css;
            };

            var options  = typeof optionsOrDuration =='object' ? optionsOrDuration : {transformorigin:0,infinite:0};
            var duration = typeof optionsOrDuration =='object' ? (optionsOrDuration.duration || 500)+"ms" : (optionsOrDuration || 500)+"ms";
            var animateName  = typeof animate == 'object' ? animate.name : ( animate || "bounce");

            var delay    = options.delay    ? options.delay+"ms" : '0ms' ;
            var count    = options.count    || 1 ;
            var end      = options.end      || 'forwards'; // forwards || backwards || none || both
            var alternate= options.alternate|| 'normal';   // normal || alternate
            var transformorigin = options.transformorigin|| '';
            var speed    = animate.curve    || 'ease-out';

            if(typeof speed=='object'){ speed = "cubic-bezier("+speed[0]+","+speed[1]+","+speed[2]+","+speed[3]+","+")" ;}
            if(options.infinite){ count = 'infinite'; }

            // modern browsers
            var css = "{ animation-name:" + animateName+";animation-duration:" + duration+";animation-timing-function: " + speed+";animation-delay: " + delay+";animation-iteration-count: " + count+";animation-direction: "+alternate+";"
                + "animation-fill-mode: "+end+";"
                + (transformorigin?"transform-origin: "+transformorigin+";":"");

            // webkit browsers
            css+= "-webkit-animation-name:" + animateName+";-webkit-animation-duration:" + duration+";-webkit-animation-timing-function:" + speed+";-webkit-animation-delay:" + delay+";-webkit-animation-iteration-count:" + count+";-webkit-animation-direction:" + alternate+";"
                + "-webkit-animation-fill-mode: "+end+";"
                + (transformorigin?"webkit-transform-origin: "+transformorigin+";":"");
            css+= "}\n";

            var animateHASH = 'Aps_'+Aps.dom.storagehash.hash(JSON.stringify([animate,duration,options]));

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
                    WebkitAnimation: 'webkitAnimationEnd'
                };

                for (var t in animations) {
                    if (el.style[t] !== undefined) {
                        return animations[t];
                    }
                }
            })(document.createElement('div'));

            this.addClass((customMode?'':'animated ' )+ animationName).once(animationEnd, function(vd) {
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
        move:function(x,y){
            this.styles({
                left: ( x || 0 ) + this.property('offsetLeft') + 'px',
                top: ( y || 0 ) + this.property('offsetTop') + 'px'
            });
            return this;
        },
        moveTo:function(x,y){
            this.styles({
                left: ( typeof x === 'string' ) ? x : (x||0 + 'px'),
                top: ( typeof y === 'string' ) ? y : (y||0 + 'px')
            });
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
                var key = keys[k];
                var v = self[key];
                Object.defineProperty(self,key,{
                    enumerable: true,
                    configurable: false,
                    get: function(key) {
                        return self._data[key];
                    },
                    set: function(key,val) {
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
            hash:hash||Aps.dom.uuid()
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
            on:function(event,call){
                if(typeof call!=='function') console.error('Invalid Inner function type:', typeof call);
                this.list.forEach(function(vd){vd.on(event,function(e){ call(vd,e);})});
            },
            addClass:function(name){ return this.vdf('addClass',name); },
            removeClass:function(name){ return this.vdf('removeClass',name); },
            remove:function(){ return this.vdf('remove'); }
        };
        if(hash) this.vdom[hash]=vlist;
        return hash?this.vdom[hash]:vlist;
    },
    get:function(selector,hash){
        var dom;
        if(typeof selector=='object'){
            if ( selector.hash ) {
                return selector;
            }else{
                dom = selector;
                selector = '';
            }
        }else if(typeof selector=='string'){
            if(selector.indexOf('.')*selector.indexOf('#')!==0 && "a,abbr,address,area,article,aside,audio,b,base,big,blockquote,body,br,button,canvas,caption,code,col,colgroup,command,dd,div,dl,dt,em,embed,fieldset,footer,form,frame,frameset,h1,h2,h3,h4,h5,h6,head,header,hr,html,i,iframe,img,input,label,legend,li,link,map,mark,menu,menuitem,meta,nav,ol,optgroup,option,output,p,param,pre,progress,q,rp,script,section,select,small,source,span,strong,style,sub,summary,sup,table,tbody,td,textarea,tfoot,th,thead,time,title,tr,track,tt,ul,var,video,wbr".indexOf(selector)===-1){
                return Aps.dom.create(selector,hash);
            }
            dom = document.querySelector(selector) ;
        }
        return dom ? this.vm(dom,selector,hash) : 0;
    },
    list:function(selector){
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
        var el     = this.parse(htmlString);
        return this.vm(el,null,hash);
    },
    create:function(type,uid,classes,attrs){
        var id = uid || this.uuid();
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
            for( var k in list){
                // css += k+'{' + list[k] + "} \n";
                if(list.hasOwnProperty(k)) css += k+' ' + list[k] + " \n";
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
            return Object.keys(obj).sort(function (a, b) {
                return value ? (obj[a] > value && obj[a] - obj[b]) : obj[a] - obj[b]
            });
        }
    },
    uuid:function(){
        var i = "v_" + Math.floor(Math.random()*1000) + (new Date()).getTime()+Math.floor(Math.random()*1000);
        return vdom("#"+i) ? this.uuid() : i;
    }
};
