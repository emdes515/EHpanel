$(document).ready(function ()
{
	var urlRCPLista = 'php/index.php?modul=raportowanieCzasuPracy&funkcja=lista';
	var urlRCPSpisDat = 'php/index.php?modul=raportowanieCzasuPracy&funkcja=spisDat';
	var urlRCPSpisPracownicy = "php/index.php?modul=raportowanieCzasuPracy&funkcja=listaPracownikowWDziale";
	var urlRCPSpisZlecen = "php/index.php?modul=raportowanieCzasuPracy&funkcja=spisZlecen";
	var urlRCPDrzewoZlecen = "php/index.php?modul=raportowanieCzasuPracy&funkcja=drzewoZlecen";
	var urlRCPSpisCzynnosci = "php/index.php?modul=raportowanieCzasuPracy&funkcja=spisCzynnosci";
	var urlRCPPrzekroczenieGodzinNaCzynnosci = "php/index.php?modul=raportowanieCzasuPracy&funkcja=przekroczenieGodzinNaCzynnosci";
	var daneRCPZmiany = '[{"idZmiany":"1","nazwa":"Zmiana A / B"},{"idZmiany":"2","nazwa":"Zmiana C"}]';



	var rcpZaznaczonyWiersz = -1;
	var rcpEksport = false;
	var idZlecenia = 0;
	var idDziecka = 0;
	var idCzynnosci = 0;
	var godzinyPlanowaneNaCzynnosci = 0;
	var sumaZaraportowanychGodzinNaCzynnosci = 0;
	var dodajWieleEdycja = {};
	var dataDziesiejsza = new Date();

	$('#rcpZakladki').jqxTabs({ 
		width: '100%',
		height: '100%',
		position: 'top',
		theme: theme
	});
	$('#rcpZakladki').off().on('tabclick', function (event) {
		if(event.args.item==1) {
			rcpKalendarzOdswiez();
//			$('#rcpKalendarz').jqxGrid({ source: rcpKalendarzDataAdapter });
		}
	});
	var sourceRCPSpisDat =
	{
		datatype: 'json',
		datafields: [
				{ name: 'data', type: 'string' }
		],
		url: urlRCPSpisDat
	};
	var dataAdapterRCPSpisDat = new $.jqx.dataAdapter(sourceRCPSpisDat);

	var rcpStatusKolorWiersza = function (row, column, value, data) {
		if (!rcpEksport)
			if (value)
			{
				var zatwierdzony = this.owner.source.records[row].zatwierdzony;
				var wyeksportowany = this.owner.source.records[row].wyeksportowany;
				if (value == 'Niezatwierdzony') { return 'rcpStatusNiezatwierdzony'}
				else if (value == 'Zatwierdzony') return 'rcpStatusZatwierdzony';
				else return 'rcpStatusERP';
			}
	};
	function rcpGrupuj(data, godzinaTablica)
	{
		if ((data.subItems.length!=undefined) && (data.subItems.length==0))
		{
			for(var i=0; i<data.subGroups.length; i++)
				godzinaTablica = rcpGrupuj(data.subGroups[i], godzinaTablica);
		}
		$.each( data.subItems, function( klucz, wartosc ) {
			godzinaTablica['godziny'] +=parseFloat(wartosc.godziny);
			if (wartosc.zatwierdzony==0) godzinaTablica['godzinyNiezatwierdzone'] += parseFloat(wartosc.godziny);
			else if ((wartosc.zatwierdzony==1) && (wartosc.wyeksportowany==0)) godzinaTablica['godzinyZatwierdzone'] += parseFloat(wartosc.godziny);
			else godzinaTablica['godzinyIFS'] += parseFloat(wartosc.godziny);
			if (((wartosc.skladnikPlac&1) || (wartosc.skladnikPlac&2)) && !(wartosc.skladnikPlac&4))  godzinaTablica['nominal'] += parseFloat(wartosc.godziny);
			if (((wartosc.skladnikPlac&1) || (wartosc.skladnikPlac&2)) && (wartosc.skladnikPlac&4))  godzinaTablica['nadgodziny'] += parseFloat(wartosc.godziny);
			if (wartosc.urlop&1)  godzinaTablica['urlop'] += parseFloat(wartosc.godziny);
		});
		return godzinaTablica;
	}
	
	var rcpGrupowanie = function (text, group, expanded, data) {
		var grupa = '';
		var godziny = 0;
		var godzinyNiezatwierdzone = 0;
		var godzinyZatwierdzone = 0;
		var godzinyIFS = 0;
		var godzinaTablica = new Array();
		godzinaTablica['godziny'] = 0;
		godzinaTablica['godzinyNiezatwierdzone'] = 0;
		godzinaTablica['godzinyZatwierdzone'] = 0;
		godzinaTablica['godzinyIFS'] = 0;
		godzinaTablica['nominal'] = 0;
		godzinaTablica['nadgodziny'] = 0;
		godzinaTablica['urlop'] = 0;
		godzinaTablica = rcpGrupuj(data, godzinaTablica);
		grupa += '<div style="padding: 10px; background-color: #f0f0f0;"><b>'+data.group+'</b> ';
		grupa += 'suma godzin: <b>'+godzinaTablica['godziny']+'</b> w tym (';
		grupa += ' nominał:<b>'+godzinaTablica['nominal']+'</b> / ';
		grupa += ' nadgodziny:<b>'+godzinaTablica['nadgodziny']+'</b> / ';
		grupa += ' urlop:<b>'+godzinaTablica['urlop']+'</b> )';
		grupa += ' w tym ( <span style="color:#728896;">niezatwierdzone:</span><b style="color:#728896;">'+godzinaTablica['godzinyNiezatwierdzone']+'</b> / ';
		grupa += ' <span style="color:#a51238;">zatwierdzone:</span><b style="color:#a51238;">'+godzinaTablica['godzinyZatwierdzone']+'</b> / ';
		grupa += ' <span style="color:#8aa311;">ERP:</span><b style="color:#8aa311;">'+godzinaTablica['godzinyIFS']+'</b> )</div>';
		
		if (rcpZaznaczonyWiersz>-1)
		{
			var tmpRcpZaznaczonyWiersz = rcpZaznaczonyWiersz;
			rcpZaznaczonyWiersz = -1;
			var rekord = $('#rcpTablica').jqxGrid('getrowdatabyid', tmpRcpZaznaczonyWiersz);
			$('#rcpTablica').jqxGrid('selectrow', tmpRcpZaznaczonyWiersz);
		}
		return grupa;
	}

	var rcpCellhover = function (element, pageX, pageY)
	{
		var cell = $('#rcpTablica').jqxGrid('getcellatposition', pageX, pageY);
		var row = cell.row;
		dane = $('#rcpTablica').jqxGrid('getrowdata', row);
		if (dane.temat != undefined && (cell.column == 'czynnosc' || cell.column == 'nrZlecenia'))
		{
			dymek = '';
			//dymek += '<tr><td style="text-align:left;"><b>Pracownik: </b></td><td style="text-align:left;">'+dane.imieNazwisko+'</td></tr>';
			//dymek += '<tr><td style="text-align:left;"><b>Data: </b></td><td style="text-align:left;">'+dane.data+'</td></tr>';
			//dymek += '<tr><td style="text-align:left; padding-right:10px;"><b>Nr zlec. / proj.: </b></td><td style="text-align:left;">'+dane.nrZlecenia+'</td></tr>';
			//dymek += '<tr><td style="text-align:left; padding-right:10px;"><b>Temat: </b></td><td style="text-align:left;">'+dane.temat+'</td></tr>';
			dymek += dane.temat;
			//dymek += '<tr><td style="text-align:left;"><b>Czynność: </b></td><td style="text-align:left;">'+dane.czynnosc+'</td></tr>';
			//dymek += '<tr><td style="text-align:left;"><b>Godziny: </b></td><td style="text-align:left;">'+dane.godziny+'</td></tr>';
			//dymek += '<tr><td style="text-align:left;"><b>Typ godzin: </b></td><td style="text-align:left;">'+dane.typGodzin+'</td></tr>';
			//dymek += '<tr><td style="text-align:left;"><b>Uwagi: </b></td><td style="text-align:left;">'+dane.uwagi+'</td></tr>';
			//dymek += '<tr><td style="text-align:left;"><b>Stan: </b></td><td style="text-align:left;">'+dane.stan+'</td></tr>';
			$('#rcpTablica').jqxTooltip({ content: dymek, opacity: 1, theme: theme });
			$('#rcpTablica').jqxTooltip('open', pageX + 15, pageY);
		}
		else {
			$('#rcpTablica').jqxTooltip('close');
		}
	};

	var sourceRCP =
	{
		datatype: 'json',
		datafields: [
			{ name: 'idCzasuPracy', type: 'number' },
			{ name: 'imieNazwisko', type: 'string' },
			{ name: 'data', type: 'string' },
			{ name: 'nrZlecenia', type: 'string' },
			{ name: 'temat', type: 'string' },
			{ name: 'czynnosc', type: 'string' },
			{ name: 'godziny', type: 'string' },
			{ name: 'skladnikPlac', type: 'number' },
			{ name: 'typGodzin', type: 'string' },
			{ name: 'uwagi', type: 'string' },
			{ name: 'zatwierdzony', type: 'number' },
			{ name: 'stan', type: 'string' },
			{ name: 'urlop', type: 'number' },
			{ name: 'wyeksportowany', type: 'number' }
		],
		url: urlRCPLista,
		async: false
	};
	var dataAdapterRCP = new $.jqx.dataAdapter(sourceRCP);
	
	$('#rcpTablica').jqxGrid(
	{
		width: '100%',
		height: '100%',
		source: dataAdapterRCP,
//		pageable: true,
		cellhover: rcpCellhover,
//		showfiltercolumnbackground: true,
		selectionmode: 'singlerow',
		editable: false,
		sortable: true,
		altrows: true,
		enabletooltips: false,
		filterable: true,
		columnsresize: true,
		showfilterrow: true,
		showcolumnlines: true,
		showcolumnheaderlines: false,
		groupable: true,
		groupsrenderer: rcpGrupowanie,
		groupsheaderheight: 40,
		groups: ['imieNazwisko'],
		localization: getLocalization('pl'),
		theme: theme,
		columns: [
			{ datafield: 'idCzasuPracy', hidden: true},
			{ text: 'Pracownik', datafield: 'imieNazwisko', cellsalign: 'left', align: 'center', filtertype: 'checkedlist', width: 200},
			{ text: 'Data', datafield: 'data', cellsalign: 'left', align: 'center', filtertype: 'list',filteritems: dataAdapterRCPSpisDat, width: 80},
			{ text: 'Nr zlecenia', datafield: 'nrZlecenia', cellsalign: 'left', align: 'center', filtertype: 'checkedlist', width: 120},
			{ datafield: 'temat', hidden: true},
			{ datafield: 'skladnikPlac', hidden: true},
			{ text: 'Czynność', datafield: 'czynnosc', cellsalign: 'left', align: 'center', filtertype: 'checkedlist'},
			{ text: 'Godziny', datafield: 'godziny', cellsalign: 'right', align: 'center', filterable: false, width: 60},
			{ text: 'Typ godzin', datafield: 'typGodzin', cellsalign: 'left', align: 'center', filtertype: 'checkedlist', width: 180},
			{ text: 'Uwagi', datafield: 'uwagi', cellsalign: 'left', align: 'center', filterable: false, width: 290},
			{ text: 'Stan', datafield: 'stan', cellsalign: 'center', align: 'center', filtertype: 'checkedlist', width: 120, cellclassname:rcpStatusKolorWiersza}
		],
		rendered: function() {
			$('#rcpTablica').jqxGrid('expandallgroups');
		},
		showstatusbar: true,
		renderstatusbar: function (statusbar) {
			var container = $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>");
			var addButton = $("<button id='rcp_addButton' style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='css/images/add.png'/><span style='margin-left: 4px; position: relative; top: -3px;'>Dodaj</span></button>");
			var addManyButton = $("<button id='rcp_addManyButton' style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='css/images/add.png'/><span style='margin-left: 4px; position: relative; top: -3px;'>Dodaj wiele</span></button>");
			var editButton = $("<button id='rcp_editButton' style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='css/images/edit.png'/><span style='margin-left: 4px; position: relative; top: -3px;'>Edytuj</span></button>");
			var duplicateButton = $("<button id='rcp_duplicateButton' style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='css/images/duplicate.png'/><span style='margin-left: 4px; position: relative; top: -3px;'>Duplikuj</span></button>");
			var deleteButton = $("<button id='rcp_deleteButton' style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='css/images/close.png'/><span style='margin-left: 4px; position: relative; top: -3px;'>Usuń</span></button>");
			var reloadButton = $("<button id='rcp_reloadButton' style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='css/images/refresh.png'/><span style='margin-left: 4px; position: relative; top: -3px;'>Przeładuj</span></button>");
			var expandButton = $("<button id='rcp_expandButton' style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='js/jqwidgets/styles/images/icon-down-blue.png'/><span style='margin-left: 4px; position: relative; top: -3px;'>Rozwiń</span></button>");
			var collapseButton = $("<button id='rcp_collapseButton' style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='js/jqwidgets/styles/images/icon-right-blue.png'/><span style='margin-left: 4px; position: relative; top: -3px;'>Zwiń</span></button>");
			var exportButton = $("<button id='rcp_exportButton' style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='css/images/excel.png'/><span style='margin-left: 4px; position: relative; top: -3px;'>Eksport XLS</span></button>");
			container.append(addButton);
			container.append(addManyButton);
			container.append(editButton);
			container.append(duplicateButton);
			container.append(deleteButton);
			container.append(reloadButton);
			container.append(expandButton);
			container.append(collapseButton);
			container.append(exportButton);
			statusbar.append(container);
			$('#rcp_addButton').jqxButton({disabled: true, theme: theme});
			$('#rcp_addManyButton').jqxButton({disabled: true, theme: theme});
			$('#rcp_editButton').jqxButton({disabled: true, theme: theme});
			$('#rcp_duplicateButton').jqxButton({disabled: true, theme: theme});
			$('#rcp_deleteButton').jqxButton({disabled: true, theme: theme});
			$('#rcp_reloadButton').jqxButton({theme: theme});
			$('#rcp_expandButton').jqxButton({theme: theme});
			$('#rcp_collapseButton').jqxButton({theme: theme});
			$('#rcp_exportButton').jqxButton({theme: theme});
			$('#rcp_addButton').off().on('click', function () {
				if (sprawdzUprawnienia('rcp_raportowanieInnychPracownikow'))
					$('#rcpPracownicy').jqxComboBox({ disabled: false });
				else
					$('#rcpPracownicy').jqxComboBox({ disabled: true });
				$('#rcpId').val(0);
				var dzisiaj = new Date().toISOString().slice(0, 10);
				idZlecenia = 0;
				idDziecka = 0;
				idCzynnosci = 0;
				$('#rcpData').val(dzisiaj);
				$('#rcpPracownicy').jqxComboBox('selectItem', idPracownika());
				$('#rcpZlecenie').jqxComboBox('clear');
				$('#rcpZlecenie').jqxComboBox(
				{
					source: dataAdapterRCPZlecenia
				});
				$('#rcpZlecenie').jqxComboBox({ selectedIndex: -1});	
				$('#rcpZlecenieWszystkie').jqxCheckBox({checked: false});
				$('#rcpDrzewoWersjiZlecenia').jqxDropDownButton('setContent', '');
				$('#rcpDrzewoWersjiZlecenia').jqxDropDownButton({disabled: false});
				$('#rcpDrzewoWersjiZleceniaDrzewo').jqxTree('clear');
				$('#rcpCzynnosc').jqxComboBox('clear');
				$('#rcpCzynnosc').jqxComboBox({ selectedIndex: -1});
				$('#rcpLiczbaGodzinAlert').html('');	
				$('#rcpLiczbaGodzinAlert2').html('');	
				$('#rcpGodziny').val('');
				$('#rcpUrlopL4').jqxCheckBox('uncheck');
				$('#rcpPraceDlaSerwisu').jqxCheckBox('uncheck');
				$('#rcpTypGodzinZjazd').jqxCheckBox('uncheck');
				$('#rcpTypGodzinNadgodziny').jqxCheckBox('uncheck');
				$('#rcpTypGodzinZmiana').jqxComboBox({ selectedIndex: 0});	
				$('#rcpUwagi').val('');
				$('#rcpZatwierdzony').jqxCheckBox('uncheck');
				$('#rcpDrzewoWersjiZlecenia').jqxDropDownButton({disabled: false});
				$('#oknoRCPDodajEdytuj').jqxWindow('open');
			});
			$('#rcp_addManyButton').off().on('click', function () {
				if (uprawnienia['rcp_raportowanieInnychPracownikow'])
					$('#rcpPracownicyWiele').jqxComboBox({ disabled: false });
				else
					$('#rcpPracownicyWiele').jqxComboBox({ disabled: true });
				$('#rcpPracownicyWiele').jqxComboBox('selectItem', idPracownika);				
				$('#rcpTablicaDodajWiele').jqxGrid('clear');
				dataAdapterDodajWiele = new $.jqx.dataAdapter(sourceDodajWiele);
				$('#rcpTablicaDodajWiele').jqxGrid({source: dataAdapterDodajWiele});
				$('#oknoRCPDodanieWiele').jqxWindow('open');
			});
			$('#rcp_editButton').off('click').off().on('click', function () {
				var indeks = $('#rcpTablica').jqxGrid('getselectedrowindex');
				var rowid = $('#rcpTablica').jqxGrid('getrowid', indeks);
				var rekord = $('#rcpTablica').jqxGrid('getrowdatabyid', rowid);
				var dane = {};
				dane['modul'] = 'raportowanieCzasuPracy',
				dane['funkcja'] = 'daneFormularz',
				dane['idCzasuPracy']=rekord.idCzasuPracy;
				daneJSON = wczytajDane('php/index.php',dane);
				$('#rcpCzynnosc').jqxComboBox('clear');
				$('#rcpCzynnosc').jqxComboBox({ selectedIndex: -1});
				$('#rcpLiczbaGodzinAlert').html('');
				$('#rcpLiczbaGodzinAlert2').html('');
				idCzynnosci = daneJSON['idCzynnosci'];
				idZlecenia = daneJSON['idZlecenia'];
				idDziecka = daneJSON['idDziecka'];
				if (uprawnienia['rcp_raportowanieInnychPracownikow'])
					$('#rcpPracownicy').jqxComboBox({ disabled: false });
				else
					$('#rcpPracownicy').jqxComboBox({ disabled: true });
				$('#rcpId').val(daneJSON['idCzasuPracy']);
				$('#rcpData').val(daneJSON['data']);
				$('#rcpPracownicy').jqxComboBox('selectItem', daneJSON['idPracownika']);
				$('#rcpZlecenie').jqxComboBox('selectItem', daneJSON['idZlecenia']);
				$('#rcpGodziny').val(daneJSON['godziny']);
				if (daneJSON['urlop']==1)
					$('#rcpUrlopL4').jqxCheckBox('check');
				else
					$('#rcpUrlopL4').jqxCheckBox('uncheck');
				if (daneJSON['praceDlaSerwisu']==1)
					$('#rcpPraceDlaSerwisu').jqxCheckBox('check');
				else
					$('#rcpPraceDlaSerwisu').jqxCheckBox('uncheck');
				if (daneJSON['nadgodziny']==1)
					$('#rcpTypGodzinNadgodziny').jqxCheckBox('check');
				else
					$('#rcpTypGodzinNadgodziny').jqxCheckBox('uncheck');
				if (daneJSON['zjazd']==1)
					$('#rcpTypGodzinZjazd').jqxCheckBox('check');
				else
					$('#rcpTypGodzinZjazd').jqxCheckBox('uncheck');
				if (daneJSON['zatwierdzony']==1)
					$('#rcpZatwierdzony').jqxCheckBox('check');
				else
					$('#rcpZatwierdzony').jqxCheckBox('uncheck');
				$('#rcpTypGodzinZmiana').jqxComboBox('selectItem', daneJSON['zmiana']);
				$('#rcpUwagi').jqxTextArea('val',daneJSON['uwagi']);
				$('#rcpDrzewoWersjiZlecenia').jqxDropDownButton({disabled: false});
				$('#oknoRCPDodanieEdycja').jqxWindow('open');
			});
			$('#rcp_duplicateButton').off().on('click', function () {
				var indeks = $('#rcpTablica').jqxGrid('getselectedrowindex');
				var rowid = $('#rcpTablica').jqxGrid('getrowid', indeks);
				var rekord = $('#rcpTablica').jqxGrid('getrowdatabyid', rowid);
				var dane = {};
				dane['idCzasuPracy']=rekord.idCzasuPracy;
				dane['modul'] = 'raportowanieCzasuPracy';
				dane['funkcja'] = 'duplikacjaRaportu';
				daneJSON = wczytajDane('php/index.php',dane);
				var id=daneJSON['id'];
				if (id>0)
				{
					pokazKomunikat('ok',komunikaty['rcpPowielono']);
				}
				else if (id == -1){
					pokazKomunikat('blad',komunikaty['rcpPowielonoZlecenieZamkniete']);
				}
				else
				{
					pokazKomunikat('blad',komunikaty['rcpPowielonoBlad']);
				}
//				$('#rcpTablica').jqxGrid({ source: dataAdapterRCP, groups: ['imieNazwisko'] });
				$('#rcpTablica').jqxGrid('updatebounddata', 'cells');
			});
			$('#rcp_deleteButton').off().on('click', function () {
				var indeks = $('#rcpTablica').jqxGrid('getselectedrowindex');
				var rowid = $('#rcpTablica').jqxGrid('getrowid', indeks);
				var rekord = $('#rcpTablica').jqxGrid('getrowdatabyid', rowid);
				var dane = {};
				dane['modul'] = 'raportowanieCzasuPracy';
				dane['funkcja'] = 'usun';
				dane['idCzasuPracy']=rekord.idCzasuPracy;
				daneJSON = wczytajDane('php/index.php',dane);
				var id=daneJSON['id'];
				if (id>0)
				{
					pokazKomunikat('ok',komunikaty['rcpUsunieto']);
				}
				else
				{
					pokazKomunikat('blad',komunikaty['rcpUsunietoBlad']);
				}
//				$('#rcpTablica').jqxGrid({ source: dataAdapterRCP, groups: ['imieNazwisko'] });
				$('#rcpTablica').jqxGrid('updatebounddata', 'cells');
			});
			$('#rcp_reloadButton').off().on('click', function () {
//				$('#rcpTablica').jqxGrid({ source: dataAdapterRCP, groups: ['imieNazwisko'] });
				$('#rcpTablica').jqxGrid('updatebounddata', 'cells');
			});
			$('#rcp_expandButton').off().on('click', function () {
				 $('#rcpTablica').jqxGrid('expandallgroups');
			});
			$('#rcp_collapseButton').off().on('click', function () {
				 $('#rcpTablica').jqxGrid('collapseallgroups');
			});
			$('#rcp_exportButton').off().on('click', function () {
				rcpEksport = true;
				$('#rcpTablica').jqxGrid('exportdata', 'json', 'rcpTablica', false, null, false, 'https://panel.elgor.com.pl/php/index.php?modul=eksport_danych&funkcja=eksport_czasuPracy');
				rcpEksport = false;
			});
			rcp_wczytajUprawnienia();
		}
	});

	$('#rcpTablica').off().on('cellclick', function (event) {
		if (event.args.datafield == 'stan')
		{
			var dane = {};
			var rowid = $('#rcpTablica').jqxGrid('getrowid', event.args.rowindex);
			var rekord = $('#rcpTablica').jqxGrid('getrowdatabyid', rowid);
			if (sprawdzUprawnienia('rcp_zatwierdz') == 1 && rekord.stan != 'ERP' )
			{
				dane['modul'] = 'raportowanieCzasuPracy',
				dane['funkcja'] = 'zmienStanRaportu',
				dane['idCzasuPracy']=rekord.idCzasuPracy;
				if (rekord.stan == 'Niezatwierdzony') 
				{
					$('#rcpTablica').jqxGrid('setcellvalue', event.args.rowindex, 'stan', 'Zatwierdzony');
					dane['zatwierdzony']=1;
				}
				else
				{
					$('#rcpTablica').jqxGrid('setcellvalue', event.args.rowindex, 'stan', 'Niezatwierdzony');
					dane['zatwierdzony']=0;
				}
				daneJSON = wczytajDane('php/index.php',dane);
				if (daneJSON['wynik'] == 1)
				{
					pokazKomunikat('ok',komunikaty['rcpZmianaStanu']);
				}
				else
				{
					pokazKomunikat('blad',komunikaty['rcpZmianaStanuBlad']);
				}
				rcpZaznaczonyWiersz = rowid;
				$('#rcpTablica').jqxGrid('updatebounddata', 'cells');

			}
		}
	});
	$('#rcpTablica').off().on('rowselect', function (event)
	{
		wiersz = event.args.row;
		if (wiersz)
		{
			if ((((uprawnienia.rcp_edytuj) && (wiersz.zatwierdzony==0)) || ((uprawnienia.rcp_edytuj_zatwierdzony) && (wiersz.zatwierdzony==1))) && wiersz.wyeksportowany==0)
				$('#rcp_editButton').jqxButton({ disabled: false});
			else
				$('#rcp_editButton').jqxButton({ disabled: true});
			if (uprawnienia.rcp_duplikuj)
				$('#rcp_duplicateButton').jqxButton({ disabled: false});
			else
				$('#rcp_duplicateButton').jqxButton({ disabled: true});
			if ((((uprawnienia.rcp_usun) && (wiersz.zatwierdzony==0)) || ((uprawnienia.rcp_usun_zatwierdzony) && (wiersz.zatwierdzony==1))) && wiersz.wyeksportowany==0)
				$('#rcp_deleteButton').jqxButton({ disabled: false});
			else
				$('#rcp_deleteButton').jqxButton({ disabled: true});
		}
		else
		{
			$('#rcp_editButton').jqxButton({ disabled: true});
			$('#rcp_duplicateButton').jqxButton({ disabled: true});
			$('#rcp_deleteButton').jqxButton({ disabled: true});
		}
	});
	$('#rcpTablica').off().on('filter', function (event) 
	{
		var filter = $('#rcpTablica').jqxGrid('getfilterinformation');
		for (i = 0; i < filter.length; i++)
		{
			if (filter[i].datafield == 'data')
			{
				var filter0 = filter[i];
				var value = filter0.filter.getfilters();
				var condition = filter0.filter.getfilters()[0].condition;
				var data = value[0].value;
				var dane = {};
				dane['modul'] = 'raportowanieCzasuPracy';
				dane['funkcja']='ustawDateFiltrowania';
				dane['data']=data;
				daneJSON = wczytajDane('php/index.php',dane);
				$('#rcpTablica').jqxGrid('updatebounddata','row');
				$('#rcpTablica').jqxGrid('addgroup', 'imieNazwisko');
				$('#rcpTablica').jqxGrid('selectrow', -1);
				rcpKalendarzOdswiez(data);

/*				sourceRCP.data = {
					data: data,
					async: false
				};
				var dataAdapterRCP = new $.jqx.dataAdapter(sourceRCP);
				$('#rcpTablica').jqxGrid({
					source: dataAdapterRCP,
					groups: ['imieNazwisko']
				});*/
			}
		}
	});

// ---------------------------------------------- dodaj edytuj RCP -----------------------------------------

	$('#oknoRCPDodajEdytuj').jqxWindow({
		width: 525,
		height: 760,
		maxWidth: 1000,
		maxHeight: 1000,
		keyboardCloseKey: 0,
		resizable: false,
		isModal: true,
		autoOpen: false,
		modalOpacity: 0.6,
		theme: theme
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
		height: 30,
		source: dataAdapterRCPListaPracownikow,
		placeHolder: 'Wybierz pracownika:',
		displayMember: "nazwiskoImie",
		valueMember: "idPracownika",
		selectedIndex: -1,
		theme: theme
	});
	$("#rcpData").jqxDateTimeInput({
		width: 300,
		height: 30,
		culture: 'pl-PL',
		formatString: 'yyyy-MM-dd',
//		min: minDataZaraportowania,
		theme: theme
	});
	$("#rcpZlecenieWszystkie").jqxCheckBox({
		width: 30,
		height: 30,
		theme: theme
	});
	$('#rcpZlecenieWszystkie').on('click', function () { 
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
		height: 30,
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
		height: 30,
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
			height: 30,
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
		height: 30,
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
		theme: theme
	});
	$("#rcpPraceDlaSerwisu").jqxCheckBox({
		theme: theme
	});
	$("#rcpTypGodzinZjazd").jqxCheckBox({
		theme: theme
	});
	$("#rcpTypGodzinNadgodziny").jqxCheckBox({
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
		height: 30,
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
		width: 30,
		height: 30,
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


// ---------------------------------------------- dodaj edytuj RCP -----------------------------------------

});
function rcp_wczytajUprawnienia()
{
	if (sprawdzUprawnienia('rcp_dodaj')) {
		$('#rcp_addButton').jqxButton({ disabled: false});
		$('#rcp_addManyButton').jqxButton({ disabled: false});
	}
	else {
		$('#rcp_addButton').jqxButton({ disabled: true});
		$('#rcp_addManyButton').jqxButton({ disabled: false});
	}
/*
	if (uprawnienia.rcp_zatwierdz)
		$('#rcpZatwierdzony').jqxCheckBox({ disabled: false});
	else
		$('#rcpZatwierdzony').jqxCheckBox({ disabled: true});
*/
}