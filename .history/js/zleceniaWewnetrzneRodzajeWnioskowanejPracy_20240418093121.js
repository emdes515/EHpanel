$(document).ready(function () {
	var urlzleceniaWewnetrzneRodzajeWnioskowanejPracyLista =
		'php/index.php?modul=zleceniaWewnetrzneRodzajeWnioskowanejPracy&funkcja=lista';
	$('#oknoZleceniaWewnetrzneRodzajeWnioskowanejPracyEdycja').jqxWindow({
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
	$('#zleceniaWewnetrzneRodzajeWnioskowanejPracyNazwa').jqxInput({
		width: 250,
		height: 25,
		theme: theme,
	});
	$('#zleceniaWewnetrzneRodzajeWnioskowanejPracyZapisz').jqxButton({
		width: 60,
		theme: theme,
	});
	$('#zleceniaWewnetrzneRodzajeWnioskowanejPracyZapisz')
		.off('click')
		.on('click', function () {
			if (
				$('#oknoZleceniaWewnetrzneRodzajeWnioskowanejPracyEdycjaFormularz').jqxValidator(
					'validate'
				) == true
			) {
				var dane = {};
				dane['id'] = $('#zleceniaWewnetrzneRodzajeWnioskowanejPracyId').val();
				dane['nazwa'] = $('#zleceniaWewnetrzneRodzajeWnioskowanejPracyNazwa').val();
				dane['modul'] = 'zleceniaWewnetrzneRodzajeWnioskowanejPracy';
				dane['funkcja'] = 'zapisz';
				daneJSON = wczytajDane('php/index.php', dane);
				var id = daneJSON['id'];
				if (id == -1) {
					pokazKomunikat('blad', komunikaty['zleceniaWewnetrzneRodzajeWnioskowanejPracyIstnieje']);
				} else if (id > 0) {
					pokazKomunikat('ok', komunikaty['zleceniaWewnetrzneRodzajeWnioskowanejPracyZapisanie']);
					$('#oknoZleceniaWewnetrzneRodzajeWnioskowanejPracyEdycja').jqxWindow('close');
					var dataAdapterZleceniaWewnetrzneRodzajeWnioskowanejPracy = new $.jqx.dataAdapter(
						sourceZleceniaWewnetrzneRodzajeWnioskowanejPracy
					);
					$('#zleceniaWewnetrzneRodzajeWnioskowanejPracyTablica').jqxGrid({
						source: dataAdapterZleceniaWewnetrzneRodzajeWnioskowanejPracy,
					});
				} else {
					pokazKomunikat('blad', komunikaty['zleceniaWewnetrzneRodzajeWnioskowanejPracyBlad']);
				}
				$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_editButton').jqxButton({
					disabled: true,
				});
				$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_deleteButton').jqxButton({
					disabled: true,
				});
			}
		});
	var sourceZleceniaWewnetrzneRodzajeWnioskowanejPracy = {
		datatype: 'json',
		datafields: [{ name: 'id' }, { name: 'nazwa' }],
		url: urlzleceniaWewnetrzneRodzajeWnioskowanejPracyLista,
		async: false,
	};
	var dataAdapterZleceniaWewnetrzneRodzajeWnioskowanejPracy = new $.jqx.dataAdapter(
		sourceZleceniaWewnetrzneRodzajeWnioskowanejPracy
	);
	$('#zleceniaWewnetrzneRodzajeWnioskowanejPracyTablica').jqxGrid({
		statusbarheight: 50,
		width: '100%',
		height: 'calc(100% - 50px)',
		source: dataAdapterZleceniaWewnetrzneRodzajeWnioskowanejPracy,
		sortable: false,
		enabletooltips: true,
		selectionmode: 'singlerow',
		filterable: false,
		editable: false,
		showfilterrow: false,
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
				"<button style='display: block' id='zleceniaWewnetrzneRodzajeWnioskowanejPracy_addButton'><div style='display: flex; justify-content: center'><img src='css/images/add.png' /><span style='margin-left: 5px;'>Dodaj</span></div></button>"
			);
			var editButton = $(
				"<button style='display: block' id='zleceniaWewnetrzneRodzajeWnioskowanejPracy_editButton'><div style='display: flex; justify-content: center'><img src='css/images/edit.png' /><span style='margin-left: 5px;'>Edytuj</span></div></button>"
			);
			var deleteButton = $(
				"<button style='display: block' id='zleceniaWewnetrzneRodzajeWnioskowanejPracy_deleteButton'><div style='display: flex; justify-content: center'><img src='css/images/close.png' /><span style='margin-left: 5px;'>Usuń</span></div></button>"
			);
			container.append(addButton);
			container.append(editButton);
			container.append(deleteButton);
			statusbar.append(container);
			$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_addButton').jqxButton({
				width: '25%',
				height: 40,
				disabled: false,
				theme: theme,
			});
			$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_editButton').jqxButton({
				width: '25%',
				height: 40,
				disabled: true,
				theme: theme,
			});
			$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_deleteButton').jqxButton({
				width: '25%',
				height: 40,
				disabled: true,
				theme: theme,
			});
			$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_addButton').on('click', function () {
				$('#zleceniaWewnetrzneRodzajeWnioskowanejPracyId').val(0);
				$('#zleceniaWewnetrzneRodzajeWnioskowanejPracyNazwa').val('');
				$('#oknoZleceniaWewnetrzneRodzajeWnioskowanejPracyEdycja').jqxWindow('open');
			});
			$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_editButton').on('click', function () {
				var indeks = $('#zleceniaWewnetrzneRodzajeWnioskowanejPracyTablica').jqxGrid(
					'getselectedrowindex'
				);
				var rowid = $('#zleceniaWewnetrzneRodzajeWnioskowanejPracyTablica').jqxGrid(
					'getrowid',
					indeks
				);
				var rekord = $('#zleceniaWewnetrzneRodzajeWnioskowanejPracyTablica').jqxGrid(
					'getrowdatabyid',
					rowid
				);
				var dane = {};
				(dane['modul'] = 'zleceniaWewnetrzneRodzajeWnioskowanejPracy'),
					(dane['funkcja'] = 'daneFormularz'),
					(dane['id'] = rekord.id);
				daneJSON = wczytajDane('php/index.php', dane);
				$('#zleceniaWewnetrzneRodzajeWnioskowanejPracyId').val(daneJSON['id']);
				$('#zleceniaWewnetrzneRodzajeWnioskowanejPracyNazwa').val(daneJSON['nazwa']);
				$('#oknoZleceniaWewnetrzneRodzajeWnioskowanejPracyEdycja').jqxWindow('open');
			});
			$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_deleteButton').on('click', function () {
				$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_uwaga').jqxWindow('open');

				$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_cancel').on('click', () => {
					$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_uwaga').jqxWindow('close');
					return;
				});

				$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_ok').on('click', () => {
					var dane = {};
					var indeks = $('#zleceniaWewnetrzneRodzajeWnioskowanejPracyTablica').jqxGrid(
						'getselectedrowindex'
					);
					var rowid = $('#zleceniaWewnetrzneRodzajeWnioskowanejPracyTablica').jqxGrid(
						'getrowid',
						indeks
					);
					var rekord = $('#zleceniaWewnetrzneRodzajeWnioskowanejPracyTablica').jqxGrid(
						'getrowdatabyid',
						rowid
					);
					dane['id'] = rekord.id;
					dane['modul'] = 'zleceniaWewnetrzneRodzajeWnioskowanejPracy';
					dane['funkcja'] = 'usun';
					daneJSON = wczytajDane('php/index.php', dane);
					var id = daneJSON['wynik'];
					if (id > 0) {
						pokazKomunikat('ok', komunikaty['zleceniaWewnetrzneRodzajeWnioskowanejPracyUsuniecie']);
						var dataAdapterZleceniaWewnetrzneDzialy = new $.jqx.dataAdapter(
							sourceZleceniaWewnetrzneRodzajeWnioskowanejPracy
						);
						$('#zleceniaWewnetrzneRodzajeWnioskowanejPracyTablica').jqxGrid({
							source: dataAdapterZleceniaWewnetrzneRodzajeWnioskowanejPracy,
						});
						//					$('#zleceniaWewnetrzneRodzajeWnioskowanejPracyTablica').jqxGrid('deleterow', rowid);
					} else {
						pokazKomunikat(
							'blad',
							komunikaty['zleceniaWewnetrzneRodzajeWnioskowanejPracyUsuniecieBlad']
						);
					}
					$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_editButton').jqxButton({
						disabled: true,
					});
					$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_deleteButton').jqxButton({
						disabled: true,
					});

					$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_uwaga').jqxWindow('close');
				});
			});
		},
		theme: theme,
	});
	$('#zleceniaWewnetrzneRodzajeWnioskowanejPracyTablica').on('cellclick', function (event) {
		$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_editButton').jqxButton({
			disabled: false,
		});
		$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_deleteButton').jqxButton({
			disabled: false,
		});
	});
	$('#oknoZleceniaWewnetrzneRodzajeWnioskowanejPracyEdycjaFormularz').jqxValidator({
		rules: [
			{
				input: '#zleceniaWewnetrzneRodzajeWnioskowanejPracyNazwa',
				message: 'Wpisz nazwę działu',
				action: 'blur',
				rule: function () {
					var wartosc = $('#zleceniaWewnetrzneRodzajeWnioskowanejPracyNazwa').val();
					if (wartosc != '') {
						return true;
					} else return false;
				},
			},
		],
	});
	$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_uwaga').jqxWindow({
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
		okButton: $('#ok'),
		cancelButton: $('#cancel'),
		initContent: function () {
			$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_ok').jqxButton({ width: '150px' });
			$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_cancel').jqxButton({ width: '150px' });
			$('#zleceniaWewnetrzneRodzajeWnioskowanejPracy_ok').focus();
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
