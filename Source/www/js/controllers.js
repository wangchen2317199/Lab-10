angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$http, $httpParamSerializerJQLike) {
    $scope.pageClass = 'validate';  
    $scope.validate = function(username, password){
        console.log("inside login function");
        $http({
            method: 'GET',
            url: 'https://api.mongolab.com/api/1/databases/mowenyoulong/collections/Lab10?q={"name": "' + username + '", "psd": "' + password + '"}&apiKey=fzeK7cu47mzxu0GCKCkEQRR-2I7KVd1H',           
            contentType: "application/json"
        }).success (function(data) {
            console.log(data);
            if(data!=""){
                window.location.assign("#/tab/dash/DiabetesDetector");
                sessionStorage.setItem("userID", data["0"]._id.$oid);
            }
            else $scope.msg ="Incorrect username or password!";
        })            
    }
})

.controller('Upd', function($scope,$http, $httpParamSerializerJQLike) { 
    $scope.pageClass = 'update';
    $scope.update = function(NewPassword){
        console.log("inside update function");
        $http({
            method: 'PUT',
            url: 'https://api.mongolab.com/api/1/databases/mowenyoulong/collections/Lab10/'+ sessionStorage.getItem("userID")+'?apiKey=fzeK7cu47mzxu0GCKCkEQRR-2I7KVd1H',
            data: JSON.stringify( { "$set" : { "psd" : NewPassword } } ),
            contentType: "application/json"
        }).success (function(data) { 
            console.log(data);
            $scope.msg ="Password has been updated!";
        })
    }
    
        $scope.delete = function(){
        console.log("inside delete function");
        $http({
            method: 'DELETE',
            url: 'https://api.mongolab.com/api/1/databases/mowenyoulong/collections/Lab10/'+ sessionStorage.getItem("userID")+'?apiKey=fzeK7cu47mzxu0GCKCkEQRR-2I7KVd1H',
            contentType: "application/json"
        }).success (function(data) { 
            $scope.msg ="Account has been deleted!";
        })
    }
})
                    
        

.controller('DiaDet', function($scope, $http){
    $scope.diaDetectLogic = function(diaData1,diaData2) {
        // Do some computation..
        var diaValue1=parseFloat(diaData1);
        console.log(diaValue1);
        var diaValue2=parseFloat(diaData2);
        console.log(diaValue2);
        if (isNaN(diaValue1) || isNaN(diaValue2))
            return{
                
               "classNameForResult": "codered", 
               "results": "Please enter the values correctly." 
            }
        
        console.log("record the parameters");
        $http({
            method: 'PUT',
             url: 'https://api.mongolab.com/api/1/databases/mowenyoulong/collections/Lab10/'+ sessionStorage.getItem("userID")+'?apiKey=fzeK7cu47mzxu0GCKCkEQRR-2I7KVd1H',
            data: JSON.stringify({
                 "$set" : { 
                     "sugarFast" : diaValue1,
                     "sugar2H": diaValue2 } 
            }),
            contentType: "application/json"
        }).success (function(data) { 
            console.log(data);

        })
        
        
        if(diaValue1 < diaValue2){
        return {
            "classNameForResult": "card",
            "classNameForSuggestion": "bar bar-footer bar-balanced",
            "results": "You expense too much money, please manage your expense more reasnable!"
        }
        }
          if(diaValue1 > diaValue2 && diaValue2 >= diaValue1/2)
              return{
            "classNameForResult": "card",
            "classNameForSuggestion": "bar bar-footer bar-balanced",
            "results": "A reasonable expense habit."                  
    }
            if(diaValue2<diaValue1/2)
                return{
                "classNameForResult": "card",
            "classNameForSuggestion": "bar bar-footer bar-balanced",
            "results":"A reasonable expense management, and your have lots of saved money."    
                    
                }
      }
              
    $scope.diaDetectView = function(style) {
        document.getElementById("result").className = style["classNameForResult"];      document.getElementById("suggestion").className=style["classNameForSuggestion"];
        console.log(style["classNameForSuggestion"]);
        document.getElementById("result").innerHTML=style["results"];
        
        
//        $cordovaToast
//        .show("Detection is recorded", 'short', 'center')
//        .then(function(success) {
//            console.log('Success');
//        }, function (error) {
//            console.log('Error');
//        });

    }
    $scope.clearSearch = function () {
        $scope.diaData1 = "";
        $scope.diaData2 = "";
    };
})


.controller('RegistCtrl', function($scope, $http, $httpParamSerializerJQLike){
    $scope.pageClass = 'register';
    $scope.register = function(email, username, password) {
        console.log("inside register function");
        $http({
            method:'GET',
            url:'https://api.mongolab.com/api/1/databases/mowenyoulong/collections/Lab10?q={"name": "' + username + '"}&apiKey=fzeK7cu47mzxu0GCKCkEQRR-2I7KVd1H',
        }).success(function(data){
            console.log(data);
            if (data!=""){
                $scope.msg ="Username already picked, choose another one!"
            }
            else {
                $http({
                    method: 'POST',
                    url : 'https://api.mongolab.com/api/1/databases/mowenyoulong/collections/Lab10?apiKey=fzeK7cu47mzxu0GCKCkEQRR-2I7KVd1H',
                    data: JSON.stringify({
                        e_mail:email,
                        name: username,
                        psd: password,
                        sugarFast:null,
                        sugar2H:null
                    }),
                    contentType: "application/json"
                }).success(function(data) { 
                    console.log(data._id.$oid);
                    $scope.msg ="User created successfully";
                })
            }
        })
    }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

