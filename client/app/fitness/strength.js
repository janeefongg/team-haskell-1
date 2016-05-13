angular.module('myApp.strength', ['factories'])
  .controller('StrengthCtrl', function ($scope, AuthFactory, StrengthFactory, $cookies, ProfileFactory, $state, $uibModal) {
    $scope.animationsEnabled = true

    $scope.inputStrength = function () {
      $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'app/fitness/strengthModal.html',
        controller: 'StrengthModalCtrl',
        windowClass: 'app-modal-window-fitness'
      })
    }

    $scope.user = $cookies.get('username')
    $scope.strengthList
    $scope.c1_data = {labels: [], series: [[]]}
    $scope.c2_data = {labels: [], series: []}

    // Getting profile information and then calling fetchLog
    $scope.getStrengthProfile = function () {
      ProfileFactory.getProfile($scope.user)
        .then(function (data) {
          $scope.display = data.data[0]
        })
        .then(function () {
          fetchLog()
        })
    }

    // Calculating 90% one rep maximum
    $scope.onerepmax = function (weight, reps) {
      return (weight * (1 + (reps / 30))).toFixed(1)
    }

    $scope.getStrengthProfile()

    // Fetching Activity log function
    const fetchLog = function () {
      StrengthFactory.getStrength($scope.user)
        .then(function (data) {
          $scope.strengthList = data.data

          // reset $scope array values
          $scope.c1_data = {labels: [], series: [[]]}
          $scope.c2_data = {labels: [], series: []}

          c1_duration_date(data.data)
          c2_activity_type(data.data)
        })
        .then(function (data) {
          renderGraphs()
        })
    }
    // Convert number (0-6) to day of week
    const day_of_week = function (num) {
      var day
      switch (num) {
        case 0:
          day = 'Sunday'
          break
        case 1:
          day = 'Monday'
          break
        case 2:
          day = 'Tuesday'
          break
        case 3:
          day = 'Wednesday'
          break
        case 4:
          day = 'Thursday'
          break
        case 5:
          day = 'Friday'
          break
        case 6:
          day = 'Saturday'
          break
      }
      return day
    }

    // Chart Graph 1 - X: Date Y: Duration at Gym
    const c1_duration_date = function (arr) {
      var c1_obj = {}
      var dateshort
      // var days = arr.length

      // Creating object of [day of week:duration]
      for (var i = 0; i < arr.length; i++) {
        dateshort = arr[i].date
        var x = new Date(dateshort).getDay()
        if (c1_obj[x] !== undefined) {
          c1_obj[x] = c1_obj[x] + arr[i].duration
        } else {
          c1_obj[x] = arr[i].duration
        }
      }

      // Setting the label and series to scope c1_data
      for (var k in c1_obj) {
        $scope.c1_data.labels.push(day_of_week(parseInt(k)))
        $scope.c1_data.series[0].push(c1_obj[k])
      }
    }

    // Pie Chart 2 - Type of activities for entire data set
    const c2_activity_type = function (arr) {
      var c2_obj = {}
      var c2_arr = []

      // Creating array of all strength workout types
      for (var i = 0; i < arr.length; i++) {
        c2_arr.push(arr[i].type)
      }

      // Counting instances(removing dup keys) of each strength workout type
      for (var j = 0; j < c2_arr.length; j++) {
        if (c2_obj[c2_arr[j]]) {
          c2_obj[c2_arr[j]]++
        } else {
          c2_obj[c2_arr[j]] = 1
        }
      }

      // Putting the instances and type into $scope.c2_data for export
      for (var k in c2_obj) {
        $scope.c2_data.labels.push(k)
        $scope.c2_data.series.push(c2_obj[k])
      }
    }

    // Rendering the graphs
    const renderGraphs = function () {
      var options = {
        width: 500,
        height: 250,
        labelInterpolationFnc: function (value) {
          return value
        }
      }

      var responsiveOptions = [
        ['screen and (min-width: 640px)', {
          chartPadding: 30,
          labelOffset: 100,
          labelDirection: 'explode',
          labelInterpolationFnc: function (value) {
            return value
          }
        }],
        ['screen and (min-width: 1024px)', {
          labelOffset: 80,
          chartPadding: 20
        }]
      ]
<<<<<<< d9a67fc9e3f772874aae4d298e79bb1f51939c6f
=======

      $(function () {
        $("[data-toggle='tooltip']").tooltip()
      })

>>>>>>> [Feat] Modals for Cardio and Strength
      new Chartist.Bar('#chart1', $scope.c1_data, options)
      new Chartist.Pie('#chart2', $scope.c2_data, responsiveOptions)
    }

      $(function () {
        $("[data-toggle='tooltip']").tooltip()
      })
  })
