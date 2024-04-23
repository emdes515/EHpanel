$(document).ready(function () {
	const pracownicyNieobecnii_Zdalnie = $('#dashboardObecnoscInput').jqxInput({
		placeHolder: 'Enter a Country',
		height: 30,
		width: 250,
		minLength: 1,
		source: countries,
	});

	async function obecnosci() {
		await fetch();
	}
});
