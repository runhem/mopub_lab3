(function() {

  var output = document.querySelector('#output'),
    input = document.querySelector('#input'),
    button = document.querySelector('#button'),
    avatar = document.querySelector('#avatar'),
    presence = document.querySelector('#presence');
  this.channel = 'North';

  var initOri = "North";

  // Assign a random avatar in random color
  avatar.className = 'face-' + ((Math.random() * 13 + 1) >>> 0) + ' color-' + ((Math.random() * 10 + 1) >>> 0);

  var p = PUBNUB.init({
    publish_key: 'pub-c-a18e5f7b-b6da-4175-a7e1-acf318c242a2',
    subscribe_key: 'sub-c-695f3b8a-0ddb-11e6-a9bb-02ee2ddab7fe'
  });

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

function chechOri (){
      window.addEventListener('deviceorientation', function(event) { 

        var orientation = event.alpha
        

        var ori = document.getElementById("test");
        

          if(orientation >=0 && orientation < 90){

            if(initOri !== "North"){
            ori.innerHTML= "";
            ori.innerHTML = ori.innerHTML + "North";
            initOri = "North";
            this.channel = 'North';
          }
        }
          else if(orientation >=90 && orientation < 180){
            if(initOri !== "West"){
              ori.innerHTML= "";
              ori.innerHTML = ori.innerHTML + "West";
              initOri = "West";
              this.channel = "West";

            }
          }
          else if(orientation >=180 && orientation < 270){
            if(initOri !== "South"){
              ori.innerHTML= "";
              ori.innerHTML = ori.innerHTML + "South";
              initOri = "South";
              this.channel = "South";

            }
            
          }
          else {
            if(initOri !== "East"){
              ori.innerHTML= "";
              ori.innerHTML = ori.innerHTML + "East";
              initOri = "East";
              this.channel = "East";

            }
            
          }

    });

  }

checkOri();
})();