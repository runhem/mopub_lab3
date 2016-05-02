var app = angular.module('app', ["pubnub.angular.service"])
var currentUser = app.value('currentUser', _.random(1000000).toString());
 app.controller('chatCtrl', function($scope, Pubnub, $q, currentUser, $rootScope) {        

$scope.channel = 'north';

   Pubnub.init({
         publish_key: 'pub-c-a18e5f7b-b6da-4175-a7e1-acf318c242a2',
         subscribe_key: 'sub-c-695f3b8a-0ddb-11e6-a9bb-02ee2ddab7fe',
                  uuid: currentUser
       });

$scope.messages = [];
 
//--------------

//-------------------

 $scope.sendMessage = function() {
       // Don't send an empty message 
       if (!$scope.chatMessage || $scope.chatMessage === '') {
            return;
        }
        Pubnub.publish({
            channel: $scope.channel,
            message: {
                uuid: (Date.now() + currentUser),
                content: $scope.chatMessage,
                sender_uuid: currentUser,
                date: new Date()
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
          count : 20, //Vill vi ha fler meddelanden kan vi öka
          channel : $scope.channel,
          callback : function (allMessages) {
            for(i in allMessages[0]){
                $scope.messages.push(allMessages[0][i]);
            };
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
        console.log("NEW MESSAGE");
        //$rootScope.$digest() - om vi hade haft flera filer???

    });
});      
// A function to display a nice uniq robot avatar 
$scope.avatarUrl = function(uuid){
    return 'http://robohash.org/'+uuid+'?set=set2&bgset=bg2&size=70x70';
};







 });