var currentAppointmentDate;

document.getElementById("displayDate").value = getTodayAsString();

function getTodayAsString() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();
	
	if (dd < 10 ) {
		dd = '0' + dd;	
	}
	if (mm < 10 ) {
		mm = '0' + mm;	
	}

	return dd + '/' + mm + '/' + yyyy;
}

function previousDate() {
	var currentAppointmentDisplayDate = document.getElementById("displayDate").value;
	var currentAppointmentDisplayDay = currentAppointmentDisplayDate.substring(0,2);
	var currentAppointmentDisplayMonth = currentAppointmentDisplayDate.substring(3,5);
	var currentAppointmentDisplayYear = currentAppointmentDisplayDate.substring(6,10);
	
	var previousDate = new Date(currentAppointmentDisplayYear, currentAppointmentDisplayMonth - 1, currentAppointmentDisplayDay);
	
	previousDate.setDate(previousDate.getDate()-1);
	
	var previousDayDisplay = displayDateFromDate(previousDate);
	document.getElementById("displayDate").value = previousDayDisplay;
}

function getEffectiveDateString() {
	return document.getElementById("displayDate").value;
}

function nextDate() {
	var currentAppointmentDisplayDate = document.getElementById("displayDate").value;
	var currentAppointmentDisplayDay = currentAppointmentDisplayDate.substring(0,2);
	var currentAppointmentDisplayMonth = currentAppointmentDisplayDate.substring(3,5);
	var currentAppointmentDisplayYear = currentAppointmentDisplayDate.substring(6,10);
	
	var nextDate = new Date(currentAppointmentDisplayYear, currentAppointmentDisplayMonth - 1, currentAppointmentDisplayDay);
	
	nextDate.setDate(nextDate.getDate() + 1);
	
	var nextDayDisplay = displayDateFromDate(nextDate);
	document.getElementById("displayDate").value = nextDayDisplay;
}

function displayDateFromDate(inputDate) {
	var displayDay = inputDate.getDate();
	var displayMonth = inputDate.getMonth() + 1;
	var displayYear = inputDate.getFullYear();
	
	if (displayDay < 10) {
		displayDay = '0' + displayDay;	
	}
	
	if (displayMonth < 10) {
		displayMonth = '0' + displayMonth;	
	}

	return displayDay + '/' + displayMonth + '/' + displayYear;
}

function dateASDBStringFromSensibleFormat(sensibleDateString) {
	var yearPart = sensibleDateString.substring(6,10);
	var monthPart = sensibleDateString.substring(3,5);
	var dayPart = sensibleDateString.substring(0,2);
	
	return '"' + yearPart + '-' + monthPart + '-' + dayPart + '"';
}




