# RoA-WSHookUp
A simple script to hook to the games' WebSocket connection an broadcasts the received messages in custom events

## Changelog

2017-06-12 13:36 - v0.3
 * added `roa-ws:page:*` events

2017-05-30 11:28 - v0.2
 * initial version

## About

### Available events
Pick one speciffic to listen to from the list below. All are prepended with `roa-ws:`

 * `battle`
 * `harvest`
 * `craft`
 * `carve`
 * `harvest`
 * `gamestats`
 * `mychans`
 * `motd`
 * `login_info`
 * `message`
 * `notification`
 * `page` - *the `roa-ws:page` event is still broadcasted, following are additional events for if you'd want to monitor only a speciffic page:*
   * `page:updates`
   * `page:town`
   * `page:town_battlegrounds`
   * `page:house`
   * `page:house_room`
   * `page:house_room_item` - *`data.item` contains info about a given room*
   * `page:clans`
   * `page:clan_members`
   * `page:clan_treasury` - *Funds*
   * `page:clan_buildings`
   * `page:training`
   * `page:boosts`
   * `page:quests`
   * `page:inventory_items` - *Same for Weapon and Armor, the `data.item_type` tells you which .. `weapons` / `armor`*
   * `page:inventory_tools`
   * `page:inventory_gems`
   * `page:inventory_accessories`
   * `page:inventory_ingredients`
   * `page:inventory_consumables`
   * `page:settings_milestones` - *for all Milestones, `data.milestone_type` tells you which page .. `PREMIUM` / `FAME` / `LEVEL` / `[TS type]_LEVEL` etc. and `PROGRESS_CHECK` for an overview*


^ These are just examples and, while an extensive list, there are more. Inspect the websocket frames to find more.

_Note: "general" include events that do not have a type, if there are any._

### Example code

From your userscript you can listen to these custom events with the following examples

```js
// to listen to battle updates use
$(document).on("roa-ws:battle", function(e, data){
    console.log(data); // data has parsed JSON data from the WebSocket event
});

// to listen to TS updates use
$(document).on("roa-ws:harvest", function(e, data){
    console.log(data); // data has parsed JSON data from the WebSocket event
});

// crafting updates
$(document).on("roa-ws:craft", function(e, data){
    console.log(data); // data has parsed JSON data from the WebSocket event
});

// chat messages
$(document).on("roa-ws:message", function(e, data){
    console.log(data); // data has parsed JSON data from the WebSocket event
});

// Crystal Shop popup window
$(document).on("roa-ws:page:boosts", function(e, data){
    console.log(data); // data has parsed JSON data from the WebSocket event
});

// or monitor them all - for fun ?
$(document).on("roa-ws:all", function(e, data){
    console.log(data); // this is the raw data received from websocket (usually a JSON encoded string)
});
```