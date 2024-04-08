$(document).ready(
raportowanieCzasuPracyDodajEdytuj = function (){
	var urlRCPSpisPracownicy = "php/index.php?modul=raportowanieCzasuPracy&funkcja=listaPracownikowWDziale";
	var urlRCPSpisZlecen = "php/index.php?modul=raportowanieCzasuPracy&funkcja=spisZlecenn";
	var urlRCPDrzewoZlecen = "php/index.php?modul=raportowanieCzasuPracy&funkcja=drzewoZlecen";
	var urlRCPSpisCzynnosci = "php/index.php?modul=raportowanieCzasuPracy&funkcja=spisCzynnosci";
	var urlRCPPrzekroczenieGodzinNaCzynnosci = "php/index.php?modul=raportowanieCzasuPracy&funkcja=przekroczenieGodzinNaCzynnosci";
	var daneRCPZmiany = '[{"idZmiany":"1","nazwa":"Zmiana A / B"},{"idZmiany":"2","nazwa":"Zmiana C"}]';
	var dataDziesiejsza = new Date();

	$('#oknoRCPDodajEdytuj').jqxWindow({
		width: 525,
		height: 630,
		maxWidth: 1000,
		maxHeight: 1000,
		keyboardCloseKey: 0,
		resizable: false,
		isModal: true,
		autoOpen: false,
		modalOpacity: 0.6,
		theme: theme
	});
	$('#oknoRCPDodajEdytuj').off().on('close', function (event) { 
		//		scriptRCPDodajEdytuj.parentNode.removeChild(scriptRCPDodajEdytuj);
	//			raportowanieCzasuPracyDodajEdytuj = function() {}
				$('#rcpModal').empty();
		//		removejscssfile("js/raportowanieCzasuPracyDodajEdytuj.js", "js")
		//		scriptRCPDodajEdytuj = undefined;
		//		log(scriptRCPDodajEdytuj)
		//		funkcjaRCPDodajEdytuj = undefined;
				alert('test');
		//		return false;
	});
	var rcpZrodloListaPracownikow =
	{
		datatype: "json",
		datafields: [
			{ name: 'idPracownika' },
			{ name: 'nazwiskoImie' }
		],
		url: urlRCPSpisPracownicy,
		async: false
	};
	var dataAdapterRCPListaPracownikow = new $.jqx.dataAdapter(rcpZrodloListaPracownikow);
	$("#rcpPracownicy").jqxComboBox({
		width: 300,
		
		source: dataAdapterRCPListaPracownikow,
		placeHolder: 'Wybierz pracownika:',
		displayMember: "nazwiskoImie",
		valueMember: "idPracownika",
		selectedIndex: -1,
		theme: theme
	});
	$("#rcpData").jqxDateTimeInput({
		width: 300,
		
		culture: 'pl-PL',
		formatString: 'yyyy-MM-dd',
//		min: minDataZaraportowania,
		theme: theme
	});
	$("#rcpZlecenieWszystkie").jqxCheckBox({
		width: 25,
		height: 25,
		theme: theme
	});
	$('#rcpZlecenieWszystkie').off().on('click', function () { 
		var value = $("#rcpZlecenieWszystkie").jqxCheckBox('val');
		if (value) {
			var rcpZleceniaSource =
			{
				dataType: "json",
				dataFields: [
					{ name: 'idZlecenia'},
					{ name: 'nazwa'}
				],
				data: { wszystkieZlecenia: 1 },
				async:false,
				url: urlRCPSpisZlecen
			};
		} else {
			var rcpZleceniaSource =
			{
				dataType: "json",
				dataFields: [
					{ name: 'idZlecenia'},
					{ name: 'nazwa'}
				],
				data: { idPracownika: idPracownika },
				async:false,
				url: urlRCPSpisZlecen
			};
		}
		var dataAdapterRCPZlecenia = new $.jqx.dataAdapter(rcpZleceniaSource);
		$("#rcpZlecenie").jqxComboBox({source: dataAdapterRCPZlecenia});
	});
	var rcpZleceniaSource =
	{
		dataType: "json",
		dataFields: [
			{ name: 'idZlecenia'},
			{ name: 'nazwa'}
		],
		data: { idPracownika: idPracownika },
		async:false,
		url: urlRCPSpisZlecen
	};
	var dataAdapterRCPZlecenia = new $.jqx.dataAdapter(rcpZleceniaSource);
	$("#rcpZlecenie").jqxComboBox(
	{
		source: dataAdapterRCPZlecenia,	
		width: 300,
		
		placeHolder: "Wybierz zlecenie / projekt",
		displayMember: 'nazwa',
		valueMember: 'idZlecenia',
		searchMode: 'containsignorecase',
		autoComplete: true,
		dropDownWidth: 700,
		dropDownHeight: 500,
		dropDownHorizontalAlignment: 'left',
		theme: theme
	});
	var rcpDrzewoZlecenSource =
	{
		dataType: "json",
		dataFields: [
			{ name: 'id' },
			{ name: 'parentid' },
			{ name: 'text' },
			{ name: 'value' }
		],
		id: 'id',
		async:false,
		url: urlRCPDrzewoZlecen
	};

	$("#rcpZlecenie").bind('select', function(event)
	{
		if ((event.args) && ($("#rcpZlecenie").jqxComboBox('getSelectedIndex')>-1))
		{
			var dropDownContent = '<div style="position: relative; margin-left: 3px; margin-top: 5px;"></div>';
			$("#rcpDrzewoWersjiZlecenia").jqxDropDownButton('setContent', dropDownContent);
			$("#rcpDrzewoWersjiZlecenia").jqxDropDownButton({disabled: false});
			var value = event.args.item.value;
			rcpDrzewoZlecenSource.data = {idZlecenia: value};
			var dataAdapterRCPDrzewoZlecen = new $.jqx.dataAdapter(rcpDrzewoZlecenSource);
			dataAdapterRCPDrzewoZlecen.dataBind();
			var records = dataAdapterRCPDrzewoZlecen.getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label'}]);
			$('#rcpDrzewoWersjiZleceniaDrzewo').jqxTree({ source: records});
			if (dataAdapterRCPDrzewoZlecen.records.length == 1) {
				$('#rcpDrzewoWersjiZleceniaDrzewo').jqxTree('selectItem', $("#rcpDrzewoWersjiZleceniaDrzewo").find('li:first')[0]);
				$("#rcpDrzewoWersjiZlecenia").jqxDropDownButton({disabled: true});
			}
			$('#rcpDrzewoWersjiZleceniaDrzewo').jqxTree('expandAll');

			items = $('#rcpDrzewoWersjiZleceniaDrzewo').jqxTree('getItems');
			$('#rcpDrzewoWersjiZleceniaDrzewo').jqxTree('selectItem', $("#"+idDziecka)[0]);
		}
	});
	$("#rcpDrzewoWersjiZlecenia").jqxDropDownButton({ 
		width: 300,
		height: 20,
		theme: theme
	});
	$("#rcpDrzewoWersjiZleceniaDrzewo").jqxTree({
		width: 500,
		height: 400,
		theme: theme
	});


	$("#rcpDrzewoWersjiZleceniaDrzewo").off().on('select', function(event)
	{
		var args = event.args;
		var item = $('#rcpDrzewoWersjiZleceniaDrzewo').jqxTree('getItem', args.element);
		var dropDownContent = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + item.label + '</div>';
		$("#rcpDrzewoWersjiZlecenia").jqxDropDownButton('setContent', dropDownContent);
		$('#rcpDrzewoWersjiZlecenia').jqxDropDownButton('close');
		if ((event.args) && (item.value>0))
		{
			$("#rcpCzynnosc").jqxComboBox('clear');
			$("#rcpCzynnosc").jqxComboBox({ selectedIndex: -1});
			var value = item.value;
			rcpCzynnosciSource.data = {idDrzewa: value};
			var dataAdapterRCPCzynnosci = new $.jqx.dataAdapter(rcpCzynnosciSource);
			$("#rcpCzynnosc").jqxComboBox({source: dataAdapterRCPCzynnosci});
			$.each( dataAdapterRCPCzynnosci.records, function( klucz, wartosc ) {
				if (wartosc.wlaczone == 1)
					$("#rcpCzynnosc").jqxComboBox('enableAt', klucz ); 
				else
					$("#rcpCzynnosc").jqxComboBox('disableAt', klucz ); 
			});
			if (idCzynnosci>0)
			{
				$("#rcpCzynnosc").jqxComboBox('selectItem', idCzynnosci);
				idCzynnosci=0;
			}
		}
	});	
	$("#rcpCzynnosc").jqxComboBox(
		{
			width: 300,
			
			dropDownWidth: 500,
			promptText: "Wybierz czynnosci",
			displayMember: 'nazwa',
			searchMode: 'containsignorecase',
			autoComplete: true,
			dropDownWidth: 700,
			dropDownHeight: 500,
			valueMember: 'idCzynnosci',
			theme: theme
		});
	
	var rcpCzynnosciSource =
	{
		dataType: "json",
		dataFields: [
			{ name: 'idCzynnosci'},
			{ name: 'nazwa'},
			{ name: 'wlaczone'}
		],
		async:false,
		url: urlRCPSpisCzynnosci
	};

	
	var rcpPrzekroczenieGodzinNaCzynnosciSource =
	{
		dataType: "json",
		dataFields: [
			{ name: 'przekroczoneGodziny' }
		],
		async:false,
		url: urlRCPPrzekroczenieGodzinNaCzynnosci
	};
	$("#rcpCzynnosc").off().on('select', function(event)
	{
		var idCzynnosci = event.args.item.value;
		var rcpPrzekroczenieGodzinNaCzynnosci =
		{
			dataType: "json",
			dataFields: [
				{ name: 'godzinyPlanowane' },
				{ name: 'sumaZaraportowanychGodzin' }
			],
			data: { idCzynnosci: idCzynnosci },
			async:false,
			url: urlRCPPrzekroczenieGodzinNaCzynnosci
		};
		var dataAdapterRCPPrzekroczenieGodzinNaCzynnosci = new $.jqx.dataAdapter(rcpPrzekroczenieGodzinNaCzynnosci);
		dataAdapterRCPPrzekroczenieGodzinNaCzynnosci.dataBind();
		godzinyPlanowaneNaCzynnosci = Number(dataAdapterRCPPrzekroczenieGodzinNaCzynnosci.records[0].godzinyPlanowane);
		sumaZaraportowanychGodzinNaCzynnosci = Number(dataAdapterRCPPrzekroczenieGodzinNaCzynnosci.records[0].sumaZaraportowanychGodzin);
//		console.log(godzinyPlanowaneNaCzynnosci+' '+sumaZaraportowanychGodzinNaCzynnosci)
		if (godzinyPlanowaneNaCzynnosci>0 && sumaZaraportowanychGodzinNaCzynnosci>godzinyPlanowaneNaCzynnosci) {
			$('#rcpLiczbaGodzinAlert').html("<b style='color: #ff0000'>Przekroczono ilość zaplanowanych godzin</b>");
		} else {
			$('#rcpLiczbaGodzinAlert').html('');
		}
		var godziny = Number($("#rcpGodziny").val());
		if (godziny>0 && godzinyPlanowaneNaCzynnosci>0 && (sumaZaraportowanychGodzinNaCzynnosci+godziny)>godzinyPlanowaneNaCzynnosci) {
			$('#rcpLiczbaGodzinAlert2').html("<b style='color: #ff0000'>Przekroczono ilość zaplanowanych godzin</b>");
		} else {
			$('#rcpLiczbaGodzinAlert2').html('');
		}
	})

	$("#rcpGodziny").jqxInput({
		width: 300,
		
		theme: theme
	});

	$("#rcpGodziny").off().on('keyup', function(event)
	{
		var godziny = Number($("#rcpGodziny").val());
		if (godziny>0 && godzinyPlanowaneNaCzynnosci>0 && (sumaZaraportowanychGodzinNaCzynnosci+godziny)>godzinyPlanowaneNaCzynnosci) {
			$('#rcpLiczbaGodzinAlert2').html("<b style='color: #ff0000'>Przekroczono ilość zaplanowanych godzin</b>");
		} else {
			$('#rcpLiczbaGodzinAlert2').html('');
		}
	})
	$("#rcpUrlopL4").jqxCheckBox({
		width: 20,
		
		theme: theme
	});
	$("#rcpPraceDlaSerwisu").jqxCheckBox({
		width: 20,
		
		theme: theme
	});
	$("#rcpTypGodzinZjazd").jqxCheckBox({
		width: 20,
		
		theme: theme
	});
	$("#rcpTypGodzinNadgodziny").jqxCheckBox({
		width: 20,
		
		theme: theme
	});
	var rcpZmianaSource =
	{
		dataType: "json",
		dataFields: [
			{ name: 'idZmiany'},
			{ name: 'nazwa'}
		],
		localdata: daneRCPZmiany
	};
	var dataAdapterRCPZmiana = new $.jqx.dataAdapter(rcpZmianaSource);
	$("#rcpTypGodzinZmiana").jqxComboBox(
	{
		source: dataAdapterRCPZmiana,	
		width: 300,
		
		promptText: "Wybierz zmianę",
		displayMember: 'nazwa',
		valueMember: 'idZmiany',
		theme: theme
	});
	$('#rcpUwagi').jqxTextArea({ 
		width: 300,
		height: 300,
		placeHolder: 'Wpisz uwagi',
		theme: theme
	});
	$("#rcpZatwierdzony").jqxCheckBox({
		width: 20,
		
		theme: theme
	});
	$("#rcpEdycjaZapisz").jqxButton({
		width: 150,
		theme: theme
	});

	$("#rcpPracownicy").bind('select', function(event)
	{
		if ((event.args) && ($("#rcpPracownicy").jqxComboBox('getSelectedIndex')>-1))
		{
			$("#rcpZlecenie").jqxComboBox({ selectedIndex: -1});
			$("#rcpCzynnosc").jqxComboBox({ selectedIndex: -1});
			var value = event.args.item.value;
			rcpZleceniaSource.data = {idPracownika: value};
			var dataAdapterRCPZlecenia = new $.jqx.dataAdapter(rcpZleceniaSource);
			$("#rcpZlecenie").jqxComboBox({source: dataAdapterRCPZlecenia});
		}
	});
})
start();

function start() {
	if (sprawdzUprawnienia('rcp_raportowanieInnychPracownikow'))
		$("#rcpPracownicy").jqxComboBox({ disabled: false });
	else
		$("#rcpPracownicy").jqxComboBox({ disabled: true });
	$("#rcpId").val(0);
	var dzisiaj = new Date();
	var dzien = dzisiaj.getDate();
	var miesiac = dzisiaj.getMonth()+1
	var rok = dzisiaj.getFullYear();
	if(dzien<10) {
	dzien='0'+dzien;
	} 
	if(miesiac<10) {
	miesiac='0'+miesiac;
	}
	idZlecenia = 0;
	idDziecka = 0;
	idCzynnosci = 0;
	$('#rcpData').val(rok+'-'+miesiac+'-'+dzien);
	$("#rcpPracownicy").jqxComboBox('selectItem', idPracownika);
	$("#rcpZlecenie").jqxComboBox('clear');
/*	$("#rcpZlecenie").jqxComboBox(
	{
		source: dataAdapterRCPZlecenia
	});*/
	$("#rcpZlecenie").jqxComboBox({ selectedIndex: -1});	
	$("#rcpZlecenieWszystkie").jqxCheckBox({checked: false});
	$("#rcpDrzewoWersjiZlecenia").jqxDropDownButton('setContent', '');
	$("#rcpDrzewoWersjiZlecenia").jqxDropDownButton({disabled: false});
	$('#rcpDrzewoWersjiZleceniaDrzewo').jqxTree('clear');
	$("#rcpCzynnosc").jqxComboBox('clear');
	$("#rcpCzynnosc").jqxComboBox({ selectedIndex: -1});
	$('#rcpLiczbaGodzinAlert').html('');	
	$('#rcpLiczbaGodzinAlert2').html('');	
	$("#rcpGodziny").val("");
	$("#rcpUrlopL4").jqxCheckBox('uncheck');
	$("#rcpPraceDlaSerwisu").jqxCheckBox('uncheck');
	$("#rcpTypGodzinZjazd").jqxCheckBox('uncheck');
	$("#rcpTypGodzinNadgodziny").jqxCheckBox('uncheck');
	$("#rcpTypGodzinZmiana").jqxComboBox({ selectedIndex: 0});	
	$("#rcpUwagi").val('');
	$("#rcpZatwierdzony").jqxCheckBox('uncheck');
	$("#rcpDrzewoWersjiZlecenia").jqxDropDownButton({disabled: false});
	$("#oknoRCPDodajEdytuj").jqxWindow('open');
}
//})

