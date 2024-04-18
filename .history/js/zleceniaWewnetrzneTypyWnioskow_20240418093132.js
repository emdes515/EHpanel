$(document).ready(function () {
	var urlzleceniaWewnetrzneTypyWnioskowLista =
		'php/index.php?modul=zleceniaWewnetrzneTypyWnioskow&funkcja=lista';
	var urlzleceniaWewnetrzneDzialyZglaszajaceLista =
		'php/index.php?modul=zleceniaWewnetrzneDzialyZglaszajace&funkcja=lista';

	$('#oknoZleceniaWewnetrzneTypyWnioskowEdycja').jqxWindow({
		width: 300,
		height: 470,
		maxWidth: 1000,
		maxHeight: 1000,
		resizable: false,
		isModal: true,
		autoOpen: false,
		modalOpacity: 0.6,
		position: { x: 'calc(50% - 300px / 2)', y: 'calc(50% - 470px / 2)' },
		theme: theme,
	});
	$('#zleceniaWewnetrzneTypyWnioskowNazwa').jqxInput({
		width: 200,
		height: 20,
		theme: theme,
	});
	$('#zleceniaWewnetrzneDzialyZglaszajace').jqxListBox({
		width: 200,
		height: 350,
		checkboxes: true,
	});
	var sourceZleceniaWewnetrzneDzialyZglaszajace = {
		datatype: 'json',
		datafields: [{ name: 'id' }, { name: 'nazwa' }],
		id: 'id',
		url: urlzleceniaWewnetrzneDzialyZglaszajaceLista,
	};
	var dataAdapterZleceniaWewnetrzneDzialyZglaszajace = new $.jqx.dataAdapter(
		sourceZleceniaWewnetrzneDzialyZglaszajace
	);
	$('#zleceniaWewnetrzneDzialyZglaszajace').jqxListBox({
		source: dataAdapterZleceniaWewnetrzneDzialyZglaszajace,
		displayMember: 'nazwa',
		valueMember: 'id',
	});

	$('#zleceniaWewnetrzneTypyWnioskowZapisz').jqxButton({
		width: 150,
		theme: theme,
	});

	$('#zleceniaWewnetrzneTypyWnioskow_uwaga').jqxWindow({
		resizable: false,
		isModal: true,
		modalOpacity: 0.3,
		autoOpen: false,
		animationType: 'slide',
		draggable: false,
		showCloseButton: false,
		width: 400,
		height: 200,
		position: { x: 'calc(50% - 400px / 2)', y: 'calc(50% - 200px / 2)' },
		theme: theme,
		okButton: $('#zleceniaWewnetrzneTypyWnioskow_ok'),
		cancelButton: $('#zleceniaWewnetrzneTypyWnioskow_cancel'),
		initContent: function () {
			$('#zleceniaWewnetrzneTypyWnioskow_ok').jqxButton({ width: '150px' });
			$('#zleceniaWewnetrzneTypyWnioskow_cancel').jqxButton({ width: '150px' });
			$('#zleceniaWewnetrzneTypyWnioskow_ok').focus();
		},
	});

	$('#zleceniaWewnetrzneTypyWnioskowZapisz')
		.off('click')
		.on('click', function () {
			if (
				$('#oknoZleceniaWewnetrzneTypyWnioskowEdycjaFormularz').jqxValidator('validate') == true
			) {
				var dane = {};
				dane['id'] = $('#zleceniaWewnetrzneTypyWnioskowId').val();
				dane['nazwa'] = $('#zleceniaWewnetrzneTypyWnioskowNazwa').val();
				dane['modul'] = 'zleceniaWewnetrzneTypyWnioskow';
				dane['dzialyZglaszajace'] = {};
				var items = $('#zleceniaWewnetrzneDzialyZglaszajace').jqxListBox('getCheckedItems');
				for (i = 0; i < items.length; i++) {
					dane['dzialyZglaszajace'][i] = items[i].value;
				}
				dane['funkcja'] = 'zapisz';
				daneJSON = wczytajDane('php/index.php', dane);
				var id = daneJSON['id'];
				if (id == -1) {
					pokazKomunikat('blad', komunikaty['zleceniaWewnetrzneTypyWnioskowIstnieje']);
				} else if (id > 0) {
					pokazKomunikat('ok', komunikaty['zleceniaWewnetrzneTypyWnioskowZapisanie']);
					$('#oknoZleceniaWewnetrzneTypyWnioskowEdycja').jqxWindow('close');
					var dataAdapterZleceniaWewnetrzneTypyWnioskow = new $.jqx.dataAdapter(
						sourceZleceniaWewnetrzneTypyWnioskow
					);
					$('#zleceniaWewnetrzneTypyWnioskowTablica').jqxGrid({
						source: dataAdapterZleceniaWewnetrzneTypyWnioskow,
					});
				} else {
					pokazKomunikat('blad', komunikaty['zleceniaWewnetrzneTypyWnioskowBlad']);
				}
				$('#zleceniaWewnetrzneTypyWnioskow_editButton').jqxButton({ disabled: true });
				$('#zleceniaWewnetrzneTypyWnioskow_deleteButton').jqxButton({ disabled: true });
			}
		});
	var sourceZleceniaWewnetrzneTypyWnioskow = {
		datatype: 'json',
		datafields: [{ name: 'id' }, { name: 'nazwa' }],
		url: urlzleceniaWewnetrzneTypyWnioskowLista,
		async: false,
	};
	var dataAdapterZleceniaWewnetrzneTypyWnioskow = new $.jqx.dataAdapter(
		sourceZleceniaWewnetrzneTypyWnioskow
	);
	$('#zleceniaWewnetrzneTypyWnioskowTablica').jqxGrid({
		width: '100%',
		height: 'calc(100% - 50px)',
		source: dataAdapterZleceniaWewnetrzneTypyWnioskow,
		//pageable: true,
		sortable: false,
		//altrows: true,
		enabletooltips: true,
		selectionmode: 'singlerow',
		filterable: true,
		showfilterrow: false,
		editable: false,
		localization: getLocalization('pl'),
		columns: [
			{ datafield: 'id', hidden: true },
			{
				text: 'Nazwa',
				datafield: 'nazwa',
				cellsalign: 'left',
				align: 'center',
				filtertype: 'textbox',
				width: '100%',
				editable: false,
			},
		],
		showstatusbar: true,
		statusbarheight: 50,
		renderstatusbar: function (statusbar) {
			var container = $(
				'<div style="display: flex; justify-content: space-evenly; align-items: center; margin-top: 7px"></div>'
			);
			var addButton = $(
				"<button style='display: block' id='zleceniaWewnetrzneTypyWnioskow_addButton'><div style='display: flex; justify-content: center'><img src='css/images/add.png' /><span style='margin-left: 5px;'>Dodaj</span></div></button>"
			);
			var editButton = $(
				"<button style='display: block' id='zleceniaWewnetrzneTypyWnioskow_editButton'><div style='display: flex; justify-content: center'><img src='css/images/edit.png' /><span style='margin-left: 5px;'>Edytuj</span></div></button>"
			);
			var deleteButton = $(
				"<button style='display: block' id='zleceniaWewnetrzneTypyWnioskow_deleteButton'><div style='display: flex; justify-content: center'><img src='css/images/close.png' /><span style='margin-left: 5px;'>Usuń</span></div></button>"
			);
			container.append(addButton);
			container.append(editButton);
			container.append(deleteButton);
			statusbar.append(container);
			$('#zleceniaWewnetrzneTypyWnioskow_addButton').jqxButton({
				width: '25%',
				height: 40,
				disabled: false,
				theme: theme,
			});
			$('#zleceniaWewnetrzneTypyWnioskow_editButton').jqxButton({
				width: '25%',
				height: 40,
				disabled: true,
				theme: theme,
			});
			$('#zleceniaWewnetrzneTypyWnioskow_deleteButton').jqxButton({
				width: '25%',
				height: 40,
				disabled: true,
				theme: theme,
			});
			$('#zleceniaWewnetrzneTypyWnioskow_addButton').on('click', function () {
				$('#zleceniaWewnetrzneTypyWnioskowId').val(0);
				$('#zleceniaWewnetrzneTypyWnioskowNazwa').val('');
				$('#zleceniaWewnetrzneDzialyZglaszajace').jqxListBox('uncheckAll');
				$('#oknoZleceniaWewnetrzneTypyWnioskowEdycja').jqxWindow('open');
			});
			$('#zleceniaWewnetrzneTypyWnioskow_editButton').on('click', function () {
				var indeks = $('#zleceniaWewnetrzneTypyWnioskowTablica').jqxGrid('getselectedrowindex');
				var rowid = $('#zleceniaWewnetrzneTypyWnioskowTablica').jqxGrid('getrowid', indeks);
				var rekord = $('#zleceniaWewnetrzneTypyWnioskowTablica').jqxGrid('getrowdatabyid', rowid);
				var dane = {};
				(dane['modul'] = 'zleceniaWewnetrzneTypyWnioskow'),
					(dane['funkcja'] = 'daneFormularz'),
					(dane['id'] = rekord.id);
				daneJSON = wczytajDane('php/index.php', dane);
				$('#zleceniaWewnetrzneTypyWnioskowId').val(daneJSON['id']);
				$('#zleceniaWewnetrzneTypyWnioskowNazwa').val(daneJSON['nazwa']);
				$('#zleceniaWewnetrzneDzialyZglaszajace').jqxListBox('uncheckAll');
				for (var i = 0; i < daneJSON['dzialyZglaszajace'].length; i++) {
					var dzialZglaszajacy = daneJSON['dzialyZglaszajace'][i];
					if (dzialZglaszajacy.wybranyDzialZglaszajacy > 0) {
						$('#zleceniaWewnetrzneDzialyZglaszajace').jqxListBox('checkItem', dzialZglaszajacy.id);
					}
				}
				$('#oknoZleceniaWewnetrzneTypyWnioskowEdycja').jqxWindow('open');
			});
			$('#zleceniaWewnetrzneTypyWnioskow_deleteButton').on('click', function () {
				$('#zleceniaWewnetrzneTypyWnioskow_uwaga').jqxWindow('open');

				$('#zleceniaWewnetrzneTypyWnioskow_cancel').on('click', () => {
					$('#zleceniaWewnetrzneTypyWnioskow_uwaga').jqxWindow('close');
					return;
				});

				$('#zleceniaWewnetrzneTypyWnioskow_ok').on('click', () => {
					console.log('ok');
					var dane = {};
					var indeks = $('#zleceniaWewnetrzneTypyWnioskowTablica').jqxGrid('getselectedrowindex');
					var rowid = $('#zleceniaWewnetrzneTypyWnioskowTablica').jqxGrid('getrowid', indeks);
					var rekord = $('#zleceniaWewnetrzneTypyWnioskowTablica').jqxGrid('getrowdatabyid', rowid);
					dane['id'] = rekord.id;
					dane['modul'] = 'zleceniaWewnetrzneTypyWnioskow';
					dane['funkcja'] = 'usun';
					daneJSON = wczytajDane('php/index.php', dane);
					var id = daneJSON['wynik'];
					if (id > 0) {
						pokazKomunikat('ok', komunikaty['zleceniaWewnetrzneTypyWnioskowUsuniecie']);
						var dataAdapterZleceniaWewnetrzneDzialy = new $.jqx.dataAdapter(
							sourceZleceniaWewnetrzneTypyWnioskow
						);
						$('#zleceniaWewnetrzneTypyWnioskowTablica').jqxGrid({
							source: dataAdapterZleceniaWewnetrzneTypyWnioskow,
						});

						//					$('#zleceniaWewnetrzneTypyWnioskowTablica').jqxGrid('deleterow', rowid);
					} else {
						pokazKomunikat('blad', komunikaty['zleceniaWewnetrzneTypyWnioskowUsuniecieBlad']);
					}
					$('#zleceniaWewnetrzneTypyWnioskow_editButton').jqxButton({ disabled: true });
					$('#zleceniaWewnetrzneTypyWnioskow_deleteButton').jqxButton({ disabled: true });
				});
			});
		},
		theme: theme,
	});
	$('#zleceniaWewnetrzneTypyWnioskowTablica').on('cellclick', function (event) {
		$('#zleceniaWewnetrzneTypyWnioskow_editButton').jqxButton({ disabled: false });
		$('#zleceniaWewnetrzneTypyWnioskow_deleteButton').jqxButton({ disabled: false });
	});

	$('#oknoZleceniaWewnetrzneTypyWnioskowEdycjaFormularz').jqxValidator({
		rules: [
			{
				input: '#zleceniaWewnetrzneTypyWnioskowNazwa',
				message: 'Wpisz nazwę działu',
				action: 'blur',
				rule: function () {
					var wartosc = $('#zleceniaWewnetrzneTypyWnioskowNazwa').val();
					if (wartosc != '') {
						return true;
					} else return false;
				},
			},
		],
	});

	// function createElements() {}
	// function displayEvent(event) {
	// 	if (event.type === 'close') {
	// 		if (event.args.dialogResult.OK) {
	// 			var dane = {};
	// 			var indeks = $('#zleceniaWewnetrzneRynkiTablica').jqxGrid('getselectedrowindex');
	// 			var rowid = $('#zleceniaWewnetrzneRynkiTablica').jqxGrid('getrowid', indeks);
	// 			var rekord = $('#zleceniaWewnetrzneRynkiTablica').jqxGrid('getrowdatabyid', rowid);
	// 			dane['id'] = rekord.id;
	// 			dane['modul'] = 'zleceniaWewnetrzneRynki';
	// 			dane['funkcja'] = 'usun';
	// 			daneJSON = wczytajDane('php/index.php', dane);
	// 			var id = daneJSON['wynik'];
	// 			if (id > 0) {
	// 				pokazKomunikat('ok', komunikaty['zleceniaWewnetrzneRynkiUsuniecie']);
	// 				var dataAdapterZleceniaWewnetrzneDzialy = new $.jqx.dataAdapter(
	// 					sourceZleceniaWewnetrzneRynki
	// 				);
	// 				$('#zleceniaWewnetrzneRynkiTablica').jqxGrid({
	// 					source: dataAdapterZleceniaWewnetrzneRynki,
	// 				});
	// 				$('#zleceniaWewnetrzneRynkiTablica').jqxGrid('deleterow', rowid);
	// 			} else {
	// 				pokazKomunikat('blad', komunikaty['zleceniaWewnetrzneRynkiUsuniecieBlad']);
	// 			}
	// 			$('#zleceniaWewnetrzneRynki_editButton').jqxButton({ disabled: true });
	// 			$('#zleceniaWewnetrzneRynki_deleteButton').jqxButton({ disabled: true });
	// 		}
	// 	}
	// }

	// function addEventListeners() {
	// 	$('#oknoZleceniaWewnetrzneTypyWnioskowUwaga').on('close', function (event) {
	// 		displayEvent(event);
	// 	});
	// 	$('#oknoZleceniaWewnetrzneTypyWnioskowUwaga').on('open', function (event) {
	// 		displayEvent(event);
	// 	});
	// }

	// $('#jqxWidget').css('visibility', 'visible');
});
/*function zlecenia_wczytajUprawnienia()
{
	if (uprawnienia.zlecenia_dodaj)
		$('#zlecenia_addButton').jqxButton({ disabled: false});
	else
		$('#zlecenia_addButton').jqxButton({ disabled: true});
	if (uprawnienia.zlecenia_edytuj)
		$('#zlecenia_editButton').jqxButton({ disabled: false});
	else
		$('#zlecenia_editButton').jqxButton({ disabled: true});
	if (uprawnienia.zlecenia_usun)
		$('#zlecenia_deleteButton').jqxButton({ disabled: false});
	else
		$('#zlecenia_deleteButton').jqxButton({ disabled: true});
}
*/
