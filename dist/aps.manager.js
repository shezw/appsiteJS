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
|                                                                            |\\\
|   AppSite Front Core Functions                                             |\\\
|   Copyright: Donsee.cn 2018.05 - 2018.09                                   |\\\
|   Author   : Sprite                                                        |\\\
|   Email    : hello@shezw.com                                               |\\\
|                                                                            |\\\
 \===========================================================================\\\\
  \===========================================================================\\\
   \===========================================================================\\
*/

"use strict";

var MANAGER = Aps.fn({

    testApi:function( previewerID ){

        var preData = Aps.former.checkForm(vlist('.a-field.valid'));

        if(!preData) return;

        this.resetOptions();

        var action = preData.action;
        var url    = preData.url || CONFIGS.apihost;
        var params = JSON.parse(preData.params);
        var headers= preData.headers ? JSON.parse(preData.headers) : 0;

        if( preData.userid ){
            this.addHeaders( {userid:preData.userid} );
        }
        if( preData.token ){
            this.addHeaders( {token:preData.token} );
        }
        if( preData.scope ){
            this.addHeaders( {scope:preData.scope} );
        }

        if( headers ){
            this.addHeaders( headers );
        }
        this.addParams( params );
        this.setAction( action );
        this.setUpdate(  );

        this.setUrl(url);

        this.setCallback(function(data,status) {
            vdom("#"+previewerID).empty().html(JSON.stringify(data, null, 2));
            hljs.initHighlightingOnLoad();
        });

        this.setErrorCall(function(status) {
            alert(status||"No response");
        })

        if(previewerID){
            vdom('#'+previewerID).html("requesting...");
        }

        Aps.cajax.request(this.options);

    },

    filterSearch:function() {

        var filters = Aps.former.checkForm(vlist('.filterSearch .a-field.valid'));
        if(!filters){ return; }

        Aps.query.addFilter( $filters );

    },

    add:function(data,itemClass,call){

        if(data){
            data.itemClass = itemClass;
        }else{
            var data = Aps.former.checkForm(vlist('.a-field.valid'));
            if(!data) return;
            data = {
                data:data,
                itemClass:itemClass
            };
        }
        Aps.gui.submitting('正在向服务器提交请求...');
        MANAGER.post('manager/addItem',call||MANAGER.chooseCall,data,{update:1,needLogin:1});

    },

    update:function(data,id,itemClass,call){

        if(data){
            data.itemType = itemClass;
            data.itemId   = id;
        }else{
            var data = Aps.former.checkForm(vlist('.a-field.valid'));
            if(!data) return;
            data = {
                data:data,
                itemClass:itemClass,
                itemId:id
            }
        }
        MANAGER.post('manager/updateItem',call||MANAGER.reloadCall,data,{update:1,needLogin:1});

    },

    preRemove:function(id,type,call){

        Aps.gui.confirm('是否确认删除?','删除后不可恢复.',{okTxt:"删除",onOk:function(){
                MANAGER.remove(id,type,call);
            }});

    },

    postFormToAction:function(action,data,call,noAuth){

        var data = data || Aps.former.checkForm(vlist('.a-field.valid'));
        if(!data) return;

        Aps.gui.submitting('正在向服务器提交请求...');
        MANAGER.post(action,call||MANAGER.backCallDelay,data,{update:1,needLogin:noAuth?0:1});

    },

    preUnbind:function(combineId,itemClass){

        Aps.gui.confirm('是否确认取消绑定?','下次需要可以再次绑定.',{okTxt:"确定",onOk:function(){
                MANAGER.post('unbindCombine',MANAGER.reloadCall,{combineId:combineId,itemtype:itemClass},{update:1,needLogin:1});
            }});

    },

    remove:function(id,type,call){

        var data = {
            itemId:id,
            itemClass:type
        };
        MANAGER.post('manager/removeItem',call||MANAGER.reloadCall,data,{update:1,needLogin:1});

    },

    deleteMedia:function( mediaId, call ){

        var data = {
            mediaId:mediaId
        };
        MANAGER.post('manager/deleteMedia',call||MANAGER.reloadCall,data,{update:1,needLogin:1});

    },

    status:function( id,type,status,call ){

        var data = {
            itemClass:type,
            itemId:id,
            data:{
                status:status
            }
        };

        MANAGER.post('manager/updateItem',call||MANAGER.reloadCall,data,{update:1,needLogin:1});
    },

    trash:  function(id,type){ this.status( id, type, 'trash' );	},
    recover:function(id,type){ this.status( id, type, 'enabled' );	},
    online: function(id,type){ this.status( id, type, 'enabled' );	},
    offline:function(id,type){ this.status( id, type, 'offline' );	},
    block:  function(id,type){ this.status( id, type, 'block' );	},

    feature:function(id,type){

        this.setFeature(id,type,1);

    },

    cancelFeature:function(id,type){

        this.setFeature(id,type,0);

    },

    setFeature:function(id,type,isFeatured,call){

        var data = {
            itemClass:type,
            itemId:id,
            data:{
                featured:isFeatured||0
            }
        };

        MANAGER.post('manager/updateItem',call||MANAGER.reloadCall,data,{update:1,needLogin:1});

    },

    sortUp:function(id,type,size,call){

        var data = {
            itemClass:type,
            itemId:id,
            size:size||1
        };

        MANAGER.post('manager/sortIncreaseItem',call||MANAGER.reloadCall,data,{update:1,needLogin:1});

    },

    sortDown:function(id,type,size,call){

        var data = {
            itemClass:type,
            itemId:id,
            size:size||1
        };

        MANAGER.post('manager/sortDecreaseItem',call||MANAGER.reloadCall,data,{update:1,needLogin:1});

    },

    autoCompelete:function( keyList ){

        for( var key in keyList ){

            if(vdom('#'+key)){
                vdom('#'+key).value(keyList[key]);
            }
        }

        Aps.gui.toast('自动填写完毕,请继续完善其他内容.');
    },

    featureComment:function(commentid){

        this.setCommentFeature(commentid,1);

    },

    cancelFeatureComment:function(commentid){

        this.setCommentFeature(commentid,0);

    },

    setCommentFeature:function(commentid,isFeatured,call){

        var data = {
            commentid:commentid,
            featured:isFeatured||0
        };

        MANAGER.post('updateComment',call||MANAGER.reloadCall,data,{update:1,needLogin:1});

    },

    blockComment:function(commentid){
        this.setCommentStatus(commentid,'blocked');
    },

    recoverComment:function(commentid){
        this.setCommentStatus(commentid,'enabled');
    },

    setCommentStatus:function(commentid,status,call){

        var data = {
            commentid:commentid,
            status:status||0
        };

        MANAGER.post('updateComment',call||MANAGER.reloadCall,data,{update:1,needLogin:1});

    },

    bindItems:function(itemid,itemtype,relationid,relationtype,type,rate){

        var data = {
            itemid:itemid,
            itemtype:itemtype,
            relationid:relationid,
            relationtype:relationtype,
            type:type,
            rate:rate||3,
        };

        MANAGER.post('bindItems',MANAGER.reloadCall,data,{update:1,needLogin:1});
    },

    unBindItem:function(combineid){

        var data = {
            combineid:combineid,
        };

        MANAGER.post('unBindItem',MANAGER.reloadCall,data,{update:1,needLogin:1});

    },

    call:function(data,method,t){

        if (!Aps.cajax.successful(data)){

            Aps.gui.submitted('提交失败',2500,'failed');
            Aps.gui.alert( data.message );

        }else{

            Aps.gui.submitted(data.message,2500,'success');

            setTimeout(function(){

                switch(method){
                    case 'back':
                        Aps.router.back();
                        break;
                    case 'reload':
                        Aps.router.reload();
                        break;
                    case 'confirmReload':
                        Aps.gui.confirm('Success','Do you want reload?',function(){ Aps.router.reload(); });
                        break;
                    case 'choose':
                        Aps.gui.confirm('成功','请选择返回或刷新',{
                            onOk:function(){
                                Aps.router.reload();
                            },
                            onCancel:function(){
                                Aps.router.back(-1);
                            },
                            okText:'刷新',
                            cancelText:'返回上一页',
                        });
                        break;
                    case 'stay':
                        break;
                    default:
                        break;
                }
            },t||500);
        }

    },

    backCall:function(data){ MANAGER.call(data,'back'); },
    stayCall:function(data){ MANAGER.call(data,'stay'); },
    reloadCall:function(data){ MANAGER.call(data,'reload'); },
    confirmReloadCall:function(data){ MANAGER.call(data,'confirmReload'); },
    chooseCall:function(data){ MANAGER.call(data,'choose'); },

    backCallDelay:function(data){  MANAGER.call(data,'back',2000); },
    stayCallDelay:function(data){ MANAGER.call(data,'stay',2000); },
    reloadCallDelay:function(data){ MANAGER.call(data,'reload',2000); },


    // custom functions
    setSeatToActiveround:function(seatsid){

        this.post('itemDetail',this.setSeatToActiveroundCall,{itemtype:'seats',itemid:seatsid},{needLogin:1,update:1});

        // Aps.gui.alert('当前版本暂未提供设置座位模版功能','提示');

    },

    setSeatToActiveroundCall:function(data){

        var round = data['content'][0];

        vdom('#seats').value(round.seats);
        Aps.seats.init(1);
        Aps.seats.preview();
        Aps.seats._listen();

    },

    addUser:function(data,type,call){

        if(data){
            data.character = type;
        }else{
            var data = Aps.former.checkForm(vlist('.a-field.valid'));
            if(!data) return;
            data.character = type;
        }
        Aps.gui.submitting('正在向服务器提交请求...');
        MANAGER.post('addUser',call||MANAGER.reloadCall,data,{update:1,needLogin:1});

    },

    updateUser:function(data,type,call) {

        if(data){
            data.character = type;
        }else{
            var data = Aps.former.checkForm(vlist('.a-field.valid'));
            if(!data) return;
            if (type){ data.character = type; }
        }
        Aps.gui.submitting('正在向服务器提交请求...');
        MANAGER.post('updateUser',call||MANAGER.reloadCall,data,{update:1,needLogin:1});

    },

    statusUser:function(userid,status,call) {

        var status = status || 'block';
        if(!userid){ return; }

        Aps.gui.submitting('正在向服务器提交请求...');
        MANAGER.post('updateUser',call||MANAGER.reloadCall,{user:userid,status:status},{update:1,needLogin:1})

    },

    blockUser:function(userid) {
        this.statusUser(userid,'blocked');
    },

    recoverUser:function(userid) {
        this.statusUser(userid,'enabled');
    },

    applyRequest:function(requestid) {

        this.statusRequest(requestid,'done');

    },

    rejectRequest:function(requestid) {

        this.statusRequest(requestid,'rejected');

    },

    statusRequest:function(requestid,status,call) {

        var status = status || 'rejected';
        if(!requestid){ return; }

        Aps.gui.submitting('正在向服务器提交请求...');
        MANAGER.post('statusRequest',call||MANAGER.reloadCall,{requestid:requestid,status:status},{update:1,needLogin:1})

    },


    // 改成可以post到特定页面的模式

    // 显示预览窗口
    preview:function(url,windowSize) {

        var data = Aps.former.checkForm(vlist('.a-field.valid'));

        Aps.router.newWindow(url,data, windowSize ? {width:windowSize.width,height:windowSize.height}: null );

    },


    exportXsl:function(group,filter){

        var	data = {'group':group,'filter':filter};

        this.post('exportData',this.exportXslCall,data,{needLogin:1,update:1},data);

    },

    exportXslCall:function(data,status,transfer){

        var Workbook=function() {
            if(!(this instanceof Workbook)) {return new Workbook();}
            this.SheetNames = [];
            this.Sheets = {};
        };
        // json = JSON.parse(data);
        if (data.status!==0) {
            // console.error("获取数据失败.<br/><br/>Failed.");
            Aps.gui.toast(data.message);
        }else{

            var struct    = EXPORTS.STRUCT[transfer.group];
            var Exports = [];
            var tablehead = {};

            for( var key in struct){
                tablehead[key] = struct[key].label;
            }

            Exports.push(tablehead);

            for (var i = 0; i < data.content.length; i++) {
                Exports.push(data.content[i]);
            }

            // Exports = CONVERS.converFullCustomer(Exports);

            if (typeof(Exports)=='array') {
                console.log('array');
            }else if(typeof(Exports)=='object'){
                // console.log(Exports);
                var EXCELDATA = [];
                for (var i = 0; i < Exports.length; i++) {
                    EXCELDATA.push(EXPORTS.objtoarray(Exports[i],struct));
                }
                // console.log(EXCELDATA);

                var wb      = new Workbook();
                var ws      = XLSX.utils.aoa_to_sheet(EXCELDATA);
                var ws_name = transfer.group+(new Date().getTime());

                wb.SheetNames.push(ws_name);    //随便起，字符串也好传变量也好
                wb.Sheets[ws_name] = ws;

                //如果要设置单元格的宽度
                //1.设置一组（也有px版的，wch改为wpx即可）
                var wswch = EXPORTS.STYLE[transfer.group];
                ws['!cols']= wswch;

                XLSX.writeFile(wb, ws_name+'.xlsx');

            }else{
                console.log(typeof(Exports));
            }

        }
    },



    // preViewOfficeMessage:function( userid, preMessage ){

    //     if(Aps.cache.has('viewOfficeMsg')){
    //         Aps.gui.toast('一天内只能发送一条预约消息.');
    //     }

    //     Aps.gui.form('请输入预约留言',"<div class='a-field valid require' a-field-type='textarea' a-field-name='content' a-field-length=200><label></label><textarea class='a-field-main'>"+(preMessage||'')+"</textarea>",
    //         {
    //             okTxt:"确定",
    //             cancelTxt:"取消",
    //             onOk:function(){

    //                 var form = Aps.former.checkForm(VL('.a-modal-form .a-field.valid'));
    //                 if( !form ){ return false; }

    //                 form.userid = userid;

    //                 MANAGER.postFormToAction('viewOfficeMessage',form,MANAGER.reloadCall);
    //                 Aps.cache.add('viewOfficeMsg',true,3600*24);
    //                 return true;
    //             }
    //         });

    // },

    // preApplyContractRequest:function(requestid,data){

    //     Aps.gui.confirm('确认签约',"您将和 "+data.party+" 正式签约,签约主体为:"+data.target+",请确认.",
    //         {
    //             okTxt:"确定",
    //             cancelTxt:"取消",
    //             onOk:function(){

    //                 MANAGER.postFormToAction('applyContractRequest',{requestid:requestid},MANAGER.reloadCall);
    //                 return true;
    //             }
    //         });

    // },

    // preDelegateService:function( serviceid ){

    //     if(!Aps.user.needLogin(true)){
    //         return;
    //     }

    //     Aps.gui.form('请输入您的联系方式',"<form class='mb-0 form service'><div class='field valid require' fieldname='replyid' fieldtype='input' length='8'><input type='hidden' class='mainfield' value='"+serviceid+"'></div><div class='form-group field valid require' fieldname='content.nickname' fieldtype='input' length='12'><label>您的称呼:</label><input type='text' class='form-control mainfield'></div><div class='form-group field valid require' fieldname='content.contact' fieldtype='input' length='16' checktype='mobile'><label>您的联系电话:</label><input type='mobile' class='form-control mainfield'></div></form>",
    //         {
    //             okTxt:"确定预约",
    //             cancelTxt:"取消",
    //             onOk:function(){
    //                 Aps.user.customerDelegate('.service .a-field.valid','service');
    //             }
    //         });
    // },


    // preRejectContractRequest:function(requestid){

    //     Aps.gui.confirm('拒绝签约邀请',"拒绝后将不能再通过,请确认.",
    //         {
    //             okTxt:"确定",
    //             cancelTxt:"取消",
    //             onOk:function(){

    //                 MANAGER.postFormToAction('rejectContractRequest',{requestid:requestid},MANAGER.reloadCall);
    //                 return true;
    //             }
    //         });

    // },

});



var MULTISELECTOR = Aps.fn({

    key:'areaid',
    api:'getAreaList',
    selector:'#areaSelector',

    module:"<option value={{key}}>{{title}}</option>",

    customCall:0,

    new:function( selector, api, key, call ){

        var A = {};

        for( var k in this){
            A[k] = this[k];
        }

        return A.init(selector,api,key,call);
    },

    init:function(selector,api,key,call){

        var self = this;

        self.selector = selector || '#areaSelector';
        self.api = api || 'getAreaList';
        self.key = key || 'areaid';
        self.module = self.module.replace("key",self.key);
        self.customCall = call || 0;

        vlist(selector + ' select').on('change',function(vd){ self.selected(vd); });

        return self;
    },

    selected:function(vd){

        if(!vd.value()){

            this.clear(vd.id());
            vd.addClass('a-field-main');
            return;
        }

        vlist(this.selector+' select').removeClass('a-field-main');

        vd.addClass('a-field-main');

        this.clear(vd.id());
        this.request(vd.value());

    },

    clear:function(fromid){

        var fromid = fromid;
        var selectors = vlist(this.selector + ' select');
        var removeble = 0;

        for (var i = 0; i < selectors.list.length; i++) {
            if(removeble){
                selectors.list[i].remove();
            }else{
                if(selectors.list[i].id()==fromid){
                    removeble = 1;
                }
            }
        }
        this.averangeWidth();

    },

    request:function(keyid){

        var self = this;
        var data = {  };
        data.parentid = keyid;

        MANAGER.post(this.api,function(data){ self.callback(data); } ,data,{update:1,needLogin:1});

    },

    callback:function(data){

        if(data.status>0){

            return;
        }

        this.append(data.content.list);
        if( typeof this.customCall == 'function' ){
            this.customCall(data.content.list);
        }

    },

    append:function(list){

        var self = this;
        var html = "<select class='form-control input-c'><option selected=selected disabled=disabled>请选择</option>"
            + Aps.mixer.loop(this.module,list);
        + "</select>";

        var nextSelector = Aps.dom.create(html);

        vdom(this.selector).append(nextSelector);

        nextSelector.on('change',function(vd){self.selected(vd)});

        this.averangeWidth();
        // 平分每个选项的宽度

    },

    averangeWidth:function(vlist){

        var vlist = vlist || VL(this.selector + ' select');

        vlist.vdf('styles',{width:( 100 / vlist.list.length )+"%",float:'left'});

    }

});





var EXPORTS = {

    STRUCT:{
        order:{
            'orderid':{    name:'orderid'   ,     label:'订单ID',      },
            'itemtype_':{  name:'itemtype_' ,     label:'订单类型', },
            'title':{      name:'title'   ,       label:'名称',     },
            'amount':{     name:'amount'   ,      label:'金额',      },
            'userid':{     name:'userid'   ,      label:'用户ID',    },
            'user.nickname':{ name:'nickname' , label:'昵称',      },
            'details.mobile':{name:'mobile'   , label:'下单手机号', },
            'details.name':{ name:'name'   ,    label:'姓名',      },
            'createtime_':{name:'createtime_'  ,  label:'交易时间',  },
            'status_':{    name:'status_'  ,      label:'状态',      },
            'writeoff_':{  name:'writeoff_'  ,    label:'是否核销',   },

        },
        user:{
            'userid':{   name:'userid'   ,      label:'用户ID',      },
            'nickname':{ name:'nickname' ,      label:'昵称',      },
            'mobile':{   name:'mobile'   , label:'手机号', },
            'realname':{ name:'realname'   ,    label:'姓名',      },
            'gender_': { name:'gender_'  ,  label:'性别',  },
            'information.realname': { name:'realname'  ,  label:'实名',  },
            'information.realstatus_': { name:'realstatus_'  ,  label:'性别',  },
            'information.country': { name:'country'  ,  label:'国家',  },
            'information.province': { name:'province'  ,  label:'省份',  },
            'information.city': { name:'city'  ,  label:'城市',  },
            'point':{  name:'point'  ,    label:'瓯圆',   },
            'registtime_':{ name:'registtime_'  ,    label:'注册日期',   },
            'status_':{  name:'status_'  ,      label:'状态',      },

        },

    },

    STYLE:{
        regist:[
            { wpx:40 },
            { wpx:40 },
            { wpx:160 },
            { wpx:70 },
            { wpx:60 },

            { wpx:40 },
            { wpx:40 },
            { wpx:30 },
            { wpx:60 },
            { wpx:100 },
            { wpx:30 },
            { wpx:70 },
            { wpx:200 },
            { wpx:120 },

            { wpx:120 },
            { wpx:120 },
            { wpx:80 },
            { wpx:60 },
            { wpx:140 },

            // { wpx:120 },

            { wpx:80 },
            { wpx:80 },
            { wpx:120 },
            { wpx:120 },
            { wpx:100 },
            { wpx:60 },
            { wpx:60 },
            { wpx:100 },
            { wpx:120 },
            { wpx:100 },
            { wpx:60 },
            { wpx:120 },
            { wpx:60 },
            { wpx:100 },
            { wpx:60 },
            { wpx:120 },
            { wpx:100 },
            { wpx:60 },
            { wpx:40 },
            { wpx:40 },
            { wpx:180 },

            { wpx:200 },

            { wpx:80 },
            { wpx:120 },
            { wpx:120 },
        ],
        order:[
            { wpx:120 },
            { wpx:80 },
            { wpx:280 },
            { wpx:80 },
            { wpx:100 },
            { wpx:160 },
            { wpx:140 },
            { wpx:100 },
            { wpx:160 },
            { wpx:80 },
            { wpx:50 },
        ],
        user:[
            { wpx:100 },
            { wpx:160 },
            { wpx:120 },
            { wpx:80 },
            { wpx:50 },
            { wpx:50 },
            { wpx:50 },
            { wpx:50 },
            { wpx:50 },
            { wpx:50 },
            { wpx:80 },
            { wpx:140 },
            { wpx:80 },
        ],
    },

    // Replace All function
    //
    replaceAll:function(res,FindText, RepText) {
        var preg = "/"+FindText+"/g";
        return res.replace(eval(preg),RepText);
    },

    objtoarray:function(obj,mod){

        var arr = [];
        for( var key in mod ){
            var v = "";
            if (typeof(obj[key])!=='undefined') {
                v = obj[key];
            }else if(key.indexOf('.')>0){

                var d = key.split(".");
                v = obj[d[0]] ? (obj[d[0]][d[1]] || '') : '';

            }
            arr.push(v);
        }
        return arr;
    }


};


var BANNER = Aps.fn({

    typeSelect:function(){

        var modules = {
            homevip:"\
				<option disabled=\"disabled\" selected=\"selected\">请选择</option>\
				<option value=\"vippackage\">会员包</option>",
            hometop:"\
				<option disabled=disabled selected=selected>请选择</option>\
				<option value=activesuit>联盟活动</option>\
				<option value=merchant>商户</option>\
			",
            trainingcourse:"\
				<option disabled=\"disabled\" selected=\"selected\">请选择</option>\
				<option value=\"trainingcourse\">训练营</option>\
			",
        };

        var location = vdom('#bannerLocation').value();

        vdom('#bannerTypeSelect').html(modules[location]);
        vdom('#bannerList').html('');
        vdom('#bannerUrl').value('');

    },

    itemSelect:function(){

        var type    = vdom('#bannerTypeSelect').value();

        var ajaxurl = CONFIGS.serverhost+'manager_index.php';

        this.post('itemList',this.itemSelectCall,{itemclass:type},{update:1,needLogin:1});

    },

    itemSelectCall:function(data){

        if (data.status !==0 ) {

            console.log(data);
            // alert('系统错误');

        }else if(data.content===false){

            vdom('#bannerList').html('');
            Aps.gui.alert('当前分类下没有内容，请先添加内容!');

        }
        var modules = "<option value=\"{{itemid}}\" >{{title}} | 推荐:{{featured}} | 排序:{{sort}} | 简介:{{description}}</option>";
        var list = "<option disabled=\"disabled\" selected=\"selected\">请选择</option>";

        list += Aps.mixer.loop(modules,data.content.list);
        vdom('#bannerList').html(list);
    },

    bannerUrl:function(){

        var type = vdom('#bannerTypeSelect').value();
        var id   = vdom('#bannerList').value();

        var url  = type+'/detail/'+id+'/';

        vdom('#bannerUrl').value(url);

    }



});

