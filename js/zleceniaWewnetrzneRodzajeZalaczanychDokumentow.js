$(document).ready(function () {
	var urlzleceniaWewnetrzneRodzajeZalaczanychDokumentowLista =
		'php/index.php?modul=zleceniaWewnetrzneRodzajeZalaczanychDokumentow&funkcja=lista';
	$('#oknoZleceniaWewnetrzneRodzajeZalaczanychDokumentowEdycja').jqxWindow({
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
	$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowNazwa').jqxInput({
		width: 250,
		height: 25,
		theme: theme,
	});
	$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowZapisz').jqxButton({
		width: 60,
		theme: theme,
	});
	$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowZapisz')
		.off('click')
		.on('click', function () {
			if (
				$('#oknoZleceniaWewnetrzneRodzajeZalaczanychDokumentowEdycjaFormularz').jqxValidator(
					'validate'
				) == true
			) {
				var dane = {};
				dane['id'] = $('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowId').val();
				dane['nazwa'] = $('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowNazwa').val();
				dane['modul'] = 'zleceniaWewnetrzneRodzajeZalaczanychDokumentow';
				dane['funkcja'] = 'zapisz';
				daneJSON = wczytajDane('php/index.php', dane);
				var id = daneJSON['id'];
				if (id == -1) {
					pokazKomunikat(
						'blad',
						komunikaty['zleceniaWewnetrzneRodzajeZalaczanychDokumentowIstnieje']
					);
				} else if (id > 0) {
					pokazKomunikat(
						'ok',
						komunikaty['zleceniaWewnetrzneRodzajeZalaczanychDokumentowZapisanie']
					);
					$('#oknoZleceniaWewnetrzneRodzajeZalaczanychDokumentowEdycja').jqxWindow('close');
					var dataAdapterZleceniaWewnetrzneRodzajeZalaczanychDokumentow = new $.jqx.dataAdapter(
						sourceZleceniaWewnetrzneRodzajeZalaczanychDokumentow
					);
					$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowTablica').jqxGrid({
						source: dataAdapterZleceniaWewnetrzneRodzajeZalaczanychDokumentow,
					});
				} else {
					pokazKomunikat('blad', komunikaty['zleceniaWewnetrzneRodzajeZalaczanychDokumentowBlad']);
				}
				$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_editButton').jqxButton({
					disabled: true,
				});
				$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_deleteButton').jqxButton({
					disabled: true,
				});
			}
		});
	var sourceZleceniaWewnetrzneRodzajeZalaczanychDokumentow = {
		datatype: 'json',
		datafields: [{ name: 'id' }, { name: 'nazwa' }],
		url: urlzleceniaWewnetrzneRodzajeZalaczanychDokumentowLista,
		async: false,
	};
	var dataAdapterZleceniaWewnetrzneRodzajeZalaczanychDokumentow = new $.jqx.dataAdapter(
		sourceZleceniaWewnetrzneRodzajeZalaczanychDokumentow
	);
	$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowTablica').jqxGrid({
		statusbarheight: 50,
		width: '100%',
		height: '100%',
		source: dataAdapterZleceniaWewnetrzneRodzajeZalaczanychDokumentow,
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
		renderstatusbar: function (statusbar) {
			var container = $(
				'<div style="display: flex; justify-content: space-evenly; align-items: center; margin-top: 7px"></div>'
			);
			var addButton = $(
				"<button style='display: block' id='zleceniaWewnetrzneRodzajeZalaczanychDokumentow_addButton'><div style='display: flex; justify-content: center'><img src='css/images/add.png' /><span style='margin-left: 5px;'>Dodaj</span></div></button>"
			);
			var editButton = $(
				"<button style='display: block' id='zleceniaWewnetrzneRodzajeZalaczanychDokumentow_editButton'><div style='display: flex; justify-content: center'><img src='css/images/edit.png' /><span style='margin-left: 5px;'>Edytuj</span></div></button>"
			);
			var deleteButton = $(
				"<button style='display: block' id='zleceniaWewnetrzneRodzajeZalaczanychDokumentow_deleteButton'><div style='display: flex; justify-content: center'><img src='css/images/close.png' /><span style='margin-left: 5px;'>Usuń</span></div></button>"
			);
			container.append(addButton);
			container.append(editButton);
			container.append(deleteButton);
			statusbar.append(container);
			$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_addButton').jqxButton({
				width: '25%',
				height: 40,
				disabled: false,
				theme: theme,
			});
			$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_editButton').jqxButton({
				width: '25%',
				height: 40,
				disabled: true,
				theme: theme,
			});
			$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_deleteButton').jqxButton({
				width: '25%',
				height: 40,
				disabled: true,
				theme: theme,
			});
			$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_addButton').on('click', function () {
				$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowId').val(0);
				$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowNazwa').val('');
				$('#oknoZleceniaWewnetrzneRodzajeZalaczanychDokumentowEdycja').jqxWindow('open');
			});
			$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_editButton').on('click', function () {
				var indeks = $('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowTablica').jqxGrid(
					'getselectedrowindex'
				);
				var rowid = $('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowTablica').jqxGrid(
					'getrowid',
					indeks
				);
				var rekord = $('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowTablica').jqxGrid(
					'getrowdatabyid',
					rowid
				);
				var dane = {};
				(dane['modul'] = 'zleceniaWewnetrzneRodzajeZalaczanychDokumentow'),
					(dane['funkcja'] = 'daneFormularz'),
					(dane['id'] = rekord.id);
				daneJSON = wczytajDane('php/index.php', dane);
				$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowId').val(daneJSON['id']);
				$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowNazwa').val(daneJSON['nazwa']);
				$('#oknoZleceniaWewnetrzneRodzajeZalaczanychDokumentowEdycja').jqxWindow('open');
			});
			$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_deleteButton').on('click', function () {
				$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_uwaga').jqxWindow('open');
				$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_cancel').on('click', () => {
					$('#zleceniaWewnetrzneTypyWnioskow_uwaga').jqxWindow('close');
					return;
				});

				$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_ok').on('click', () => {
					var dane = {};
					var indeks = $('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowTablica').jqxGrid(
						'getselectedrowindex'
					);
					var rowid = $('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowTablica').jqxGrid(
						'getrowid',
						indeks
					);
					var rekord = $('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowTablica').jqxGrid(
						'getrowdatabyid',
						rowid
					);
					dane['id'] = rekord.id;
					dane['modul'] = 'zleceniaWewnetrzneRodzajeZalaczanychDokumentow';
					dane['funkcja'] = 'usun';
					daneJSON = wczytajDane('php/index.php', dane);
					var id = daneJSON['wynik'];
					if (id > 0) {
						pokazKomunikat(
							'ok',
							komunikaty['zleceniaWewnetrzneRodzajeZalaczanychDokumentowUsuniecie']
						);
						var dataAdapterZleceniaWewnetrzneDzialy = new $.jqx.dataAdapter(
							sourceZleceniaWewnetrzneRodzajeZalaczanychDokumentow
						);
						$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowTablica').jqxGrid({
							source: dataAdapterZleceniaWewnetrzneRodzajeZalaczanychDokumentow,
						});
						//					$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowTablica').jqxGrid('deleterow', rowid);
					} else {
						pokazKomunikat(
							'blad',
							komunikaty['zleceniaWewnetrzneRodzajeZalaczanychDokumentowUsuniecieBlad']
						);
					}
					$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_editButton').jqxButton({
						disabled: true,
					});
					$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_deleteButton').jqxButton({
						disabled: true,
					});
				});
			});
		},
		theme: theme,
	});
	$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowTablica').on('cellclick', function (event) {
		$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_editButton').jqxButton({ disabled: false });
		$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_deleteButton').jqxButton({
			disabled: false,
		});
	});

	$('#oknoZleceniaWewnetrzneRodzajeZalaczanychDokumentowEdycjaFormularz').jqxValidator({
		rules: [
			{
				input: '#zleceniaWewnetrzneRodzajeZalaczanychDokumentowNazwa',
				message: 'Wpisz nazwę działu',
				action: 'blur',
				rule: function () {
					var wartosc = $('#zleceniaWewnetrzneRodzajeZalaczanychDokumentowNazwa').val();
					if (wartosc != '') {
						return true;
					} else return false;
				},
			},
		],
	});
	$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_uwaga').jqxWindow({
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
		okButton: $('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_ok'),
		cancelButton: $('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_cancel'),
		initContent: function () {
			$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_ok').jqxButton({ width: '150px' });
			$('#zleceniaWewnetrzneRodzajeZalaczanychDokumentow_cancel').jqxButton({ width: '150px' });
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
