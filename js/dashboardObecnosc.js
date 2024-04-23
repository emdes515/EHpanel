$(document).ready(function () {
	var dashboardObecnoscListaPracownikowSource = {
		datatype: 'json',
		datafields: [
			{ name: 'imie', type: 'string' },
			{ name: 'nazwisko', type: 'string' },
			{ name: 'login', type: 'string' },
			{ name: 'nrEwidencyjny', type: 'int' },
			{ name: 'symbolDzialu', type: 'string' },
			{ name: 'nazwaDzialu', type: 'string' },
			{ name: 'nazwiskoImie', type: 'string' },
		],
		url: 'php/index.php?modul=dashboardObecnosc&funkcja=listaPracownikow',
		async: false,
	};

	var dashboardObecnoscListaPracownikowDataAdapter = new $.jqx.dataAdapter(
		dashboardObecnoscListaPracownikowSource
	);

	const dashboardObecnoscPracownicyNieobecniOrazNaPracyZdalnejDzisiajJSON = wczytajDane(
		'php/index.php',
		{
			modul: 'dashboardObecnosc',
			funkcja: 'nieobecnosciPracaZdalna',
		}
	);

	console.log(dashboardObecnoscPracownicyNieobecniOrazNaPracyZdalnejDzisiajJSON);

	$('#dashboardObecnoscInput').jqxComboBox({
		width: 300,
		height: 20,
		placeHolder: 'Wybierz pracownika',
		source: dashboardObecnoscListaPracownikowDataAdapter,
		displayMember: 'nazwiskoImie',
		valueMember: 'nrEwidencyjny',
		autoComplete: true,
		searchMode: 'containsignorecase',
		theme: theme,
	});

	$('#dashboardObecnoscInfo').hide();

	$('#dashboardObecnoscInput').on('change', function (event) {
		$('#dashboardObecnoscInfo').show();

		const daneJSON = wczytajDane('php/index.php', {
			modul: 'dashboardObecnosc',
			funkcja: 'danePracownika',
			nrEwidencyjny: event.args.item.value,
		});

		const obecnoscJSON = wczytajDane('php/index.php', {
			modul: 'dashboardObecnosc',
			funkcja: 'danePracownika',
			nrEwidencyjny: event.args.item.value,
		});

		const pracownik = daneJSON[0];

		const { imie, nazwisko, symbolDzialu, nazwaDzialu } = pracownik;

		$('#dashboardObecnoscNazwiskoImie').text(`${nazwisko} ${imie}`);

		$('#dashboardObecnoscObecnosc').text('test');
		$('#dashboardObecnoscDzial').text(`${symbolDzialu} (${nazwaDzialu})`);
		$('#dashboardObecnoscEmail').text('test');
		$('#dashboardObecnoscNrTelWew').text('test');
		$('#dashboardObecnoscNrTelSlu').text('test');
		$('#dashboardObecnoscPrzelozony').text('test');
	});
});
