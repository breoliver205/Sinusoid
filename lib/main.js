(function(window, f){ "use strict"; if (typeof module === "object" && typeof module.exports === "object") module.exports = window.document ? f(window, true) : function(w){ if (!w.document) throw new ReferenceError("Sinusoid requires a window with a document."); return f(w); }; else f(window); })
(typeof window !== "undefined" ? window : this, function(window, noglobal){
	function convToArr(args){ return Array.from(args); }
	
	const fns = Object.freeze({
		cosine: n => { return Math.cos(n); },
		sine: n => { return Math.sin(n); },
		tangent: n => { return Math.tan(n); },
		secant: n => { return 1 / Math.cos(n); },
		cosecant: n => { return 1 / Math.sin(n); },
		cotangent: n => { return 1 / Math.tan(n); }
	});
	
	class Sinusoid {
		constructor(options = {}){
			options = Object.assign({}, options);
			this.hasCanvas = "canvas" in options || false;
			this.canvas = options.canvas || document.createElement("canvas");
			if (!(this.canvas instanceof HTMLCanvasElement)) this.canvas = document.createElement("canvas");
			this.canvas.className = "SinusoidCanvas sinusoid";
			this.type = options.type || "sine";
			this.canonicaltypes = Object.freeze(["sine", "cosine", "tangent", "secant", "cosecant", "cotangent"]);
			this.aliases = Object.freeze({ sin: "sine", cos: "cosine", tan: "tangent", sec: "secant", csc: "cosecant", cot: "cotangent" });
			if (this.type in this.aliases) this.type = this.aliases[this.type];
			if (this.canonicaltypes.indexOf(this.type) === -1) this.type = "sine";
			this.canvas.dataset.type = this.type;
			
			this.width = !isNaN(width = parseInt(options.width, 10)) || isFinite(width) ? width : 500;
			this.height = !isNaN(height = parseInt(options.height, 10)) || isFinite(height) ? height : 200;
			this.scale = !isNaN(scale = parseInt(options.scale, 10)) || isFinite(scale) ? scale : 200;
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			
			this.context = this.canvas.getContext("2d");
			
			this.axisColor = typeof (axisColor = options.axisColor || "rgb(80, 80, 80)") === "string" ? axisColor : "rgb(80, 80, 80)";
			this.lineColor = typeof (lineColor = options.axisColor || "rgb(80, 80, 80)") === "string" ? lineColor : "rgb(80, 80, 200)";
			
			this.allowPointDrawing = !!options.allowPointDrawing || false;
			this.pointColor = typeof (pointColor = options.axisColor || "rgb(80, 80, 80)") === "string" ? pointColor : "rgb(180, 0, 0)";
		}
		
		showAxes(axes){
			let xMin = 0, yMin = 0;
			
			this.context.beginPath();
			this.context.strokeStyle = this.axisColor;
			
			this.context.moveTo(xMin, this.height / 2);
			this.context.lineTo(this.width, this.height / 2);
			
			this.context.moveTo(this.width / 2, yMin);
			this.context.lineTo(this.width / 2, this.height);
			
			this.context.moveTo(xMin, yMin);
			this.context.lineTo(xMin, this.height);
			
			this.context.stroke();
		}
								
		drawPoint(y){
			if (this.allowPointDrawing === false) return;
			
			let radius = 3;
			this.context.beginPath();
			
			this.context.arc(4, y, radius, 0, 2 * Math.PI, false);
			
			this.context.fillStyle = this.pointColor;
			this.context.fill();
			this.context.lineWidth = 1;
			this.context.stroke();
		}
		
		performFn(value){
			let type = this.type;
			if (type in this.aliases) type = this.aliases[type];
			if (this.canonicaltypes.indexOf(type) === -1) type = "sine";
			if (type in fns) return fns[type].call(this, value);
			else return value;
		}
		
		plot(offsetX, offsetY){
			this.context.beginPath();
			this.context.lineWidth = 4;
			this.context.strokeStyle = this.lineColor;
			
			let x = 4, y = 0, amplitude = 40, frequency = 20;
			
			this.context.moveTo(x, 50);
			
			while (x < width){
				y = this.height / 2 + amplitude * this.performFn((x + offsetX) / frequency);
				this.context.lineTo(x, y);
				x++;
			}
			
			this.context.stroke();
			this.context.save();
			
			this.drawPoint(y);
			
			this.context.stroke();
			this.context.restore();
		}
		
		draw(target){
			if (this.hasCanvas) return false;
			this.target = typeof target !== "undefined" ? target : document.body;
			if (!(this.target instanceof HTMLElement)) this.target = document.body;
			
			this.target.appendChild(this.canvas);
			return true;
		}
	}
});
