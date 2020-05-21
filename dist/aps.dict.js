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
if (!ApsMd){ var ApsMd={};};

ApsMd.locale = {
	'zh-CN':{
		'CURRENT_LANGUAGE':'zh-CN',
		'ACCOUNTS':'账号',
		'ATTACHMENTS':'附注',

		'ACCOUNT_ADD_SUC':'创建账户成功.',

		'INSTANT_VERIFY':'快速登录',
		'INSTANT':'快速登录',
		'NEW_MEMBER':'新用户',
		'REGIST':'注册',
		'LOGIN':'登录',
		'WELCOME':'欢迎',
		'EMAIL':'邮箱',
		'MOBILE':'手机号',
		'NICKNAME':'昵称',
		'VERIFY_CODE':'验证码',
		'SEND_CODE':'发送验证码',
		'EMAIL_ADDRESS':'邮件地址',
		'PASSWORD':'密码',
		'REPASSWORD':'确认密码',
		'LOGIN_ACCOUNT':'账号',
		'CONTINUE':'继续',

		'LOGIN_WECHAT':' 使用微信登录',
		'LOGIN_FACEBOOK':' 使用Facebook登录',

		'TERMS_TITLE':'使用须知',
		'SAFEMODE_ABOUT':'使用指纹识别开启安全模式，当安全模式开启时，每一次打开应用都需要进行指纹认证才可以访问详情.',
		'LOADING':'加载中...',
		'LOADED_ALL':'已经全部加载',
		'LOADING_SUC':'加载成功.',
		'LOADING_FAL':'加载失败.',

		'NEED_LOGIN':'需要先登录!',
		'AUTHORATION':'身份验证',

		'LOGIN_SUC':'登录成功.',
		'LOGIN_FAL':'登录失败.',

		'CANCEL':'取消',
		'OK':'好的',
		'DONE':'完成',

		'UPLOADING':'上传中...',
		'FILE_TOO_LARGE':'你的文件太大了',
		'UNKNOW_FILE_EXT':'不支持的文件类型',
		'UPLOAD_FAL':'上传失败.',
		'UPLOADED':'已经上传过一次了.',

		'SUCCESS':'成功',
		'FAILED':'失败',
		'ERROR':'错误',
		'SUBMITING':'提交中',
		'SUBMIT_SUC':'提交成功.',
		'SUBMIT_FAL':'提交失败.',

		'NEW_ACCOUNT':'添加账号',
		'EDIT_ACCOUNT':'查看/编辑账号',
		'DEFAULT_NAME':'MACUT用户',
		'SIGN_OUT':'退出账号',
		'SIGN_IN':'登录',

		'CONFIRM_OUT':'是否确定退出当前账户?',
		'EDIT_NOTE':'编辑备注',
		'ADD_NOTE':'添加备注',
		'SET_PASS':'设置密码',
		'EDIT_PASS':'编辑密码',

		'WRONG_INPUT':'无效输入',
		'WRONG_MOBILE':'无效手机号',
		'WRONG_VCODE':'无效验证码',
		'WRONG_PASS':'无效密码',
		'WRONG_IDNUMBER':'无效身份证号',
		'WRONG_EMAIL':'无效邮箱地址',
		'WRONG_NICKNAME':'无效昵称',

		'WRONG_INPUT_MSG':'无效输入',
		'WRONG_MOBILE_MSG':'请输入有效的手机号码',
		'WRONG_VCODE_MSG':'请输入4或6位数的数字验证码',
		'WRONG_PASS_MSG':'请输入至少6位的密码',
		'WRONG_IDNUMBER_MSG':'请输入有效身份证号码',
		'WRONG_EMAIL_MSG':'请输入有效的邮箱地址',
		'WRONG_NICKNAME_MSG':'昵称只能由中英文、数字、下划线的非特殊字符组成<br/>不支持输入基本的表情字符😢',

		'CATEGORY_NON':'没有分类信息',
		'CATEGORY_NON_MORE':'没有更多分类',
		'ACCOUNT_NON':'没有账号',
		'ACCOUNT_NON_MORE':'没有更多账号',

		'PASS_NOTMATCH':'两次密码不一致',
		'UNNAMED':'未命名',
		'NO_MODIFY':'没有修改,保存成功',
		'DELETE_ACCOUNT':'是否确定删除该账户',
		'DELETE_CONFIRM':'删除确认',

		'FINGER_OAUTH_FAL':'认证识别失败',
		'NEED_FINGER_OAUTH':'请认证您的身份',
		'FINGER_NOT_SUPPORT':'需要设备支持指纹识别功能',

		'WRONG_LENGTH':function(p){ return p.txt+'的长度限制为'+p.length+'字符以内,请修改后再试.'; },
		'FIELD_REQUIRE':function(p){ return p.txt+'是必填项, 请完善后再试.';},
	},

	'en-WW':{
		'CURRENT_LANGUAGE':'en-WW',
		'ACCOUNTS':'Accounts',
		'ATTACHMENTS':'Attachments',

		'ACCOUNT_ADD_SUC':'Create account success.',

		'INSTANT_VERIFY':'Instant Verify',
		'INSTANT':'Instant',
		'NEW_MEMBER':'New Member',
		'REGIST':'Regist',
		'LOGIN':'Login',
		'WELCOME':'WELCOME',
		'EMAIL':'Email',
		'MOBILE':'Mobile',
		'NICKNAME':'Nickname',
		'EMAIL_ADDRESS':'Email Address',
		'PASSWORD':'Password',
		'REPASSWORD':'Confirm Password',
		'LOGIN_ACCOUNT':'Account',
		'VERIFY_CODE':'Verify Code',
		'SEND_CODE':'Send Code',
		'CONTINUE':'Continue',

		'LOGIN_WECHAT':' Sign In with Wechat',
		'LOGIN_FACEBOOK':' Sign In with Facebook',

		'LOGIN_SUC':'Login Success.',
		'LOGIN_FAL':'Login Failed.',

		'TERMS_TITLE':'Terms and Conditions',
		'SAFEMODE_ABOUT':'You need to use finger authoration for switch your Safe Mode,<br/>When the Safe Mode is enabled. You need to finger authoration every time reload MACUT.',

		'LOADING':'Loading...',
		'LOADED_ALL':'Loaded all.',
		'LOADING_SUC':'Loaded.',
		'LOADING_FAL':'Load failed.',

		'NEED_LOGIN':'You need login to continue!',
		'AUTHORATION':'Authoration',

		'CANCEL':'Cancel',
		'OK':'Okay',
		'DONE':'done',

		'UPLOADING':'Uploading...',
		'FILE_TOO_LARGE':"Your file is too large.",
		'UNKNOW_FILE_EXT':"Unknow file extensions.",
		'UPLOAD_FAL':'Upload failed.',
		'UPLOADED':'Already uploaded.',

		'SUCCESS':'Success.',
		'FAILED':'Failed.',
		'ERROR':'Error.',
		'SUBMITING':'Submiting...',
		'SUBMIT_SUC':'Submited.',
		'SUBMIT_FAL':'Submit failed.',

		'NEW_ACCOUNT':'New account',
		'EDIT_ACCOUNT':'Edit account',
		'DEFAULT_NAME':'MACUT User',
		'SIGN_OUT':'Sign Out',
		'SIGN_IN':'Sign In',

		'CONFIRM_OUT':'Do you want logout?',
		'EDIT_NOTE':'Edit note',
		'ADD_NOTE':'Add note',
		'SET_PASS':'Set password',
		'EDIT_PASS':'Edit password',

		'WRONG_INPUT':'Invalid input',
		'WRONG_MOBILE':'Incorrect mobile',
		'WRONG_VCODE':'Incorrect verify code',
		'WRONG_PASS':'Invalid password',
		'WRONG_IDNUMBER':'Incorrect identity number',
		'WRONG_EMAIL':'Invalid email address',
		'WRONG_NICKNAME':'Invalid nickname',

		'WRONG_INPUT_MSG':'Invalid input',
		'WRONG_MOBILE_MSG':'Please type in the correct mobile number.',
		'WRONG_VCODE_MSG':'Please type in 6 numbers verify code you had received.',
		'WRONG_PASS_MSG':'Please type in at least 6 characters password.',
		'WRONG_IDNUMBER_MSG':'Please type in correct id number.',
		'WRONG_EMAIL_MSG':'Please type in the correct email address.',
		'WRONG_NICKNAME_MSG':'You can only enter Chinese and English, numbers, underscores, minus signs, and you cannot use special symbols and emoji 😢.',

		'CATEGORY_NON':'No category information.',
		'CATEGORY_NON_MORE':'No more category information.',
		'ACCOUNT_NON':'No account.',
		'ACCOUNT_NON_MORE':'No more account',

		'PASS_NOTMATCH':'Passwords not match.',
		'MAX_ATTACH':'The maximum number of attachments reached.',
		'REQ_ATTACH_VAL':'Attachment value is required.',
		'UNNAMED':'Un Named',
		'NO_MODIFY':'No modification, save completed',
		'DELETE_ACCOUNT':'Do you want delete this account.',
		'DELETE_CONFIRM':'Delete confirm',

		'FINGER_OAUTH_FAL':'Identity Verify Failed.',
		'NEED_FINGER_OAUTH':'Please Verify Your Identity.',
		'FINGER_NOT_SUPPORT':'Need the Local Authentication on your device.',

		'WRONG_LENGTH':function(p){ return p.txt+' is limited to '+p.length+' characters, please modify.' },
		'FIELD_REQUIRE':function(p){ return p.txt+' is Required, Please complete the form';},

	}
};

ApsMd.dict = { // ! 转换器字典 # dictionary of converter 

	'roombook':{
		0:'off',
		1:'on',
		2:'used'
	},

	category:{
		1:'bankcard',
		2:'email',
		3:'game',
		4:'social',
		5:'website',
		6:'vipcard',
		7:'idcard',
		8:'office',
		9:'other',
	},

	categoryName:{
		bankcard:'Bank Card',
		email:'Email',
		game:'Game',
		social:'Social',
		website:'Website',
		vipcard:'Vip Card',
		idcard:'ID Card',
		office:'Office/House',
		other:'Other',
	},

	categoryColor:{
		email:'blue',
		social:'green',
		game:'purper',
		website:'blue',
		bankcard:'gold',
		vipcard :'red',
		idcard:'bgreen',
		office:'brown',
		other:'light',
	},

	categoryIcon:{
		email:"Micon icon-email",
		social:"Micon icon-social",
		game:"Micon icon-game",
		website:"Micon icon-website",
		bankcard:"Micon icon-bank",
		vipcard:"Micon icon-vipcard",
		idcard:"Micon icon-personal",
		office:"Micon icon-office",
		other:"Micon icon-other",
	},

};




ApsMd.animate = { // ? 动画模板
	fadeIn:{
		name:'fadeIn',
		frames:{
			0:{opacity:0},
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
	scaleIn:{
		name:'scaleIn',
		frames:{
			0:{width:0,height:0},
			// 100:{opacity:1}
		}
	},
	scaleOut:{
		name:'scaleOut',
		frames:{
			// 0:{opacity:1},
			100:{width:0,height:0}
		}
	},
	scaleInX:{
		name:'scaleInX',
		frames:{
			0:{width:0,},
			// 100:{opacity:1}
		}
	},
	scaleOutX:{
		name:'scaleOutX',
		frames:{
			// 0:{opacity:1},
			100:{width:0,}
		}
	},
	scaleInY:{
		name:'scaleInY',
		frames:{
			0:{height:0},
			// 100:{opacity:1}
		}
	},
	scaleOutY:{
		name:'scaleOutY',
		frames:{
			// 0:{opacity:1},
			100:{height:0}
		}
	},
	fadeInDown:{
		name:'fadeInDown',
		frames:{
			0:{ opacity:0,transform:"translate3d(0, -15%, 0)"},
			50:{ opacity:1,transform:"translate3d(0, 2%, 0)"},
			100:{ opacity:1,transform:"translate3d(0, 0, 0)"},
		}
	},
	fadeInUp:{
		name:'fadeInUp',
		frames:{
			0:{ opacity:0,transform:"translate3d(0, 15%, 0)"},
			50:{ opacity:1,transform:"translate3d(0, -2%, 0)"},
			100:{ opacity:1,transform:"translate3d(0, 0, 0)"},
		}
	},
	fadeOutDown:{
		name:'fadeOutDown',
		frames:{
			0:{ opacity:1,transform:"translate3d(0, 0, 0)"},
			50:{ opacity:1,transform:"translate3d(0, 2%, 0)"},
			100:{ opacity:0,transform:"translate3d(0, -150%, 0)"},
		},
		curve:"ease-in"
	},
	fadeOutUp:{
		name:'fadeOutUp',
		frames:{
			0:{ opacity:1,transform:"translate3d(0, 0, 0)"},
			50:{ opacity:1,transform:"translate3d(0, -2%, 0)"},
			100:{ opacity:0,transform:"translate3d(0, 150%, 0)"},
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
			100:{transform:"scale(0)",opacity:0},
		},
		// curve:"cubic-bezier(0.4,-0.14, 0.68, 0.19)"
	},
	slideInRight:{
		name:'slideInRight',
		frames:{
			0:{transform:"translate(100%,0)"},
			100:{transform:"translate(0,0)"},
		},
		curve:"cubic-bezier(0.215, 0.61, 0.355, 1)"
	},
	slideInBottom:{
		name:'slideInBottom',
		frames:{
			0:{transform:"translate(0,100%)"},
			100:{transform:"translate(0,0)"},
		},
		curve:"cubic-bezier(0.215, 0.61, 0.355, 1)"
	},
	slideInLeft:{
		name:'slideInLeft',
		frames:{
			0:{transform:"translate(-100%,0)"},
			100:{transform:"translate(0,0)"},
		},
		curve:"cubic-bezier(0.215, 0.61, 0.355, 1)"
	},
	slideOutBottom:{
		name:'slideOutBottom',
		frames:{
			0:{transform:"translate(0,0)"},
			100:{transform:"translate(0,120%)"},
		},
		curve:"ease-out"
	},
	slideOutRight:{
		name:'slideOutRight',
		frames:{
			0:{transform:"translate(0,0)",filter:"blur(0)"},
			100:{transform:"translate(100%,0)",filter:"blur(1rem)"},
		},
		curve:"cubic-bezier(0.215, 0.61, 0.355, 1)"
	},
	onBlur:function(range){
		return {
			name:'onBlur',
			frames:{
				0:{ filter:"blur(0px)" },
				100:{ filter:"blur(5px)" }
			},
			count:2,
		}
	}
};
