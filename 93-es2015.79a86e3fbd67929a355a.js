(window.webpackJsonp=window.webpackJsonp||[]).push([[93],{pdqh:function(e,t,o){"use strict";o.r(t),o.d(t,"iosTransitionAnimation",(function(){return d})),o.d(t,"shadow",(function(){return s})),o("HWnG");var a=o("Elhb");const r=(e,t="top")=>`calc(${e}px + var(--ion-safe-area-${t}))`,n=e=>document.querySelector(`${e}.ion-cloned-element`),s=e=>e.shadowRoot||e,l=e=>e.querySelector("ion-header:not(.header-collapse-condense-inactive) ion-title[size=large]"),c=(e,t)=>{const o=e.querySelectorAll("ion-buttons");for(const a of o){const e=a.closest("ion-header"),o=e&&!e.classList.contains("header-collapse-condense-inactive"),r=a.querySelector("ion-back-button"),n=a.classList.contains("buttons-collapse");if(null!==r&&(n&&o&&t||!n))return r}return null},i=(e,t,o,s)=>{const l=t?"7px":"-7px",c=t?"-4px":"4px",i=t?"-4px":"4px",f=t?"right":"left",d=t?"left":"right",m=[{offset:0,opacity:0,transform:`translate(${l}, ${r(8)}) scale(2.1)`},{offset:1,opacity:1,transform:`translate(${c}, ${r(-40)}) scale(1)`}],y=[{offset:0,opacity:1,transform:`translate(${c}, ${r(-40)}) scale(1)`},{offset:.6,opacity:0},{offset:1,opacity:0,transform:`translate(${l}, ${r(8)}) scale(2.1)`}],b=o?y:m,p=[{offset:0,opacity:0,transform:`translate3d(${i}, ${r(-35)}, 0) scale(0.6)`},{offset:1,opacity:1,transform:`translate3d(${i}, ${r(-40)}, 0) scale(1)`}],u=[{offset:0,opacity:1,transform:`translate(${i}, ${r(-40)}) scale(1)`},{offset:.2,opacity:0,transform:`translate(${i}, ${r(-35)}) scale(0.6)`},{offset:1,opacity:0,transform:`translate(${i}, ${r(-35)}) scale(0.6)`}],S=o?u:p,$=Object(a.a)(),T=Object(a.a)(),E=n("ion-back-button"),h=E.querySelector(".button-text"),q=E.querySelector("ion-icon");E.text=s.text,E.mode=s.mode,E.icon=s.icon,E.color=s.color,E.disabled=s.disabled,E.style.setProperty("display","block"),E.style.setProperty("position","fixed"),T.addElement(q),$.addElement(h),$.beforeStyles({"transform-origin":`${f} center`}).beforeAddWrite(()=>{s.style.setProperty("display","none")}).afterAddWrite(()=>{s.style.setProperty("display",""),E.style.setProperty("display","none")}).keyframes(b),T.beforeStyles({"transform-origin":`${d} center`}).keyframes(S),e.addAnimation([$,T])},f=(e,t,o,s)=>{const l=t?"-18px":"18px",c=t?"right":"left",i=[{offset:0,opacity:0,transform:`translate(${l}, ${r(0)}) scale(0.49)`},{offset:.1,opacity:0},{offset:1,opacity:1,transform:`translate(0, ${r(49)}) scale(1)`}],f=[{offset:0,opacity:.99,transform:`translate(0, ${r(49)}) scale(1)`},{offset:.6,opacity:0},{offset:1,opacity:0,transform:`translate(${l}, ${r(0)}) scale(0.5)`}],d=o?i:f,m=n("ion-title"),y=Object(a.a)();m.innerText=s.innerText,m.size=s.size,m.color=s.color,y.addElement(m),y.beforeStyles({"transform-origin":`${c} center`,height:"46px",display:"",position:"relative"}).beforeAddWrite(()=>{s.style.setProperty("display","none")}).afterAddWrite(()=>{s.style.setProperty("display",""),m.style.setProperty("display","none")}).keyframes(d),e.addAnimation(y)},d=(e,t)=>{try{const o="cubic-bezier(0.32,0.72,0,1)",r="opacity",n="transform",d="0%",m=.8,y="rtl"===e.ownerDocument.dir,b=y?"-99.5%":"99.5%",p=y?"33%":"-33%",u=t.enteringEl,S=t.leavingEl,$="back"===t.direction,T=u.querySelector(":scope > ion-content"),E=u.querySelectorAll(":scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *"),h=u.querySelectorAll(":scope > ion-header > ion-toolbar"),q=Object(a.a)(),X=Object(a.a)();if(q.addElement(u).duration(t.duration||540).easing(t.easing||o).fill("both").beforeRemoveClass("ion-page-invisible"),S&&e){const t=Object(a.a)();t.addElement(e),q.addAnimation(t)}if(T||0!==h.length||0!==E.length?(X.addElement(T),X.addElement(E)):X.addElement(u.querySelector(":scope > .ion-page, :scope > ion-nav, :scope > ion-tabs")),q.addAnimation(X),$?X.beforeClearStyles([r]).fromTo("transform",`translateX(${p})`,`translateX(${d})`).fromTo(r,m,1):X.beforeClearStyles([r]).fromTo("transform",`translateX(${b})`,`translateX(${d})`),T){const e=s(T).querySelector(".transition-effect");if(e){const t=e.querySelector(".transition-cover"),o=e.querySelector(".transition-shadow"),n=Object(a.a)(),s=Object(a.a)(),l=Object(a.a)();n.addElement(e).beforeStyles({opacity:"1"}).afterStyles({opacity:""}),s.addElement(t).beforeClearStyles([r]).fromTo(r,0,.1),l.addElement(o).beforeClearStyles([r]).fromTo(r,.03,.7),n.addAnimation([s,l]),X.addAnimation([n])}}const A=u.querySelector("ion-header.header-collapse-condense"),{forward:g,backward:j}=((e,t,o,a,r)=>{const n=c(a,o),s=l(r),d=l(a),m=c(r,o),y=null!==n&&null!==s&&!o,b=null!==d&&null!==m&&o;return y?(f(e,t,o,s),i(e,t,o,n)):b&&(f(e,t,o,d),i(e,t,o,m)),{forward:y,backward:b}})(q,y,$,u,S);if(h.forEach(e=>{const t=Object(a.a)();t.addElement(e),q.addAnimation(t);const o=Object(a.a)();o.addElement(e.querySelector("ion-title"));const n=Object(a.a)(),l=Array.from(e.querySelectorAll("ion-buttons,[menuToggle]")),c=e.closest("ion-header"),i=c&&c.classList.contains("header-collapse-condense-inactive");let f;f=l.filter($?e=>{const t=e.classList.contains("buttons-collapse");return t&&!i||!t}:e=>!e.classList.contains("buttons-collapse")),n.addElement(f);const m=Object(a.a)();m.addElement(e.querySelectorAll(":scope > *:not(ion-title):not(ion-buttons):not([menuToggle])"));const u=Object(a.a)();u.addElement(s(e).querySelector(".toolbar-background"));const S=Object(a.a)(),T=e.querySelector("ion-back-button");if(T&&S.addElement(T),t.addAnimation([o,n,m,u,S]),n.fromTo(r,.01,1),m.fromTo(r,.01,1),$)i||o.fromTo("transform",`translateX(${p})`,`translateX(${d})`).fromTo(r,.01,1),m.fromTo("transform",`translateX(${p})`,`translateX(${d})`),S.fromTo(r,.01,1);else if(A||o.fromTo("transform",`translateX(${b})`,`translateX(${d})`).fromTo(r,.01,1),m.fromTo("transform",`translateX(${b})`,`translateX(${d})`),u.beforeClearStyles([r]).fromTo(r,.01,1),g||S.fromTo(r,.01,1),T&&!g){const e=Object(a.a)();e.addElement(s(T).querySelector(".button-text")).fromTo("transform",y?"translateX(-100px)":"translateX(100px)","translateX(0px)"),t.addAnimation(e)}}),S){const e=Object(a.a)(),t=S.querySelector(":scope > ion-content");if(e.addElement(t),e.addElement(S.querySelectorAll(":scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *")),q.addAnimation(e),$?e.beforeClearStyles([r]).fromTo("transform",`translateX(${d})`,y?"translateX(-100%)":"translateX(100%)"):e.fromTo("transform",`translateX(${d})`,`translateX(${p})`).fromTo(r,1,m),t){const o=s(t).querySelector(".transition-effect");if(o){const t=o.querySelector(".transition-cover"),n=o.querySelector(".transition-shadow"),s=Object(a.a)(),l=Object(a.a)(),c=Object(a.a)();s.addElement(o).beforeStyles({opacity:"1"}).afterStyles({opacity:""}),l.addElement(t).beforeClearStyles([r]).fromTo(r,.1,0),c.addElement(n).beforeClearStyles([r]).fromTo(r,.7,.03),s.addAnimation([l,c]),e.addAnimation([s])}}S.querySelectorAll(":scope > ion-header > ion-toolbar").forEach(e=>{const t=Object(a.a)();t.addElement(e);const o=Object(a.a)();o.addElement(e.querySelector("ion-title"));const l=Object(a.a)(),c=e.querySelectorAll("ion-buttons,[menuToggle]"),i=e.closest("ion-header"),f=i&&i.classList.contains("header-collapse-condense-inactive"),m=Array.from(c).filter(e=>{const t=e.classList.contains("buttons-collapse");return t&&!f||!t});l.addElement(m);const b=Object(a.a)(),u=e.querySelectorAll(":scope > *:not(ion-title):not(ion-buttons):not([menuToggle])");u.length>0&&b.addElement(u);const S=Object(a.a)();S.addElement(s(e).querySelector(".toolbar-background"));const T=Object(a.a)(),E=e.querySelector("ion-back-button");if(E&&T.addElement(E),t.addAnimation([o,l,b,T,S]),q.addAnimation(t),T.fromTo(r,.99,0),l.fromTo(r,.99,0),b.fromTo(r,.99,0),$){if(f||o.fromTo("transform",`translateX(${d})`,y?"translateX(-100%)":"translateX(100%)").fromTo(r,.99,0),b.fromTo("transform",`translateX(${d})`,y?"translateX(-100%)":"translateX(100%)"),S.beforeClearStyles([r]).fromTo(r,1,.01),E&&!j){const e=Object(a.a)();e.addElement(s(E).querySelector(".button-text")).fromTo("transform",`translateX(${d})`,`translateX(${(y?-124:124)+"px"})`),t.addAnimation(e)}}else f||o.fromTo("transform",`translateX(${d})`,`translateX(${p})`).fromTo(r,.99,0).afterClearStyles([n,r]),b.fromTo("transform",`translateX(${d})`,`translateX(${p})`).afterClearStyles([n,r]),T.afterClearStyles([r]),o.afterClearStyles([r]),l.afterClearStyles([r])})}return q}catch(o){throw o}}}}]);