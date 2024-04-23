$(document).ready(function () {
	const pracownicyNieobecnii_Zdalnie = $('#dashboardObecnoscInput').jqxInput({
		placeHolder: 'Enter a Country',
		height: 30,
		width: 250,
		minLength: 1,
	});

	const url = 'https://api.elgor.com.pl/login';
	const apikey =
		'f000983f7ccf9d50418948aeb3eef18484fb354824ca383c64823bd7db18c41b82b90434b9ab30e4f310701d749fa158569573b16a13cbd15fd0b853af04ed77';

	var url = 'https://api.elgor.com.pl/login';
	var apikey =
		'f000983f7ccf9d50418948aeb3eef18484fb354824ca383c64823bd7db18c41b82b90434b9ab30e4f310701d749fa158569573b16a13cbd15fd0b853af04ed77';

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.setRequestHeader('apikey', apikey);

	xhr.onload = function () {
		if (xhr.status === 200) {
			console.log('Odpowiedź z API: ' + xhr.responseText);
		} else {
			console.error('Wystąpił błąd: ' + xhr.status);
		}
	};

	xhr.onerror = function () {
		console.error('Wystąpił błąd podczas wykonywania zapytania');
	};

	xhr.send();
});
