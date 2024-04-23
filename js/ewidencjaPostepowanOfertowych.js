$(document).ready(function () {
	var urlEpoLista =
		"php/index.php?modul=ewidencjaPostepowanOfertowych&funkcja=lista";
	var urlEpoPanstwaLista =
		"php/index.php?modul=ewidencjaPostepowanOfertowych&funkcja=panstwaLista";
	var urlEpoSpolkiLista =
		"php/index.php?modul=ewidencjaPostepowanOfertowych&funkcja=spolkiLista";
	var urlEpoOdbiorcaLista =
		"php/index.php?modul=ewidencjaPostepowanOfertowych&funkcja=odbiorcaLista";
	var urlEpoRuchLista =
		"php/index.php?modul=ewidencjaPostepowanOfertowych&funkcja=ruchLista";
	var urlEpoZamawiajacyLista =
		"php/index.php?modul=ewidencjaPostepowanOfertowych&funkcja=zamawiajacyLista";
	var urlEpoNazwaPlikuPrzedrostek =
		"php/index.php?modul=ewidencjaPostepowanOfertowych&funkcja=nazwaPlikuPrzedrostekLista";
	var urlEpoNazwaPlikuRok =
		"php/index.php?modul=ewidencjaPostepowanOfertowych&funkcja=nazwaPlikuRokLista";
	var urlEpoNrProjektuLista =
		"php/index.php?modul=ewidencjaPostepowanOfertowych&funkcja=nrProjektuLista";
	var urlEpoProwadzacyLista =
		"php/index.php?modul=ewidencjaPostepowanOfertowych&funkcja=prowadzacyLista";
	var urlEpoWalutaLista =
		"php/index.php?modul=ewidencjaPostepowanOfertowych&funkcja=walutaLista";
	var urlEpoWartoscWadiumSlownik =
		"php/index.php?modul=ewidencjaPostepowanOfertowych&funkcja=wartoscWadiumSlownikLista";
	var urlEpoRodzajWadium =
		"php/index.php?modul=ewidencjaPostepowanOfertowych&funkcja=rodzajWadiumLista";
	var urlEpoInformacje =
		"php/index.php?modul=ewidencjaPostepowanOfertowych&funkcja=informacjeLista";
	$("#oknoEwidencjaPostepowanOfertowych").jqxWindow({
		resizable: false,
		width: "100%",
		height: "90%",
		maxWidth: "100%",
		maxHeight: 2000,
		draggable: false,
		keyboardCloseKey: 0,
		showCloseButton: false,
		theme: "web",
	});
	$("#oknoEwidencjaPostepowanOfertowychDodanieEdycja").jqxWindow({
		width: 550,
		height: "100%",
		maxWidth: 1000,
		maxHeight: 1000,
		resizable: false,
		isModal: true,
		autoOpen: false,
		modalOpacity: 0.6,
		theme: "web",
	});
	// Szybka ścieżka
	$("#epoSzybkaSciezka").jqxCheckBox({
		width: 120,
		height: 25,
		theme: "web",
	});
	$("#epoSzybkaSciezka").on("change", function (event) {
		var checked = event.args.checked;
		if (checked)
			$("#epoIloscWnioskowSzybkiejSciezki").jqxNumberInput({ disabled: false });
		else {
			$("#epoIloscWnioskowSzybkiejSciezki").jqxNumberInput({ disabled: true });
			$("#epoIloscWnioskowSzybkiejSciezki").val("0");
		}
	});
	// Ilość wniosków szybkiej ścieżki
	$("#epoIloscWnioskowSzybkiejSciezki").jqxNumberInput({
		width: 50,
		height: 20,
		min: 0,
		disabled: true,
		inputMode: "simple",
		decimalDigits: 0,
		spinButtons: true,
	});
	// Państwa
	var sourceEpoPanstwa = {
		datatype: "json",
		datafields: [{ name: "idPanstwa" }, { name: "nazwaPanstwa" }],
		url: urlEpoPanstwaLista,
		async: false,
	};
	var dataAdapterEpoPanstwa = new $.jqx.dataAdapter(sourceEpoPanstwa);
	$("#epoPanstwo").jqxComboBox({
		width: 300,
		height: 20,
		//		autoComplete: true,
		searchMode: "containsignorecase",
		placeHolder: "Wybierz państwo",
		source: dataAdapterEpoPanstwa,
		displayMember: "nazwaPanstwa",
		valueMember: "idPanstwa",
		theme: "web",
	});

	// Spółki
	var sourceEpoSpolki = {
		datatype: "json",
		datafields: [{ name: "idSpolka" }, { name: "nazwaSpolka" }],
		url: urlEpoSpolkiLista,
		async: false,
	};
	var dataAdapterEpoSpolki = new $.jqx.dataAdapter(sourceEpoSpolki);
	$("#epoSpolka").jqxComboBox({
		width: 300,
		height: 25,
		multiSelect: true,
		autoComplete: true,
		searchMode: "containsignorecase",
		placeHolder: "Wybierz spółkę",
		source: dataAdapterEpoSpolki,
		displayMember: "nazwaSpolka",
		valueMember: "idSpolka",
		theme: "web",
	});
	// Odbiorca
	var sourceEpoOdbiorca = {
		datatype: "json",
		datafields: [{ name: "idOdbiorca" }, { name: "nazwaOdbiorca" }],
		url: urlEpoOdbiorcaLista,
		async: false,
	};
	var dataAdapterEpoOdbiorca = new $.jqx.dataAdapter(sourceEpoOdbiorca);
	$("#epoOdbiorca").jqxComboBox({
		width: 300,
		height: 25,
		multiSelect: true,
		autoComplete: true,
		searchMode: "containsignorecase",
		placeHolder: "Wybierz odbiorcę",
		source: dataAdapterEpoOdbiorca,
		displayMember: "nazwaOdbiorca",
		valueMember: "idOdbiorca",
		theme: "web",
	});

	// Ruch
	var sourceEpoRuch = {
		datatype: "json",
		datafields: [{ name: "idRuch" }, { name: "nazwaRuch" }],
		url: urlEpoRuchLista,
		async: false,
	};
	var dataAdapterEpoRuch = new $.jqx.dataAdapter(sourceEpoRuch);
	$("#epoRuch").jqxComboBox({
		width: 300,
		height: 25,
		multiSelect: true,
		autoComplete: true,
		searchMode: "containsignorecase",
		placeHolder: "Wybierz ruch",
		source: dataAdapterEpoRuch,
		displayMember: "nazwaRuch",
		valueMember: "idRuch",
		theme: "web",
	});

	// Zamawiający
	var sourceEpoZamawiajacy = {
		datatype: "json",
		datafields: [{ name: "idZamawiajacy" }, { name: "nazwaZamawiajacy" }],
		url: urlEpoZamawiajacyLista,
		async: false,
	};
	var dataAdapterEpoZamawiajacy = new $.jqx.dataAdapter(sourceEpoZamawiajacy);
	$("#epoZamawiajacy").jqxComboBox({
		width: 300,
		height: 25,
		multiSelect: true,
		autoComplete: true,
		searchMode: "containsignorecase",
		placeHolder: "Wybierz zamawiającego",
		source: dataAdapterEpoZamawiajacy,
		displayMember: "nazwaZamawiajacy",
		valueMember: "idZamawiajacy",
		theme: "web",
	});

	// Nazwa pliku przedrostek
	var sourceEpoNazwaPlikuPrzedrostek = {
		datatype: "json",
		datafields: [
			{ name: "idNazwaPlikuPrzedrostek" },
			{ name: "nazwaPlikuPrzedrostek" },
		],
		url: urlEpoNazwaPlikuPrzedrostek,
		async: false,
	};
	var dataAdapterEpoNazwaPlikuPrzedrostek = new $.jqx.dataAdapter(
		sourceEpoNazwaPlikuPrzedrostek
	);
	$("#epoNazwaPlikuPrzedrostek").jqxComboBox({
		width: 70,
		height: 20,
		//		autoComplete: true,
		searchMode: "containsignorecase",
		placeHolder: "Wybierz przedrostek",
		source: dataAdapterEpoNazwaPlikuPrzedrostek,
		displayMember: "nazwaPlikuPrzedrostek",
		valueMember: "idNazwaPlikuPrzedrostek",
		theme: "web",
	});
	// Nazwa pliku rok
	var sourceEpoNazwaPlikuRok = {
		datatype: "json",
		datafields: [{ name: "idNazwaPlikuRok" }, { name: "nazwaPlikuRok" }],
		url: urlEpoNazwaPlikuRok,
		async: false,
	};
	var dataAdapterEpoNazwaPlikuRok = new $.jqx.dataAdapter(sourceEpoNazwaPlikuRok);
	$("#epoNazwaPlikuRok").jqxComboBox({
		width: 50,
		height: 20,
		//		autoComplete: true,
		searchMode: "containsignorecase",
		placeHolder: "Wybierz rok",
		source: dataAdapterEpoNazwaPlikuRok,
		displayMember: "nazwaPlikuRok",
		valueMember: "idNazwaPlikuRok",
		theme: "web",
	});

	// Nr projektu
	var epoNrProjektuZakonczoneChecked = 1;
	var sourceEpoNrProjektu = {
		datatype: "json",
		datafields: [{ name: "idZlecenia" }, { name: "nrProjektu" }],
		data: {
			zakonczone: epoNrProjektuZakonczoneChecked,
		},
		url: urlEpoNrProjektuLista,
		async: false,
	};
	var dataAdapterEpoNrProjektu = new $.jqx.dataAdapter(sourceEpoNrProjektu);
	$("#epoNrProjektu").jqxComboBox({
		width: 280,
		height: 25,
		source: dataAdapterEpoNrProjektu,
		multiSelect: true,
		autoComplete: true,
		searchMode: "containsignorecase",
		placeHolder: "Wybierz nr projektu",
		displayMember: "nrProjektu",
		valueMember: "idZlecenia",
		theme: "web",
	});

	// Zakończone projekty

	$("#epoNrProjektuZakonczone").jqxCheckBox({
		width: 25,
		height: 25,
		checked: true,
		theme: "web",
	});

	$("#epoNrProjektuZakonczone").on("change", function (event) {
		var checked = event.args.checked;
		if (checked) {
			epoNrProjektuZakonczoneChecked = 1;
		} else {
			epoNrProjektuZakonczoneChecked = 0;
		}
		var sourceEpoNrProjektu = {
			datatype: "json",
			datafields: [{ name: "idZlecenia" }, { name: "nrProjektu" }],
			data: {
				zakonczone: epoNrProjektuZakonczoneChecked,
			},
			url: urlEpoNrProjektuLista,
			async: false,
		};
		var dataAdapterEpoNrProjektu = new $.jqx.dataAdapter(sourceEpoNrProjektu);
		$("#epoNrProjektu").jqxComboBox({
			source: dataAdapterEpoNrProjektu,
		});
	});

	$("#epoNrProjektu").on("bindingComplete", function (event) {
		var dane = {};
		dane["modul"] = "ewidencjaPostepowanOfertowych";
		dane["funkcja"] = "daneFormularza_nrProjektu";
		dane["epoId"] = rekord.epoId;
		daneJSON = wczytajDane("php/index.php", dane);
		$.each(daneJSON, function (klucz, wartosc) {
			$("#epoNrProjektu").jqxComboBox("selectItem", klucz);
		});
		$("#dropdownlistArrowepoNrProjektu").css("height", "25px");
	});

	// Usługa gornicza
	$("#epoNrPostepowania").jqxInput({
		width: 300,
		height: 20,
		theme: "web",
	});

	// Data złożenia oferty
	$("#epoDataZlozeniaOferty").jqxDateTimeInput({
		width: 300,
		height: 20,
		culture: "pl-PL",
		formatString: "yyyy-MM-dd",
		theme: "web",
	});
	$("#epoDataZlozeniaOferty").on("change", function (event) {
		var data = event.args.date;
		if (data != null) {
			$("#epoDataOdbioruKoncowego").jqxDateTimeInput({ disabled: false });
			$("#epoDataWaznosciOferty").jqxDateTimeInput({ disabled: false });
			$("#epoDataDostawy").jqxDateTimeInput({ disabled: false });
			$("#epoDataZakonczeniaPrzetargu").jqxDateTimeInput({ disabled: false });
		}
	});
	//Temat oferty
	/*	$('#epoTematOferty').jqxInput({
		width: 300,
		height: 20,
		theme: 'web'
	});*/
	$("#epoTematOferty").jqxTextArea({
		width: 300,
		height: 90,
		theme: "web",
	});

	// Prowadzący
	var sourceEpoProwadzacy = {
		datatype: "json",
		datafields: [{ name: "idPracownika" }, { name: "nazwiskoImie" }],
		url: urlEpoProwadzacyLista,
		async: false,
	};
	var dataAdapterEpoProwadzacy = new $.jqx.dataAdapter(sourceEpoProwadzacy);
	$("#epoProwadzacy").jqxComboBox({
		width: 300,
		height: 20,
		//		autoComplete: true,
		searchMode: "containsignorecase",
		placeHolder: "Wybierz prowadzącego",
		source: dataAdapterEpoProwadzacy,
		displayMember: "nazwiskoImie",
		valueMember: "idPracownika",
		theme: "web",
	});
	$("#epoKwotaOferty").jqxNumberInput({
		width: 100,
		height: 20,
		symbolPosition: "right",
		theme: "web",
	});
	var sourceEpoWaluta = {
		datatype: "json",
		datafields: [{ name: "id" }, { name: "symbol" }],
		url: urlEpoWalutaLista,
		async: false,
	};
	var dataAdapterEpoWaluta = new $.jqx.dataAdapter(sourceEpoWaluta);
	$("#epoKwotaOfertyWaluta").jqxComboBox({
		width: 50,
		height: 20,
		//		autoComplete: true,
		searchMode: "containsignorecase",
		placeHolder: "Wybierz walutę",
		source: dataAdapterEpoWaluta,
		displayMember: "symbol",
		valueMember: "id",
		theme: "web",
	});
	$("#epoKwotaKontraktu").jqxNumberInput({
		width: 100,
		height: 20,
		symbolPosition: "right",
		theme: "web",
	});
	var sourceEpoWaluta = {
		datatype: "json",
		datafields: [{ name: "id" }, { name: "symbol" }],
		url: urlEpoWalutaLista,
		async: false,
	};
	var dataAdapterEpoWaluta = new $.jqx.dataAdapter(sourceEpoWaluta);
	$("#epoKwotaKontraktuWaluta").jqxComboBox({
		width: 50,
		height: 20,
		//		autoComplete: true,
		searchMode: "containsignorecase",
		placeHolder: "Wybierz walutę",
		source: dataAdapterEpoWaluta,
		displayMember: "symbol",
		valueMember: "id",
		theme: "web",
	});
	/*	$('#epoKwotaKontraktuWaluta').on('select', function (event) {
		var symbolWaluty = event.args.item.label;
		$("#epoKwotaKontraktu").jqxNumberInput({ symbol: symbolWaluty });
	});
*/

	// Wartość wadium
	var sourceEpoWartoscWadiumSlownik = {
		datatype: "json",
		datafields: [{ name: "id" }, { name: "nazwa" }],
		url: urlEpoWartoscWadiumSlownik,
		async: false,
	};
	var dataAdapterEpoWartoscWadiumSlownik = new $.jqx.dataAdapter(
		sourceEpoWartoscWadiumSlownik
	);
	$("#epoWartoscWadiumSlownik").jqxComboBox({
		width: 100,
		height: 20,
		//		autoComplete: true,
		searchMode: "containsignorecase",
		placeHolder: "Wybierz wadium",
		source: dataAdapterEpoWartoscWadiumSlownik,
		displayMember: "nazwa",
		valueMember: "id",
		theme: "web",
	});
	$("#epoWartoscWadiumSlownik").on("change", function (event) {
		var indeks = event.args;
		if (indeks != undefined) {
			$("#epoWartoscWadium").jqxNumberInput({ disabled: true });
			$("#epoWartoscWadiumWaluta").jqxComboBox({ disabled: true });
		} else {
			$("#epoWartoscWadium").jqxNumberInput({ disabled: false });
			$("#epoWartoscWadiumWaluta").jqxComboBox({ disabled: false });
		}
	});

	$("#epoWartoscWadium").jqxNumberInput({
		width: 100,
		height: 20,
		symbolPosition: "right",
		theme: "web",
	});
	$("#epoWartoscWadiumWaluta").jqxComboBox({
		width: 50,
		height: 20,
		//		autoComplete: true,
		searchMode: "containsignorecase",
		placeHolder: "Wybierz walutę",
		source: dataAdapterEpoWaluta,
		displayMember: "symbol",
		valueMember: "id",
		theme: "web",
	});
	/*	$('#epoWartoscWadiumWaluta').on('select', function (event) {
		var symbolWaluty = event.args.item.label;
		$("#epoWartoscWadium").jqxNumberInput({ symbol: symbolWaluty });
	});
*/
	// Rodzaj wadium
	var sourceEpoRodzajWadium = {
		datatype: "json",
		datafields: [{ name: "id" }, { name: "nazwa" }],
		url: urlEpoRodzajWadium,
		async: false,
	};
	var dataAdapterEpoRodzajWadium = new $.jqx.dataAdapter(sourceEpoRodzajWadium);
	$("#epoRodzajWadium").jqxComboBox({
		width: 300,
		height: 20,
		//		autoComplete: true,
		searchMode: "containsignorecase",
		placeHolder: "Wybierz rodzaj wadium",
		source: dataAdapterEpoRodzajWadium,
		displayMember: "nazwa",
		valueMember: "id",
		theme: "web",
	});
	// Data odbioru należności
	$("#epoDataOdbioruKoncowego").jqxDateTimeInput({
		width: 300,
		height: 20,
		culture: "pl-PL",
		disabled: true,
		formatString: "yyyy-MM-dd",
		theme: "web",
	});
	// Data ważności oferty
	$("#epoDataWaznosciOferty").jqxDateTimeInput({
		width: 300,
		height: 20,
		culture: "pl-PL",
		disabled: true,
		formatString: "yyyy-MM-dd",
		theme: "web",
	});
	// Bezpieczna oferta
	$("#epoBezpiecznaOferta").jqxCheckBox({
		width: 120,
		height: 25,
		theme: "web",
	});
	//Nr umowy lub zamówienia
	$("#epoNrUmowyLubZamowienia").jqxInput({
		width: 300,
		height: 20,
		theme: "web",
	});
	// Data dostawy
	$("#epoDataDostawy").jqxDateTimeInput({
		width: 300,
		height: 20,
		culture: "pl-PL",
		disabled: true,
		formatString: "yyyy-MM-dd",
		theme: "web",
	});
	// Informacje
	var sourceEpoInformacje = {
		datatype: "json",
		datafields: [{ name: "id" }, { name: "opis" }],
		url: urlEpoInformacje,
		async: false,
	};
	var dataAdapterEpoInformacje = new $.jqx.dataAdapter(sourceEpoInformacje);
	$("#epoInformacje").jqxComboBox({
		width: 300,
		height: 20,
		searchMode: "containsignorecase",
		placeHolder: "Wybierz informację",
		source: dataAdapterEpoInformacje,
		displayMember: "opis",
		valueMember: "id",
		theme: "web",
	});
	// Uzupełnienie informacji
	$("#epoUzupelnienieInformacji").jqxTextArea({
		width: 300,
		height: 90,
		theme: "web",
	});

	// Data zakończenia przetargu
	$("#epoDataZakonczeniaPrzetargu").jqxDateTimeInput({
		width: 300,
		height: 20,
		culture: "pl-PL",
		disabled: true,
		formatString: "yyyy-MM-dd",
		theme: "web",
	});

	// priorytet
	var rowEpoPriotetet = {};
	rowEpoPriotetet[0] = {};
	rowEpoPriotetet[0]["nr"] = "1";
	rowEpoPriotetet[0]["wartosc"] = "1";
	rowEpoPriotetet[1] = {};
	rowEpoPriotetet[1]["nr"] = "2";
	rowEpoPriotetet[1]["wartosc"] = "2";
	rowEpoPriotetet[2] = {};
	rowEpoPriotetet[2]["nr"] = "3";
	rowEpoPriotetet[2]["wartosc"] = "3";
	var sourceEpoPriorytet = {
		localdata: rowEpoPriotetet,
		datatype: "array",
	};
	var dataAdapterEpoPriorytet = new $.jqx.dataAdapter(sourceEpoPriorytet);
	$("#epoPriorytet").jqxComboBox({
		width: 300,
		height: 20,
		//		autoComplete: true,
		placeHolder: "Wybierz priotytet",
		source: dataAdapterEpoPriorytet,
		displayMember: "nr",
		valueMember: "wartosc",
		theme: "web",
	});

	// proces w toku
	$("#epoProcesWToku").jqxRadioButton({
		width: 250,
		height: 20,
		checked: true,
		theme: "web",
	});
	// zakonczono
	$("#epoZakonczono").jqxRadioButton({
		width: 250,
		height: 20,
		theme: "web",
	});

	// Wygrano
	$("#epoWygrano").jqxCheckBox({
		width: 120,
		height: 25,
		theme: "web",
	});
	// Anulowano
	$("#epoAnulowano").jqxCheckBox({
		width: 120,
		height: 25,
		theme: "web",
	});
	// Wynajem
	$("#epoWynajem").jqxCheckBox({
		width: 120,
		height: 25,
		theme: "web",
	});

	$("#epoEdycjaZapisz").jqxButton({
		width: 150,
		theme: "web",
	});

	$("#epoEdycjaZapisz")
		.off("click")
		.on("click", function () {
			if (
				$("#oknoEwidencjaPostepowanOfertowychEdycjaFormularz").jqxValidator(
					"validate"
				) == true
			) {
				var dane = {};
				epo_stanTablicy = $("#ewidencjaPostepowanOfertowychTablica").jqxGrid(
					"savestate"
				);
				dane["id"] = $("#epoId").val();
				if ($("#epoSzybkaSciezka").val()) dane["szybkaSciezka"] = 1;
				else dane["szybkaSciezka"] = 0;
				dane["iloscWnioskowSzybkiejSciezki"] = $(
					"#epoIloscWnioskowSzybkiejSciezki"
				).val();
				dane["panstwo"] = $("#epoPanstwo").val();
				var i = 0;
				dane["spolka"] = {};
				$.each($("#epoSpolka").jqxComboBox("getSelectedItems"), function (index) {
					dane["spolka"][i++] = this.value;
				});
				var i = 0;
				dane["odbiorca"] = {};
				$.each($("#epoOdbiorca").jqxComboBox("getSelectedItems"), function (index) {
					dane["odbiorca"][i++] = this.value;
				});
				var i = 0;
				dane["ruch"] = {};
				$.each($("#epoRuch").jqxComboBox("getSelectedItems"), function (index) {
					dane["ruch"][i++] = this.value;
				});
				var i = 0;
				dane["zamawiajacy"] = {};
				$.each($("#epoZamawiajacy").jqxComboBox("getSelectedItems"), function (index) {
					dane["zamawiajacy"][i++] = this.value;
				});
				var i = 0;
				dane["nrProjektu"] = {};
				$.each($("#epoNrProjektu").jqxComboBox("getSelectedItems"), function (index) {
					dane["nrProjektu"][i++] = this.value;
				});
				//			dane["spolka"] = $("#epoSpolka").jqxComboBox('getSelectedItems');
				//			dane["odbiorca"] = $("#epoOdbiorca").jqxComboBox('getSelectedItems');
				//			dane["ruch"] = $("#epoRuch").jqxComboBox('getSelectedItems');
				//			dane["zamawiajacy"] = $("#epoZamawiajacy").jqxComboBox('getSelectedItems');
				dane["nazwaPlikuPrzedrostek"] = $("#epoNazwaPlikuPrzedrostek").val();
				dane["nazwaPlikuRok"] = $("#epoNazwaPlikuRok").val();
				dane["nrPostepowania"] = $("#epoNrPostepowania").val();
				if ($("#epoDataZlozeniaOferty").val() == "")
					dane["dataZlozeniaOferty"] = "0000-00-00";
				else dane["dataZlozeniaOferty"] = $("#epoDataZlozeniaOferty").val();
				dane["tematOferty"] = $("#epoTematOferty").val();
				dane["prowadzacy"] = $("#epoProwadzacy").val();
				dane["kwotaOferty"] = $("#epoKwotaOferty").val();
				dane["kwotaOfertyWaluta"] = $("#epoKwotaOfertyWaluta").val();
				dane["kwotaKontraktu"] = $("#epoKwotaKontraktu").val();
				dane["kwotaKontraktuWaluta"] = $("#epoKwotaKontraktuWaluta").val();
				dane["wartoscWadium"] = $("#epoWartoscWadium").val();
				dane["wartoscWadiumWaluta"] = $("#epoWartoscWadiumWaluta").val();
				dane["wartoscWadiumSlownik"] = $("#epoWartoscWadiumSlownik").val();
				dane["rodzajWadium"] = $("#epoRodzajWadium").val();
				if ($("#epoDataOdbioruKoncowego").val() == "")
					dane["dataOdbioruKoncowego"] = "0000-00-00";
				else dane["dataOdbioruKoncowego"] = $("#epoDataOdbioruKoncowego").val();
				if ($("#epoDataWaznosciOferty").val() == "")
					dane["dataWaznosciOferty"] = "0000-00-00";
				else dane["dataWaznosciOferty"] = $("#epoDataWaznosciOferty").val();
				if ($("#epoBezpiecznaOferta").val()) dane["bezpiecznaOferta"] = 1;
				else dane["bezpiecznaOferta"] = 0;
				dane["nrUmowyLubZamowienia"] = $("#epoNrUmowyLubZamowienia").val();
				if ($("#epoDataDostawy").val() == "") dane["dataDostawy"] = "0000-00-00";
				else dane["dataDostawy"] = $("#epoDataDostawy").val();
				dane["informacje"] = $("#epoInformacje").val();
				dane["uzupelnienieInformacji"] = $("#epoUzupelnienieInformacji").val();
				if ($("#epoDataZakonczeniaPrzetargu").val() == "")
					dane["dataZakonczeniaPrzetargu"] = "0000-00-00";
				else dane["dataZakonczeniaPrzetargu"] = $("#epoDataZakonczeniaPrzetargu").val();
				if ($("#epoProcesWToku").val()) dane["procesWToku"] = 1;
				else dane["procesWToku"] = 0;
				dane["priorytet"] = $("#epoPriorytet").val();
				if ($("#epoZakonczono").val()) dane["zakonczono"] = 1;
				else dane["zakonczono"] = 0;
				if ($("#epoWygrano").val()) dane["wygrano"] = 1;
				else dane["wygrano"] = 0;
				if ($("#epoAnulowano").val()) dane["anulowano"] = 1;
				else dane["anulowano"] = 0;
				if ($("#epoWynajem").val()) dane["wynajem"] = 1;
				else dane["wynajem"] = 0;
				dane["modul"] = "ewidencjaPostepowanOfertowych";
				dane["funkcja"] = "zapisz";
				daneJSON = wczytajDane("php/index.php", dane);
				var id = daneJSON["id"];
				if (id == -1) pokazKomunikat("blad", komunikaty["epoDodanieBlad"]);
				else if (id > 0) {
					pokazKomunikat("ok", komunikaty["epoDodanieOK"]);
					$("#oknoEwidencjaPostepowanOfertowychDodanieEdycja").jqxWindow("close");
					var dataAdaptersEpoLista = new $.jqx.dataAdapter(sourceEpoLista, {
						loadComplete: function (records) {
							$("#ewidencjaPostepowanOfertowychTablica").jqxGrid(
								"loadstate",
								epo_stanTablicy
							);
						},
					});
					$("#ewidencjaPostepowanOfertowychTablica").jqxGrid({
						source: dataAdaptersEpoLista,
					});
				}
			}
		});

	var sourceEpoLista = {
		datatype: "json",
		datafields: [
			{ name: "epoId", type: "number" },
			{ name: "epoNrProcedury", type: "number" },
			{ name: "epoSzybkaSciezka", type: "number" },
			{ name: "epoIloscWnioskowSzybkiejSciezki", type: "number" },
			{ name: "epoPanstwoNazwa", type: "string" },
			{ name: "epoSpolkaNazwa", type: "string" },
			{ name: "epoOdbiorcaNazwa", type: "string" },
			{ name: "epoRuchNazwa", type: "string" },
			{ name: "epoZamawiajacyNazwa", type: "string" },
			{ name: "epoNazwaPlikuPrzedrostekNazwa", type: "string" },
			{ name: "epoNazwaPliku", type: "string" },
			{ name: "epoZlecenie", type: "string" },
			{ name: "epoNrPostepowania", type: "string" },
			{ name: "epoDataZlozeniaOferty", type: "string" },
			{ name: "epoTematOferty", type: "string" },
			{ name: "pracownikNazwiskoImie", type: "string" },
			{ name: "epoKwotaOferty", type: "string" },
			{ name: "epoKwotaKontraktu", type: "string" },
			{ name: "epoWadiumWartosc", type: "string" },
			{ name: "epoWadiumWartoscNazwa", type: "string" },
			{ name: "epoWadiumRodzajNazwa", type: "string" },
			{ name: "epoDataOdbioruKoncowego", type: "string" },
			{ name: "epoWaznoscOferty", type: "string" },
			{ name: "epoBezpiecznaOferta", type: "string" },
			{ name: "epoNrUmowyZamowienia", type: "string" },
			{ name: "epoDataDostawy", type: "string" },
			{ name: "epoInformacjeOpis", type: "string" },
			{ name: "epoUzupelnienieInformacji", type: "string" },
			{ name: "epoDataZakonczeniaPrzetargu", type: "string" },
			{ name: "epoProcesWToku", type: "string" },
			{ name: "epoPriorytet", type: "string" },
			{ name: "epoZakonczono", type: "string" },
			{ name: "epoWygrano", type: "string" },
			{ name: "epoAnulowano", type: "string" },
			{ name: "epoWynajem", type: "string" },
		],
		timeout: 10000,
		url: urlEpoLista,
	};
	var cellsrenderer = function (
		row,
		columnfield,
		value,
		defaulthtml,
		columnproperties
	) {
		if (value < 20) {
			return (
				'<span style="margin: 4px; float: ' +
				columnproperties.cellsalign +
				'; color: #0000ff;">' +
				value +
				"</span>"
			);
		} else {
			return (
				'<span style="margin: 4px; float: ' +
				columnproperties.cellsalign +
				'; color: #008000;">' +
				value +
				"</span>"
			);
		}
	};
	var cellclass = function (row, columnfield, value) {
		var rowData = $("#ewidencjaPostepowanOfertowychTablica").jqxGrid(
			"getrowdata",
			row
		);
		var formatowanie = "";
		if (rowData.epoZakonczono == "Tak" && rowData.epoWygrano == "Tak")
			formatowanie += "epoWygrano ";
		if (rowData.epoZakonczono == "Tak" && rowData.epoWygrano == "Nie")
			formatowanie += "epoNieWygrano ";
		if (rowData.epoAnulowano == "Tak") formatowanie += "epoAnulowano ";
		return formatowanie;
	};
	var dataAdaptersEpoLista = new $.jqx.dataAdapter(sourceEpoLista);
	$("#ewidencjaPostepowanOfertowychTablica").jqxGrid({
		width: "100%",
		height: "100%",
		columnsheight: 60,
		source: dataAdaptersEpoLista,
		//pageable: true,
		sortable: true,
		groupable: true,
		enabletooltips: true,
		selectionmode: "singlerow",
		filterable: true,
		editable: true,
		columnsresize: true,
		//		autoloadstate: true,
		localization: getLocalization("pl"),
		columns: [
			{ datafield: "epoId", hidden: true },
			{
				text: "Nr",
				datafield: "epoNrProcedury",
				cellsalign: "right",
				align: "center",
				filtertype: "textbox",
				width: 50,
				height: 100,
				editable: false,
				cellclassname: cellclass,
				pinned: true,
			},
			{
				text: "Szybka<br>ścieżka",
				datafield: "epoSzybkaSciezka",
				cellsalign: "center",
				align: "center",
				filtertype: "checkedlist",
				width: 60,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Ilość<br>wniosków",
				datafield: "epoIloscWnioskowSzybkiejSciezki",
				cellsalign: "center",
				align: "center",
				filtertype: "checkedlist",
				width: 60,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Państwo",
				datafield: "epoPanstwoNazwa",
				cellsalign: "left",
				align: "center",
				filtertype: "checkedlist",
				width: 100,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Spółka",
				datafield: "epoSpolkaNazwa",
				cellsalign: "left",
				align: "center",
				filtertype: "textbox",
				width: 150,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Odbiorca",
				datafield: "epoOdbiorcaNazwa",
				cellsalign: "left",
				align: "center",
				filtertype: "textbox",
				width: 150,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Ruch",
				datafield: "epoRuchNazwa",
				cellsalign: "left",
				align: "center",
				filtertype: "textbox",
				width: 70,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Zamawiający",
				datafield: "epoZamawiajacyNazwa",
				cellsalign: "left",
				align: "center",
				filtertype: "textbox",
				width: 150,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Nazwa pliku 1",
				datafield: "epoNazwaPlikuPrzedrostekNazwa",
				cellsalign: "right",
				align: "center",
				filtertype: "checkedlist",
				width: 80,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Nazwa pliku 2",
				datafield: "epoNazwaPliku",
				cellsalign: "right",
				align: "center",
				filtertype: "textbox",
				width: 80,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Nr projektu",
				datafield: "epoZlecenie",
				cellsalign: "right",
				align: "center",
				filtertype: "textbox",
				width: 80,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Nr postępowania",
				datafield: "epoNrPostepowania",
				cellsalign: "right",
				align: "center",
				filtertype: "textbox",
				width: 100,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Data<br>złożenia oferty",
				datafield: "epoDataZlozeniaOferty",
				cellsalign: "left",
				align: "center",
				filtertype: "range",
				width: 80,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Temat oferty",
				datafield: "epoTematOferty",
				cellsalign: "left",
				align: "center",
				filtertype: "textbox",
				width: 600,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Prowadzący",
				datafield: "pracownikNazwiskoImie",
				cellsalign: "left",
				align: "center",
				filtertype: "textbox",
				width: 150,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Kwota<br>oferty",
				datafield: "epoKwotaOferty",
				cellsalign: "right",
				align: "center",
				filtertype: "textbox",
				width: 120,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Wadium<br>wartość",
				datafield: "epoWadiumWartosc",
				cellsalign: "right",
				align: "center",
				filtertype: "textbox",
				width: 80,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Wadium<br>rodzaj",
				datafield: "epoWadiumRodzajNazwa",
				cellsalign: "center",
				align: "center",
				filtertype: "textbox",
				width: 100,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Data odbioru<br>końcowego",
				datafield: "epoDataOdbioruKoncowego",
				cellsalign: "right",
				align: "center",
				filtertype: "textbox",
				width: 80,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Data ważności<br>oferty",
				datafield: "epoWaznoscOferty",
				cellsalign: "center",
				align: "center",
				filtertype: "textbox",
				width: 80,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Oferta<br>zabezpieczona ?",
				datafield: "epoBezpiecznaOferta",
				cellsalign: "right",
				align: "center",
				filtertype: "textbox",
				width: 70,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Nr umowy",
				datafield: "epoNrUmowyZamowienia",
				cellsalign: "left",
				align: "center",
				filtertype: "textbox",
				width: 100,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Kwota<br>kontraktu",
				datafield: "epoKwotaKontraktu",
				cellsalign: "right",
				align: "center",
				filtertype: "textbox",
				width: 120,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Data<br>dostawy",
				datafield: "epoDataDostawy",
				cellsalign: "left",
				align: "center",
				filtertype: "textbox",
				width: 80,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Informacje",
				datafield: "epoInformacjeOpis",
				cellsalign: "left",
				align: "center",
				filtertype: "textbox",
				width: 150,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Uzupełnienie informacji",
				datafield: "epoUzupelnienieInformacji",
				cellsalign: "left",
				align: "center",
				filtertype: "textbox",
				width: 400,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Data zakończenia<br>przetragu",
				datafield: "epoDataZakonczeniaPrzetargu",
				cellsalign: "left",
				align: "center",
				filtertype: "textbox",
				width: 100,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Proces<br>w toku",
				datafield: "epoProcesWToku",
				cellsalign: "center",
				align: "center",
				filtertype: "checkedlist",
				width: 60,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Priorytet",
				datafield: "epoPriorytet",
				cellsalign: "center",
				align: "center",
				filtertype: "checkedlist",
				width: 60,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Zakończono",
				datafield: "epoZakonczono",
				cellsalign: "center",
				align: "center",
				filtertype: "checkedlist",
				width: 80,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Wygrano",
				datafield: "epoWygrano",
				cellsalign: "center",
				align: "center",
				filtertype: "checkedlist",
				width: 60,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Usunięto",
				datafield: "epoAnulowano",
				cellsalign: "center",
				align: "center",
				filtertype: "checkedlist",
				width: 70,
				editable: false,
				cellclassname: cellclass,
			},
			{
				text: "Najem",
				datafield: "epoWynajem",
				cellsalign: "center",
				align: "center",
				filtertype: "checkedlist",
				width: 70,
				editable: false,
				cellclassname: cellclass,
			},
		],
		showstatusbar: true,
		statusbarheight: 50,
		renderstatusbar: function (statusbar) {
			var container = $(
				'<div style="display: flex; justify-content: space-start; align-items: left; margin-top: 7px; overflow: hidden; position: relative; margin:5px;"></div>'
			);
			var addButton = $(
				"<button style='display: block; margin-left: 10px;' id='epo_addButton'><div style='display: flex; justify-content: center'><img src='css/images/add.png' /><span style='margin-left: 5px;'>Dodaj</span></div></button>"
			);
			var editButton = $(
				"<button style='display: block; margin-left: 10px;' id='epo_editButton'><div style='display: flex; justify-content: center'><img src='css/images/edit.png' /><span style='margin-left: 5px;'>Edytuj</span></div></button>"
			);
			var deleteButton = $("<button style='display: block; margin-left: 10px;' id='epo_deleteButton'><div style='display: flex; justify-content: center'><img src='css/images/close.png' /><span style='margin-left: 5px;'>Usuń</span></div></button>");
			var reloadButton = $(
				"<button style='display: block; margin-left: 10px;' id='epo_reloadButton'><div style='display: flex; justify-content: center'><img src='css/images/refresh.png' /><span style='margin-left: 5px;'>Przeładuj</span></div></button>"
			);
			var exportButton = $(
				"<button id='epo_exportButton' style='display: block; float: left; margin-left: 10px;'><div style='display: flex; justify-content: center'><img style='position: relative; width:35%; height: 35%;margin-top: 10%;' src='css/images/excel.png'/><span style='margin-left: 4px;margin-top: 5%; position: relative; top: -3px;'>Export XLS</span></div></button>"
			);
			container.append(addButton);
			container.append(editButton);
			// container.append(deleteButton);
			container.append(reloadButton);
			container.append(exportButton);
			statusbar.append(container);
			$("#epo_addButton").jqxButton({
				width: "5%",
				height: 40,
				disabled: false,
				theme: theme,
			});
			$("#epo_editButton").jqxButton({
				width: "5%",
				height: 40,
				disabled: false,
				theme: theme,
			});
			// $('#epo_deleteButton').jqxButton({ 
			// 	width: '5%',
			// 	height: 40,
			// 	disabled: false,
			// 	theme: theme,
			// });
			$("#epo_reloadButton").jqxButton({
				width: "5%",
				height: 40,
				disabled: false,
				theme: theme,
			});
			$("#epo_exportButton").jqxButton({
				width: "5%",
				height: 40,
				disabled: false,
				theme: theme,
			});
			$("#epo_addButton").on("click", function () {
				$("#epoId").val(0);
				$("#epoSzybkaSciezka").jqxCheckBox({ checked: false });
				$("#epoIloscWnioskowSzybkiejSciezki").val("0");

				$("#epoPanstwo").jqxComboBox({ selectedIndex: -1 });

				//				$("#epoSpolka").jqxComboBox({selectedIndex:-1});
				//				$("#epoOdbiorca").jqxComboBox({selectedIndex:-1});
				//				$("#epoRuch").jqxComboBox({selectedIndex:-1});
				//				$("#epoZamawiajacy").jqxComboBox({selectedIndex: -1});

				$("#epoSpolka").jqxComboBox("clearSelection");
				$("#dropdownlistArrowepoSpolka").css("height", "25px");
				//				$("#epoSpolka").jqxComboBox({showArrow: true});

				$("#epoOdbiorca").jqxComboBox("clearSelection");
				$("#dropdownlistArrowepoOdbiorca").css("height", "25px");
				//				$("#epoOdbiorca").jqxComboBox({placeHolder: "Wybierz odbiorcę" });
				//				$("#epoOdbiorca").jqxComboBox({showArrow: true });

				$("#epoRuch").jqxComboBox("clearSelection");
				$("#dropdownlistArrowepoRuch").css("height", "25px");
				//				$("#epoRuch").jqxComboBox({showArrow: true });
				//				$("#epoRuch").jqxComboBox({placeHolder: "Wybierz ruch" });

				$("#epoZamawiajacy").jqxComboBox("clearSelection");
				$("#dropdownlistArrowepoZamawiajacy").css("height", "25px");
				//				$("#epoZamawiajacy").jqxComboBox({showArrow: true });
				//				$("#epoZamawiajacy").jqxComboBox({placeHolder: "Wybierz zamawiającego" });

				$("#epoNazwaPlikuPrzedrostek").jqxComboBox({ selectedIndex: -1 });
				$("#epoNazwaPlikuRok").jqxComboBox({ selectedIndex: -1 });
				//				$("#epoNrProjektu").jqxComboBox({selectedIndex: -1 });
				$("#epoNrProjektu").jqxComboBox("clearSelection");
				$("#dropdownlistArrowepoNrProjektu").css("height", "25px");

				$("#epoNrPostepowania").val("");
				$("#epoDataZlozeniaOferty").val("");
				$("#epoTematOferty").val("");
				//				$("#epoProwadzacy").jqxComboBox({selectedIndex: -1 });
				$("#epoProwadzacy").val(idPracownika);
				$("#epoKwotaOferty").val("");
				$("#epoKwotaOfertyWaluta").jqxComboBox({ selectedIndex: -1 });
				$("#epoKwotaKontraktu").val("");
				$("#epoKwotaKontraktuWaluta").jqxComboBox({ selectedIndex: -1 });
				$("#epoWartoscWadium").val("");
				$("#epoWartoscWadiumWaluta").jqxComboBox({ selectedIndex: -1 });
				$("#epoWartoscWadiumSlownik").jqxComboBox({ selectedIndex: -1 });
				$("#epoRodzajWadium").jqxComboBox({ selectedIndex: -1 });
				$("#epoDataOdbioruKoncowego").val("");
				$("#epoDataWaznosciOferty").val("");
				$("#epoBezpiecznaOferta").jqxCheckBox({ checked: false });
				$("#epoNrUmowyLubZamowienia").val("");
				$("#epoDataDostawy").val("");
				$("#epoInformacje").jqxComboBox({ selectedIndex: -1 });
				$("#epoUzupelnienieInformacji").val("");
				$("#epoDataZakonczeniaPrzetargu").val("");
				$("#epoPriorytet").jqxComboBox({ selectedIndex: -1 });
				$("#epoProcesWToku").jqxRadioButton({ checked: true });
				$("#epoZakonczono").jqxRadioButton({ checked: false });
				$("#epoWygrano").jqxCheckBox({ checked: false });
				$("#epoAnulowano").jqxCheckBox({ checked: false });
				$("#epoWynajem").jqxCheckBox({ checked: false });
				$("#epoNazwaPlikuFormularz").show();
				$("#epoNazwaPlikuWartosc").hide();
				$("#oknoEwidencjaPostepowanOfertowychDodanieEdycja").jqxWindow("open");
			});
			$("#epo_editButton").on("click", function () {
				var indeks = $("#ewidencjaPostepowanOfertowychTablica").jqxGrid(
					"getselectedrowindex"
				);
				var rowid = $("#ewidencjaPostepowanOfertowychTablica").jqxGrid(
					"getrowid",
					indeks
				);
				var rekord = $("#ewidencjaPostepowanOfertowychTablica").jqxGrid(
					"getrowdatabyid",
					rowid
				);
				var dane = {};
				(dane["modul"] = "ewidencjaPostepowanOfertowych"),
					(dane["funkcja"] = "daneFormularz"),
					(dane["epoId"] = rekord.epoId);
				daneJSON = wczytajDane("php/index.php", dane);
				log(daneJSON);
				$("#epoId").val(daneJSON["epoId"]);
				if (daneJSON["szybkaSciezka"] == "1")
					$("#epoSzybkaSciezka").jqxCheckBox({ checked: true });
				else $("#epoSzybkaSciezka").jqxCheckBox({ checked: false });
				$("#epoIloscWnioskowSzybkiejSciezki").val(
					daneJSON["iloscWnioskowSzybkiejSciezki"]
				);
				if (daneJSON["epoPanstwo_id"] == "")
					$("#epoPanstwo").jqxComboBox({ selectedIndex: -1 });
				else $("#epoPanstwo").val(daneJSON["epoPanstwo_id"]);

				$("#epoSpolka").jqxComboBox("clearSelection");
				$("#epoOdbiorca").jqxComboBox("clearSelection");
				$("#epoRuch").jqxComboBox("clearSelection");
				$("#epoZamawiajacy").jqxComboBox("clearSelection");

				$("#epoNazwaPlikuPrzedrostek").val(daneJSON["epoNazwaPlikuPrzedrostek_id"]);
				$("#epoNazwaPlikuRok").val(daneJSON["epoNazwaPlikuRok_id"]);
				if (daneJSON["epoNazwaPliku"] != "") {
					$("#epoNazwaPlikuWartoscTekst").html(daneJSON["epoNazwaPliku"]);
					$("#epoNazwaPlikuFormularz").hide();
					$("#epoNazwaPlikuWartosc").show();
				} else {
					$("#epoNazwaPlikuPrzedrostek").jqxComboBox({ selectedIndex: -1 });
					$("#epoNazwaPlikuRok").jqxComboBox({ selectedIndex: -1 });
					$("#epoNazwaPlikuWartoscTekst").html("");
					$("#epoNazwaPlikuFormularz").show();
					$("#epoNazwaPlikuWartosc").hide();
					//					$("#epoNazwaPlikuPrzedrostek").hide();
					//					$("#epoNazwaPlikuRok").hide();
				}
				$("#epoNrProjektu").jqxComboBox("clearSelection");
				//				$("#epoNrProjektu").val(daneJSON["zlecenia_idZlecenia"]);
				$("#epoNrPostepowania").val(daneJSON["nrPostepowania"]);
				$("#epoDataZlozeniaOferty").val(daneJSON["dataZlozeniaOferty"]);
				$("#epoTematOferty").val(daneJSON["tematOferty"]);
				if (daneJSON["pracownicy_idPracownika"] == "")
					$("#epoProwadzacy").jqxComboBox({ selectedIndex: -1 });
				else $("#epoProwadzacy").val(daneJSON["pracownicy_idPracownika"]);
				$("#epoKwotaOferty").val(daneJSON["kwotaOferty"]);
				if (daneJSON["epoKwotaOfertyWaluta_id"] == "")
					$("#epoKwotaOfertyWaluta").jqxComboBox({ selectedIndex: -1 });
				else $("#epoKwotaOfertyWaluta").val(daneJSON["epoKwotaOfertyWaluta_id"]);
				$("#epoKwotaKontraktu").val(daneJSON["kwotaKontraktu"]);
				if (daneJSON["epoKwotaKontraktuWaluta_id"] == "")
					$("#epoKwotaKontraktuWaluta").jqxComboBox({ selectedIndex: -1 });
				else $("#epoKwotaKontraktuWaluta").val(daneJSON["epoKwotaKontraktuWaluta_id"]);
				$("#epoWartoscWadium").val(daneJSON["wadiumWartosc"]);

				if (daneJSON["epoWadiumWartoscWaluta_id"] == "")
					$("#epoWartoscWadiumWaluta").jqxComboBox({ selectedIndex: -1 });
				else $("#epoWartoscWadiumWaluta").val(daneJSON["epoWadiumWartoscWaluta_id"]);

				$("#epoWartoscWadiumSlownik").val(daneJSON["epoWadiumWartosc_id"]);
				$("#epoRodzajWadium").val(daneJSON["epoWadiumRodzaj_id"]);
				$("#epoDataOdbioruKoncowego").val(daneJSON["dataOdbioruKoncowego"]);
				$("#epoDataWaznosciOferty").val(daneJSON["waznoscOferty"]);
				if (daneJSON["bezpiecznaOferta"] == "1")
					$("#epoBezpiecznaOferta").jqxCheckBox({ checked: true });
				else $("#epoBezpiecznaOferta").jqxCheckBox({ checked: false });
				$("#epoNrUmowyLubZamowienia").val(daneJSON["nrUmowyZamowienia"]);
				$("#epoDataDostawy").val(daneJSON["dataDostawy"]);
				if (daneJSON["epoInformacje_id"] == "")
					$("#epoInformacje").jqxComboBox({ selectedIndex: -1 });
				else $("#epoInformacje").val(daneJSON["epoInformacje_id"]);
				$("#epoUzupelnienieInformacji").val(daneJSON["uzupelnienieInformacji"]);
				$("#epoDataZakonczeniaPrzetargu").val(daneJSON["dataZakonczeniaPrzetargu"]);

				if (daneJSON["priorytet_id"] == "")
					$("#epoPriorytet").jqxComboBox({ selectedIndex: -1 });
				else $("#epoPriorytet").val(daneJSON["priorytet_id"]);

				if (daneJSON["procesWToku"] == "1")
					$("#epoProcesWToku").jqxRadioButton({ checked: true });
				else $("#epoProcesWToku").jqxRadioButton({ checked: false });

				if (daneJSON["zakonczono"] == "1")
					$("#epoZakonczono").jqxRadioButton({ checked: true });
				else $("#epoZakonczono").jqxRadioButton({ checked: false });

				if (daneJSON["wygrano"] == "1") $("#epoWygrano").jqxCheckBox({ checked: true });
				else $("#epoWygrano").jqxCheckBox({ checked: false });

				if (daneJSON["anulowano"] == "1")
					$("#epoAnulowano").jqxCheckBox({ checked: true });
				else $("#epoAnulowano").jqxCheckBox({ checked: false });

				if (daneJSON["wynajem"] == "1") $("#epoWynajem").jqxCheckBox({ checked: true });
				else $("#epoWynajem").jqxCheckBox({ checked: false });

				var dane = {};
				dane["modul"] = "ewidencjaPostepowanOfertowych";
				dane["funkcja"] = "daneFormularza_spolka";
				dane["epoId"] = rekord.epoId;
				daneJSON = wczytajDane("php/index.php", dane);
				$.each(daneJSON, function (klucz, wartosc) {
					$("#epoSpolka").jqxComboBox("selectItem", klucz);
				});
				$("#dropdownlistArrowepoSpolka").css("height", "25px");
				//$("#epoSpolka").jqxComboBox({showArrow: true });

				var dane = {};
				dane["modul"] = "ewidencjaPostepowanOfertowych";
				dane["funkcja"] = "daneFormularza_odbiorca";
				dane["epoId"] = rekord.epoId;
				daneJSON = wczytajDane("php/index.php", dane);
				$.each(daneJSON, function (klucz, wartosc) {
					$("#epoOdbiorca").jqxComboBox("selectItem", klucz);
				});
				$("#dropdownlistArrowepoOdbiorca").css("height", "25px");
				//$("#epoOdbiorca").jqxComboBox({showArrow: true });

				var dane = {};
				dane["modul"] = "ewidencjaPostepowanOfertowych";
				dane["funkcja"] = "daneFormularza_ruch";
				dane["epoId"] = rekord.epoId;
				daneJSON = wczytajDane("php/index.php", dane);
				$.each(daneJSON, function (klucz, wartosc) {
					$("#epoRuch").jqxComboBox("selectItem", klucz);
				});
				$("#dropdownlistArrowepoRuch").css("height", "25px");
				//$("#epoRuch").jqxComboBox({showArrow: true });

				var dane = {};
				dane["modul"] = "ewidencjaPostepowanOfertowych";
				dane["funkcja"] = "daneFormularza_zamawiajacy";
				dane["epoId"] = rekord.epoId;
				daneJSON = wczytajDane("php/index.php", dane);
				$.each(daneJSON, function (klucz, wartosc) {
					$("#epoZamawiajacy").jqxComboBox("selectItem", klucz);
				});
				$("#dropdownlistArrowepoZamawiajacy").css("height", "25px");
				//$("#epoZamawiajacy").jqxComboBox({showArrow: true });

				var dane = {};
				dane["modul"] = "ewidencjaPostepowanOfertowych";
				dane["funkcja"] = "daneFormularza_nrProjektu";
				dane["epoId"] = rekord.epoId;
				daneJSON = wczytajDane("php/index.php", dane);
				$.each(daneJSON, function (klucz, wartosc) {
					$("#epoNrProjektu").jqxComboBox("selectItem", klucz);
				});
				$("#dropdownlistArrowepoNrProjektu").css("height", "25px");
				//$("#epoZamawiajacy").jqxComboBox({showArrow: true });

				$("#oknoEwidencjaPostepowanOfertowychDodanieEdycja").jqxWindow("open");
			});
			/*			$("#epo_deleteButton").on('click', function () {
				var dane = {};
				var indeks = $("#ewidencjaPostepowanOfertowychTablica").jqxGrid('getselectedrowindex');
				var rowid = $('#ewidencjaPostepowanOfertowychTablica').jqxGrid('getrowid', indeks);
				var rekord = $("#ewidencjaPostepowanOfertowychTablica").jqxGrid('getrowdatabyid', rowid);
				dane["id"] = rekord.epoId;
				dane['modul'] = "ewidencjaPostepowanOfertowych";
				dane['funkcja']="usun";
				daneJSON = wczytajDane('php/index.php',dane);
				var id=daneJSON["ilosc"];
				if (id>0)
				{
					pokazKomunikat('ok',komunikaty['epoUsuniecieOK']);
					$('#ewidencjaPostepowanOfertowychTablica').jqxGrid('deleterow', rowid);
				}
				else
				{
					pokazKomunikat('blad',komunikaty['epoUsuniecieBlad']);
				}

			});
*/
			$("#epo_reloadButton").on("click", function () {
				$("#ewidencjaPostepowanOfertowychTablica").jqxGrid({ source: sourceEpoLista });
			});
			$("#epo_exportButton").on("click", function () {
				$("#ewidencjaPostepowanOfertowychTablica").jqxGrid(
					"exportdata",
					"json",
					"ewidencjaPostepowanOfertowychTablica",
					false,
					null,
					false,
					"https://panel.elgor.com.pl/php/index.php?modul=eksport_danych&funkcja=eksport_ewidencjiPostepowanOfertowych"
				);
			});
			epo_wczytajUprawnienia();
		},
		theme: "web",
	});
	$("#oknoEwidencjaPostepowanOfertowychEdycjaFormularz").jqxValidator({
		rules: [
			{
				input: "#epoNazwaPlikuPrzedrostek",
				message: "Wybierz typ oferty",
				action: "blur",
				rule: function () {
					var epoNazwaPlikuPrzedrostek = $("#epoNazwaPlikuPrzedrostek").val();
					var epoNazwaPlikuRok = $("#epoNazwaPlikuRok").val();
					if (epoNazwaPlikuPrzedrostek == "" && epoNazwaPlikuRok != "") {
						return false;
					} else return true;
				},
			},
			{
				input: "#epoNazwaPlikuRok",
				message: "Wybierz rok",
				action: "blur",
				rule: function () {
					var epoNazwaPlikuPrzedrostek = $("#epoNazwaPlikuPrzedrostek").val();
					var epoNazwaPlikuRok = $("#epoNazwaPlikuRok").val();
					if (epoNazwaPlikuPrzedrostek != "" && epoNazwaPlikuRok == "") {
						return false;
					} else return true;
				},
			},
			{
				input: "#epoKwotaOfertyWaluta",
				message: "Wybierz walutę",
				action: "blur",
				rule: function () {
					var epoKwotaOferty = $("#epoKwotaOferty").val();
					var epoKwotaOfertyWaluta = $("#epoKwotaOfertyWaluta").val();
					if (epoKwotaOferty != 0 && epoKwotaOfertyWaluta == "") {
						return false;
					} else return true;
				},
			},
			{
				input: "#epoKwotaKontraktuWaluta",
				message: "Wybierz walutę",
				action: "blur",
				rule: function () {
					var epoKwotaKontraktu = $("#epoKwotaKontraktu").val();
					var epoKwotaKontraktuWaluta = $("#epoKwotaKontraktuWaluta").val();
					if (epoKwotaKontraktu != 0 && epoKwotaKontraktuWaluta == "") {
						return false;
					} else return true;
				},
			},
			{
				input: "#epoWartoscWadiumWaluta",
				message: "Wybierz walutę",
				action: "blur",
				rule: function () {
					var wartoscWadium = $("#epoWartoscWadium").val();
					var wartoscWadiumWaluta = $("#epoWartoscWadiumWaluta").val();
					if (wartoscWadium != 0 && wartoscWadiumWaluta == "") {
						return false;
					} else return true;
				},
			},
			{
				input: "#epoDataOdbioruKoncowego",
				message: "Data odbioru należności musi być >= od daty złożenia oferty",
				action: "blur",
				rule: function () {
					var dataOdbioruKoncowego = $("#epoDataOdbioruKoncowego").val();
					var dataZlozeniaOferty = $("#epoDataZlozeniaOferty").val();
					if (dataOdbioruKoncowego != "") {
						dataOdbioruKoncowegoSplit = dataOdbioruKoncowego.split("-");
						dataZlozeniaOfertySplit = dataZlozeniaOferty.split("-");
						var dataOdbioruNaleznosciDate = new Date(
							dataOdbioruKoncowegoSplit[0],
							dataOdbioruKoncowegoSplit[1] - 1,
							dataOdbioruKoncowegoSplit[2]
						);
						var dataZlozeniaOfertyDate = new Date(
							dataZlozeniaOfertySplit[0],
							dataZlozeniaOfertySplit[1] - 1,
							dataZlozeniaOfertySplit[2]
						);
						if (dataOdbioruNaleznosciDate - dataZlozeniaOfertyDate < 0) return false;
						else return true;
					} else {
						return true;
					}
				},
			},
			{
				input: "#epoDataWaznosciOferty",
				message: "Data ważności oferty musi być >= od daty złożenia oferty",
				action: "blur",
				rule: function () {
					var dataWaznosciOferty = $("#epoDataWaznosciOferty").val();
					var dataZlozeniaOferty = $("#epoDataZlozeniaOferty").val();
					if (dataWaznosciOferty != "") {
						dataWaznosciOfertySplit = dataWaznosciOferty.split("-");
						dataZlozeniaOfertySplit = dataZlozeniaOferty.split("-");
						var dataWaznosciOfertyDate = new Date(
							dataWaznosciOfertySplit[0],
							dataWaznosciOfertySplit[1] - 1,
							dataWaznosciOfertySplit[2]
						);
						var dataZlozeniaOfertyDate = new Date(
							dataZlozeniaOfertySplit[0],
							dataZlozeniaOfertySplit[1] - 1,
							dataZlozeniaOfertySplit[2]
						);
						if (dataWaznosciOfertyDate - dataZlozeniaOfertyDate < 0) return false;
						else return true;
					} else {
						return true;
					}
				},
			},
			{
				input: "#epoDataDostawy",
				message: "Data dostawy musi być >= od daty złożenia oferty",
				action: "blur",
				rule: function () {
					var dataDostawy = $("#epoDataDostawy").val();
					var dataZlozeniaOferty = $("#epoDataZlozeniaOferty").val();
					if (dataDostawy != "") {
						dataDostawySplit = dataDostawy.split("-");
						dataZlozeniaOfertySplit = dataZlozeniaOferty.split("-");
						var dataDostawyDate = new Date(
							dataDostawySplit[0],
							dataDostawySplit[1] - 1,
							dataDostawySplit[2]
						);
						var dataZlozeniaOfertyDate = new Date(
							dataZlozeniaOfertySplit[0],
							dataZlozeniaOfertySplit[1] - 1,
							dataZlozeniaOfertySplit[2]
						);
						if (dataDostawyDate - dataZlozeniaOfertyDate < 0) return false;
						else return true;
					} else {
						return true;
					}
				},
			},
			{
				input: "#epoDataZakonczeniaPrzetargu",
				message: "Data zakończenia przetargu musi być >= od daty złożenia oferty",
				action: "blur",
				rule: function () {
					var dataZakonczeniaPrzetargu = $("#epoDataZakonczeniaPrzetargu").val();
					var dataZlozeniaOferty = $("#epoDataZlozeniaOferty").val();
					if (dataZakonczeniaPrzetargu != "") {
						dataZakonczeniaPrzetarguSplit = dataZakonczeniaPrzetargu.split("-");
						dataZlozeniaOfertySplit = dataZlozeniaOferty.split("-");
						var dataZakonczeniaPrzetarguDate = new Date(
							dataZakonczeniaPrzetarguSplit[0],
							dataZakonczeniaPrzetarguSplit[1] - 1,
							dataZakonczeniaPrzetarguSplit[2]
						);
						var dataZlozeniaOfertyDate = new Date(
							dataZlozeniaOfertySplit[0],
							dataZlozeniaOfertySplit[1] - 1,
							dataZlozeniaOfertySplit[2]
						);
						if (dataZakonczeniaPrzetarguDate - dataZlozeniaOfertyDate < 0) return false;
						else return true;
					} else {
						return true;
					}
				},
			},

			/*			{input: '#zleceniaPozycjaZlecenia', message: 'Wpisz pozycję zlecenia / id podprojektu', action: 'blur', rule: function () {
					var wartosc = $("#zleceniaPozycjaZlecenia").val()
					if (wartosc!='')
					{
						$("#zleceniaPozycjaZlecenia").val(wartosc.toUpperCase());
						if ($('#zleceniaTypZlecenia').val()==1)
							$("#zleceniaPozycjaZlecenia").val('0');
						return true;
					}
					else if ($('#zleceniaTypZlecenia').val()==1)
					{
						$("#zleceniaPozycjaZlecenia").val('0');
						return true;
					}
					else return false;
				}
			},
			{input: '#zleceniaOdpZaZlecenie', message: 'Wybierz odpowiedzialnego za zlecenie', action: 'change', rule: function () {
					var id = $('#zleceniaOdpZaZlecenie').val()
					if (id>0) return true
					else return false;
				}
			},
			{input: '#zleceniaRodzajZlecenia', message: 'Wybierz rodzaj zlecenia', action: 'change', rule: function () {
					var id = $('#zleceniaRodzajZlecenia').val()
					if (id>0) return true
					else return false;
				}
			},
			{input: '#zleceniaTypZlecenia', message: 'Wybierz typ zlecenia', action: 'change', rule: function () {
					var id = $('#zleceniaTypZlecenia').val()
					if (id>0) return true
					else return false;
				}
			},
			{input: '#zleceniaTemat', message: 'Wpisz temat / opis projektu', action: 'change', rule: function () {
					var wartosc = $('#zleceniaTemat').val()
					if (wartosc!='') return true
					else return false;
				}
			},
			{input: '#marszrutaTablica', message: 'Wczytaj marszrutę', action: 'change', rule: function () {
					wiersze = $('#marszrutaTablica').jqxGrid('getrows');
					if (wiersze.length>0) return true
					else return false;
				}
			}
*/
		],
	});
});
function epo_wczytajUprawnienia() {
	if (sprawdzUprawnienia("epo_dodaj")) $("#epo_addButton").jqxButton({ disabled: false });
	else $("#epo_addButton").jqxButton({ disabled: true });
	if (uprawnienia.epo_edytuj) $("#epo_editButton").jqxButton({ disabled: false });
	else $("#epo_editButton").jqxButton({ disabled: true });
	/*	if (uprawnienia.epo_usun)
		$('#epo_deleteButton').jqxButton({ disabled: false});
	else
		$('#epo_deleteButton').jqxButton({ disabled: true});*/
	if (uprawnienia.epo_export)
		$("#epo_exportButton").jqxButton({ disabled: false });
	else $("#epo_exportButton").jqxButton({ disabled: true });
}