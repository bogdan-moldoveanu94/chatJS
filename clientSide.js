$(document).ready(function(){  
var socket = io();
var currentUserName = '';
$("#chat").hide();



$('form').submit(function(){
  var text = $('#m').val()
  if(text){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
  }
  return false; 
});


socket.on('chat message', function(msg){
  $('#messages').append($('<li class="chat-bubble">').text(msg));
	$(document).scrollTop($(document).height());
});


$("#join").click(function(){
    var name = $("#name").val();
    if (name != "") {
        socket.emit("join", name);
        currentUserName = name;
        $("#loginForm").detach();
        $("#login").detach();

        $("#chat").show();
        $("#m").focus();
        ready = true;
    }
});


$("#name").keypress(function(e){
    if(e.which == 13) {
        var name = $("#name").val();
        if (name != "") {
            socket.emit("join", name);
            ready = true;
            $("#login").detach();
            $("#chat").show();
            $("#msg").focus();
        }
    }
});



        socket.on("update", function(msg) {
            if(ready){
                $("#messages").append($('<li class="server-message">').text(msg));
            }
        });
	



        socket.on("disconnect", function(){
            $("#messages").append($('<li class="server-message">').text('The server is not available'));
            $("#messages").attr("disabled", "disabled");
            $("#m").attr("disabled", "disabled");
        });



        socket.on("update-people", function(people){
            if(ready) {
                $("#people-list").empty();
                $.each(people, function(clientid, name) {
                    $('#people-list').append($('<li class="list-group-item">').text("" + name + ""));
                });
            }
        });




});
