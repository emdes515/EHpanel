$(document).ready(function () {
	var urlzleceniaWewnetrzneRynkiLista = 'php/index.php?modul=zleceniaWewnetrzneRynki&funkcja=lista';
	$('#oknoZleceniaWewnetrzneRynkiEdycja').jqxWindow({
		width: 375,
		height: 200,
		maxWidth: 1000,
		maxHeight: 1000,
		resizable: false,
		draggable: false,
		isModal: true,
		autoOpen: false,
		showCloseButton: false,
		modalOpacity: 0.6,
		position: { x: 'calc(50% - 375px / 2)', y: 'calc(50% - 200px / 2)' },
		theme: theme,
	});
	$('#zleceniaWewnetrzneRynkiNazwa').jqxInput({
		width: 250,
		height: 25,
		theme: theme,
	});
	$('#zleceniaWewnetrzneRynkiZapisz').jqxButton({
		width: 60,
		theme: theme,
	});
	$('#zleceniaWewnetrzneRynkiZapisz')
		.off('click')
		.on('click', function () {
			if ($('#oknoZleceniaWewnetrzneRynkiEdycjaFormularz').jqxValidator('validate') == true) {
				var dane = {};
				dane['id'] = $('#zleceniaWewnetrzneRynkiId').val();
				dane['nazwa'] = $('#zleceniaWewnetrzneRynkiNazwa').val();
				dane['modul'] = 'zleceniaWewnetrzneRynki';
				dane['funkcja'] = 'zapisz';
				daneJSON = wczytajDane('php/index.php', dane);
				var id = daneJSON['id'];
				if (id == -1) {
					pokazKomunikat('blad', komunikaty['zleceniaWewnetrzneRynkiIstnieje']);
				} else if (id > 0) {
					pokazKomunikat('ok', komunikaty['zleceniaWewnetrzneRynkiZapisanie']);
					$('#oknoZleceniaWewnetrzneRynkiEdycja').jqxWindow('close');
					var dataAdapterZleceniaWewnetrzneRynki = new $.jqx.dataAdapter(
						sourceZleceniaWewnetrzneRynki
					);
					$('#zleceniaWewnetrzneRynkiTablica').jqxGrid({
						source: dataAdapterZleceniaWewnetrzneRynki,
					});
				} else {
					pokazKomunikat('blad', komunikaty['zleceniaWewnetrzneRynkiBlad']);
				}
				$('#zleceniaWewnetrzneRynki_editButton').jqxButton({ disabled: true });
				$('#zleceniaWewnetrzneRynki_deleteButton').jqxButton({ disabled: true });
			}
		});
	var sourceZleceniaWewnetrzneRynki = {
		datatype: 'json',
		datafields: [{ name: 'id' }, { name: 'nazwa' }],
		url: urlzleceniaWewnetrzneRynkiLista,
		async: false,
	};
	var dataAdapterZleceniaWewnetrzneRynki = new $.jqx.dataAdapter(sourceZleceniaWewnetrzneRynki);
	$('#zleceniaWewnetrzneRynkiTablica').jqxGrid({
		width: '100%',
		height: '100%',
		source: dataAdapterZleceniaWewnetrzneRynki,
		sortable: false,
		enabletooltips: true,
		selectionmode: 'singlerow',
		filterable: true,
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
		statusbarheight: 50,
		renderstatusbar: function (statusbar) {
			var container = $(
				'<div style="display: flex; justify-content: space-evenly; align-items: center; margin-top: 7px"></div>'
			);
			var addButton = $(
				"<button style='display: block' id='zleceniaWewnetrzneRynki_addButton'><div style='display: flex; justify-content: center'><img src='css/images/add.png' /><span style='margin-left: 5px;'>Dodaj</span></div></button>"
			);
			var editButton = $(
				"<button style='display: block' id='zleceniaWewnetrzneRynki_editButton'><div style='display: flex; justify-content: center'><img src='css/images/edit.png' /><span style='margin-left: 5px;'>Edytuj</span></div></button>"
			);
			var deleteButton = $(
				"<button style='display: block' id='zleceniaWewnetrzneRynki_deleteButton'><div style='display: flex; justify-content: center'><img src='css/images/close.png' /><span style='margin-left: 5px;'>Usuń</span></div></button>"
			);
			container.append(addButton);
			container.append(editButton);
			container.append(deleteButton);
			statusbar.append(container);
			$('#zleceniaWewnetrzneRynki_addButton').jqxButton({
				width: '25%',
				height: 40,
				disabled: false,
				theme: theme,
			});
			$('#zleceniaWewnetrzneRynki_editButton').jqxButton({
				width: '25%',
				height: 40,
				disabled: true,
				theme: theme,
			});
			$('#zleceniaWewnetrzneRynki_deleteButton').jqxButton({
				width: '25%',
				height: 40,
				disabled: true,
				theme: theme,
			});
			$('#zleceniaWewnetrzneRynki_addButton').on('click', function () {
				$('#zleceniaWewnetrzneRynkiId').val(0);
				$('#zleceniaWewnetrzneRynkiNazwa').val('');
				$('#oknoZleceniaWewnetrzneRynkiEdycja').jqxWindow('open');
			});
			$('#zleceniaWewnetrzneRynki_editButton').on('click', function () {
				var indeks = $('#zleceniaWewnetrzneRynkiTablica').jqxGrid('getselectedrowindex');
				var rowid = $('#zleceniaWewnetrzneRynkiTablica').jqxGrid('getrowid', indeks);
				var rekord = $('#zleceniaWewnetrzneRynkiTablica').jqxGrid('getrowdatabyid', rowid);
				var dane = {};
				(dane['modul'] = 'zleceniaWewnetrzneRynki'),
					(dane['funkcja'] = 'daneFormularz'),
					(dane['id'] = rekord.id);
				daneJSON = wczytajDane('php/index.php', dane);
				$('#zleceniaWewnetrzneRynkiId').val(daneJSON['id']);
				$('#zleceniaWewnetrzneRynkiNazwa').val(daneJSON['nazwa']);
				$('#oknoZleceniaWewnetrzneRynkiEdycja').jqxWindow('open');
			});
			$('#zleceniaWewnetrzneRynki_deleteButton').on('click', function () {
				$('#zleceniaWewnetrzneRynki_uwaga').jqxWindow('open');
				$('#zleceniaWewnetrzneRynki_cancel').on('click', () => {
					$('#zleceniaWewnetrzneRynki_uwaga').jqxWindow('close');
					return;
				});

				$('#zleceniaWewnetrzneRynki_ok').on('click', () => {
					var dane = {};
					var indeks = $('#zleceniaWewnetrzneRynkiTablica').jqxGrid('getselectedrowindex');
					var rowid = $('#zleceniaWewnetrzneRynkiTablica').jqxGrid('getrowid', indeks);
					var rekord = $('#zleceniaWewnetrzneRynkiTablica').jqxGrid('getrowdatabyid', rowid);
					dane['id'] = rekord.id;
					dane['modul'] = 'zleceniaWewnetrzneRynki';
					dane['funkcja'] = 'usun';
					daneJSON = wczytajDane('php/index.php', dane);
					var id = daneJSON['wynik'];
					if (id > 0) {
						pokazKomunikat('ok', komunikaty['zleceniaWewnetrzneRynkiUsuniecie']);
						var dataAdapterZleceniaWewnetrzneDzialy = new $.jqx.dataAdapter(
							sourceZleceniaWewnetrzneRynki
						);
						$('#zleceniaWewnetrzneRynkiTablica').jqxGrid({
							source: dataAdapterZleceniaWewnetrzneRynki,
						});
						$('#zleceniaWewnetrzneRynkiTablica').jqxGrid('deleterow', rowid);
					} else {
						pokazKomunikat('blad', komunikaty['zleceniaWewnetrzneRynkiUsuniecieBlad']);
					}
					$('#zleceniaWewnetrzneRynki_editButton').jqxButton({ disabled: true });
					$('#zleceniaWewnetrzneRynki_deleteButton').jqxButton({ disabled: true });
				});
			});
		},
		theme: theme,
	});
	$('#zleceniaWewnetrzneRynkiTablica').on('cellclick', function (event) {
		$('#zleceniaWewnetrzneRynki_editButton').jqxButton({ disabled: false });
		$('#zleceniaWewnetrzneRynki_deleteButton').jqxButton({ disabled: false });
	});
	$('#oknoZleceniaWewnetrzneRynkiEdycjaFormularz').jqxValidator({
		rules: [
			{
				input: '#zleceniaWewnetrzneRynkiNazwa',
				message: 'Wpisz nazwę działu',
				action: 'blur',
				rule: function () {
					var wartosc = $('#zleceniaWewnetrzneRynkiNazwa').val();
					if (wartosc != '') {
						return true;
					} else return false;
				},
			},
		],
	});
	$('#zleceniaWewnetrzneRynki_uwaga').jqxWindow({
		position: { x: 'calc(50% - 200px)', y: 'calc(50% - 100px)' },
		resizable: false,
		isModal: true,
		modalOpacity: 0.3,
		autoOpen: false,
		animationType: 'slide',
		draggable: false,
		showCloseButton: false,
		width: '400px',
		height: '200px',
		theme: theme,
		okButton: $('#zleceniaWewnetrzneRynki_ok'),
		cancelButton: $('#zleceniaWewnetrzneRynki_cancel'),
		initContent: function () {
			$('#zleceniaWewnetrzneRynki_ok').jqxButton({ width: '150px' });
			$('#zleceniaWewnetrzneRynki_cancel').jqxButton({ width: '150px' });
			$('#ok').focus();
		},
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
