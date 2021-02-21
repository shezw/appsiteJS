# appsiteJS

中文 | [English](./README.md)

### 介绍

appsiteJS是appsite全栈开发框架的前端js库, 包含了 虚拟dom、AJAX、数据缓存、界面交互效果、本地化等等特性.

### 特性

##### 虚拟dom

vdom 提供了一个类jQuery语法的方式绑定一个关联对象到html dom,同时提供了大多数jQuery方法如 addClass(), show(), remove().
**vdom总是只选择一个确定的dom. VD() 是 vdom()的缩写.**
**vlist用于选择一系列dom. VL()是vlist()的缩写.**

```javascript
// CSS选择器
let title = VD('h1.title');
	title.toggleClass('active');
	
// 系列(list)选择	
let selections = VL('select option');	
    selections.each( (vd)=>{ // 每个vd都是一个vdom对象
        console.log( vd.isSelected() );
        console.log( vd.value() ); 
    });	

// 读取和设置输入框的值	
let field = VD('.filed');
	console.log( field.value() );
	field.value('Value Changed');
	console.log( filed.value() );

// 绑定事件响应
VD("select.picker").on( 'change', (vd)=> {
    console.log( vd.value() );
});
```

vdom 提供一个animate()方法来对dom添加CSS动画，需要使用一个动画描述参数.
```javascript
let fadeInUpAnimate = {
    name:'fadeInUp',
    frames:{
        0:{ opacity:0,transform:"translate3d(0, 15%, 0)"},
        50:{ opacity:1,transform:"translate3d(0, -2%, 0)"},
        100:{ opacity:1,transform:"translate3d(0, 0, 0)"},
    }
}

VD('.popup').animate( fadeInUpAnimate );

/**
 * animateCSS() 用于实现 aps.i18n.js 中已经内置的动画效果
 * 在dist/aps.dict.js中可查看更多
 */

VD('.popup').animateCSS('fadeInUp', ()=>{} );

```

### 文档

制作中...

### 如何使用

在头部引入 aps.css.
在底部引入 aps.i18n.js, aps.js.
```html
<link rel="stylesheet" href="./dist/aps.css">
</head>

</body>

<script src="dist/aps.i18n.js"></script><!-- 国际化 -->

<script src="dist/aps.js"></script><!-- 主文件 -->

```


aps.manager.js用于appsite管理后台.
