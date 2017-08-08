var app = angular.module('myApp', ['ngRoute']);

app.factory("services", ['$http', function($http) {
  var serviceBase = 'services/';
    var obj = {};
    obj.getAppointments = function(){
        return $http.get(serviceBase + 'appointments');
    };
    obj.getFilteredAppointments = function(targetDateString){
    	var instring = serviceBase + 'getFilteredAppointments?filter_date = ' + targetDateString;
        return $http.get(serviceBase + 'getFilteredAppointments?filter_date = ' + targetDateString);
    };
    obj.getAppointment = function(appointment_id){
        return $http.get(serviceBase + 'appointment?id=' + appointment_id);
    };

    obj.insertAppointment = function (appointment) {
    return $http.post(serviceBase + 'insertAppointment', appointment).then(function (results) {
        return results;
    });
	};

	obj.updateAppointment = function (id,appointment) {
	    return $http.post(serviceBase + 'updateAppointment', {id:id, appointment:appointment}).then(function (status) {
	        return status.data;
	    });
	};

	obj.deleteAppointment = function (id) {
	    return $http.delete(serviceBase + 'deleteAppointment?id=' + id).then(function (status) {
	        return status.data;
	    });
	};

    return obj;   
}]);

app.controller('listCtrl', function ($scope, services) {
	 var targetDateString = document.getElementById("displayDate").value;
    services.getAppointments().then(function(data){
        $scope.appointments = data.data;
    });
});

app.controller('dateListCtrl', function ($scope, services, $routeParams) {
	 var targetDateString = dateASDBStringFromSensibleFormat("01-04-2015");
    services.getFilteredAppointments(targetDateString).then(function(data){
        $scope.appointments = data.data;
    });
});

app.controller('editCtrl', function ($scope, $rootScope, $location, $routeParams, services, appointment) {
    var appointment_id = ($routeParams.appointment_id) ? parseInt($routeParams.appointment_id) : 0;
    $rootScope.title = (appointment_id > 0) ? 'Edit Appointment' : 'Add Appointment';
    $scope.buttonText = (appointment_id > 0) ? 'Update Appointment' : 'Add New Appointment';
      var original = appointment.data;
      original._id = appointment_id;
      $scope.appointment = angular.copy(original);
      $scope.appointment._id = appointment_id;
      $scope.appointment.appointment_date = "12/31/2015";

      $scope.isClean = function() {
        return angular.equals(original, $scope.appointment);
      };

      $scope.deleteAppointment = function(appointment) {
        $location.path('/');
        if(confirm("Are you sure you want to delete appointment number: "+$scope.appointment._id)===true)
        services.deleteAppointment(appointment.appointment_id);
      };

      $scope.saveAppointment = function(appointment) {
        $location.path('/');
        if (appointment_id <= 0) {
            services.insertAppointment(appointment);
        }
        else {
            services.updateAppointment(appointment_id, appointment);
        }
    };
});

app.directive('focusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.focusMe, function(value) {
        if(value === true) { 
          console.log('value=',value);
          $timeout(function() {
            element[0].focus();
            scope[attrs.focusMe] = false;
          });
        }
      });
    }
  };
});

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        title: 'Appointments',
        templateUrl: 'partials/appointments.html',
        //controller: 'listCtrl'  
        controller: 'dateListCtrl'
      })
      .when('/edit-appointment/:appointment_id', {
        title: 'Edit Appointments',
        templateUrl: 'partials/edit-appointment.html',
        controller: 'editCtrl',
        resolve: {
          appointment: function(services, $route){
            var appointment_id = $route.current.params.appointment_id;
            return services.getAppointment(appointment_id);
          }
        }
      })
      .when('/appointments/:filter_date', {
        title: 'Edit Appointments',
        templateUrl: 'partials/edit-appointment.html',
        controller: 'dateListCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
}]);
app.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);
