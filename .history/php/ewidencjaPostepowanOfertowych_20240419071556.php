<?PHP
class ewidencjaPostepowanOfertowych
{
	use db;
	use library;
	private $arg;
	private $smarty;
	public $dane = array();
	public function __construct($arg)
	{
		$this->arg = $arg;
		$this->dbconnect();
		$funkcja = (string)$arg["funkcja"];
	}
	public function wyniki()
	{
		return $this->dane;
	}
	public function ewidencjaPostepowanOfertowych()
	{
		if (function_exists($this->arg["funkcja"]))
			return $this->arg["funkcja"]($this->arg);
		else
		{
			die('Moduł: '.$this->arg['modul'].'<br>Brak funkcji: '.$this->arg["funkcja"]);
		}
	}
	public function lista()
	{
		$status=array(0=>"Otwarte",1=>"Zamknięte");
		$i=0;
		$sql = $this->conn->prepare("SELECT epo.id AS epoId, 
								epo.nrProcedury AS epoNrProcedury, 
								epo.szybkaSciezka AS epoSzybkaSciezka,
								epo.iloscWnioskowSzybkiejSciezki AS epoIloscWnioskowSzybkiejSciezki,
								epoPanstwo.nazwa AS epoPanstwoNazwa,
								(SELECT GROUP_CONCAT(epoSpolka.nazwa) FROM ewidencjaPostepowanOfertowych AS epo2 JOIN ewidencjaPostepowanOfertowych_has_epoSpolka AS epo_hs ON epo2.id = epo_hs.ewidencjaPostepowanOfertowych_id JOIN epoSpolka ON epoSpolka.id = epo_hs.epoSpolka_id WHERE epo2.id = epo.id) AS epoSpolkaNazwa,
								(SELECT GROUP_CONCAT(epoOdbiorca.nazwa) FROM ewidencjaPostepowanOfertowych AS epo2 JOIN ewidencjaPostepowanOfertowych_has_epoOdbiorca AS epo_ho ON epo2.id = epo_ho.ewidencjaPostepowanOfertowych_id JOIN epoOdbiorca ON epoOdbiorca.id = epo_ho.epoOdbiorca_id WHERE epo2.id = epo.id) AS epoOdbiorcaNazwa,
								(SELECT GROUP_CONCAT(epoRuch.nazwa) FROM ewidencjaPostepowanOfertowych AS epo2 JOIN ewidencjaPostepowanOfertowych_has_epoRuch AS epo_hr ON epo2.id = epo_hr.ewidencjaPostepowanOfertowych_id JOIN epoRuch ON epoRuch.id = epo_hr.epoRuch_id WHERE epo2.id = epo.id) AS epoRuchNazwa,
								(SELECT GROUP_CONCAT(epoZamawiajacy.nazwa) FROM ewidencjaPostepowanOfertowych AS epo2 JOIN ewidencjaPostepowanOfertowych_has_epoZamawiajacy AS epo_hz ON epo2.id = epo_hz.ewidencjaPostepowanOfertowych_id JOIN epoZamawiajacy ON epoZamawiajacy.id = epo_hz.epoZamawiajacy_id WHERE epo2.id = epo.id) AS epoZamawiajacyNazwa,
								epoNazwaPlikuPrzedrostek.nazwa AS epoNazwaPlikuPrzedrostekNazwa,
								CONCAT(epo.epoNazwaPlikuNumer,'-',substr(epoNazwaPlikuRok.rok,3)) AS epoNazwaPliku,
								(SELECT GROUP_CONCAT(CONCAT(zlecenia.nrIFS,'.',zlecenia.pozycjaIFS) SEPARATOR '\n') FROM ewidencjaPostepowanOfertowych AS epo2 JOIN ewidencjaPostepowanOfertowych_has_zlecenia AS epo_hz ON epo2.id = epo_hz.ewidencjaPostepowanOfertowych_id JOIN zlecenia ON zlecenia.idZlecenia = epo_hz.zlecenia_idZlecenia WHERE epo2.id = epo.id) AS epoZlecenie,
								epo.nrPostepowania AS epoNrPostepowania, 
								epo.dataZlozeniaOferty AS epoDataZlozeniaOferty,
								epo.tematOferty AS epoTematOferty, 
								CONCAT(pracownicy.nazwisko,' ', pracownicy.imie) AS pracownikNazwiskoImie,
								CONCAT(epo.kwotaOferty,' ', epoKwotaOfertyWaluta.symbol) AS epoKwotaOferty,
								CONCAT(epo.kwotaKontraktu.' ',epoKwotaKontraktuWaluta.symbol) AS epoKwotaKontraktu,
	--							epoKwotaKontraktu.nazwa AS epoKwotaKontraktuNazwa,
								IFNULL(epoWadiumWartosc.nazwa,CONCAT(epo.wadiumWartosc,epoWadiumWartoscWaluta.symbol)) AS epoWadiumWartosc,
	--							epoWadiumWartosc.nazwa AS epoWadiumWartoscNazwa,
								epoWadiumRodzaj.nazwa AS epoWadiumRodzajNazwa,
								epo.dataOdbioruKoncowego AS epoDataOdbioruKoncowego, 
								epo.waznoscOferty AS epoWaznoscOferty, 
								epo.bezpiecznaOferta AS epoBezpiecznaOferta, 
								epo.nrUmowyZamowienia AS epoNrUmowyZamowienia, 
								epo.dataDostawy AS epoDataDostawy, 
								epoInformacje.opis AS epoInformacjeOpis,
								epo.uzupelnienieInformacji AS epoUzupelnienieInformacji, 
								epo.dataZakonczeniaPrzetargu AS epoDataZakonczeniaPrzetargu, 
								epo.procesWToku AS epoProcesWToku,
								epo.priorytet AS epoPriorytet,
								epo.zakonczono AS epoZakonczono,
								epo.wygrano AS epoWygrano,
								epo.anulowano AS epoAnulowano,
								epo.wynajem AS epoWynajem
								FROM ewidencjaPostepowanOfertowych AS epo 
								LEFT JOIN epoPanstwo ON epo.epoPanstwo_id = epoPanstwo.id
								LEFT JOIN epoNazwaPlikuPrzedrostek ON epo.epoNazwaPlikuPrzedrostek_id = epoNazwaPlikuPrzedrostek.id
								LEFT JOIN epoNazwaPlikuRok ON epo.epoNazwaPlikuRok_id = epoNazwaPlikuRok.id
								LEFT JOIN pracownicy ON epo.pracownicy_idPracownika = pracownicy.idPracownika
								LEFT JOIN epoWaluta AS epoKwotaOfertyWaluta ON epo.epoKwotaOfertyWaluta_id = epoKwotaOfertyWaluta.id
								LEFT JOIN epoWaluta AS epoKwotaKontraktuWaluta ON epo.epoKwotaKontraktuWaluta_id = epoKwotaKontraktuWaluta.id
								LEFT JOIN epoWadiumWartosc ON epo.epoWadiumWartosc_id = epoWadiumWartosc.id
								LEFT JOIN epoWaluta AS epoWadiumWartoscWaluta ON epo.epoWadiumWartoscWaluta_id = epoWadiumWartoscWaluta.id
								LEFT JOIN epoWadiumRodzaj ON epo.epoWadiumRodzaj_id = epoWadiumRodzaj.id
								LEFT JOIN epoInformacje ON epo.epoInformacje_id = epoInformacje.id
								ORDER BY epo.nrProcedury DESC");
		$res=$this->dbQuery($sql);
	//	echo $res["blad"];
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$tmp=array();
			$tmp["epoId"] = $row["epoId"];
			$tmp["epoNrProcedury"] = $row["epoNrProcedury"];
			if ($row["epoSzybkaSciezka"]==1)
				$tmp["epoSzybkaSciezka"] = "Tak";
			else
				$tmp["epoSzybkaSciezka"] = "Nie";
			$tmp["epoIloscWnioskowSzybkiejSciezki"] = $row["epoIloscWnioskowSzybkiejSciezki"];
			$tmp["epoPanstwoNazwa"] = $row["epoPanstwoNazwa"];
			$tmp["epoSpolkaNazwa"] = $row["epoSpolkaNazwa"];
			$tmp["epoOdbiorcaNazwa"] = $row["epoOdbiorcaNazwa"];
			$tmp["epoRuchNazwa"] = $row["epoRuchNazwa"];
			$tmp["epoZamawiajacyNazwa"] = $row["epoZamawiajacyNazwa"];
			$tmp["epoNazwaPlikuPrzedrostekNazwa"] = $row["epoNazwaPlikuPrzedrostekNazwa"];
			$tmp["epoNazwaPliku"] = $row["epoNazwaPliku"];
			$tmp["epoZlecenie"] = $row["epoZlecenie"];
			$tmp["epoNrPostepowania"] = $row["epoNrPostepowania"];
			$tmp["epoDataZlozeniaOferty"] = $row["epoDataZlozeniaOferty"];
			$tmp["epoTematOferty"] = $row["epoTematOferty"];
			$tmp["pracownikNazwiskoImie"] = $row["pracownikNazwiskoImie"];
			$tmp["epoKwotaOferty"] = $row["epoKwotaOferty"];
			$tmp["epoKwotaKontraktu"] = $row["epoKwotaKontraktu"];
			$tmp["epoWadiumWartosc"] = $row["epoWadiumWartosc"];
			$tmp["epoWadiumRodzajNazwa"] = $row["epoWadiumRodzajNazwa"];
			$tmp["epoDataOdbioruKoncowego"] = $row["epoDataOdbioruKoncowego"];
			$tmp["epoWaznoscOferty"] = $row["epoWaznoscOferty"];
			if ($row["epoBezpiecznaOferta"]==1)
				$tmp["epoBezpiecznaOferta"] = "Tak";
			else
				$tmp["epoBezpiecznaOferta"] = "Nie";
			$tmp["epoNrUmowyZamowienia"] = $row["epoNrUmowyZamowienia"];
			$tmp["epoDataDostawy"] = $row["epoDataDostawy"];
			$tmp["epoInformacjeOpis"] = $row["epoInformacjeOpis"];
			$tmp["epoUzupelnienieInformacji"] = $row["epoUzupelnienieInformacji"];
			$tmp["epoDataZakonczeniaPrzetargu"] = $row["epoDataZakonczeniaPrzetargu"];
			if ($row["epoProcesWToku"] == 1)
				$tmp["epoProcesWToku"] = "Tak";
			else
				$tmp["epoProcesWToku"] = "Nie";
			$tmp["epoPriorytet"] = $row["epoPriorytet"];
			if ($row["epoZakonczono"] == 1)
				$tmp["epoZakonczono"] = "Tak";
			else
				$tmp["epoZakonczono"] = "Nie";
			if ($row["epoWygrano"] == 1)
				$tmp["epoWygrano"] = "Tak";
			else
				$tmp["epoWygrano"] = "Nie";
			if ($row["epoAnulowano"] == 1)
				$tmp["epoAnulowano"] = "Tak";
			else
				$tmp["epoAnulowano"] = "Nie";
			if ($row["epoWynajem"] == 1)
				$tmp["epoWynajem"] = "Tak";
			else
				$tmp["epoWynajem"] = "";
			$this->dane[$i] = $tmp;
			$i++;
		}
		return $this->dane;
	}
	public function panstwaLista()
	{
		$i=0;
		$sql = $this->conn->prepare("SELECT id, nazwa FROM epoPanstwo ORDER BY nazwa");
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$tmp = array();
			$tmp["idPanstwa"] = $row["id"];
			$tmp["nazwaPanstwa"] = $row["nazwa"];
			$this->dane[$i] = $tmp;
			$i++;
		}
		return $this->dane;
	}
	public function spolkiLista()
	{
		$i=0;
		$sql = $this->conn->prepare("SELECT id, nazwa FROM epoSpolka ORDER BY nazwa");
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$tmp = array();
			$tmp["idSpolka"] = $row["id"];
			$tmp["nazwaSpolka"] = $row["nazwa"];
			$this->dane[$i] = $tmp;
			$i++;
		}
		return $this->dane;
	}
	public function odbiorcaLista()
	{
		$i=0;
		$sql = $this->conn->prepare("SELECT id, nazwa FROM epoOdbiorca ORDER BY nazwa");
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$tmp = array();
			$tmp["idOdbiorca"] = $row["id"];
			$tmp["nazwaOdbiorca"] = $row["nazwa"];
			$this->dane[$i] = $tmp;
			$i++;
		}
		return $this->dane;
	}
	public function ruchLista()
	{
		$i=0;
		$sql = $this->conn->prepare("SELECT id, nazwa FROM epoRuch ORDER BY nazwa");
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$tmp = array();
			$tmp["idRuch"] = $row["id"];
			$tmp["nazwaRuch"] = $row["nazwa"];
			$this->dane[$i] = $tmp;
			$i++;
		}
		return $this->dane;
	}
	public function zamawiajacyLista()
	{
		$i=0;
		$sql = $this->conn->prepare("SELECT id, nazwa FROM epoZamawiajacy ORDER BY nazwa");
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$tmp = array();
			$tmp["idZamawiajacy"] = $row["id"];
			$tmp["nazwaZamawiajacy"] = $row["nazwa"];
			$this->dane[$i] = $tmp;
			$i++;
		}
		return $this->dane;
	}
	public function nazwaPlikuPrzedrostekLista()
	{
		$i=0;
		$sql = $this->conn->prepare("SELECT id, nazwa FROM epoNazwaPlikuPrzedrostek ORDER BY nazwa");
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$tmp = array();
			$tmp["idNazwaPlikuPrzedrostek"] = $row["id"];
			$tmp["nazwaPlikuPrzedrostek"] = $row["nazwa"];
			$this->dane[$i] = $tmp;
			$i++;
		}
		return $this->dane;
	}
	public function nazwaPlikuRokLista()
	{
		$i=0;
		$sql = $this->conn->prepare("SELECT id, substr(rok,3,2) AS rok FROM epoNazwaPlikuRok ORDER BY rok");
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$tmp = array();
			$tmp["idNazwaPlikuRok"] = $row["id"];
			$tmp["nazwaPlikuRok"] = $row["rok"];
			$this->dane[$i] = $tmp;
			$i++;
		}
		return $this->dane;
	}
	public function nrProjektuLista()
	{
		$i=0;
		if ($this->arg["zakonczone"] == 1)
		{
			$sql = $this->conn->prepare("SELECT DISTINCT * FROM (SELECT idZlecenia, CONCAT(nrIFS,'.',pozycjaIFS) AS nrProjektu FROM zlecenia WHERE zamkniete = 0 
			UNION ALL
			SELECT zlecenia.idZlecenia, CONCAT(zlecenia.nrIFS,'.',zlecenia.pozycjaIFS) AS nrProjektu  FROM ewidencjaPostepowanOfertowych_has_zlecenia AS epo_hz 
			JOIN zlecenia ON epo_hz.zlecenia_idZlecenia = zlecenia.idZlecenia
			ORDER BY nrProjektu ASC) AS t");
		}
		else
		{
			$sql = $this->conn->prepare("SELECT idZlecenia, CONCAT(nrIFS,'.',pozycjaIFS) AS nrProjektu FROM zlecenia ORDER BY nrProjektu ASC");
		}
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$tmp = array();
			$tmp["idZlecenia"] = $row["idZlecenia"];
			$tmp["nrProjektu"] = $row["nrProjektu"];
			$this->dane[$i] = $tmp;
			$i++;
		}
		return $this->dane;
	}
	public function prowadzacyLista()
	{
		$i=0;
		$sql = $this->conn->prepare("SELECT DISTINCT pracownicy.idPracownika, CONCAT(pracownicy.nazwisko,' ',pracownicy.imie) AS nazwiskoImie FROM pracownicy JOIN dzialy_has_pracownicy ON pracownicy.idPracownika = dzialy_has_pracownicy.idPracownika WHERE dzialy_has_pracownicy.idDzialu IN (SELECT idDzialu FROM dzialy WHERE nazwa LIKE 'DH%' OR nazwa LIKE 'DRY') AND widoczny=1 ORDER BY nazwiskoImie ASC");
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$tmp = array();
			$tmp["idPracownika"] = $row["idPracownika"];
			$tmp["nazwiskoImie"] = $row["nazwiskoImie"];
			$this->dane[$i] = $tmp;
			$i++;
		}
		return $this->dane;
	}
	public function walutaLista()
	{
		$i=0;
		$sql = $this->conn->prepare("SELECT id, symbol FROM epoWaluta ORDER BY symbol ASC");
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$tmp = array();
			$tmp["id"] = $row["id"];
			$tmp["symbol"] = $row["symbol"];
			$this->dane[$i] = $tmp;
			$i++;
		}
		return $this->dane;
	}
	public function wartoscKwotaKontraktuLista()
	{
		$i=0;
		$sql = $this->conn->prepare("SELECT id, nazwa FROM epoKwotaKontraktu ORDER BY nazwa ASC");
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$tmp = array();
			$tmp["id"] = $row["id"];
			$tmp["nazwa"] = $row["nazwa"];
			$this->dane[$i] = $tmp;
			$i++;
		}
		return $this->dane;
	}
	public function wartoscWadiumSlownikLista()
	{
		$i=0;
		$sql = $this->conn->prepare("SELECT id, nazwa FROM epoWadiumWartosc ORDER BY nazwa ASC");
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$tmp = array();
			$tmp["id"] = $row["id"];
			$tmp["nazwa"] = $row["nazwa"];
			$this->dane[$i] = $tmp;
			$i++;
		}
		return $this->dane;
	}
	public function rodzajWadiumLista()
	{
		$i=0;
		$sql = $this->conn->prepare("SELECT id, nazwa FROM epoWadiumRodzaj ORDER BY nazwa ASC");
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$tmp = array();
			$tmp["id"] = $row["id"];
			$tmp["nazwa"] = $row["nazwa"];
			$this->dane[$i] = $tmp;
			$i++;
		}
		return $this->dane;
	}
	public function informacjeLista()
	{
		$i=0;
		$sql = $this->conn->prepare("SELECT id, opis FROM epoInformacje ORDER BY opis ASC");
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$tmp = array();
			$tmp["id"] = $row["id"];
			$tmp["opis"] = $row["opis"];
			$this->dane[$i] = $tmp;
			$i++;
		}
		return $this->dane;
	}
	public function daneFormularz()
	{
		$sql = $this->conn->prepare("SELECT id ,nrProcedury, szybkaSciezka, iloscWnioskowSzybkiejSciezki,
			IFNULL(epoPanstwo_id,'') AS epoPanstwo_id,
	--		IFNULL(epoSpolka_id,'') AS epoSpolka_id,
	--		IFNULL(epoOdbiorca_id,'') AS epoOdbiorca_id,
	--		IFNULL(epoRuch_id,'') AS epoRuch_id,
	--		IFNULL(epoZamawiajacy_id,'') AS epoZamawiajacy_id,
			IFNULL(epoNazwaPlikuPrzedrostek_id,'') AS epoNazwaPlikuPrzedrostek_id,
			IFNULL(epoNazwaPlikuNumer,'') AS epoNazwaPlikuNumer,
			IFNULL(epoNazwaPlikuRok_id,'') AS epoNazwaPlikuRok_id,
			IFNULL(nrPostepowania,'') AS nrPostepowania,
			IFNULL(dataZlozeniaOferty,'') AS dataZlozeniaOferty,
			IFNULL(tematOferty,'') AS tematOferty,
			IFNULL(pracownicy_idPracownika,'') AS pracownicy_idPracownika,
			IFNULL(epoKwotaOfertyWaluta_id,'') AS epoKwotaOfertyWaluta_id,
			IFNULL(kwotaOferty,'0') AS kwotaOferty,
			IFNULL(kwotaKontraktu,'0') AS kwotaKontraktu,
			IFNULL(epoKwotaKontraktuWaluta_id,'') AS epoKwotaKontraktuWaluta_id, 
			IFNULL(wadiumWartosc,'0') AS wadiumWartosc,
			IFNULL(epoWadiumWartoscWaluta_id,'') AS epoWadiumWartoscWaluta_id, 
			IFNULL(epoWadiumWartosc_id,'') AS epoWadiumWartosc_id,
			IFNULL(epoWadiumRodzaj_id,'') AS epoWadiumRodzaj_id,
			IFNULL(dataOdbioruKoncowego,'') AS dataOdbioruKoncowego,
			IFNULL(waznoscOferty,'') AS waznoscOferty,
			IFNULL(bezpiecznaOferta,'') AS bezpiecznaOferta,
			IFNULL(nrUmowyZamowienia,'') AS nrUmowyZamowienia, 
			IFNULL(dataDostawy,'') AS dataDostawy,
			IFNULL(epoInformacje_id,'') AS epoInformacje_id,
			IFNULL(uzupelnienieInformacji,'') AS uzupelnienieInformacji,
			IFNULL(dataZakonczeniaPrzetargu,'') AS dataZakonczeniaPrzetargu,
			IFNULL(procesWToku,'') AS procesWToku,
			IFNULL(priorytet,'') AS priorytet,
			IFNULL(zakonczono,'') AS zakonczono,
			IFNULL(wygrano,'') AS wygrano,
			IFNULL(anulowano,'') AS anulowano,
			IFNULL(wynajem,'') AS wynajem
			FROM ewidencjaPostepowanOfertowych WHERE id=:epoId");
		$sql->bindValue(":epoId", $this->arg["epoId"], PDO::PARAM_INT);
		$res=$this->dbQuery($sql);
	//	echo $res["blad"];
		$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
		$this->dane["epoId"] = $row["id"];
		$this->dane["nrProcedury"] = $row["nrProcedury"];
		$this->dane["szybkaSciezka"] = $row["szybkaSciezka"];
		$this->dane["iloscWnioskowSzybkiejSciezki"] = $row["iloscWnioskowSzybkiejSciezki"];
		$this->dane["epoPanstwo_id"] = $row["epoPanstwo_id"];
		$this->dane["epoSpolka_id"] = $row["epoSpolka_id"];
		$this->dane["epoOdbiorca_id"] = $row["epoOdbiorca_id"];
		$this->dane["epoRuch_id"] = $row["epoRuch_id"];
		$this->dane["epoZamawiajacy_id"] = $row["epoZamawiajacy_id"];
		$this->dane["epoNazwaPlikuPrzedrostek_id"] = $row["epoNazwaPlikuPrzedrostek_id"];
		$this->dane["epoNazwaPlikuRok_id"] = $row["epoNazwaPlikuRok_id"];
		$this->dane["nrPostepowania"] = $row["nrPostepowania"];
		if ($row["dataZlozeniaOferty"]=="0000-00-00")
			$this->dane["dataZlozeniaOferty"] = "";
		else
			$this->dane["dataZlozeniaOferty"] = $row["dataZlozeniaOferty"];
		$this->dane["tematOferty"] = $row["tematOferty"];
		$this->dane["pracownicy_idPracownika"] = $row["pracownicy_idPracownika"];
		$this->dane["epoKwotaKontraktu_id"] = $row["epoKwotaKontraktu_id"];
		$this->dane["kwotaOferty"] = $row["kwotaOferty"];
		$this->dane["epoKwotaOfertyWaluta_id"] = $row["epoKwotaOfertyWaluta_id"];
		$this->dane["kwotaKontraktu"] = $row["kwotaKontraktu"];
		$this->dane["epoKwotaKontraktuWaluta_id"] = $row["epoKwotaKontraktuWaluta_id"];
		$this->dane["wadiumWartosc"] = $row["wadiumWartosc"];
		$this->dane["epoWadiumWartoscWaluta_id"] = $row["epoWadiumWartoscWaluta_id"];
		$this->dane["epoWadiumWartosc_id"] = $row["epoWadiumWartosc_id"];
		$this->dane["epoWadiumRodzaj_id"] = $row["epoWadiumRodzaj_id"];
		if ($row["dataOdbioruKoncowego"]=="0000-00-00")
			$this->dane["dataOdbioruKoncowego"] = "";
		else
			$this->dane["dataOdbioruKoncowego"] = $row["dataOdbioruKoncowego"];
		if ($row["waznoscOferty"]=="0000-00-00")
			$this->dane["waznoscOferty"] = "";
		else
			$this->dane["waznoscOferty"] = $row["waznoscOferty"];
		$this->dane["bezpiecznaOferta"] = $row["bezpiecznaOferta"];
		$this->dane["nrUmowyZamowienia"] = $row["nrUmowyZamowienia"];
		if ($row["dataDostawy"]=="0000-00-00")
			$this->dane["dataDostawy"] = "";
		else
			$this->dane["dataDostawy"] = $row["dataDostawy"];
		$this->dane["epoInformacje_id"] = $row["epoInformacje_id"];
		$this->dane["uzupelnienieInformacji"] = $row["uzupelnienieInformacji"];
		if ($row["dataZakonczeniaPrzetargu"]=="0000-00-00")
			$this->dane["dataZakonczeniaPrzetargu"] = "";
		else
			$this->dane["dataZakonczeniaPrzetargu"] = $row["dataZakonczeniaPrzetargu"];
		$this->dane["procesWToku"] = $row["procesWToku"];
		$this->dane["priorytet_id"] = $row["priorytet"];
		$this->dane["zakonczono"] = $row["zakonczono"];
		$this->dane["wygrano"] = $row["wygrano"];
		$this->dane["anulowano"] = $row["anulowano"];
		$this->dane["wynajem"] = $row["wynajem"];
		$sql = $this->conn->prepare("SELECT CONCAT(enpp.nazwa,epo.epoNazwaPlikuNumer,'-',enpr.rok) AS nazwaPliku FROM ewidencjaPostepowanOfertowych AS epo JOIN epoNazwaPlikuPrzedrostek AS enpp ON epo.epoNazwaPlikuPrzedrostek_id=enpp.id JOIN epoNazwaPlikuRok AS enpr ON epo.epoNazwaPlikuRok_id=enpr.id WHERE epo.id=:epoId");
		$sql->bindValue(":epoId", $this->arg["epoId"], PDO::PARAM_INT);
		$res=$this->dbQuery($sql);
		if ($res["wynik"]->rowCount()==1)
		{
			$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
			$this->dane["epoNazwaPliku"] = $row["nazwaPliku"];
		}
		else
			$this->dane["epoNazwaPliku"] = "";
		return $this->dane;
	}
	public function daneFormularza_spolka()
	{
		$sql = $this->conn->prepare("SELECT epoSpolka.id, epoSpolka.nazwa FROM ewidencjaPostepowanOfertowych_has_epoSpolka AS epo_hp JOIN epoSpolka ON epo_hp.epoSpolka_id = epoSpolka.id WHERE epo_hp.ewidencjaPostepowanOfertowych_id=:epoId");
		$sql->bindValue(":epoId", $this->arg["epoId"], PDO::PARAM_INT);
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$this->dane[$row["id"]] = $row["nazwa"];
		}
		return $this->dane;
	}
	public function daneFormularza_odbiorca()
	{
		$sql = $this->conn->prepare("SELECT epoOdbiorca.id, epoOdbiorca.nazwa FROM ewidencjaPostepowanOfertowych_has_epoOdbiorca AS epo_ho JOIN epoOdbiorca ON epo_ho.epoOdbiorca_id = epoOdbiorca.id WHERE epo_ho.ewidencjaPostepowanOfertowych_id=:epoId");
		$sql->bindValue(":epoId", $this->arg["epoId"], PDO::PARAM_INT);
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$this->dane[$row["id"]] = $row["nazwa"];
		}
		return $this->dane;
	}
	public function daneFormularza_ruch()
	{
		$sql = $this->conn->prepare("SELECT epoRuch.id, epoRuch.nazwa FROM ewidencjaPostepowanOfertowych_has_epoRuch AS epo_hr JOIN epoRuch ON epo_hr.epoRuch_id = epoRuch.id WHERE epo_hr.ewidencjaPostepowanOfertowych_id=:epoId");
		$sql->bindValue(":epoId", $this->arg["epoId"], PDO::PARAM_INT);
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$this->dane[$row["id"]] = $row["nazwa"];
		}
		return $this->dane;
	}
	public function daneFormularza_zamawiajacy()
	{
		$sql = $this->conn->prepare("SELECT epoZamawiajacy.id, epoZamawiajacy.nazwa FROM ewidencjaPostepowanOfertowych_has_epoZamawiajacy AS epo_hz JOIN epoZamawiajacy ON epo_hz.epoZamawiajacy_id = epoZamawiajacy.id WHERE epo_hz.ewidencjaPostepowanOfertowych_id=:epoId");
		$sql->bindValue(":epoId", $this->arg["epoId"], PDO::PARAM_INT);
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$this->dane[$row["id"]] = $row["nazwa"];
		}
		return $this->dane;
	}
	public function daneFormularza_nrProjektu()
	{
		$sql = $this->conn->prepare("SELECT zlecenia.idZlecenia, zlecenia.nrIFS FROM ewidencjaPostepowanOfertowych_has_zlecenia AS epo_hz 
			JOIN zlecenia ON epo_hz.zlecenia_idZlecenia = zlecenia.idZlecenia 
			WHERE epo_hz.ewidencjaPostepowanOfertowych_id=:epoId");
		$sql->bindValue(":epoId", $this->arg["epoId"], PDO::PARAM_INT);
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$this->dane[$row["idZlecenia"]] = $row["nrIFS"];
		}
		return $this->dane;
	}
	public function zapisz()
	{
		if ($this->arg["id"]==0)
		{
	//		var_dump($this->arg);
			$idZlecenia = -1;
			$sql = $this->conn->prepare("SELECT IFNULL(MAX(nrProcedury),0)+1 AS nrProcedury FROM ewidencjaPostepowanOfertowych");
			$res=$this->dbQuery($sql);
			$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
			$nrProcedury = $row["nrProcedury"];

			if ($this->arg["nazwaPlikuPrzedrostek"]!="")
			{
				$sql = $this->conn->prepare("SELECT IFNULL(MAX(epoNazwaPlikuNumer),0)+1 AS nazwaPlikuNumer FROM ewidencjaPostepowanOfertowych WHERE epoNazwaPlikuPrzedrostek_id=:nazwaPlikuPrzedrostek");
				$sql->bindValue(":nazwaPlikuPrzedrostek", $this->arg["nazwaPlikuPrzedrostek"], PDO::PARAM_INT);
				$res=$this->dbQuery($sql);
				$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
				$nazwaPlikuNumer = $row["nazwaPlikuNumer"];
			}
			else
			{
				$nazwaPlikuNumer=null;
			}
			$sql = $this->conn->prepare("INSERT INTO ewidencjaPostepowanOfertowych VALUES (
			NULL, :nrProcedury, :szybkaSciezka, :iloscWnioskowSzybkiejSciezki,
			:panstwo, :nazwaPlikuPrzedrostek ,:nazwaPlikuNumer, :nazwaPlikuRok,
			:nrPostepowania, :dataZlozeniaOferty ,:tematOferty ,:prowadzacy , :kwotaOferty, :kwotaOfertyWaluta
			, :kwotaKontraktu ,:kwotaKontraktuWaluta 
			, :wartoscWadium, :wartoscWadiumWaluta,
			:wartoscWadiumSlownik, :rodzajWadium, :dataOdbioruKoncowego, :dataWaznosciOferty, :bezpiecznaOferta, :nrUmowyLubZamowienia
			, :dataDostawy, :informacje, :uzupelnienieInformacji, :dataZakonczeniaPrzetargu, :procesWToku, :priorytet
			, :zakonczono, :wygrano, :anulowano, :wynajem)");
			if ($this->arg["panstwo"] == "") $this->arg["panstwo"] = null;
	//		if ($this->arg["spolka"] == "") $this->arg["spolka"] = null;
	//		if ($this->arg["odbiorca"] == "") $this->arg["odbiorca"] = null;
	//		if ($this->arg["ruch"] == "") $this->arg["ruch"] = null;
	//		if ($this->arg["zamawiajacy"] == "") $this->arg["zamawiajacy"] = null;
			if ($this->arg["nazwaPlikuPrzedrostek"] == "") $this->arg["nazwaPlikuPrzedrostek"] = null;
			if ($this->arg["nazwaPlikuRok"] == "") $this->arg["nazwaPlikuRok"] = null;
			if ($this->arg["prowadzacy"] == "") $this->arg["prowadzacy"] = null;
			if ($this->arg["kwotaOfertyWaluta"] == "") $this->arg["kwotaOfertyWaluta"] = null;
			if ($this->arg["kwotaKontraktuWaluta"] == "") $this->arg["kwotaKontraktuWaluta"] = null;
			if ($this->arg["wartoscWadiumWaluta"] == "") $this->arg["wartoscWadiumWaluta"] = null;
			if ($this->arg["wartoscWadiumSlownik"] == "") $this->arg["wartoscWadiumSlownik"] = null;
			if ($this->arg["rodzajWadium"] == "") $this->arg["rodzajWadium"] = null;
			if ($this->arg["informacje"] == "") $this->arg["informacje"] = null;
			
			$sql->bindValue(":nrProcedury", $nrProcedury, PDO::PARAM_INT);
			$sql->bindValue(":szybkaSciezka", $this->arg["szybkaSciezka"], PDO::PARAM_STR);
			$sql->bindValue(":iloscWnioskowSzybkiejSciezki", $this->arg["iloscWnioskowSzybkiejSciezki"], PDO::PARAM_STR);
			$sql->bindValue(":panstwo", $this->arg["panstwo"], PDO::PARAM_INT);
	//		$sql->bindValue(":spolka", $this->arg["spolka"], PDO::PARAM_INT);
	//		$sql->bindValue(":odbiorca", $this->arg["odbiorca"], PDO::PARAM_INT);
	//		$sql->bindValue(":ruch", $this->arg["ruch"], PDO::PARAM_INT);
	//		$sql->bindValue(":zamawiajacy", $this->arg["zamawiajacy"], PDO::PARAM_INT);
			$sql->bindValue(":nazwaPlikuPrzedrostek", $this->arg["nazwaPlikuPrzedrostek"], PDO::PARAM_INT);
			$sql->bindValue(":nazwaPlikuNumer", $nazwaPlikuNumer, PDO::PARAM_INT);
			$sql->bindValue(":nazwaPlikuRok", $this->arg["nazwaPlikuRok"], PDO::PARAM_STR);
			$sql->bindValue(":nrPostepowania", $this->arg["nrPostepowania"], PDO::PARAM_STR);
			$sql->bindValue(":dataZlozeniaOferty", $this->arg["dataZlozeniaOferty"], PDO::PARAM_STR);
			$sql->bindValue(":tematOferty", $this->arg["tematOferty"], PDO::PARAM_STR);
			$sql->bindValue(":prowadzacy", $this->arg["prowadzacy"], PDO::PARAM_STR);
			$sql->bindValue(":kwotaOferty", $this->arg["kwotaOferty"], PDO::PARAM_STR);
			$sql->bindValue(":kwotaOfertyWaluta", $this->arg["kwotaOfertyWaluta"], PDO::PARAM_STR);
			$sql->bindValue(":kwotaKontraktu", $this->arg["kwotaKontraktu"], PDO::PARAM_STR);
			$sql->bindValue(":kwotaKontraktuWaluta", $this->arg["kwotaKontraktuWaluta"], PDO::PARAM_STR);
			$sql->bindValue(":wartoscWadium", $this->arg["wartoscWadium"], PDO::PARAM_STR);
			$sql->bindValue(":wartoscWadiumWaluta", $this->arg["wartoscWadiumWaluta"], PDO::PARAM_STR);
			$sql->bindValue(":wartoscWadiumSlownik", $this->arg["wartoscWadiumSlownik"], PDO::PARAM_STR);
			$sql->bindValue(":rodzajWadium", $this->arg["rodzajWadium"], PDO::PARAM_STR);
			$sql->bindValue(":dataOdbioruKoncowego", $this->arg["dataOdbioruKoncowego"], PDO::PARAM_STR);
			$sql->bindValue(":dataWaznosciOferty", $this->arg["dataWaznosciOferty"], PDO::PARAM_STR);
			$sql->bindValue(":bezpiecznaOferta", $this->arg["bezpiecznaOferta"], PDO::PARAM_STR);
			$sql->bindValue(":nrUmowyLubZamowienia", $this->arg["nrUmowyLubZamowienia"], PDO::PARAM_STR);
			$sql->bindValue(":dataDostawy", $this->arg["dataDostawy"], PDO::PARAM_STR);
			$sql->bindValue(":informacje", $this->arg["informacje"], PDO::PARAM_STR);
			$sql->bindValue(":uzupelnienieInformacji", $this->arg["uzupelnienieInformacji"], PDO::PARAM_STR);
			$sql->bindValue(":dataZakonczeniaPrzetargu", $this->arg["dataZakonczeniaPrzetargu"], PDO::PARAM_STR);
			$sql->bindValue(":procesWToku", $this->arg["procesWToku"], PDO::PARAM_STR);
			$sql->bindValue(":priorytet", $this->arg["priorytet"], PDO::PARAM_INT);
			$sql->bindValue(":zakonczono", $this->arg["zakonczono"], PDO::PARAM_STR);
			$sql->bindValue(":wygrano", $this->arg["wygrano"], PDO::PARAM_STR);
			$sql->bindValue(":anulowano", $this->arg["anulowano"], PDO::PARAM_STR);
			$sql->bindValue(":wynajem", $this->arg["wynajem"], PDO::PARAM_STR);
			$res=$this->dbQuery($sql);
			$idEpo = $this->conn->lastInsertId();
			$this->zapiszLogi($res["zrodlo"],"ewidencjaPostepowanOfertowych_zapisz");
	//		echo $res["blad"];
			if ($res["blad"]=="")
			{
				for ($i=0; $i<count($this->arg["spolka"]); $i++)
				{
					$sql = $this->conn->prepare("INSERT INTO ewidencjaPostepowanOfertowych_has_epoSpolka VALUES (:idEpo, :spolka)");
					$sql->bindValue(":idEpo", $idEpo, PDO::PARAM_INT);
					$sql->bindValue(":spolka", $this->arg["spolka"][$i], PDO::PARAM_INT);
					$res=$this->dbQuery($sql);
					$this->zapiszLogi($res["zrodlo"],"ewidencjaPostepowanOfertowych_zapisz");
				}
				for ($i=0; $i<count($this->arg["odbiorca"]); $i++)
				{
					$sql = $this->conn->prepare("INSERT INTO ewidencjaPostepowanOfertowych_has_epoOdbiorca VALUES (:idEpo, :odbiorca)");
					$sql->bindValue(":idEpo", $idEpo, PDO::PARAM_INT);
					$sql->bindValue(":odbiorca", $this->arg["odbiorca"][$i], PDO::PARAM_INT);
					$res=$this->dbQuery($sql);
					$this->zapiszLogi($res["zrodlo"],"ewidencjaPostepowanOfertowych_zapisz");
				}
				for ($i=0; $i<count($this->arg["ruch"]); $i++)
				{
					$sql = $this->conn->prepare("INSERT INTO ewidencjaPostepowanOfertowych_has_epoRuch VALUES (:idEpo, :ruch)");
					$sql->bindValue(":idEpo", $idEpo, PDO::PARAM_INT);
					$sql->bindValue(":ruch", $this->arg["ruch"][$i], PDO::PARAM_INT);
					$res=$this->dbQuery($sql);
					$this->zapiszLogi($res["zrodlo"],"ewidencjaPostepowanOfertowych_zapisz");
				}
				for ($i=0; $i<count($this->arg["zamawiajacy"]); $i++)
				{
					$sql = $this->conn->prepare("INSERT INTO ewidencjaPostepowanOfertowych_has_epoZamawiajacy VALUES (:idEpo, :zamawiajacy)");
					$sql->bindValue(":idEpo", $idEpo, PDO::PARAM_INT);
					$sql->bindValue(":zamawiajacy", $this->arg["zamawiajacy"][$i], PDO::PARAM_INT);
					$res=$this->dbQuery($sql);
					$this->zapiszLogi($res["zrodlo"],"ewidencjaPostepowanOfertowych_zapisz");
				}
				for ($i=0; $i<count($this->arg["nrProjektu"]); $i++)
				{
					$sql = $this->conn->prepare("INSERT INTO ewidencjaPostepowanOfertowych_has_zlecenia VALUES (:idEpo, :nrProjektu)");
					$sql->bindValue(":idEpo", $idEpo, PDO::PARAM_INT);
					$sql->bindValue(":nrProjektu", $this->arg["nrProjektu"][$i], PDO::PARAM_INT);
					$res=$this->dbQuery($sql);
					$this->zapiszLogi($res["zrodlo"],"ewidencjaPostepowanOfertowych_zapisz");
				}

			}
			else
				$idEpo = -1;
		}
		else
		{
			$sql = $this->conn->prepare("SELECT epoNazwaPlikuNumer FROM ewidencjaPostepowanOfertowych WHERE id=:id");
			$sql->bindValue(":id", $this->arg["id"], PDO::PARAM_STR);
			$res=$this->dbQuery($sql);
			$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
			$nazwaPlikuNumer = $row["epoNazwaPlikuNumer"];
			if ($nazwaPlikuNumer == "")
			{
				$sql = $this->conn->prepare("SELECT IFNULL(MAX(epoNazwaPlikuNumer),0)+1 AS nazwaPlikuNumer FROM ewidencjaPostepowanOfertowych WHERE epoNazwaPlikuPrzedrostek_id=:nazwaPlikuPrzedrostek");
				$sql->bindValue(":nazwaPlikuPrzedrostek", $this->arg["nazwaPlikuPrzedrostek"], PDO::PARAM_INT);
				$res=$this->dbQuery($sql);
				$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
				$nazwaPlikuNumer = $row["nazwaPlikuNumer"];
		//		echo $nazwaPlikuNumer;
			}
			$sql = $this->conn->prepare("UPDATE ewidencjaPostepowanOfertowych SET
			szybkaSciezka=:szybkaSciezka, iloscWnioskowSzybkiejSciezki=:iloscWnioskowSzybkiejSciezki,
			epoPanstwo_id=:panstwo, epoNazwaPlikuPrzedrostek_id=:nazwaPlikuPrzedrostek, epoNazwaPlikuNumer=:nazwaPlikuNumer,
			epoNazwaPlikuRok_id=:nazwaPlikuRok, nrPostepowania=:nrPostepowania,
			dataZlozeniaOferty=:dataZlozeniaOferty ,tematOferty=:tematOferty ,pracownicy_idPracownika=:prowadzacy,
			kwotaOferty=:kwotaOferty, epoKwotaOfertyWaluta_id=:kwotaOfertyWaluta, kwotaKontraktu=:kwotaKontraktu ,epoKwotaKontraktuWaluta_id=:kwotaKontraktuWaluta,
			wadiumWartosc=:wartoscWadium, epoWadiumWartoscWaluta_id=:wartoscWadiumWaluta, epoWadiumWartosc_id=:wartoscWadiumSlownik,
			epoWadiumRodzaj_id=:rodzajWadium, dataOdbioruKoncowego=:dataOdbioruKoncowego, waznoscOferty=:dataWaznosciOferty,
			bezpiecznaOferta=:bezpiecznaOferta, nrUmowyZamowienia=:nrUmowyLubZamowienia, dataDostawy=:dataDostawy,
			epoInformacje_id=:informacje, uzupelnienieInformacji=:uzupelnienieInformacji,
			dataZakonczeniaPrzetargu=:dataZakonczeniaPrzetargu, procesWToku=:procesWToku, priorytet=:priorytet, zakonczono=:zakonczono, 
			wygrano=:wygrano, anulowano=:anulowano, wynajem=:wynajem WHERE id=:id");
			if ($this->arg["panstwo"] == "") $this->arg["panstwo"] = null;
			if ($this->arg["nazwaPlikuPrzedrostek"] == "") $this->arg["nazwaPlikuPrzedrostek"] = null;
			if ($this->arg["nazwaPlikuRok"] == "") $this->arg["nazwaPlikuRok"] = null;
			if ($this->arg["prowadzacy"] == "") $this->arg["prowadzacy"] = null;
			if ($this->arg["kwotaOfertyWaluta"] == "") $this->arg["kwotaOfertyWaluta"] = null;
			if ($this->arg["kwotaKontraktuWaluta"] == "") $this->arg["kwotaKontraktuWaluta"] = null;
			if ($this->arg["wartoscWadiumWaluta"] == "") $this->arg["wartoscWadiumWaluta"] = null;
			if ($this->arg["wartoscWadiumSlownik"] == "") $this->arg["wartoscWadiumSlownik"] = null;
			if ($this->arg["rodzajWadium"] == "") $this->arg["rodzajWadium"] = null;
			if ($this->arg["informacje"] == "") $this->arg["informacje"] = null;
			
			$sql->bindValue(":id", $this->arg["id"], PDO::PARAM_STR);
			$sql->bindValue(":szybkaSciezka", $this->arg["szybkaSciezka"], PDO::PARAM_STR);
			$sql->bindValue(":iloscWnioskowSzybkiejSciezki", $this->arg["iloscWnioskowSzybkiejSciezki"], PDO::PARAM_STR);
			$sql->bindValue(":panstwo", $this->arg["panstwo"], PDO::PARAM_INT);
			$sql->bindValue(":nazwaPlikuPrzedrostek", $this->arg["nazwaPlikuPrzedrostek"], PDO::PARAM_INT);
			$sql->bindValue(":nazwaPlikuNumer", $nazwaPlikuNumer, PDO::PARAM_INT);
			$sql->bindValue(":nazwaPlikuRok", $this->arg["nazwaPlikuRok"], PDO::PARAM_STR);
			$sql->bindValue(":nrPostepowania", $this->arg["nrPostepowania"], PDO::PARAM_STR);
			$sql->bindValue(":dataZlozeniaOferty", $this->arg["dataZlozeniaOferty"], PDO::PARAM_STR);
			$sql->bindValue(":tematOferty", $this->arg["tematOferty"], PDO::PARAM_STR);
			$sql->bindValue(":prowadzacy", $this->arg["prowadzacy"], PDO::PARAM_STR);
			$sql->bindValue(":kwotaOferty", $this->arg["kwotaOferty"], PDO::PARAM_STR);
			$sql->bindValue(":kwotaOfertyWaluta", $this->arg["kwotaOfertyWaluta"], PDO::PARAM_STR);
			$sql->bindValue(":kwotaKontraktu", $this->arg["kwotaKontraktu"], PDO::PARAM_STR);
			$sql->bindValue(":kwotaKontraktuWaluta", $this->arg["kwotaKontraktuWaluta"], PDO::PARAM_STR);
			$sql->bindValue(":wartoscWadium", $this->arg["wartoscWadium"], PDO::PARAM_STR);
			$sql->bindValue(":wartoscWadiumWaluta", $this->arg["wartoscWadiumWaluta"], PDO::PARAM_STR);
			$sql->bindValue(":wartoscWadiumSlownik", $this->arg["wartoscWadiumSlownik"], PDO::PARAM_STR);
			$sql->bindValue(":rodzajWadium", $this->arg["rodzajWadium"], PDO::PARAM_STR);
			$sql->bindValue(":dataOdbioruKoncowego", $this->arg["dataOdbioruKoncowego"], PDO::PARAM_STR);
			$sql->bindValue(":dataWaznosciOferty", $this->arg["dataWaznosciOferty"], PDO::PARAM_STR);
			$sql->bindValue(":bezpiecznaOferta", $this->arg["bezpiecznaOferta"], PDO::PARAM_STR);
			$sql->bindValue(":nrUmowyLubZamowienia", $this->arg["nrUmowyLubZamowienia"], PDO::PARAM_STR);
			$sql->bindValue(":dataDostawy", $this->arg["dataDostawy"], PDO::PARAM_STR);
			$sql->bindValue(":informacje", $this->arg["informacje"], PDO::PARAM_STR);
			$sql->bindValue(":uzupelnienieInformacji", $this->arg["uzupelnienieInformacji"], PDO::PARAM_STR);
			$sql->bindValue(":dataZakonczeniaPrzetargu", $this->arg["dataZakonczeniaPrzetargu"], PDO::PARAM_STR);
			$sql->bindValue(":procesWToku", $this->arg["procesWToku"], PDO::PARAM_STR);
			$sql->bindValue(":priorytet", $this->arg["priorytet"], PDO::PARAM_INT);
			$sql->bindValue(":zakonczono", $this->arg["zakonczono"], PDO::PARAM_STR);
			$sql->bindValue(":wygrano", $this->arg["wygrano"], PDO::PARAM_STR);
			$sql->bindValue(":anulowano", $this->arg["anulowano"], PDO::PARAM_STR);
			$sql->bindValue(":wynajem", $this->arg["wynajem"], PDO::PARAM_STR);
			$res=$this->dbQuery($sql);
			$this->zapiszLogi($res["zrodlo"],"ewidencjaPostepowanOfertowych_zapisz");
	//		echo $res["blad"];
			if ($res["blad"]=="")
			{
				$idEpo = $this->arg["id"];
				$sql = $this->conn->prepare("DELETE FROM ewidencjaPostepowanOfertowych_has_epoSpolka WHERE ewidencjaPostepowanOfertowych_id=:idEpo");
				$sql->bindValue(":idEpo", $idEpo, PDO::PARAM_INT);
				$res=$this->dbQuery($sql);
				$sql = $this->conn->prepare("DELETE FROM ewidencjaPostepowanOfertowych_has_epoOdbiorca WHERE ewidencjaPostepowanOfertowych_id=:idEpo");
				$sql->bindValue(":idEpo", $idEpo, PDO::PARAM_INT);
				$res=$this->dbQuery($sql);
				$sql = $this->conn->prepare("DELETE FROM ewidencjaPostepowanOfertowych_has_epoRuch WHERE ewidencjaPostepowanOfertowych_id=:idEpo");
				$sql->bindValue(":idEpo", $idEpo, PDO::PARAM_INT);
				$res=$this->dbQuery($sql);
				$sql = $this->conn->prepare("DELETE FROM ewidencjaPostepowanOfertowych_has_epoZamawiajacy WHERE ewidencjaPostepowanOfertowych_id=:idEpo");
				$sql->bindValue(":idEpo", $idEpo, PDO::PARAM_INT);
				$res=$this->dbQuery($sql);
				$sql = $this->conn->prepare("DELETE FROM ewidencjaPostepowanOfertowych_has_zlecenia WHERE ewidencjaPostepowanOfertowych_id=:idEpo");
				$sql->bindValue(":idEpo", $idEpo, PDO::PARAM_INT);
				$res=$this->dbQuery($sql);
				for ($i=0; $i<count($this->arg["spolka"]); $i++)
				{
					$sql = $this->conn->prepare("INSERT INTO ewidencjaPostepowanOfertowych_has_epoSpolka VALUES (:idEpo, :spolka)");
					$sql->bindValue(":idEpo", $idEpo, PDO::PARAM_INT);
					$sql->bindValue(":spolka", $this->arg["spolka"][$i], PDO::PARAM_INT);
					$res=$this->dbQuery($sql);
					$this->zapiszLogi($res["zrodlo"],"ewidencjaPostepowanOfertowych_zapisz");
				}
				for ($i=0; $i<count($this->arg["odbiorca"]); $i++)
				{
					$sql = $this->conn->prepare("INSERT INTO ewidencjaPostepowanOfertowych_has_epoOdbiorca VALUES (:idEpo, :odbiorca)");
					$sql->bindValue(":idEpo", $idEpo, PDO::PARAM_INT);
					$sql->bindValue(":odbiorca", $this->arg["odbiorca"][$i], PDO::PARAM_INT);
					$res=$this->dbQuery($sql);
					$this->zapiszLogi($res["zrodlo"],"ewidencjaPostepowanOfertowych_zapisz");
				}
				for ($i=0; $i<count($this->arg["ruch"]); $i++)
				{
					$sql = $this->conn->prepare("INSERT INTO ewidencjaPostepowanOfertowych_has_epoRuch VALUES (:idEpo, :ruch)");
					$sql->bindValue(":idEpo", $idEpo, PDO::PARAM_INT);
					$sql->bindValue(":ruch", $this->arg["ruch"][$i], PDO::PARAM_INT);
					$res=$this->dbQuery($sql);
					$this->zapiszLogi($res["zrodlo"],"ewidencjaPostepowanOfertowych_zapisz");
				}
				for ($i=0; $i<count($this->arg["zamawiajacy"]); $i++)
				{
					$sql = $this->conn->prepare("INSERT INTO ewidencjaPostepowanOfertowych_has_epoZamawiajacy VALUES (:idEpo, :zamawiajacy)");
					$sql->bindValue(":idEpo", $idEpo, PDO::PARAM_INT);
					$sql->bindValue(":zamawiajacy", $this->arg["zamawiajacy"][$i], PDO::PARAM_INT);
					$this->zapiszLogi($res["zrodlo"],"ewidencjaPostepowanOfertowych_zapisz");
					$res=$this->dbQuery($sql);
				}
				for ($i=0; $i<count($this->arg["nrProjektu"]); $i++)
				{
					$sql = $this->conn->prepare("INSERT INTO ewidencjaPostepowanOfertowych_has_zlecenia VALUES (:idEpo, :nrProjektu)");
					$sql->bindValue(":idEpo", $idEpo, PDO::PARAM_INT);
					$sql->bindValue(":nrProjektu", $this->arg["nrProjektu"][$i], PDO::PARAM_INT);
					$res=$this->dbQuery($sql);
					$this->zapiszLogi($res["zrodlo"],"ewidencjaPostepowanOfertowych_zapisz");
				}
			}
			else
				$idEpo = -1;
	//		echo $res["blad"];
		}
		$this->dane["id"]=$idEpo;
		return $this->dane;
	}
	public function usun()
	{
		$sql = $this->conn->prepare("DELETE FROM ewidencjaPostepowanOfertowych WHERE id=:id");
		$sql->bindValue(':id', $this->arg["id"], PDO::PARAM_INT);
		$res=$this->dbQuery($sql);
		$this->zapiszLogi($res["zrodlo"],"ewidencjaPostepowanOfertowych_usun");
		if($res["blad"])
		{
			$ilosc=0;
		}
		else
		{
			$ilosc = $sql->rowCount();
		}
		$this->dane["ilosc"]=$ilosc;
		return $this->dane;
	}
}
?>