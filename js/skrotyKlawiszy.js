$(document).keydown(function(e){
//	log(e.which);
	if ((e.ctrlKey) && (!e.altKey))
		switch(e.which)
		{
			case 82: //CTRL+R
					if (uprawnienia.menu_RCP)
						if (!$("#oknoRCP").length)
							$("#pulpitPodklad").load("html/raportowanieCzasuPracy.html", function() {zaladowaneOkna.push('oknoRCP')});
						else
							$("#oknoRCP").jqxWindow('bringToFront');
					else
						pokazKomunikat('blad',komunikaty['menuBrakUprawnienDoModuluRCP']);
					e.preventDefault();
				break;
			case 69: //CTRL+E
					if (uprawnienia.menu_zleceniaWewnetrzne)
						if (!$("#oknoRCP").length)
							$("#pulpitPodklad").load("html/zleceniaWewnetrzne.html", function() {zaladowaneOkna.push('oknoZleceniaWewnetrzne')});
						else
							$("#oknoZleceniaWewnetrzne").jqxWindow('bringToFront');
					else
						pokazKomunikat('blad',komunikaty['menuBrakUprawnienDoModuluUstawieniaZleceniaWewnetrzne']);
					e.preventDefault();
				break;
			case 66: //CTRL+B
					$("#pulpitPodklad").load("html/raportowanieCzasuPracyKalendarz.html", function() {zaladowaneOkna.push('oknoRaportowanieCzasuPracyKalendarz')});
					e.preventDefault();
				break;
			case 116: //F5
					// pokazKomunikat('blad',komunikaty['klawiszF5']);
					// e.preventDefault();
				break;
			case 90: //CTRL+Z
					if (uprawnienia.menu_zlecenia)
						if (!$("#oknoZlecenia").length)
							$("#pulpitPodklad").load("html/zlecenia.html", function() {zaladowaneOkna.push('oknoZlecenia')});
						else
							$("#oknoZlecenia").jqxWindow('bringToFront');
					else
						pokazKomunikat('blad',komunikaty['menuBrakUprawnienDoModuluZlecenia']);
					e.preventDefault();
				break;
			
		}
	else
		switch(e.which)
		{
			case 116: //F5
					//pokazKomunikat('blad',komunikaty['klawiszF5'])
					//e.preventDefault();
				break;
		}
})