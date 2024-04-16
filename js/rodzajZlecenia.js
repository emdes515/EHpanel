$(document).ready(function () {
	var url = "php/index.php?modul=rodzajZlecenia&funkcja=lista";
	var source = {
		datatype: "json",
		datafields: [
			{ name: "idRodzajZlecenia", type: "number" },
			{ name: "nazwa", type: "string" },
		],
		url: url,
		addrow: function (rowid, rowdata, position, commit) {
			commit(true);
		},
		deleterow: function (rowid, commit) {
			commit(true);
		},
		updaterow: function (rowid, newdata, commit) {
			commit(true);
		},
	};
	var dataAdapter = new $.jqx.dataAdapter(source);;
	$("#rodzajZleceniaTablica").jqxGrid({
		statusbarheight: 40,
		width: 450,
		height: 400,
		source: dataAdapter,
		sortable: true,
		altrows: true,
		enabletooltips: true,
		editable: true,
		selectionmode: "singlerow",
		editmode: "selectedrow",
		filterable: true,
		localization: getLocalization("pl"),
		columns: [
			{
				text: "ID",
				datafield: "idRodzajZlecenia",
				cellsalign: "left",
				align: "center",
				hidden: true,
			},
			{
				text: "Rodzaj zlecenia",
				datafield: "nazwa",
				cellsalign: "left",
				align: "center",
				filtertype: "input",
			},
		],
		showstatusbar: true,
		renderstatusbar: function (statusbar) {
			var container = $(
				"<div style='overflow: hidden; position: relative; margin: 5px;'></div>"
			);
			var addButton = $(
				"<div style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='css/images/add.png'/><span style='margin-left: 4px; position: relative; top: -3px;'>Dodaj</span></div>"
			);
			var deleteButton = $(
				"<div style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='css/images/close.png'/><span style='margin-left: 4px; position: relative; top: -3px;'>Usuń</span></div>"
			);
			var reloadButton = $(
				"<div style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='css/images/refresh.png'/><span style='margin-left: 4px; position: relative; top: -3px;'>Przeładuj</span></div>"
			);
			container.append(addButton);
			container.append(deleteButton);
			container.append(reloadButton);
			statusbar.append(container);
			addButton.jqxButton({ width: 85, height: 20 });
			deleteButton.jqxButton({ width: 85, height: 20 });
			reloadButton.jqxButton({ width: 85, height: 20 });
			addButton.click(function (event) {
				var rows = new Array();
				var row = new Array();
				row["nazwa"] = "";
				rows[0] = row;
				$("#rodzajZleceniaTablica").jqxGrid("addrow", null, rows);
				$("#rodzajZleceniaTablica").scrollTop(0);
			});
			deleteButton.click(function (event) {
				$("#rodzajZlecenia_uwaga").jqxWindow("open");
				$('#cancel').on('click', () => {
					$('#zleceniaWewnetrzneTypyWnioskow_uwaga').jqxWindow('close');
					return;
					});
					$('#ok').on('click', () => {
						var selectedrowindex = $("#rodzajZleceniaTablica").jqxGrid(
							"getselectedrowindex"
						);
						var rowscount = $("#rodzajZleceniaTablica").jqxGrid(
							"getdatainformation"
						).rowscount;
						if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
							var dane = {};
							var rowid = $("#rodzajZleceniaTablica").jqxGrid("getrowid", selectedrowindex);
							var idRodzajZlecenia = $("#rodzajZleceniaTablica").jqxGrid(
								"getcellvalue",
								rowid,
								"idRodzajZlecenia"
							);
							(dane["modul"] = "rodzajZlecenia"),
								(dane["funkcja"] = "usun"),
								(dane["idRodzajZlecenia"] = idRodzajZlecenia);
							daneJSON = wczytajDane("php/index.php", dane);
							var ilosc = daneJSON["ilosc"];
							if (ilosc > 0) {
								pokazKomunikat("ok", komunikaty["rodzajZleceniaUsuniecie"]);
								var commit = $("#rodzajZleceniaTablica").jqxGrid("deleterow", rowid);
							} else {
								$("#rodzajZleceniaTablica").jqxGrid({ source: dataAdapter });
								pokazKomunikat("blad", komunikaty["rodzajZleceniaUsuniecieBlad"]);
							}
						}
					});
				});
			reloadButton.click(function (event) {
				$("#rodzajZleceniaTablica").jqxGrid({ source: dataAdapter });
			});
		},
		theme: theme,
	});
	$("#rodzajZleceniaTablica").on("cellendedit", function (event) {
		var dane = {};
		var args = event.args;
		if (args.datafield != "idRodzajZlecenia") {
			var idRodzajZlecenia = args.row.idRodzajZlecenia;
			if (idRodzajZlecenia == undefined) idRodzajZlecenia = 0;
			(dane["modul"] = "rodzajZlecenia"),
				(dane["funkcja"] = "zapisz"),
				(dane["idRodzajZlecenia"] = idRodzajZlecenia);
			dane["nazwa"] = args.row.nazwa;
			daneJSON = wczytajDane("php/index.php", dane);
			var id = daneJSON["id"];
			if (id > 0) {
				$("#rodzajZleceniaTablica").jqxGrid(
					"setcellvalue",
					args.rowindex,
					"idRodzajZlecenia",
					id
				);
				pokazKomunikat("ok", komunikaty["rodzajZleceniaDodanie"]);
			} else {
				$("#rodzajZleceniaTablica").jqxGrid({ source: dataAdapter });
				pokazKomunikat("blad", komunikaty["rodzajZleceniaDodanieBlad"]);
			}
		}
	});
	$("#rodzajZlecenia_uwaga").jqxWindow({
		position: { x: 'calc(50% - 200px)', y: 'calc(50% - 100px)' },
		resizable: false,
		isModal: true,
		modalOpacity: 0.3,
		autoOpen: false,
		animationType: "slide",
		draggable: false,
		showCloseButton: false,
		width: "400px",
		height: "200px",
		theme: theme,
		okButton: $("#ok"),
		cancelButton: $("#cancel"),
		initContent: function () {
			$("#ok").jqxButton({ width: "150px" });
			$("#cancel").jqxButton({ width: "150px" });
			$("#ok").focus();
		},
	});
});
