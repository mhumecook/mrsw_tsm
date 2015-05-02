//Define an angular module for our app
var app = angular.module('consultsApplication', ['ngRoute']);


app.factory("services", ['$http', function($http) {
  var serviceBase = 'services/'
    var obj = {};
    obj.getCustomers = function(){
        return $http.get(serviceBase + 'customers');
    }
    obj.getConsultations = function(){
		return $http.get(serviceBase + 'appointments');
	}
	
    obj.getConsultationsForDate = function (effectiveDate) {
    	return $http.get(serviceBase + 'filteredAppointments?effective_date=' + yyyymmddFormat(effectiveDate));
    }
    
    obj.getAppointment = function(appointmentID){
        return $http.get(serviceBase + 'appointment?id=' + appointmentID);
    }

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

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        title: 'Appointments',
        templateUrl: 'partials/consults.html',
        controller: 'TableController'
    }).
      when('/edit-appointment/:appointment_id', {
        title: 'Edit Appointment',
        templateUrl: 'partials/edit-appointment.html',
        controller: 'EditAppointmentController',
        resolve: {
          appointment: function(services, $route){
            var appointmentID = $route.current.params.appointment_id;
            var thing = services.getAppointment(appointmentID);
            return thing;
          }
        }
    }).
      otherwise({
        redirectTo: '/'
      });
}]);

app.controller('TableController', function($scope, $rootScope, services) {
		var currentDate = new Date(); 
		
		if ($rootScope.effectiveDate == null) {			
			$scope.effectiveDate = currentDate;		
		} else {
			$scope.effectiveDate = $rootScope.effectiveDate;		
		}

		$rootScope.effectiveDate = $scope.effectiveDate;
		$scope.effectiveDateDisplayed = displaySensibleDate($scope.effectiveDate);
		
		$scope.previousDate = function () {
			var currentEffectiveDate = $scope.effectiveDate;
			currentEffectiveDate.setDate(currentEffectiveDate.getDate() - 1);
			$scope.effectiveDate = currentEffectiveDate;
			$scope.effectiveDateDisplayed = displaySensibleDate($scope.effectiveDate);
			services.getConsultationsForDate(currentEffectiveDate).then(function(data) {
				$scope.appointments = data.data;
					});
		}	
			
		$scope.nextDate = function () {
			var currentEffectiveDate = $scope.effectiveDate;
			currentEffectiveDate.setDate(currentEffectiveDate.getDate() + 1);
			$scope.effectiveDate = currentEffectiveDate;
			var newDateString = yyyymmddFormat(currentEffectiveDate);
			$scope.effectiveDateDisplayed = displaySensibleDate($scope.effectiveDate);
			services.getConsultationsForDate(currentEffectiveDate).then(function(data) {
					$scope.appointments = data.data;
				});
		};
	services.getConsultationsForDate($scope.effectiveDate).then(function(data) {
		$scope.appointments = data.data;
	});
	//
	//Nasty, nasty hack follows.  The author is clearly ignorant of how this environment works and cannot access
	//the appropriate scope to set the retrieved data to
	//
	$scope.previousDate();
	$scope.nextDate();
});


app.controller('EditAppointmentController', function($scope, $rootScope, $location, $routeParams, $filter, services, appointment) {
	var appointmentID = ($routeParams.appointment_id) ? parseInt($routeParams.appointment_id) : 0;
	var original = appointment.data;
			
		$scope.$watch('appointment.appointment_date', function(newValue, oldValue) {
			//$scope.appointment.day_of_week = $filter('date')($scope.appointment.appointment_date, 'EEEE');
			$scope.appointment.day_of_week = $filter('date')($scope.appointment.appointment_date, 'EEEE');
		
		});
		
	$rootScope.title = (appointmentID > 0) ? 'Edit Appointment' : 'Add Appointment';
	$scope.buttonText = (appointmentID > 0) ? 'Update Appointment' : 'Add New Appointment';

	original._id = appointmentID;
	$scope.appointment = angular.copy(original);
	$scope.appointment._id = appointmentID;

	$scope.isClean = function() {
		return angular.equals(original, $scope.appointment);
		}

      $scope.deleteAppointment = function(appointment) {
        $location.path('/');
        if(confirm("Are you sure you want to delete appointment number: "+$scope.appointment._id)==true)
        services.deleteAppointment(appointment.appointment_id);
      };
        
	$scope.saveAppointment = function(appointment) {
		$location.path('/');
		
        if (appointmentID <= 0) {
            services.insertAppointment(appointment);
        }
        else {
            services.updateAppointment(appointment.appointment_id, $scope.appointment);
        }
    };		
});

app.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);