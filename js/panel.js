function przygotowanie() {
	$('#komunikaty').jqxNotification({
		autoClose: true,
		position: 'bottom-right',
		theme: theme,
		autoCloseDelay: 3000,
		opacity: 1,
	})
}
function pokazKomunikat(typKomunikatu, komunikat) {
	switch (typKomunikatu) {
		case 'error':
			$('#komunikaty').jqxNotification({ template: 'error' })
			break
		case 'ok':
			$('#komunikaty').jqxNotification({ template: 'success' })
			break
	}

	$('#komunikatTekst').html(komunikat)
	$('#komunikaty').jqxNotification('open')
}
function wczytajDane(url, dane) {
	var dane
	$.ajax({
		method: 'POST',
		dataType: 'json',
		data: dane,
		url: url,
		timeout: 10000,
		async: false,
		success: function (data) {
			dane = data
			//			log(dane);
			console.log(dane)
		},
		error: function (e) {
			log('json error: ' + e.message)
		},
	})
	return dane
}
function wczytajDane2(url, dane) {
	var dane
	$.ajax({
		method: 'POST',
		dataType: 'json',
		data: dane,
		url: url,
		timeout: 10000,
		async: false,
		contentType: false,
		processData: false,
		crossDomain: true,
		success: function (data) {
			dane = data
			log(dane)
		},
		error: function (e) {
			log('json error: ' + e.message)
		},
	})
	return dane
}
function sprawdzUprawnienia(uprawnienie) {
	var dane = {}
	dane['modul'] = 'logowanie'
	dane['funkcja'] = 'sprawdzUprawnienia'
	dane['uprawnienie'] = uprawnienie
	daneJSON = wczytajDane('php/index.php', dane)
	return daneJSON['wynik']
}
function idPracownika() {
	var dane = {}
	dane['modul'] = 'logowanie'
	dane['funkcja'] = 'idPracownika'
	daneJSON = wczytajDane('php/index.php', dane)
	return daneJSON['wynik']
}
function log(tekst) {
	console.log(tekst)
}
