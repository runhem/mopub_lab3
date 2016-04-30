var app = angular.module('app', ["pubnub.angular.service"])
 app.controller('chatCtrl', function($scope, Pubnub) {        
   
$scope.channel = 'messages-channel';
   Pubnub.init({
         publish_key: 'pub-c-a18e5f7b-b6da-4175-a7e1-acf318c242a2',
         subscribe_key: 'sub-c-695f3b8a-0ddb-11e6-a9bb-02ee2ddab7fe',
       });

$scope.messages = [];

 $scope.sendMessage = function() {
       // Don't send an empty message 
       if (!$scope.chatMessage || $scope.chatMessage === '') {
            return;
        }
        Pubnub.publish({
            channel: $scope.channel,
            message: {
                content: $scope.chatMessage,
                avatar: 'avatar.png'
            },
            callback: function(m) {
                console.log(m);
                $scope.messages.push(m)
            }
        });
        // Reset the messageContent input
        console.log($scope.chatMessage)
        $scope.chatMessage = '';

    }
$scope.showHistory = function(){
        Pubnub.history({
          count : 20,
          channel : $scope.channel,
          callback : function (chatMessage) {
            for(i in chatMessage[0]){
                console.log(chatMessage[0][i].content)
            };
            console.log(chatMessage[0])

          }
        });
      };    

$scope.subscribeToChat = function(){
    Pubnub.subscribe({
    channel: $scope.channel,
    triggerEvents: ['callback']
});
}

Pubnub.subscribe({
    channel: $scope.channel,
    triggerEvents: ['callback']
});

// Listening to the callbacks
$scope.$on(Pubnub.getMessageEventNameFor($scope.channel), function (ngEvent, m) {
    $scope.$apply(function () {
        $scope.messages.push(m)
    });
});      


 });