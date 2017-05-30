// ==UserScript==
// @name         RoA WSHookUP
// @namespace    Reltorakii_is_awesome
// @version      0.1
// @description  try to take over the world!
// @author       Reltorakii
// @run-at       document-start
// @match        https://beta.avabur.com/game
// @downloadURL  https://github.com/edvordo/RoA-WSHookUp/raw/master/RoA-WSHookUp.user.js
// @updateURL    https://github.com/edvordo/RoA-WSHookUp/raw/master/RoA-WSHookUp.user.js
// @grant        none
// ==/UserScript==

(function(window) {
    'use strict';
    
    var OriginalWS = window.WebSocket;
    var initOWS    = OriginalWS.apply.bind(OriginalWS);
    var wsListener = OriginalWS.prototype.addEventListener;
        wsListener = wsListener.call.bind(wsListener);
    var hooked = false;
    function MyWS(url, opts) {
        var ws;
        if (this instanceof WebSocket) {
            if (arguments.length === 1) {
                ws = new OriginalWS(url);
            } else if (arguments.length >= 2) {
                ws = new OriginalWS();
            } else {
                ws = new OriginalWS();
            }
        } else {
            ws = initOWS(this, arguments);
        }
        wsListener(ws, "message", function(event){
            hooked = true;
            var etype = "roa-ws:";
            var data;
            try {
                data = JSON.parse(event.data);
                for (var i = 0; i < data.length; i++) {
                    etype = "roa-ws:";
                    var item = data[i];
                    if (item.hasOwnProperty("type")) {
                        etype = etype + item.type;
                    } else {
                        etype = etype + "general";
                    }
                    $(document).trigger(etype, item);
                    //$(document).trigger("roa-ws:all", item);
                }
            } catch (ex) {
                data = event.data;
                etype = etype + "general";
                $(document).trigger(etype, data);
            }

            $(document).trigger("roa-ws:all", event.data);
        });
        return ws;
    }
    window.WebSocket = MyWS.bind();
    window.WebSocket.prototype = OriginalWS.prototype;
    window.WebSocket.prototype.constructor = window.WebSocket;

    setTimeout(function(){
        if (hooked === false) {
            $.alert("The script 'WSHookUp' failed to hook to the WebSocket connection Avabur uses. In case you are using a nother userscript that depends on this, you may want to refresh the page to try again.", "WSHookUp Failed");
        }
    }, 1000);
})(window);