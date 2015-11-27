// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require react
//= require react_ujs
//= require vendor/uri
//= require vendor/uri-template
//= require classnames
//= require react-input-autosize/dist/react-input-autosize
//= require vendor/react-select
// require react-select
//= require components
//= require rest
//= require_tree .
//= require websocket_rails/main

Turbolinks.enableProgressBar();
var host = window.location.hostname;
var port = window.location.port;
//port = 3001;

var websocketUrl = host + ':' + port + '/websocket';

var websocket = new WebSocketRails(websocketUrl);
websocket.on_open = function (data) {
    console.log('Connection has been established: ', data);
    var channel = websocket.subscribe_private('repos/17/revisions/change');
    websocket.bind('testevent', function (data) {
        console.log("New event", data); // would output 'this is a message'
    });
    websocket.trigger("testeventsent", "Some data has been sent");
    channel.bind('create', function (data) {
        console.log('cret', data);
    })
};

//setTimeout(() => {
//    console.log(NotificationManager.warn);
//    NotificationManager.warn('Bullshit', 'Is happening');
//    NotificationManager.success('Bullshit', 'Is happening');
//    NotificationManager.inform('Bullshit', 'Is happening');
//    NotificationManager.error('Bullshit', 'Is happening', {
//        position: Notification.Positions.tl
//    });
//}, 1000);
