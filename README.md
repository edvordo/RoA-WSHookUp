# RoA-WSHookUp
A simple script to hook to the games' WebSocket connection an broadcasts the received messages in custom events

## About

### Available events
Pick one speciffic to listen to from. All are prepended with `roa-ws:`

 * `battle`
 * `trade`
 * `gamestats`
 * `mychans`
 * `motd`
 * `login_info`
 * `message`
 * `notification`
 * `page`


^ Those are the ones I know of, there probably are and will be more.

_Note: "general" include events that do not have a type, if there are any._
### Example code

From your userscript you can listen to these custom events with the following examples

```js
// to listen to battle updates use
$(document).on("roa-ws:battle", function(e, data){
    console.log(data); // data has parsed JSON data from the WebSocket event
});

// to listen to TS updates use
$(document).on("roa-ws:trade", function(e, data){
    console.log(data); // data has parsed JSON data from the WebSocket event
});

// chat messages
$(document).on("roa-ws:message", function(e, data){
    console.log(data); // data has parsed JSON data from the WebSocket event
});

// or monitor them all - for fun ?
$(document).on("roa-ws:all", function(e, data){
    console.log(data); // this is the raw data received from websocket (usually a JSON encoded string)
});
```