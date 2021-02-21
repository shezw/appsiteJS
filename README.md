# appsiteJS

[中文](./README.zh-CN.md) | English

### Indroduction

appsiteJS is a front-end javascript library for appsite framework, includes virtual dom, AJAX, Data Cache, interaction GUI and i18n features and more.

### Features

##### Virtual dom

Virtual dom provides a jQuery like syntax to bind a v-dom object to a html dom, and most jQuery dom methods such as addClass(), show(), remove().
**vdom always select one dom explicitly. VD() is the abbreviation of vdom().**
**vlist provide a dom list selection. VL() is the abbreviation of vlist().**

```javascript
// CSS selection
let title = VD('h1.title');
	title.toggleClass('active');
	
// list selection	
let selections = VL('select option');	
    selections.each( (vd)=>{ // Every vd is a vdom object
        console.log( vd.isSelected() );
        console.log( vd.value() ); 
    });	

// read and set value	
let field = VD('.filed');
	console.log( field.value() );
	field.value('Value Changed');
	console.log( filed.value() );

// bind event
VD("select.picker").on( 'change', (vd)=> {
    console.log( vd.value() );
});
```

vdom provide an extra feature animate() to add css animate to doms by an animate description object.
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
 * animateCSS() is used for prepared animates in aps.i18n.js
 * see more at dist/aps.i18n.js
 */

VD('.popup').animateCSS('fadeInUp', ()=>{} );

```

### Documentation

Writing...

### How to use

include aps.css at head part.
include aps.i18n.js, aps.js at foot part.
```html
<link rel="stylesheet" href="./dist/aps.css">
</head>

</body>

<script src="dist/aps.i18n.js"></script><!-- i18n -->

<script src="dist/aps.js"></script><!-- core -->

```


aps.manager.js is used for appsite back-end management.
