define([WEBROOT_URL+"js/modules/noteboard.js",WEBROOT_URL+"js/core/sandbox.js"],function(a,b){var c=void 0,d=function(){c=this,c.sandbox=new b(c),c.sandbox.on("resource-add",f),c.sandbox.on("resource-move",k),c.sandbox.on("resource-resize",l),c.sandbox.on("resource-msg",m),c.sandbox.on("resource-forward",s),c.sandbox.on("resource-back",r),c.sandbox.on("resource-bg",n),c.sandbox.on("resource-fs",p),c.sandbox.on("resource-ff",o),c.sandbox.on("resource-c",q),c.sandbox.on("resource-remove",i),c.sandbox.on("resource-comment-add",t),c.sandbox.on("resource-index-timeline",w),c.sandbox.on("scribble-add",u),c.sandbox.on("scribble-clear",v),e()},e=function(){$.getJSON(API+"Note/AllNotes/"+a.id,function(a){c.sandbox.emit("resource-load",a)}),$.getJSON(API+"Scribble/Noteboard/"+a.id,function(a){c.sandbox.emit("scribble-load",a)})},f=function(a){a.data.isNew&&$.post(API+"Note",a.data,function(b){a.setId(b.id)})},g=function(b){return b.realTime?void 0:isNaN(parseInt(b.id))?void f(a.getModel(b.id)):void $.ajax({url:API+"Note/"+b.id,data:b,type:"PUT"})},h=function(a){a.realTime||$.ajax({url:ROOT_URL+"Note/Multiple",data:a,type:"POST"})},i=function(a){return a.realTime?void 0:a.notes?(a.action="remove",void j(a)):void $.ajax({url:API+"Note/"+a.id,type:"DELETE"})},j=function(a){a.realTime||$.ajax({url:ROOT_URL+"Note/Multiple",data:a,type:"POST"})},k=function(a){a.action="position",h(a)},l=function(a){a.action="resize",h(a)},m=function(a){a.action="msg",g(a)},n=function(a){a.action="bg",h(a)},o=function(a){a.action="ff",h(a)},p=function(a){a.action="fs",h(a)},q=function(a){a.action="c",h(a)},r=function(b){b.action="index",b.index=a.minIndex,g(b)},s=function(b){b.action="index",b.index=a.maxIndex,g(b)},t=function(a){a.realTime||$.post(API+"Comment",a)},u=function(a){a.realTime||$.post(API+"Scribble",a)},v=function(b){b.realTime||$.getJSON(API+"Scribble/Clear/"+a.id)},w=function(a){a.realTime||$.ajax({url:API+"Note/IndexTimeline/",data:{resources:a.resources},type:"POST"})};return{init:d}});