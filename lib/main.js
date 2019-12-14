(function(window, f){ "use strict"; if (typeof module === "object" && typeof module.exports === "object") module.exports = window.document ? f(window, true) : function(w){ if (!w.document) throw new ReferenceError("Sinusoid requires a window with a document."); return f(w); }; else f(window); })
(typeof window !== "undefined" ? window : this, function(window, noglobal){
	function convToArr(args){
		return Array.from(args);
	}
});
