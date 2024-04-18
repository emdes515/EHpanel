$(document).ready(function () {
	var urlzleceniaWewnetrzneDzialyZglaszajaceLista =
		'php/index.php?modul=zleceniaWewnetrzneDzialyZglaszajace&funkcja=lista';
	var urlzleceniaWewnetrzneTypyWnioskowLista =
		'php/index.php?modul=zleceniaWewnetrzneTypyWnioskow&funkcja=lista';
	var urlZleceniaWewnetrzneDzialyZglaszajacePracownicy =
		'php/index.php?modul=zleceniaWewnetrzneDzialyZglaszajace&funkcja=pracownicy';

	$('#oknoZleceniaWewnetrzneDzialyZglaszajace').on('close', function (event) {
		usunOkno('oknoZleceniaWewnetrzneDzialyZglaszajace');
	});
	$('#oknoZleceniaWewnetrzneDzialyZglaszajaceEdycja').jqxWindow({
		width: 350,
		height: 520,
		maxWidth: 1000,
		maxHeight: 1000,
		resizable: false,
		isModal: true,
		autoOpen: false,
		modalOpacity: 0.6,
		position: { x: 'calc(50% - 350px / 2)', y: 'calc(50% - 520px / 2)' },
		theme: theme,
	});

	$('#zleceniaWewnetrzneDzialyZglaszajace_uwaga').jqxWindow({
		position: { x: 'calc(50% - 200px)', y: 'calc(50% - 100px)' },
		resizable: false,
		isModal: true,
		modalOpacity: 0.3,
		autoOpen: false,
		animationType: 'slide',
		draggable: false,
		showCloseButton: false,
		width: 400,
		height: 200,
		theme: theme,
		okButton: $('#ok'),
		cancelButton: $('#cancel'),
		initContent: function () {
			$('#zleceniaWewnetrzneDzialyZglaszajace_ok').jqxButton({ width: '150px' });
			$('#zleceniaWewnetrzneDzialyZglaszajaces_cancel').jqxButton({ width: '150px' });
			$('#zleceniaWewnetrzneDzialyZglaszajace_ok').focus();
		},
	});

	$('#zleceniaWewnetrzneDzialyZglaszajaceNazwa').jqxInput({
		width: 250,
		height: 20,
		theme: theme,
	});
	var sourceZleceniaWewnetrzneTypyWnioskow = {
		datatype: 'json',
		datafields: [{ name: 'id' }, { name: 'nazwa' }],
		id: 'id',
		url: urlzleceniaWewnetrzneTypyWnioskowLista,
	};
	var dataAdapterZleceniaWewnetrzneTypyWnioskow = new $.jqx.dataAdapter(
		sourceZleceniaWewnetrzneTypyWnioskow
	);
	$('#zleceniaWewnetrzneDzialyZglaszajaceTypyWnioskow').jqxListBox({
		width: '100%',
		height: 200,
		checkboxes: true,
		source: dataAdapterZleceniaWewnetrzneTypyWnioskow,
		displayMember: 'nazwa',
		valueMember: 'id',
	});

	var sourceZleceniaWewnetrzneDzialyZglaszajacePracownicy = {
		datatype: 'json',
		datafields: [{ name: 'id' }, { name: 'nazwiskoImie' }],
		id: 'id',
		url: urlZleceniaWewnetrzneDzialyZglaszajacePracownicy,
	};
	var dataAdapterZleceniaWewnetrzneDzialyZglaszajacePracownicy = new $.jqx.dataAdapter(
		sourceZleceniaWewnetrzneDzialyZglaszajacePracownicy
	);
	$('#zleceniaWewnetrzneDzialyZglaszajacePracownicy').jqxListBox({
		width: '100%',
		height: 200,
		checkboxes: true,
		source: dataAdapterZleceniaWewnetrzneDzialyZglaszajacePracownicy,
		displayMember: 'nazwiskoImie',
		valueMember: 'id',
	});

	$('#zleceniaWewnetrzneDzialyZglaszajaceZapisz').jqxButton({
		width: 100,
		theme: theme,
	});

	$('#zleceniaWewnetrzneDzialyZglaszajaceZapisz')
		.off('click')
		.on('click', function () {
			if (
				$('#oknoZleceniaWewnetrzneDzialyZglaszajaceEdycjaFormularz').jqxValidator('validate') ==
				true
			) {
				var dane = {};
				dane['id'] = $('#zleceniaWewnetrzneDzialyZglaszajaceId').val();
				dane['nazwa'] = $('#zleceniaWewnetrzneDzialyZglaszajaceNazwa').val();
				dane['modul'] = 'zleceniaWewnetrzneDzialyZglaszajace';

				dane['typyWnioskow'] = {};
				var items = $('#zleceniaWewnetrzneDzialyZglaszajaceTypyWnioskow').jqxListBox(
					'getCheckedItems'
				);
				for (i = 0; i < items.length; i++) {
					dane['typyWnioskow'][i] = items[i].value;
				}
				dane['pracownicy'] = {};
				var items = $('#zleceniaWewnetrzneDzialyZglaszajacePracownicy').jqxListBox(
					'getCheckedItems'
				);
				for (i = 0; i < items.length; i++) {
					dane['pracownicy'][i] = items[i].value;
				}

				dane['funkcja'] = 'zapisz';
				daneJSON = wczytajDane('php/index.php', dane);
				var id = daneJSON['id'];
				if (id == -1) {
					pokazKomunikat('blad', komunikaty['zleceniaWewnetrzneDzialyZglaszajaceIstnieje']);
				} else if (id > 0) {
					pokazKomunikat('ok', komunikaty['zleceniaWewnetrzneDzialyZglaszajaceZapisanie']);
					$('#oknoZleceniaWewnetrzneDzialyZglaszajaceEdycja').jqxWindow('close');
					var dataAdapterZleceniaWewnetrzneDzialyZglaszajace = new $.jqx.dataAdapter(
						sourceZleceniaWewnetrzneDzialyZglaszajace
					);
					$('#zleceniaWewnetrzneDzialyZglaszajaceTablica').jqxGrid({
						source: dataAdapterZleceniaWewnetrzneDzialyZglaszajace,
					});
				} else {
					pokazKomunikat('blad', komunikaty['zleceniaWewnetrzneDzialyZglaszajaceBlad']);
				}
				$('#zleceniaWewnetrzneDzialyZglaszajace_editButton').jqxButton({ disabled: true });
				$('#zleceniaWewnetrzneDzialyZglaszajace_deleteButton').jqxButton({ disabled: true });
			}
		});

	var sourceZleceniaWewnetrzneDzialyZglaszajace = {
		datatype: 'json',
		datafields: [{ name: 'id' }, { name: 'nazwa' }],
		url: urlzleceniaWewnetrzneDzialyZglaszajaceLista,
		async: false,
	};
	var dataAdapterZleceniaWewnetrzneDzialyZglaszajace = new $.jqx.dataAdapter(
		sourceZleceniaWewnetrzneDzialyZglaszajace
	);
	$('#zleceniaWewnetrzneDzialyZglaszajaceTablica').jqxGrid({
		width: '100%',
		height: 'calc(100% - 50px)',
		statusbarheight: 50,
		source: dataAdapterZleceniaWewnetrzneDzialyZglaszajace,
		//pageable: true,
		sortable: false,
		//altrows: true,
		enabletooltips: true,
		selectionmode: 'singlerow',
		filterable: fasle,
		showfilterrow: true,
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
		renderstatusbar: function (statusbar) {
			var container = $(
				'<div style="display: flex; justify-content: space-evenly; align-items: center; margin-top: 7px"></div>'
			);
			var addButton = $(
				"<button style='display: block' id='zleceniaWewnetrzneDzialyZglaszajace_addButton'><div style='display: flex; justify-content: center'><img src='css/images/add.png' /><span style='margin-left: 5px;'>Dodaj</span></div></button>"
			);
			var editButton = $(
				"<button style='display: block' id='zleceniaWewnetrzneDzialyZglaszajace_editButton'><div style='display: flex; justify-content: center'><img src='css/images/edit.png' /><span style='margin-left: 5px;'>Edytuj</span></div></button>"
			);
			var deleteButton = $(
				"<button style='display: block' id='zleceniaWewnetrzneDzialyZglaszajace_deleteButton'><div style='display: flex; justify-content: center'><img src='css/images/close.png' /><span style='margin-left: 5px;'>Usuń</span></div></button>"
			);
			container.append(addButton);
			container.append(editButton);
			container.append(deleteButton);
			statusbar.append(container);

			$('#zleceniaWewnetrzneDzialyZglaszajace_addButton').jqxButton({
				width: '25%',
				height: 40,
				disabled: false,
				theme: theme,
			});
			$('#zleceniaWewnetrzneDzialyZglaszajace_editButton').jqxButton({
				width: '25%',
				height: 40,
				disabled: true,
				theme: theme,
			});
			$('#zleceniaWewnetrzneDzialyZglaszajace_deleteButton').jqxButton({
				width: '25%',
				height: 40,
				disabled: true,
				theme: theme,
			});
			$('#zleceniaWewnetrzneDzialyZglaszajace_addButton').on('click', function () {
				$('#zleceniaWewnetrzneDzialyZglaszajaceId').val(0);
				$('#zleceniaWewnetrzneDzialyZglaszajaceNazwa').val('');
				$('#zleceniaWewnetrzneDzialyZglaszajaceTypyWnioskow').jqxListBox('uncheckAll');
				$('#zleceniaWewnetrzneDzialyZglaszajacePracownicy').jqxListBox('uncheckAll');
				$('#oknoZleceniaWewnetrzneDzialyZglaszajaceEdycja').jqxWindow('open');
			});
			$('#zleceniaWewnetrzneDzialyZglaszajace_editButton').on('click', function () {
				var indeks = $('#zleceniaWewnetrzneDzialyZglaszajaceTablica').jqxGrid(
					'getselectedrowindex'
				);
				var rowid = $('#zleceniaWewnetrzneDzialyZglaszajaceTablica').jqxGrid('getrowid', indeks);
				var rekord = $('#zleceniaWewnetrzneDzialyZglaszajaceTablica').jqxGrid(
					'getrowdatabyid',
					rowid
				);

				console.log(rekord);

				var dane = {};
				(dane['modul'] = 'zleceniaWewnetrzneDzialyZglaszajace'),
					(dane['funkcja'] = 'daneFormularz'),
					(dane['id'] = rekord.id);

				console.log(dane);

				daneJSON = wczytajDane('php/index.php', dane);

				console.log(daneJSON);

				$('#zleceniaWewnetrzneDzialyZglaszajaceId').val(daneJSON['id']);
				$('#zleceniaWewnetrzneDzialyZglaszajaceNazwa').val(daneJSON['nazwa']);
				$('#zleceniaWewnetrzneDzialyZglaszajaceTypyWnioskow').jqxListBox('uncheckAll');
				for (var i = 0; i < daneJSON['typyWnioskow'].length; i++) {
					var typWniosku = daneJSON['typyWnioskow'][i];
					if (typWniosku.wybranyTypWniosku > 0) {
						$('#zleceniaWewnetrzneDzialyZglaszajaceTypyWnioskow').jqxListBox(
							'checkItem',
							typWniosku.id
						);
					}
				}
				$('#zleceniaWewnetrzneDzialyZglaszajacePracownicy').jqxListBox('uncheckAll');
				for (var i = 0; i < daneJSON['pracownicy'].length; i++) {
					var pracownik = daneJSON['pracownicy'][i];
					$('#zleceniaWewnetrzneDzialyZglaszajacePracownicy').jqxListBox('checkItem', pracownik.id);
				}
				$('#oknoZleceniaWewnetrzneDzialyZglaszajaceEdycja').jqxWindow('open');
			});
			$('#zleceniaWewnetrzneDzialyZglaszajace_deleteButton').on('click', function () {
				$('#zleceniaWewnetrzneDzialyZglaszajace_uwaga').jqxWindow('open');

				$('#zleceniaWewnetrzneDzialyZglaszajaces_cancel').on('click', () => {
					$('#zleceniaWewnetrzneDzialyZglaszajace_uwaga').jqxWindow('close');
					return;
				});

				$('#zleceniaWewnetrzneDzialyZglaszajace_ok').on('click', () => {
					var dane = {};
					var indeks = $('#zleceniaWewnetrzneDzialyZglaszajaceTablica').jqxGrid(
						'getselectedrowindex'
					);
					var rowid = $('#zleceniaWewnetrzneDzialyZglaszajaceTablica').jqxGrid('getrowid', indeks);
					var rekord = $('#zleceniaWewnetrzneDzialyZglaszajaceTablica').jqxGrid(
						'getrowdatabyid',
						rowid
					);
					dane['id'] = rekord.id;
					dane['modul'] = 'zleceniaWewnetrzneDzialyZglaszajace';
					dane['funkcja'] = 'usun';
					daneJSON = wczytajDane('php/index.php', dane);
					var id = daneJSON['wynik'];
					if (id > 0) {
						pokazKomunikat('ok', komunikaty['zleceniaWewnetrzneDzialyZglaszajaceUsuniecie']);
						var dataAdapterZleceniaWewnetrzneDzialy = new $.jqx.dataAdapter(
							sourceZleceniaWewnetrzneDzialyZglaszajace
						);
						$('#zleceniaWewnetrzneDzialyZglaszajaceTablica').jqxGrid({
							source: dataAdapterZleceniaWewnetrzneDzialyZglaszajace,
						});

						//$('#zleceniaWewnetrzneDzialyZglaszajaceTablica').jqxGrid('deleterow', rowid);
					} else {
						pokazKomunikat('blad', komunikaty['zleceniaWewnetrzneDzialyZglaszajaceUsuniecieBlad']);
					}
					$('#zleceniaWewnetrzneDzialyZglaszajace_editButton').jqxButton({ disabled: true });
					$('#zleceniaWewnetrzneDzialyZglaszajace_deleteButton').jqxButton({ disabled: true });

					$('#zleceniaWewnetrzneDzialyZglaszajace_uwaga').jqxWindow('close');
				});
			});
		},
		theme: theme,
	});
	$('#zleceniaWewnetrzneDzialyZglaszajaceTablica').on('cellclick', function (event) {
		$('#zleceniaWewnetrzneDzialyZglaszajace_editButton').jqxButton({ disabled: false });
		$('#zleceniaWewnetrzneDzialyZglaszajace_deleteButton').jqxButton({ disabled: false });
	});

	$('#oknoZleceniaWewnetrzneDzialyZglaszajaceEdycjaFormularz').jqxValidator({
		rules: [
			{
				input: '#zleceniaWewnetrzneDzialyZglaszajaceNazwa',
				message: 'Wpisz nazwę działu',
				action: 'blur',
				rule: function () {
					var wartosc = $('#zleceniaWewnetrzneDzialyZglaszajaceNazwa').val();
					if (wartosc != '') {
						return true;
					} else return false;
				},
			},
		],
	});
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
