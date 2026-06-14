const u=e=>e?String(e).replace(/[\uD800-\uDFFF]/g,"").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,"").trim():"",i=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);export{i,u as s};
