// ==UserScript==
// @name         RoA WSHookUP
// @namespace    Reltorakii_is_awesome
// @version      0.3.2
// @description  Hooks to the websocket communication and broadcasts the various messages as custom events
// @author       Reltorakii
// @run-at       document-start
// @match        https://*.avabur.com/game*
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
                    var etypepage = "";
                    var item = data[i];
                    if (item.hasOwnProperty("type")) {
                        etype = etype + item.type;
                        // in case its a "page" type message create additional event
                        // e.g.: "roa-ws:page:boosts", "roa-ws:page:clans" or "roa-ws:page:settings_milestones" etc.
                        if (item.type === "page" && item.hasOwnProperty("page") && "string" === typeof item.page) {
                            etypepage = etype + ":" + item.page;
                        }
                    } else {
                        etype = etype + "general";
                    }

                    // This is a special kind of message containing info about the user
                    // I'm resending it in 5 second because this script is supposed to
                    // run at "document start" and potential userscripts that are
                    // listening to the even "roa:login_info" may not catch this message.
                    // They should, I got the message 99 times out of 100, which shows
                    // that userscripts are not 100% reliable with their running queue.
                    if (etype === "roa-ws:login_info") {
                        setTimeout(function(_etype, _item){
                            $(document).trigger(_etype, _item);
                        }, 5000, etype, item);
                    }

                    $(document).trigger(etype, item);
                    if (etypepage.length > 0) {
                        $(document).trigger(etypepage, item);
                    }
                }
            } catch (ex) {
                console.log(ex);
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
            $.alert("The script 'WSHookUp' failed to hook to the WebSocket connection Avabur uses. In case you are using another userscript that depends on this, you may want to refresh the page to try again.", "WSHookUp Failed");
        }
    }, 30000);
})(window);
