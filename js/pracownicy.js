$(document).ready(function () {
	var urlPracownicyLista = 'php/index.php?modul=pracownicy&funkcja=lista';
	var urlListaDzialow = 'php/index.php?modul=uprawnienia&funkcja=listaDzialow';

	var sourcePracownicyLista = {
		datatype: 'json',
		datafields: [{ name: 'idPracownika' }, { name: 'nazwiskoImie' }],
		localdata: [
			...[{ idPracownika: 0, nazwiskoImie: 'Dodaj pracownika' }],
			...wczytajDane(urlPracownicyLista),
		],
		async: false,
	};

	var dataAdapterPracownicyLista = new $.jqx.dataAdapter(sourcePracownicyLista);

	$('#pracownicyPracownik').jqxComboBox({
		width: 300,
		height: 20,
		placeHolder: 'Wybierz pracownika',
		source: dataAdapterPracownicyLista,
		displayMember: 'nazwiskoImie',
		valueMember: 'idPracownika',
		autoComplete: true,
		searchMode: 'containsignorecase',
		selectedIndex: 0,
		theme: theme,
	});
	$('#pracownicyPracownik').jqxComboBox('getItem', 0).html =
		'<div style="text-align: center; backgroud: blue; font-weight: bold; padding: 8px;">Dodaj pracownika</div>';
	$('#pracownicyImie').jqxInput({
		width: 300,
		height: 20,
		theme: theme,
	});
	$('#pracownicyNazwisko').jqxInput({
		width: 300,
		height: 20,
		theme: theme,
	});
	$('#pracownicyProxNetId').jqxInput({
		width: 300,
		height: 20,
		theme: theme,
	});
	$('#pracownicyNrIFS').jqxInput({
		width: 300,
		height: 20,
		theme: theme,
	});
	$('#pracownicySambaLogin').jqxInput({
		width: 300,
		height: 20,
		theme: theme,
	});
	$('#pracownicyEmail').jqxInput({
		width: 300,
		height: 20,
		theme: theme,
	});
	$('#pracownicyEmailEH').jqxInput({
		width: 300,
		height: 20,
		theme: theme,
	});
	$('#pracownicyWyslacPowiadomieniaZleceniaWewnetrznego').jqxCheckBox({
		width: 300,
		height: 20,
		theme: theme,
	});
	$('#pracownicyWyslacPasek').jqxCheckBox({
		width: 300,
		height: 20,
		theme: theme,
	});
	$('#pracownicyEtat').jqxInput({
		width: 300,
		height: 20,
		theme: theme,
	});
	$('#pracownicyNoweHaslo').jqxPasswordInput({
		width: 300,
		height: 20,
		showStrength: true,
		showStrengthPosition: 'right',
		localization: {
			passwordStrengthString: 'Siła hasła',
			tooShort: 'Za krótkie',
			weak: 'Słabe',
			fair: 'Średnie',
			good: 'Dobre',
			strong: 'Mocne',
		},
		strengthTypeRenderer: function (password, characters, defaultStrength) {
			var matches = password.match(/^[A-Za-z0-9.,-]{8,40}$/);
			var length = password.length;
			if (length < 8) {
				komunikat = 'Za krótkie (8-40)';
				kolor = 'rgb(170, 0, 51)';
			} else {
				if (password.match(/^[A-Za-z0-9.,-]{8,40}$/)) {
					komunikat = 'Poprawne';
					kolor = 'rgb(118, 194, 97)';
				} else {
					komunikat = 'Zawiera niepoprawne znaki (A-Za-z0-9.,-)';
					kolor = 'rgb(170, 0, 51)';
				}
			}
			return "<div style='color: " + kolor + ";'><b>" + komunikat + '</b></div>';
		},
		theme: theme,
	});
	$('#pracownicyPowtorzNoweHaslo').jqxPasswordInput({
		width: 300,
		height: 20,
		showStrength: true,
		showStrengthPosition: 'right',
		localization: {
			passwordStrengthString: 'Siła hasła',
			tooShort: 'Za krótkie',
			weak: 'Słabe',
			fair: 'Średnie',
			good: 'Dobre',
			strong: 'Mocne',
		},
		strengthTypeRenderer: function (password, characters, defaultStrength) {
			var matches = password.match(/^[A-Za-z0-9.,-]{8,40}$/);
			var length = password.length;
			if (length < 8) {
				komunikat = 'Za krótkie (8-40)';
				kolor = 'rgb(170, 0, 51)';
			} else {
				if (matches) {
					komunikat = 'Poprawne';
					kolor = 'rgb(118, 194, 97)';
				} else {
					komunikat = 'Zawiera niepoprawne znaki (A-Za-z0-9.,-)';
					kolor = 'rgb(170, 0, 51)';
				}
			}
			return "<div style='color: " + kolor + ";'><b>" + komunikat + '</b></div>';
		},
		theme: theme,
	});
	$('#pracownicyKierownik').jqxCheckBox({
		width: 20,
		height: 20,
		theme: theme,
	});
	var sourceListaDzialow = {
		datatype: 'json',
		datafields: [
			{ name: 'id', type: 'number' },
			{ name: 'parentid', type: 'number' },
			{ name: 'text', type: 'string' },
			{ name: 'value', type: 'string' },
		],
		id: 'id',
		url: urlListaDzialow,
		async: false,
	};
	var dataAdapterListaDzialow = new $.jqx.dataAdapter(sourceListaDzialow);
	dataAdapterListaDzialow.dataBind();
	var daneListaDzialow = dataAdapterListaDzialow.getRecordsHierarchy('id', 'parentid', 'items', [
		{ name: 'text', map: 'label' },
	]);
	$('#pracownicyDzial').jqxDropDownButton({
		width: 300,
		height: 20,
		theme: theme,
	});
	$('#pracownicyDzialDrzewo').jqxTree({
		source: daneListaDzialow,
		width: 300,
		height: 200,
		checkboxes: true,
		theme: theme,
	});
	$('#pracownicyDzialDrzewo').jqxTree('expandAll');
	$('#pracownicyDzial').jqxDropDownButton('setContent', 'Wybierz dział:');
	$('#pracownicyDzialDrzewo').on('select', function (event) {
		$('#pracownicyDzial').jqxDropDownButton('close');
		var dzialyZaznaczone = [];
		console.log(dzialyZaznaczone);
		var dzialy = $('#pracownicyDzialDrzewo').jqxTree('getCheckedItems');
		for (var i = 0; i < dzialy.length; i++) {
			if (dzialy[i].selected) dzialyZaznaczone.push('<b>' + dzialy[i].label + '</b>');
			else dzialyZaznaczone.push(dzialy[i].label);
		}
		var sDzialy = dzialyZaznaczone.join();
		if (sDzialy != '') $('#pracownicyDzial').jqxDropDownButton('setContent', sDzialy);
		else $('#pracownicyDzial').jqxDropDownButton('setContent', 'Wybierz dział:');
	});
	$('#pracownicyDzialDrzewo').on('checkChange', function (event) {
		var dzialyZaznaczone = [];
		var dzialy = $('#pracownicyDzialDrzewo').jqxTree('getCheckedItems');
		for (var i = 0; i < dzialy.length; i++) {
			if (dzialy[i].selected) dzialyZaznaczone.push('<b>' + dzialy[i].label + '</b>');
			else dzialyZaznaczone.push(dzialy[i].label);
		}
		var sDzialy = dzialyZaznaczone.join();
		if (sDzialy != '') $('#pracownicyDzial').jqxDropDownButton('setContent', sDzialy);
		else $('#pracownicyDzial').jqxDropDownButton('setContent', 'Wybierz dział:');
	});
	$('#pracownicyWidoczny').jqxCheckBox({
		width: 20,
		height: 20,
		theme: theme,
	});
	$('#pracownicyEdycjaZapisz').jqxButton({
		theme: theme,
	});
	$('#pracownicyPracownik').on('select', function (event) {
		var dane = {};
		var args = event.args;
		var item = args.item;

		if (item) {
			// dodawanie nowego pracownika
			if (item.value == 0) {
				dane['modul'] = 'pracownicy';
				dane['funkcja'] = 'dodaj';

				daneJSON = wczytajDane('php/index.php', dane);

				$('#pracownicyImie').val('');
				$('#pracownicyNazwisko').val('');
				$('#pracownicyProxNetId').val('');
				$('#pracownicyNrIFS').val('');
				$('#pracownicySambaLogin').val('');
				$('#pracownicyEmail').val('');
				$('#pracownicyEmailEH').val('');
				$('#pracownicyWyslacPowiadomieniaZleceniaWewnetrznego').jqxCheckBox('uncheck');
				$('#pracownicyWyslacPasek').jqxCheckBox('uncheck');
				$('#pracownicyNoweHaslo').val('');
				$('#pracownicyPowtorzNoweHaslo').val('');
				$('#pracownicyEtat').val('');
				$('#pracownicyKierownik').jqxCheckBox('uncheck');
				$('#pracownicyWidoczny').jqxCheckBox('uncheck');
				$('#pracownicyDzialDrzewo').jqxTree('uncheckAll');
			} else {
				//edycja instejącego pracownika
				idPracownika = item.value;
				idDzialu = 0;
				dane['modul'] = 'pracownicy';
				dane['funkcja'] = 'formularz';
				dane['idPracownika'] = item.value;

				daneJSON = wczytajDane('php/index.php', dane);

				$('#pracownicyImie').val(daneJSON['imie']);
				$('#pracownicyNazwisko').val(daneJSON['nazwisko']);
				$('#pracownicyProxNetId').val(daneJSON['proxNetId']);
				$('#pracownicyNrIFS').val(daneJSON['nrIFS']);
				$('#pracownicySambaLogin').val(daneJSON['sambaLogin']);
				$('#pracownicyEmail').val(daneJSON['email']);
				$('#pracownicyEmailEH').val(daneJSON['emailEH']);
				if (daneJSON['wyslacPowiadomieniaZleceniaWewnetrznego'] == 1)
					$('#pracownicyWyslacPowiadomieniaZleceniaWewnetrznego').jqxCheckBox('check');
				else $('#pracownicyWyslacPowiadomieniaZleceniaWewnetrznego').jqxCheckBox('uncheck');
				if (daneJSON['wyslacPasek'] == 1) $('#pracownicyWyslacPasek').jqxCheckBox('check');
				else $('#pracownicyWyslacPasek').jqxCheckBox('uncheck');
				$('#pracownicyNoweHaslo').val('');
				$('#pracownicyPowtorzNoweHaslo').val('');
				$('#pracownicyEtat').val(daneJSON['etat']);
				if (daneJSON['kierownik'] == 1) $('#pracownicyKierownik').jqxCheckBox('check');
				else $('#pracownicyKierownik').jqxCheckBox('uncheck');
				if (daneJSON['widoczny'] == 1) $('#pracownicyWidoczny').jqxCheckBox('check');
				else $('#pracownicyWidoczny').jqxCheckBox('uncheck');
				$('#pracownicyDzialDrzewo').jqxTree('uncheckAll');
				var items = $('#pracownicyDzialDrzewo').jqxTree('getItems');
				$.each(daneJSON['dzial'], function (klucz, wartosc) {
					$('#pracownicyDzialDrzewo').jqxTree('checkItem', $('#' + wartosc.idDzialu)[0], true);
					if (wartosc.dzialPodstawowy == '1')
						$('#pracownicyDzialDrzewo').jqxTree('selectItem', $('#' + wartosc.idDzialu)[0]);
				});
			}
		}
	});
	$('#pracownicyPracownik').on('click', function () {
		$('#pracownicyPracownik').val('');
	});
	$('#pracownicyEdycjaZapisz')
		.off()
		.on('click', function () {
			if ($('#pracownicyFormularz').jqxValidator('validate') == true) {
				var dane = {};
				var dzial = {};
				var i = 0;
				dane['idPracownika'] = $('#pracownicyPracownik').val();
				dane['imie'] = $('#pracownicyImie').val();
				dane['nazwisko'] = $('#pracownicyNazwisko').val();
				dane['proxNetId'] = $('#pracownicyProxNetId').val();
				dane['nrIFS'] = $('#pracownicyNrIFS').val();
				dane['sambaLogin'] = $('#pracownicySambaLogin').val();
				dane['email'] = $('#pracownicyEmail').val();
				dane['emailEH'] = $('#pracownicyEmailEH').val();
				dane['wyslacPowiadomieniaZleceniaWewnetrznego'] = Number(
					$('#pracownicyWyslacPowiadomieniaZleceniaWewnetrznego').val()
				);
				dane['wyslacPasek'] = Number($('#pracownicyWyslacPasek').val());
				dane['etat'] = $('#pracownicyEtat').val();
				dane['noweHaslo'] = $('#pracownicyNoweHaslo').val();
				dane['powtorzNoweHaslo'] = $('#pracownicyPowtorzNoweHaslo').val();
				dane['kierownik'] = Number($('#pracownicyKierownik').val());
				var items = $('#pracownicyDzialDrzewo').jqxTree('getCheckedItems');
				$.each(items, function (index) {
					var tmp = {};
					tmp['idDzialu'] = this.value;
					if (this.selected) tmp['dzialPodstawowy'] = 1;
					else tmp['dzialPodstawowy'] = 0;
					dzial[i] = tmp;
					i++;
				});
				dane['dzial'] = dzial;
				dane['widoczny'] = Number($('#pracownicyWidoczny').val());
				if (dane['idPracownika'] == 0) {
					dane['modul'] = 'pracownicy';
					dane['funkcja'] = 'dodaj';
					dane['idPracownika'] = null;
				} else {
					dane['modul'] = 'pracownicy';
					dane['funkcja'] = 'zapisz';
				}

				daneJSON = wczytajDane('php/index.php', dane);
				var id = daneJSON['idPracownika'];

				if (id >= 0 && id != null) {
					id === 0
						? pokazKomunikat('ok', komunikaty['pracownicyNowyDodanie'])
						: pokazKomunikat('ok', komunikaty['pracownicyDodanie']);
					$('#pracownicyPracownik').jqxComboBox('selectIndex', 0);
					$('#pracownicyImie').val('');
					$('#pracownicyNazwisko').val('');
					$('#pracownicyProxNetId').val('');
					$('#pracownicyNrIFS').val('');
					$('#pracownicySambaLogin').val('');
					$('#pracownicyEmail').val('');
					$('#pracownicyEmailEH').val('');
					$('#pracownicyWyslacPowiadomieniaZleceniaWewnetrznego').jqxCheckBox('uncheck');
					$('#pracownicyWyslacPasek').jqxCheckBox('uncheck');
					$('#pracownicyEtat').val('');
					$('#pracownicyNoweHaslo').val('');
					$('#pracownicyPowtorzNoweHaslo').val('');
					$('#pracownicyKierownik').jqxCheckBox('uncheck');
					$('#pracownicyWidoczny').jqxCheckBox('uncheck');
					$('#pracownicyDzialDrzewo').jqxTree('uncheckAll');

					var sourcePracownicyLista = {
						datatype: 'json',
						datafields: [{ name: 'idPracownika' }, { name: 'nazwiskoImie' }],
						localdata: [
							...[{ idPracownika: 0, nazwiskoImie: 'Dodaj pracownika' }],
							...wczytajDane(urlPracownicyLista),
						],
						async: false,
					};

					var dataAdapterPracownicyLista = new $.jqx.dataAdapter(sourcePracownicyLista);

					$('#pracownicyPracownik').jqxComboBox({
						source: dataAdapterPracownicyLista,
					});

					$('#pracownicyPracownik').jqxComboBox('refresh');
				} else {
					pokazKomunikat('blad', komunikaty['pracownicyDodanieBlad']);
				}
			}
		});
	$('#pracownicyFormularz').jqxValidator({
		rules: [
			{
				input: '#pracownicyPracownik',
				message: 'Wybierz pracownika',
				action: 'change',
				rule: function () {
					var idPracownika = $('#pracownicyPracownik').val();
					if (idPracownika >= 0) return true;
					else return false;
				},
			},
			{
				input: '#pracownicyEtat',
				message: 'Wpisz etat',
				action: 'blur',
				rule: function () {
					var etat = $('#pracownicyEtat').val();
					etat = etat.replace(',', '.');
					var etat = parseFloat(etat);
					if (etat >= 0) {
						$('#pracownicyEtat').val(etat);
						return true;
					} else {
						$('#pracownicyEtat').val(0);
						return false;
					}
				},
			},
			{
				input: '#pracownicyNoweHaslo',
				message: 'Nieprawidłowe nowe hasło',
				action: 'change',
				rule: function () {
					var wartosc = $('#pracownicyNoweHaslo').val();
					var matches = wartosc.match(/^[A-Za-z0-9.,-]{8,40}$/);
					var length = wartosc.length;
					if (length > 0)
						if (length < 8) return false;
						else if (matches) return true;
						else return false;
					else return true;
				},
			},
			{
				input: '#pracownicyPowtorzNoweHaslo',
				message: 'Nieprawidłowe powtórzenie nowego hasła',
				action: 'change',
				rule: function () {
					var wartoscNoweHaslo = $('#pracownicyNoweHaslo').val();
					var wartoscPowtorzNoweHaslo = $('#pracownicyPowtorzNoweHaslo').val();
					var matches = wartoscPowtorzNoweHaslo.match(/^[A-Za-z0-9.,-]{8,40}$/);
					var length = wartoscPowtorzNoweHaslo.length;
					if (length > 0)
						if (length < 8) return false;
						else if (matches)
							if (wartoscNoweHaslo == wartoscPowtorzNoweHaslo) return true;
							else return false;
						else return false;
					else return true;
				},
			},
		],
	});
});
