angular.module('myApp.socialFactoryModule', ['btford.socket-io'])
  .factory('socialFactory', function ($http) {
    var roomNumber;
    function updateZip (username, zipcode) {
      var zipHolder = {
        username: username,
        zipcode: zipcode
      }
      return $http.post('/api/social/updateZip', zipHolder)
    }
    function findPeople (zipcode) {
      return $http.post('/api/social/findPeople', {zipcode: zipcode})
    }
    function newChat (username1, username2) {
      return new Promise(function(resolve){

      $http.post('/api/social/newChat', {username1: username1, username2: username2})
        .then(function(data){
          console.log(data.data.roomNumber)
          roomNumber = data.data.roomNumber
          resolve(data.data.roomNumber)
        })
      })
    }
    function giveRoom(){
      return roomNumber;
    }
    return {
      updateZip: updateZip,
      findPeople: findPeople,
      newChat: newChat,
      giveRoom: giveRoom
    }
  })
  .factory('socket', function ($rootScope) {
    var socket = io.connect('/pee')
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments
          $rootScope.$apply(function () {
            callback.apply(socket, args)
          })
        })
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args)
            }
          })
        })
      }
    }
  })
