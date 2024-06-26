$(document).ready(function () {
	const pracownicy = ['a', 'b', 'c'];

	const pracownicyNieobecnii_Zdalnie = $('#dashboardObecnoscInput').jqxInput({
		placeHolder: 'Wprowadź dane pracownika',
		height: '100%',
		width: '100%',
		minLength: 1,
		searchMode: 'startswithignorecase',
		source: pracownicy,
	});

	// const url = 'https://api.elgor.com.pl/login';
	// const apikey =
	// 	'f000983f7ccf9d50418948aeb3eef18484fb354824ca383c64823bd7db18c41b82b90434b9ab30e4f310701d749fa158569573b16a13cbd15fd0b853af04ed77';

	// fetch(url, {
	// 	method: 'GET',
	// 	headers: {
	// 		Accept: 'application/json',
	// 		apikey: apikey,
	// 	},
	// })
	// 	.then((response) => response.json())
	// 	.then((data) => console.log(data));

	var url = './sampledata/products.xml';
	// prepare the data
	var source = {
		datatype: 'xml',
		datafields: [
			{ name: 'ProductName', type: 'string' },
			{ name: 'QuantityPerUnit', type: 'int' },
			{ name: 'UnitPrice', type: 'float' },
			{ name: 'UnitsInStock', type: 'float' },
			{ name: 'Discontinued', type: 'bool' },
		],
		root: 'Products',
		record: 'Product',
		id: 'ProductID',
		url: url,
	};
	var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
		if (value < 20) {
			return (
				'<span style="margin: 4px; margin-top:8px; float: ' +
				columnproperties.cellsalign +
				'; color: #ff0000;">' +
				value +
				'</span>'
			);
		} else {
			return (
				'<span style="margin: 4px; margin-top:8px; float: ' +
				columnproperties.cellsalign +
				'; color: #008000;">' +
				value +
				'</span>'
			);
		}
	};
	var dataAdapter = new $.jqx.dataAdapter(source, {
		downloadComplete: function (data, status, xhr) {},
		loadComplete: function (data) {},
		loadError: function (xhr, status, error) {},
	});
	// initialize jqxGrid
	$('#grid').jqxGrid({
		width: getWidth('Grid'),
		source: dataAdapter,
		pageable: true,
		autoheight: true,
		sortable: true,
		altrows: true,
		enabletooltips: true,
		editable: true,
		filterable: true,
		selectionmode: 'multiplecellsadvanced',
		columns: [
			{
				text: 'Product Name',
				columngroup: 'ProductDetails',
				datafield: 'ProductName',
				width: 250,
			},
			{
				text: 'Quantity per Unit',
				columngroup: 'ProductDetails',
				datafield: 'QuantityPerUnit',
				cellsalign: 'right',
				align: 'right',
				width: 200,
			},
			{
				text: 'Unit Price',
				columngroup: 'ProductDetails',
				datafield: 'UnitPrice',
				align: 'right',
				cellsalign: 'right',
				cellsformat: 'c2',
				width: 200,
			},
			{
				text: 'Units In Stock',
				datafield: 'UnitsInStock',
				cellsalign: 'right',
				cellsrenderer: cellsrenderer,
				width: 100,
			},
			{ text: 'Discontinued', columntype: 'checkbox', datafield: 'Discontinued' },
		],
		columngroups: [{ text: 'Product Details', align: 'center', name: 'ProductDetails' }],
	});
});
