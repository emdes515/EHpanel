$('#menuGlowne').jqxNavigationBar({
	width: '100%',
	expandMode: 'multiple',
	expandedIndexes: [0],
	theme: theme,
});

$('#menuGlowneModuly').jqxMenu({ width: '100%', mode: 'vertical', theme: theme });
$('#menuGlowneModuly').css('visibility', 'visible');
$('#menuGlowneUstawienia').jqxMenu({ width: '100%', mode: 'vertical', theme: theme });
$('#menuGlowneUstawienia').css('visibility', 'visible');

$('#menuRaportowanieCzasuPracy').click(function () {
	if (sprawdzUprawnienia('menu_RCP') == 1) {
		$('#pulpit').load('html/raportowanieCzasuPracy.html');
		zamknijMenu();
	} else pokazKomunikat('blad', komunikaty['menuBrakUprawnienDoModuluRCP']);
});

$('#wyloguj').jqxButton({ width: 120, height: 30, theme: theme });
$('#wyloguj').click(function () {
	let dane = {};
	dane['modul'] = 'logowanie';
	dane['funkcja'] = 'wyloguj';
	daneJSON = wczytajDane('php/index.php', dane);
	if (daneJSON['wynik'] == 1) {
		location.reload();
	}
});

$('#dashboardZleceniaWewnetrzne').click(function () {
	const daneJSON = wczytajDane('php/index.php', {
		modul: 'dashboardZleceniaWewnetrzne',
		funkcja: 'wczytaj',
		idPracownika: wczytajDane('php/index.php', {
			modul: 'logowanie',
			funkcja: 'getIdPracownika',
		}).wynik,
	});

	if (daneJSON['menu_zleceniaWewnetrzne'].menu_zleceniaWewnetrzne) {
		$('#pulpit').load('html/dashboardZleceniaWewnetrzne.html');
		zamknijMenu();
	} else {
		pokazKomunikat('blad', komunikaty['menuBrakUprawnienDoModuluUstawieniaZleceniaWewnetrzne']);
	}
});

let dane = {};
dane['modul'] = 'logowanie';
dane['funkcja'] = 'pokazDanePracownika';
daneJSON = wczytajDane('php/index.php', dane);
$('#imieNazwiskoPracownika').html(daneJSON['imie'] + ' ' + daneJSON['nazwisko']);
