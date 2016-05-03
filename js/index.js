(function() {

  var p = PUBNUB.init({
    publish_key: 'pub-c-a18e5f7b-b6da-4175-a7e1-acf318c242a2',
    subscribe_key: 'sub-c-695f3b8a-0ddb-11e6-a9bb-02ee2ddab7fe'
  });

  //Default-value for currentChat
  var currentChat = "";

  // Assign a random avatar in random color
  avatar = document.querySelector('#avatar');
  avatar.className = 'face-' + ((Math.random() * 13 + 1) >>> 0) + ' color-' + ((Math.random() * 10 + 1) >>> 0);
  

//---------- ChangeChannel begins ---------- 

  //Function that changes chat channel
  function changeChannel(newChannel, p){

  var output = document.querySelector("#messages" + newChannel),
    input = document.querySelector("#input" +newChannel),
    button = document.querySelector("#button" + newChannel),
    presence = document.querySelector('#presence');
    var channel = newChannel;

  p.subscribe({
    channel: channel,
    callback: function(m) {
      if(m.text === ""){
        console.log("i if!",m.text);
      }else{
      output.innerHTML = '<p><i class="' + m.avatar + '"></i><span>' + m.text.replace(/[<>]/ig, '') + '</span></p>' + output.innerHTML;
      }
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

window.addEventListener('deviceorientation', checkChat)

//Function that checks the currentChat and the orientation of the phone. 
//If the orientation has changed the function switches the color of the 
//chat room and calles the function "show" with right chat as input value
function checkChat (event){
        var orientation;
        var style = document.querySelector(".container");
        if(event.webkitCompassHeading){

            orientation=event.webkitCompassHeading;
          }

          else{
            orientation=event.alpha;
          }


        if(orientation >=315 || orientation < 45){
          if(currentChat !== "North"){
            style.style.backgroundColor = "#779ECB";
            show("North")
          }
        }
        else if(orientation >=45 && orientation < 135){
          if(currentChat !== "East"){
              style.style.backgroundColor = "#FFD1DC";
              show("East");
            }
          }
          else if(orientation >=135 && orientation < 225){
            if(currentChat !== "South"){
              style.style.backgroundColor = "#77DD77";
              show("South");
            } 
          }
          else if(orientation >=225 && orientation < 315){
            if(currentChat !== "West"){
              style.style.backgroundColor ="#FDFD96";
              show("West");
            }
          }
    };

// Displays the new chat and hides the currentChat if there is one
function show (newChat){
  if(currentChat !== ""){
    //Displays the new chat and hides the current one
    document.getElementById(newChat).style.display = "block";
    document.getElementById(currentChat).style.display = "none";
    //Changes the chat channel and makes the newChat the currentChat
    changeChannel(newChat, p);
    
    p.unsubscribe({
      channel: currentChat
    })

    currentChat = newChat;
    //Display the right chat name in the chat-view
    document.querySelector('#header').innerHTML = newChat;
  }
  else{
    //Displays the new chat
    document.getElementById(newChat).style.display = "block";
    //Changes the chat channel and makes the newChat the currentChat
    changeChannel(newChat, p);
    currentChat = newChat;
    //Display the right chat name in the chat-view
  }
}; 


//Runs the checkChat function

document.getElementById('buttonView').onclick = function(){
    window.removeEventListener('deviceorientation', checkChat)
    
    document.querySelector(".container").style.backgroundColor = "#ffffff";

    document.getElementById("North").style.display = "block";
    document.getElementById("North").style.backgroundColor = "#779ECB";
    changeChannel("North", p);

    document.getElementById("South").style.display = "block";
    document.getElementById("South").style.backgroundColor = "#77DD77";
    changeChannel("South", p);


    document.getElementById("West").style.display = "block";
    document.getElementById("West").style.backgroundColor = "#FDFD96";
    changeChannel("West", p);

    document.getElementById("East").style.display = "block";
    document.getElementById("East").style.backgroundColor ="#FFD1DC";
    changeChannel("East", p);

    document.getElementById("inputNorth").style.display = "none";
    document.getElementById("buttonNorth").style.display = "none";

    document.getElementById("inputSouth").style.display = "none";
    document.getElementById("buttonSouth").style.display = "none";

    document.getElementById("inputWest").style.display = "none";
    document.getElementById("buttonWest").style.display = "none";

    document.getElementById("inputEast").style.display = "none";
    document.getElementById("buttonEast").style.display = "none";

    document.getElementById("back").style.display="block";
    document.getElementById("buttonView").style.display="none";
};

document.getElementById("back").onclick=function(){
  window.addEventListener('deviceorientation', checkChat)

    document.getElementById("North").style.display = "none";
  

    document.getElementById("South").style.display = "none";


    document.getElementById("West").style.display = "none";

    document.getElementById("East").style.display = "none";

    document.getElementById("inputNorth").style.display = "block";
    document.getElementById("buttonNorth").style.display = "block";

    document.getElementById("inputSouth").style.display = "block";
    document.getElementById("buttonSouth").style.display = "block";

    document.getElementById("inputWest").style.display = "block";
    document.getElementById("buttonWest").style.display = "block";

    document.getElementById("inputEast").style.display = "block";
    document.getElementById("buttonEast").style.display = "block";

    document.getElementById("back").style.display="none";
    document.getElementById("buttonView").style.display="block";

  
}

})();







