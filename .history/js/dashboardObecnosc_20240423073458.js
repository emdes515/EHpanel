$(document).ready(function () {
	const pracownicy = [
		{
			imie: 'JAN',
			nazwisko: 'NOWAK',
			login: '...',
			nrEwidencyjny: 22000000,
			symbolDzialu: 'IT',
			nazwaDzialu: 'DZIAŁ INFORMATYKI',
		},
		{
			imie: 'ADAM',
			nazwisko: 'KOWALSKI',
			login: '...',
			nrEwidencyjny: 22000001,
			symbolDzialu: 'IT',
			nazwaDzialu: 'DZIAŁ INFORMATYKI',
		},
	];

	const pracownicyNieobecnii_Zdalnie = $('#dashboardObecnoscInput').jqxInput({
		placeHolder: 'Wprowadź dane pracownika',
		height: '100%',
		width: '100%',
		minLength: 1,
		source: pracownicy,
		searchMode: 'startswithignorecase',
		valueMember: 'idPracownika',
		theme: theme,
	});

	const url = 'https://api.elgor.com.pl/login';
	const apikey =
		'f000983f7ccf9d50418948aeb3eef18484fb354824ca383c64823bd7db18c41b82b90434b9ab30e4f310701d749fa158569573b16a13cbd15fd0b853af04ed77';

	fetch(url, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			apikey: apikey,
		},
	})
		.then((response) => response.json())
		.then((data) => console.log(data));
});
