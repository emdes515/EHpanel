$(document).ready(function () {
	var urlListaDzialow = 'php/index.php?modul=uprawnienia&funkcja=listaDzialow';
	var urlListaPracownikow = 'php/index.php?modul=uprawnienia&funkcja=listaPracownikow';
	var urlListaUprawnien = 'php/index.php?modul=uprawnienia&funkcja=listaUprawnien';
	var idDzialu = 0;
	var idPracownika = 0;

	$('#uprawnieniaZapisz').jqxButton({
		theme: 'web',
		width: 65,
		height: 35,
	});
	$('#uprawnieniaSpisDzialow').jqxDropDownButton({
		width: 275,
		height: 20,
		theme: 'web',
	});
	$('#uprawnieniaSpisDzialow').jqxDropDownButton('setContent', 'Wybierz dział:');
	var sourceListaUprawnien = {
		datatype: 'json',
		datafields: [{ name: 'title' }, { name: 'html' }, { name: 'group' }],
		id: 'id',
		async: false,
		url: urlListaUprawnien,
	};
	var daneSpisUprawnien = new $.jqx.dataAdapter(sourceListaUprawnien);
	$('#uprawnieniaSpisUprawnien').jqxListBox({
		width: 590,
		height: 500,
		source: daneSpisUprawnien,
		displayMember: 'html',
		valueMember: 'title',
		checkboxes: true,
		theme: 'web',
		/*		renderer: function (index, label, value) {
			var dane='';
			if (value)
			{
				dane='<div style="float:left; padding-right:5px;"><img src="css/images/blank.png"></div>';
			}
			dane += label;
			return dane;
		}*/
	});
	var sourceListaDzialow = {
		datatype: 'json',
		datafields: [
			{ name: 'id', type: 'number' },
			{ name: 'parentid', type: 'number' },
			{ name: 'text', type: 'string' },
			{ name: 'value', type: 'string' },
		],
		url: urlListaDzialow,
		async: false,
	};
	var dataAdapterListaDzialow = new $.jqx.dataAdapter(sourceListaDzialow);
	dataAdapterListaDzialow.dataBind();
	var daneListaDzialow = dataAdapterListaDzialow.getRecordsHierarchy('id', 'parentid', 'items', [
		{ name: 'text', map: 'label' },
	]);
	$('#uprawnieniaSpisDzialowDrzewo').jqxTree({
		source: daneListaDzialow,
		width: 200,
		height: 200,
		theme: 'web',
	});
	$('#uprawnieniaSpisDzialowDrzewo').jqxTree('expandAll');
	var sourceListaPracownikow = {
		datatype: 'json',
		datafields: [{ name: 'idPracownika' }, { name: 'nazwiskoImie' }],
		url: urlListaPracownikow,
		async: false,
	};

	var dataAdapterListaPracownikow = new $.jqx.dataAdapter(sourceListaPracownikow);
	$('#uprawnieniaSpisPracownikow').jqxComboBox({
		source: dataAdapterListaPracownikow,
		displayMember: 'nazwiskoImie',
		valueMember: 'idPracownika',
		placeHolder: 'Wybierz pracownika:',
		selectedIndex: -1,
		width: 275,
		height: 20,
		autoComplete: true,
		searchMode: 'containsignorecase',
	});

	$('#uprawnieniaSpisPracownikow').on('select', function (event) {
		$('#uprawnieniaSpisDzialowDrzewo').jqxTree('selectItem', null);
		$('#uprawnieniaSpisDzialow').jqxDropDownButton('setContent', 'Wybierz dział:');
		var dane = {};
		var args = event.args;
		var item = args.item;
		idPracownika = item.value;
		idDzialu = 0;
		var daneSpisUprawnien = new $.jqx.dataAdapter(sourceListaUprawnien);
		$('#uprawnieniaSpisUprawnien').jqxListBox({
			source: daneSpisUprawnien,
		});

		(dane['modul'] = 'uprawnienia'),
			(dane['funkcja'] = 'spisUprawnienPracownika'),
			(dane['idPracownika'] = item.value);
		daneJSON = wczytajDane('php/index.php', dane);

		$('#uprawnieniaSpisUprawnien').jqxListBox('uncheckAll');
		var items = $('#uprawnieniaSpisUprawnien').jqxListBox('getItems');
		$.each(items, function (index) {
			if ($.inArray('p' + this.value, daneJSON.idUprawnienia) > -1)
				$('#uprawnieniaSpisUprawnien').jqxListBox('checkIndex', this.index);
			if ($.inArray('d' + this.value, daneJSON.idUprawnienia) > -1) {
				i = $.inArray('d' + this.value, daneJSON.idUprawnienia);
				$('#uprawnieniaSpisUprawnien').jqxListBox('checkIndex', this.index);
				$('#uprawnieniaSpisUprawnien').jqxListBox(
					'updateAt',
					{
						label:
							'<div style="float:left; padding-right:5px;"><img src="css/images/group.png"></div>' +
							daneJSON.opis[i],
					},
					index
				);
			}
		});
	});
	$('#uprawnieniaSpisDzialowDrzewo').on('select', function (event) {
		var dane = {};
		var args = event.args;
		var item = $('#uprawnieniaSpisDzialowDrzewo').jqxTree('getItem', args.element);
		idPracownika = 0;
		idDzialu = item.value;
		var daneSpisUprawnien = new $.jqx.dataAdapter(sourceListaUprawnien);
		$('#uprawnieniaSpisUprawnien').jqxListBox({
			source: daneSpisUprawnien,
		});
		var dropDownContent =
			'<div style="position: relative; margin-left: 3px; margin-top: 5px;">' +
			item.label +
			'</div>';
		$('#uprawnieniaSpisDzialow').jqxDropDownButton('setContent', dropDownContent);
		$('#uprawnieniaSpisDzialow').jqxDropDownButton('close');
		$('#uprawnieniaSpisPracownikow').jqxComboBox('clearSelection');
		(dane['modul'] = 'uprawnienia'),
			(dane['funkcja'] = 'spisUprawnienDzialu'),
			(dane['idDzialu'] = item.value);
		daneJSON = wczytajDane('php/index.php', dane);
		$('#uprawnieniaSpisUprawnien').jqxListBox('uncheckAll');
		var items = $('#uprawnieniaSpisUprawnien').jqxListBox('getItems');
		$.each(items, function (index) {
			if ($.inArray(this.value, daneJSON) > -1)
				$('#uprawnieniaSpisUprawnien').jqxListBox('checkIndex', this.index);
		});
	});
	$('#uprawnieniaZapisz').on('click', function () {
		var dane = {};
		var checkedItems = '';
		var uprawnienia = {};
		var i = 0;
		var items = $('#uprawnieniaSpisUprawnien').jqxListBox('getCheckedItems');
		$.each(items, function (index) {
			if (!isNaN(Number(this.value))) uprawnienia[i++] = this.value;
		});
		(dane['modul'] = 'uprawnienia'), (dane['funkcja'] = 'zapis'), (dane['idDzialu'] = idDzialu);
		dane['idPracownika'] = idPracownika;
		dane['uprawnienia'] = uprawnienia;
		daneJSON = wczytajDane('php/index.php', dane);
		var id = daneJSON['id'];
		if (id > 0) {
			pokazKomunikat('ok', komunikaty['uprawnieniaDodanie']);
			idPracownika = 0;
			idDzialu = 0;
			$('#uprawnieniaSpisDzialowDrzewo').jqxTree('selectItem', null);
			$('#uprawnieniaSpisDzialow').jqxDropDownButton('setContent', 'Wybierz dział:');
			$('#uprawnieniaSpisPracownikow').jqxComboBox('clearSelection');
			$('#uprawnieniaSpisUprawnien').jqxListBox('uncheckAll');
			$('#uprawnieniaSpisUprawnien').jqxListBox('refresh');
		} else {
			pokazKomunikat('blad', komunikaty['uprawnieniaDodanieBlad']);
		}
	});
});
