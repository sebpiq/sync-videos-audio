!(function () {
    window.polyfilledAudioWorkletNode = false
    var e,
        t = [];
    function r(e) {
        var r = this,
            n = {},
            i = -1;
        this.parameters.forEach(function (e, o) {
            var s = t[++i] || (t[i] = new Float32Array(r.bufferSize));
            s.fill(e.value), (n[o] = s);
        }),
            this.processor.realm.exec("self.sampleRate=sampleRate=" + this.context.sampleRate + ";self.currentTime=currentTime=" + this.context.currentTime);
        var s = o(e.inputBuffer),
            a = o(e.outputBuffer);
        this.instance.process([s], [a], n);
    }
    function o(e) {
        for (var t = [], r = 0; r < e.numberOfChannels; r++) t[r] = e.getChannelData(r);
        return t;
    }
    function n(e) {
        return e.$$processors || (e.$$processors = {});
    }
    ;("function" != typeof AudioWorkletNode || window.forcePolyfillingAudioWorkletNode) &&
        ((self.AudioWorkletNode = function (t, o, i) {
            window.polyfilledAudioWorkletNode = true
            var s = n(t)[o],
                a = t.createScriptProcessor(16384, 2, i && i.outputChannelCount ? i.outputChannelCount[0] : 2);
            if (((a.parameters = new Map()), s.properties))
                for (var u = 0; u < s.properties.length; u++) {
                    var c = s.properties[u],
                        l = t.createGain().gain;
                    (l.value = c.defaultValue), a.parameters.set(c.name, l);
                }
            var p = new MessageChannel();
            e = p.port2;
            var f = new s.Processor(i || {});
            return (e = null), (a.port = p.port1), (a.processor = s), (a.instance = f), (a.onaudioprocess = r), a;
        }),
        Object.defineProperty((self.AudioContext || self.webkitAudioContext).prototype, "audioWorklet", {
            get: function () {
                return this.$$audioWorklet || (this.$$audioWorklet = new self.AudioWorklet(this));
            },
        }),
        (self.AudioWorklet = (function () {
            function t(e) {
                this.$$context = e;
            }
            return (
                (t.prototype.addModule = function (t, r) {
                    var o = this;
                    return fetch(t)
                        .then(function (e) {
                            if (!e.ok) throw Error(e.status);
                            return e.text();
                        })
                        .then(function (t) {
                            var i = {
                                sampleRate: 0,
                                currentTime: 0,
                                AudioWorkletProcessor: function () {
                                    this.port = e;
                                },
                                registerProcessor: function (e, t) {
                                    n(o.$$context)[e] = { realm: s, context: i, Processor: t, properties: t.parameterDescriptors || [] };
                                },
                            };
                            i.self = i;
                            var s = new (function (e, t) {
                                var r = document.createElement("iframe");
                                (r.style.cssText = "position:absolute;left:0;top:-999px;width:1px;height:1px;"), t.appendChild(r);
                                var o = r.contentWindow,
                                    n = o.document,
                                    i = "var window,$hook";
                                for (var s in o) s in e || "eval" === s || ((i += ","), (i += s));
                                for (var a in e) (i += ","), (i += a), (i += "=self."), (i += a);
                                var u = n.createElement("script");
                                u.appendChild(n.createTextNode('function $hook(self,console) {"use strict";\n        ' + i + ";return function() {return eval(arguments[0])}}")), n.body.appendChild(u), (this.exec = o.$hook(e, console));
                            })(i, document.documentElement);
                            return s.exec(((r && r.transpile) || String)(t)), null;
                        });
                }),
                t
            );
        })()));
})();
//# sourceMappingURL=audioworklet-polyfill.js.map
