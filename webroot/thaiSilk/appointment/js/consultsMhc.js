//Initialise the date for the page
var today = new Date();

function displaySensibleDate(dateObject) {
	var displayDay = dateObject.getDate();
	var displayMonth = dateObject.getMonth() + 1;
	var displayYear = dateObject.getFullYear();
	
	if (displayDay < 10) {
		displayDay = '0' + displayDay;	
	}
	
	if (displayMonth < 10) {
		displayMonth = '0' + displayMonth;	
	}
	
	var formattedString = displayDay + '/' + displayMonth + '/' + displayYear;
	return formattedString;
}

function yyyymmddFormat(dateObject) {
			var yyyy = dateObject.getFullYear();
			var mm = dateObject.getMonth() + 1;
			var dd = dateObject.getDate();

			if (dd < 10 ) {
				dd = '0' + dd;	
			}
			if (mm < 10 ) {
				mm = '0' + mm;	
			}			
			
			var returnString= yyyy + '-' + mm + '-' + dd;
			return returnString;
		}	
