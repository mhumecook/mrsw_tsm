//Define an angular module for our app
var app = angular.module('consultsApplication', ['ngRoute', 'ngAnimate', 'toaster']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        title: 'Appointments',
        templateUrl: 'partials/consults.html',
        controller: 'TableController'
    })
        .when('/login', {
            title: 'Login',
            templateUrl: 'partials/login.html',
            controller: 'AuthenticationController'
        })
      .when('/logout', {
          title: 'Logout',
          templateUrl: 'partials/login.html',
          controller: 'LogoutController'
      })
      .when('/signup', {
          title: 'Signup',
          templateUrl: 'partials/signup.html',
          controller: 'AuthenticationController'
      })
      .when('/edit-appointment/:appointment_id', {
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
        redirectTo: '/login'
      });
}]).run(function ($rootScope, $location, Data) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.authenticated = false; 
            Data.get('session').then(function (results) {
                if (results.uid) {
                    $rootScope.authenticated = true;
                    $rootScope.uid = results.uid;
                    $rootScope.name = results.name;
                    $rootScope.email = results.email;
                } else {
                    var nextUrl = next.$$route.originalPath;
                    if (nextUrl == '/signup' || nextUrl == '/login') {

                    } else {
                        $location.path("/login");
                    }
                }
            });
        });
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
    });


