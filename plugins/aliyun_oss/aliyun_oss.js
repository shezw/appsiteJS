"use strict";


var OSS = {

    accessid            : '',
    accesskey           : '',
    host                : '',
    policyBase64        : '',
    signature           : '',
    callbackbody        : '',
    filename            : '',
    key                 : '',
    expire              : 0,
    g_object_name       : '',
    g_object_name_type  : 'random_name',
    now                 : Date.parse(new Date()) / 1000,
    timestamp           : Date.parse(new Date()) / 1000,
    ossurl              : 'aliyun/getOSSSign?mode=JSON',

    send_request:function(type,user)
    {
        var xmlhttp = null;
        var type    = type || 'image';

        if (window.XMLHttpRequest)
        {
            xmlhttp=new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
      
        if (xmlhttp!=null)
        {
            var serverUrl = CONFIGS.urihost+OSS.ossurl+'&type='+type;

            xmlhttp.open( "GET", serverUrl, false );
            if( user ){
                xmlhttp.setRequestHeader('userid',user.userid);
                xmlhttp.setRequestHeader('token',user.token);
                xmlhttp.setRequestHeader('scope',user.scope);
            }
            xmlhttp.send( null );
            return xmlhttp.responseText;
        }else{

            alert("Your browser does not support XMLHTTP.");
        }
    },

    get_signature:function(type,user)
    {
        //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
        OSS.now = OSS.timestamp = Date.parse(new Date()) / 1000; 
        if (OSS.expire < OSS.now + 10)
        {
            var body         = OSS.send_request(type,user);
            var obj          = JSON.parse(JSON.parse(body).content);

            // var obj                = eval ("(" + body + ")");
            OSS.host         = obj['host'];
            OSS.policyBase64 = obj['policy'];
            OSS.accessid     = obj['accessid'];
            OSS.signature    = obj['signature'];
            OSS.expire       = parseInt(obj['expire']);
            OSS.callbackbody = obj['callback'];
            OSS.key          = obj['dir'];
            console.log(OSS);
            return true;
        }
        return false;

    },

    random_string:function(len) {  // 随机字符串 最长32位
    　　len = len || 32;
    　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';   
    　　var maxPos = chars.length;
    　　var pwd = '';
    　　for (var i = 0; i < len; i++) {
        　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },

    get_suffix:function(filename) {   // 获取后缀
        var pos = filename.lastIndexOf('.');
        var suffix = '';
        if (pos != -1) {
            suffix = filename.substring(pos);
        }
        return suffix;
    },

    calculate_object_name:function(filename) // 生成文件名
    {
        if (OSS.g_object_name_type === 'local_name'){
            
            OSS.g_object_name += "${filename}";
        
        }else if (OSS.g_object_name_type === 'random_name'){

            OSS.suffix        = OSS.get_suffix(filename);
            OSS.g_object_name = OSS.key + OSS.random_string(10) + OSS.suffix;
        
        }
        return '';
    },

    get_uploaded_object_name:function(filename) // 生成文件名
    {
        if (OSS.g_object_name_type === 'local_name'){

            var tmp_name = OSS.g_object_name;
            tmp_name = tmp_name.replace("${filename}", filename);
            return tmp_name;

        }else if(OSS.g_object_name_type === 'random_name'){

            return OSS.g_object_name;
        }
    },

    set_upload_param:function(up, filename, ret, user )
    {
        if (ret == false)
        {
            ret = OSS.get_signature(up.settings.filters.mime_types[0].title, user);
        }
        OSS.g_object_name = OSS.key;
        if (filename != '') { 
            var suffix = OSS.get_suffix(filename);
            OSS.calculate_object_name(filename);
        }
        var new_multipart_params = {
            'key'           : OSS.g_object_name,
            'policy'        : OSS.policyBase64,
            'OSSAccessKeyId': OSS.accessid,
            'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
            'callback'      : OSS.callbackbody,
            'signature'     : OSS.signature,
        };

        up.setOption({
            'url': OSS.host,
            'multipart_params': new_multipart_params,
        });

        up.start();
    },

};


