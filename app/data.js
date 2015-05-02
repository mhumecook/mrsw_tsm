app.factory("Data", ['$http', 'toaster',
    function ($http, toaster) { // This service connects to our REST API

        var serviceBase = 'services/v1/';

        var obj = {};
        obj.toast = function (data) {
            toaster.pop(data.status, "", data.message, 10000, 'trustedHtml');
        }
        obj.get = function (q) {  
            return $http.get(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        obj.post = function (q, object) {
            return $http.post(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            });
        };

        return obj;
}]);


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
