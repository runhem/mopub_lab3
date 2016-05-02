(function() {

  var p = PUBNUB.init({
    publish_key: 'pub-c-a18e5f7b-b6da-4175-a7e1-acf318c242a2',
    subscribe_key: 'sub-c-695f3b8a-0ddb-11e6-a9bb-02ee2ddab7fe'
  });

  //Default-value for currentChat
  var currentChat = "";

  // Assign a random avatar in random color
  avatar.className = 'face-' + ((Math.random() * 13 + 1) >>> 0) + ' color-' + ((Math.random() * 10 + 1) >>> 0);

//---------- ChangeChannel begins ---------- 

  //Function that changes chat channel
  function changeChannel(currentChat, newChannel, p){
    if(currentChat !== ""){
      p.unsubscribe({
      channel: currentChat
    })
  };

  var output = document.querySelector("#messages" + newChannel),
    input = document.querySelector("#input" +newChannel),
    button = document.querySelector("#button" + newChannel),
    avatar = document.querySelector('#avatar'),
    presence = document.querySelector('#presence');
    var channel = newChannel;

  p.subscribe({
    channel: channel,
    callback: function(m) {
      output.innerHTML = '<p><i class="' + m.avatar + '"></i><span>' + m.text.replace(/[<>]/ig, '') + '</span></p>' + output.innerHTML;
    },
    presence: function(m) {
      if (m.occupancy > 1) {
        presence.textContent = m.occupancy + ' people online';
      } else {
        presence.textContent = 'Nobody else is online';
      }
    }
  });

  p.bind('keyup', input, function(e) {
    (e.keyCode || e.charCode) === 13 && publish()
  });

  p.bind('click', button, publish);

  function publish() {
    p.publish({
      channel: channel,
      message: {
        avatar: avatar.className,
        text: input.value
      },
      x: (input.value = '')
    });
  }
}

//---------- ChangeChannel ends -----------


//Function that checks the currentChat and the orientation of the phone. 
//If the orientation has changed the function switches the color of the 
//chat room and calles the function "show" with right chat as input value
function checkChat (){
      window.addEventListener('deviceorientation', function(event) { 
        var orientation = event.alpha;
        var style = document.querySelector(".container");

        if(orientation >=0 && orientation < 90){
          if(currentChat !== "North"){
            style.style.backgroundColor = "#779ECB";
            show("North")
          }
        }
        else if(orientation >=90 && orientation < 180){
          if(currentChat !== "West"){
              style.style.backgroundColor = "#FDFD96";
              show("West");
            }
          }
          else if(orientation >=180 && orientation < 270){
            if(currentChat !== "South"){
              style.style.backgroundColor = "#77DD77";
              show("South");
            } 
          }
          else {
            if(currentChat !== "East"){
              style.style.backgroundColor = "#FFD1DC";
              show("East");
            }
          }

    });

  }

// Displays the new chat and hides the currentChat if there is one
function show (newChat){
  if(currentChat !== ""){
    //Displays the new chat and hides the current one
    document.getElementById(newChat).style.display = "block";
    document.getElementById(currentChat).style.display = "none";
    //Changes the chat channel and makes the newChat the currentChat
    changeChannel(currentChat, newChat, p);
    currentChat = newChat;
    //Display the right chat name in the chat-view
    document.querySelector('#header').innerHTML = newChat; 

  }
  else{
    //Displays the new chat
    document.getElementById(newChat).style.display = "block";
    //Changes the chat channel and makes the newChat the currentChat
    changeChannel(currentChat, newChat, p);
    currentChat = newChat;
    //Display the right chat name in the chat-view
    document.querySelector('#header').innerHTML = newChat;
  }
};  

//Runs the checkChat function
checkChat();

})();

