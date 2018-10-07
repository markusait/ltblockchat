// Make connection
var socket = io.connect('http://localhost:3007');
var timeout
// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = "";
});

function timeoutFunction() {
  socket.emit("typing", false);
}

message.addEventListener('keyup',function(){
 clearTimeout(timeout)
 socket.emit('typing', handle.value)
 timeout = setTimeout(timeoutFunction, 2000)
})

message.addEventListener('keydown',function(e){
 if(e.keyCode === 13) {
   socket.emit('chat', {
     message: message.value,
     handle: handle.value
   })
   message.value = ""
 }
})
let randomColor = "#"+((1<<24)*Math.random()|0).toString(16);
// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p class="sender" style="color: blue"><strong>' + data.user+ ': </strong>' + data.message + '</p>';     //can we change color here?
    //
    // let chat = document.getElementById('output')
    // let randomColor = "#"+((1<<24)*Math.random()|0).toString(16);
    // chat.children[chat.children.length -1].style.color = randomColor

});

socket.on('typing', function(data){
    if (data) {
      feedback.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
    } else {
      feedback.innerHTML = ''
    }
});
