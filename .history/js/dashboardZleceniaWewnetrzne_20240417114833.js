$(document).ready(function () {
	const daneJSON = wczytajDane('php/index.php', {
		modul: 'dashboardZleceniaWewnetrzne',
		funkcja: 'wczytaj',
		idPracownika: wczytajDane('php/index.php', {
			modul: 'logowanie',
			funkcja: 'getIdPracownika',
		}).wynik,
	});

	if (daneJSON['menu_zleceniaWewnetrzne_dzialZglaszajacy'].menu_zleceniaWewnetrzne_dzialZglaszajacy)
		$('#dashboardZleceniaWewnetrzneDzialyZglaszajacePulpit').html(
			daneJSON['menu_zleceniaWewnetrzne_dzialZglaszajacy'].html
		);
	else $('#dashboardZleceniaWewnetrzneDzialyZglaszajacePulpit').load('html/brakUprawnien.html');

	if (
		daneJSON['menu_zleceniaWewnetrzne_rodzajWnioskowanejPracy']
			.menu_zleceniaWewnetrzne_rodzajWnioskowanejPracy
	)
		$('#dashboardZleceniaWewnetrzneRodzajeWnioskowanejPracyPulpit').html(
			daneJSON['menu_zleceniaWewnetrzne_rodzajWnioskowanejPracy'].html
		);
	else
		$('#dashboardZleceniaWewnetrzneRodzajeWnioskowanejPracyPulpit').load('html/brakUprawnien.html');

	if (
		daneJSON['menu_zleceniaWewnetrzne_rodzajZalaczanychDokumentow']
			.menu_zleceniaWewnetrzne_rodzajZalaczanychDokumentow
	)
		$('#dashboardZleceniaWewnetrzneRodzajeZalaczanychDokumentowPulpit').html(
			daneJSON['menu_zleceniaWewnetrzne_rodzajZalaczanychDokumentow'].html
		);
	else
		$('#dashboardZleceniaWewnetrzneRodzajeZalaczanychDokumentowPulpit').load(
			'html/brakUprawnien.html'
		);

	if (daneJSON['menu_zleceniaWewnetrzne_rynkek'].menu_zleceniaWewnetrzne_rynkek)
		$('#dashboardZleceniaWewnetrzneRynkiPulpit').html(
			daneJSON['menu_zleceniaWewnetrzne_rynkek'].html
		);
	else $('#dashboardZleceniaWewnetrzneRynkiPulpit').load('html/brakUprawnien.html');

	if (daneJSON['menu_zleceniaWewnetrzne_typWniosku'].menu_zleceniaWewnetrzne_typWniosku)
		$('#dashboardZleceniaWewnetrzneTypyWnioskowPulpit').html(
			daneJSON['menu_zleceniaWewnetrzne_typWniosku'].html
		);
	else $('#dashboardZleceniaWewnetrzneTypyWnioskowPulpit').load('html/brakUprawnien.html');
});
