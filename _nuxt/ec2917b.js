(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{148:function(n,e,t){"use strict";var r=t(6),o=t(149)(6),l="findIndex",c=!0;l in[]&&Array(1)[l]((function(){c=!1})),r(r.P+r.F*c,"Array",{findIndex:function(n){return o(this,n,arguments.length>1?arguments[1]:void 0)}}),t(75)(l)},149:function(n,e,t){var r=t(19),o=t(74),l=t(20),c=t(13),f=t(150);n.exports=function(n,e){var t=1==n,h=2==n,v=3==n,w=4==n,y=6==n,d=5==n||y,m=e||f;return function(e,f,k){for(var x,T,S=l(e),_=o(S),A=r(f,k,3),I=c(_.length),j=0,E=t?m(e,I):h?m(e,0):void 0;I>j;j++)if((d||j in _)&&(T=A(x=_[j],j,S),n))if(t)E[j]=T;else if(T)switch(n){case 3:return!0;case 5:return x;case 6:return j;case 2:E.push(x)}else if(w)return!1;return y?-1:v||w?w:E}}},150:function(n,e,t){var r=t(151);n.exports=function(n,e){return new(r(n))(e)}},151:function(n,e,t){var r=t(9),o=t(103),l=t(2)("species");n.exports=function(n){var e;return o(n)&&("function"!=typeof(e=n.constructor)||e!==Array&&!o(e.prototype)||(e=void 0),r(e)&&null===(e=e[l])&&(e=void 0)),void 0===e?Array:e}},152:function(n,e,t){"use strict";t.r(e);t(30),t(41),t(27),t(43),t(42),t(31),t(148),t(76),t(28),t(29),t(14);function r(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}function o(n,e){for(var i=0;i<e.length;i++){var t=e[i];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(n,t.key,t)}}function l(n,e,t){return e&&o(n.prototype,e),t&&o(n,t),n}function c(n,e){var t;if("undefined"==typeof Symbol||null==n[Symbol.iterator]){if(Array.isArray(n)||(t=function(n,e){if(!n)return;if("string"==typeof n)return f(n,e);var t=Object.prototype.toString.call(n).slice(8,-1);"Object"===t&&n.constructor&&(t=n.constructor.name);if("Map"===t||"Set"===t)return Array.from(n);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return f(n,e)}(n))||e&&n&&"number"==typeof n.length){t&&(n=t);var i=0,r=function(){};return{s:r,n:function(){return i>=n.length?{done:!0}:{done:!1,value:n[i++]}},e:function(n){throw n},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,l=!0,c=!1;return{s:function(){t=n[Symbol.iterator]()},n:function(){var n=t.next();return l=n.done,n},e:function(n){c=!0,o=n},f:function(){try{l||null==t.return||t.return()}finally{if(c)throw o}}}}function f(n,e){(null==e||e>n.length)&&(e=n.length);for(var i=0,t=new Array(e);i<e;i++)t[i]=n[i];return t}var h={data:function(){var n=function(){function n(e,t){r(this,n),this.lhs=e,this.rhs=t}return l(n,[{key:"eval",value:function(){if(void 0!==this.lhs.contents&&1==this.lhs.contents)return new e(1,void 0,new t(new e([new o(0),new o(1),this.rhs,new o(0)])));var n=this.rhs.hasTwo()?new o(2):this.lhs,r=this.lhs.hasTwo()?new o(2):this.rhs;return n=n.eval(),r=r.eval(),new e([n,new t(r)])}},{key:"hasTwo",value:function(){return this.lhs.hasTwo()||this.rhs.hasTwo()}},{key:"lift",value:function(){return new n(this.lhs.lift(),this.rhs.lift())}},{key:"toString",value:function(){return this.lhs+"="+this.rhs}}]),n}(),e=function(){function n(e){r(this,n),this.terms=e}return l(n,[{key:"eval",value:function(){return new n(this.terms.map((function(n){return n.eval()})))}},{key:"hasTwo",value:function(){return this.terms.some((function(n){return n.hasTwo()}))}},{key:"lift",value:function(){return new n(this.terms.map((function(n){return n.lift()})))}},{key:"toString",value:function(){return this.terms.map((function(n){return n.toString()})).join("")}}]),n}(),t=function(){function n(e){r(this,n),this.inside=e}return l(n,[{key:"eval",value:function(){return this.inside.eval().lift()}},{key:"hasTwo",value:function(){return this.inside.hasTwo()}},{key:"lift",value:function(){return new n(this.inside.lift())}},{key:"toString",value:function(){return"("+this.inside+")"}}]),n}(),o=function(){function n(e){r(this,n),this.contents=e}return l(n,[{key:"eval",value:function(){return this}},{key:"hasTwo",value:function(){return 2==this.contents}},{key:"lift",value:function(){return new n(Math.min(this.contents+1,2))}},{key:"toString",value:function(){return["7","牧","^^"][this.contents]}}]),n}(),f=function(){function n(e){r(this,n),this.msg=e}return l(n,[{key:"eval",value:function(){return"ParseError!"+this.msg}}]),n}();return{expression:{raw:"",eq:new t(new n(new o(0),new o(0))),parse:function(r){var l,h=[],v=[],w=c(r.replace(/ /g,"").replace(/7/g,"0").replace(/牧/g,"1").replace(/\^\^/g,"2"));try{for(w.s();!(l=w.n()).done;){var y=l.value;switch(y){case"0":case"1":case"2":v.push(new o(parseInt(y)));break;case"=":v.push("=");break;case"(":h.push(v),v=[];break;case")":if(0==h.length)return f("開いていない括弧を閉じようとしました");var d,m=h.pop();if(-1==(d=v.findIndex((function(n){return"="==n}))))m.push(new t(new e(v)));else{if(0==d||d==v.length-1)return new f("文の端に=は置けません．");var k=v.slice(0,d),x=v.slice(d+1);m.push(new t(new n(new e(k),new e(x))))}v=m;break;default:return new f("知らない文字:"+y)}}}catch(n){w.e(n)}finally{w.f()}if(console.log(v),h.length>0)return new f("括弧が閉じきっていません．");if(-1==(d=v.findIndex((function(n){return"="==n}))))return new e(v);if(0==d||d==v.length-1)return new f("文の端に=は置けません．");console.log(k);k=v.slice(0,d),x=v.slice(d+1);return new n(new e(k),new e(x))}}}}},v=t(24),component=Object(v.a)(h,(function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("div",{staticClass:"expression"},[t("form",{on:{submit:function(n){n.preventDefault()}}},[t("label",[n._v("\n            ョ米\n            "),t("input",{directives:[{name:"model",rawName:"v-model",value:n.expression.raw,expression:"expression.raw"}],attrs:{type:"text"},domProps:{value:n.expression.raw},on:{input:function(e){e.target.composing||n.$set(n.expression,"raw",e.target.value)}}})]),n._v(" "),t("button",{attrs:{type:"submit"}},[n._v("胡す")])]),n._v(" "),t("ul",[t("li",[t("p",[n._v(" 元のョ米: "+n._s(n.expression.raw)+" ")])]),n._v(" "),t("li",[t("p",[n._v(" 胡結果: "+n._s(n.expression.parse(n.expression.raw).eval())+" ")])])])])}),[],!1,null,null,null);e.default=component.exports}}]);