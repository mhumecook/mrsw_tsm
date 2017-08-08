app.controller('AuthenticationController', function ($scope, $rootScope, $routeParams, $location, $http, Data) {
    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};
    $scope.doLogin = function (customer) {
        Data.post('login', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('/');
            }
        });
    };
    $scope.signup = {email:'',password:'',name:''};
    $scope.signUp = function (customer) {
        Data.post('signUp', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('/');
            }
        });
    };
    $scope.logout = function () {
        Data.get('logout').then(function (results) {
            Data.toast(results);
            $rootScope.loggedIn = false;
            $location.path('login');
        });
    }
});

app.controller('TableController', function($scope, $rootScope, $location, services) {
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
        
         
        $scope.doNewAppointment = function($event) {
            if ($rootScope.authenticated)
                $location.path('/edit-appointment/0');
        };

        
	services.getConsultationsForDate($scope.effectiveDate).then(function(data) {
		$scope.appointments = data.data;
	});
	
});


app.controller('EditAppointmentController', function($scope, $rootScope, $location, $routeParams, $filter, services, appointment) {
	var appointmentID = ($routeParams.appointment_id) ? parseInt($routeParams.appointment_id) : 0;
	var original = appointment.data;
			
		$scope.$watch('appointment.appointment_date', function(newValue, oldValue) {
			$scope.appointment.day_of_week = $filter('date')($scope.appointment.appointment_date, 'EEEE');
		
		});
		
	$rootScope.title = (appointmentID > 0) ? 'Edit Appointment' : 'Add Appointment';
	$scope.buttonText = (appointmentID > 0) ? 'Update Appointment' : 'Add New Appointment';
    
    //If this is a new appointment, set the date to the date on which we opened the editor
    if (appointmentID === 0) 
        {
            original = {};
            original.appointment_date = $scope.effectiveDate.toString("yyyy-MM-dd");
        }
	original._id = appointmentID;
	$scope.appointment = angular.copy(original);
	$scope.appointment._id = appointmentID;

	$scope.isClean = function() {
		return angular.equals(original, $scope.appointment);
		};

    $scope.deleteAppointment = function(appointment) {
        $location.path('/');
        if(confirm("Are you sure you want to delete appointment number: "+$scope.appointment._id)===true)
            {
            services.deleteAppointment(appointment.appointment_id);
            }
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

app.controller('LogoutController', function($scope, $location, Data) {
        Data.get('logout').then(function (results) {
            Data.toast(results);
            $location.path('login');
        });
});

app.controller('ConsultsController', function($scope, $location) {
		$scope.logout = function() {
			$location.path('logout');
		};
        
        $scope.doNewAppointment = function() {
            $location.path('/edit-appointment/0');
        };
});
