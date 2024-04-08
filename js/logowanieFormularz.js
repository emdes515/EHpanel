$("#login").jqxInput({ placeHolder: "Login", width: '70%', height: 30, theme: theme });
$("#haslo").jqxPasswordInput({ placeHolder: "Haslo", width: '70%', height: 30, showPasswordIcon: false, theme: theme });
$("#zaloguj").jqxButton({ width: 120, height: 30, theme: theme});
$("#zaloguj").click(function() {
	logowanie();
});
function logowanie() {
	let dane = {}
	dane["login"] = $("#login").val();
	dane["haslo"] = $("#haslo").val();
	dane['modul'] = "logowanie";
	dane['funkcja']="zaloguj";
	daneJSON = wczytajDane('php/index.php',dane);
	if (daneJSON['wynik'] == '1') {
		pokazKomunikat('ok',komunikaty['logowanieOK']);
		$("#panelBocznyZawartosc").load("html/menuGlowne.html");
	} else {
		pokazKomunikat('error',komunikaty['logowanieError']);
	}
}