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
  function initChannel(newChannel, p){

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
};

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

initChannel("North", p);
initChannel("South", p);
initChannel("West", p);
initChannel("East", p);

// Displays the new chat and hides the currentChat if there is one
function show (newChat){
  console.log(currentChat)
  if(currentChat !== ""){
    // If old chat, hide it!
    document.getElementById(currentChat).setAttribute("class", "hidden");
  }
  //Displays the new chat
    document.getElementById(newChat).setAttribute("class", "");
    //Changes the chat channel and makes the newChat the currentChat
    currentChat = newChat;
    //Display the right chat name in the chat-view
}; 



document.getElementById('buttonView').onclick = function(){
// Remove eventlistener to stop change view according to orientation 
  window.removeEventListener('deviceorientation', checkChat)

// Set all orientationdivs into masterView, hiding buttons and input while displaying messages. + white background     
  document.querySelector(".container").style.backgroundColor = "#ffffff";
  document.getElementById("North").setAttribute("class", "masterView");
  document.getElementById("West").setAttribute("class", "masterView");
  document.getElementById("South").setAttribute("class", "masterView");
  document.getElementById("East").setAttribute("class", "masterView");


// Also show back-button and hide change view
  document.getElementById("back").style.display="block";
  document.getElementById("buttonView").style.display="none";

  document.getElementById("presence").style.display="none";
};


document.getElementById("back").onclick=function(){
// Back to normal view and back to listen to device orientation
  window.addEventListener('deviceorientation', checkChat)

// Back to normal classes and hidden-mode
  document.getElementById("North").setAttribute("class", "hidden");
  document.getElementById("West").setAttribute("class", "hidden");
  document.getElementById("South").setAttribute("class", "hidden");
  document.getElementById("East").setAttribute("class", "hidden");

// Hide back button and show change view 
  document.getElementById("back").style.display="none";
  document.getElementById("buttonView").style.display="block";

  document.getElementById("presence").style.display="block";
}

})();



