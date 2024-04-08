<?php
class raportowanieCzasuPracy
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
	public function lista()
	{
		$stanyRaportowanychPrac = array(1 => "Niezatwierdzony", 2 => "Zatwierdzony", 3 => "Wyeksportowany");
		$typGodzin = array(1 => "zmiana A/B", 2 => "zmiana C", 4 => " - nadgodziny", 8 => " - zjazd");
		$dane = array();
		$i = 0;
		if (!$_SESSION["rcp"]["dataFiltrowania"])
			$_SESSION["rcp"]["dataFiltrowania"] = date('Y-m');
		//	if (!$arg["data"]) $arg["data"]=date('Y-m');
		if (in_array("rcp_raportyDzialu", $this->spisUprawnien()))
			$spisPracownikow = $this->spisIdPracownikow();
		else
			$spisPracownikow = $this->idPracownika();
		$sql = $this->conn->prepare("SELECT idCzasuPracy, CONCAT(p.nazwisko,' ',p.imie) nazwiskoImie, data, praceDlaSerwisu, dataUtworzenia, dataModyfikacji,
							dataZatwierdzenia, dataWyeksportowania, tworzacy, modyfikujacy, zatwierdzajacy, eksportujacy, cp.godziny, skladnikPlac, uwagi,
							cz.opis AS czynnosc, z.nrIFS AS nrIFS, temat, pozycjaIFS, zatwierdzony, wyeksportowany, urlop 
							FROM 
								czasPracy cp LEFT JOIN zlecenia z ON cp.idZlecenia=z.idZlecenia 
										  LEFT JOIN czynnosci cz ON cp.idCzynnosci=cz.idCzynnosci
										  LEFT JOIN pracownicy p ON cp.idPracownika=p.idPracownika
							WHERE data LIKE :data AND cp.idPracownika IN ($spisPracownikow)
							ORDER BY nazwiskoImie ASC, data ASC");
		$sql->bindValue(':data', $_SESSION["rcp"]["dataFiltrowania"] . "-%", PDO::PARAM_STR);
		$res = $this->dbQuery($sql);
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC)) {
			$tmp = array();
			$tmp["idCzasuPracy"] = $row["idCzasuPracy"];
			$tmp["imieNazwisko"] = $row["nazwiskoImie"];
			$tmp["data"] = $row["data"];

			if ($row["urlop"]) {
				$tmp["nrZlecenia"] = "Urlop";
				$tmp["temat"] = "Urlop";
				$tmp["czynnosc"] = "Urlop";
				$tmp["typGodzin"] = "Urlop";
				$tmp["godziny"] = $row["godziny"];
			} else {
				$tmp["nrZlecenia"] = $row["nrIFS"];
				if ($row["pozycjaIFS"])
					$tmp["nrZlecenia"] .= "." . $row["pozycjaIFS"];
				$tmp["temat"] = $row["temat"];
				$tmp["czynnosc"] = $row["czynnosc"];
				$tmp["godziny"] = $row["godziny"];
				$tmp["skladnikPlac"] = $row["skladnikPlac"];
				if ($row["skladnikPlac"] & 1)
					$tmp["typGodzin"] = "zmiana A/B";
				elseif ($row["skladnikPlac"] & 2)
					$tmp["typGodzin"] = "zmiana C";
				if ($row["skladnikPlac"] & 4)
					$tmp["typGodzin"] .= " - nadgodziny";
				if ($row["skladnikPlac"] & 8)
					$tmp["typGodzin"] .= " - zjazd";
			}

			$tmp["uwagi"] = $row["uwagi"];
			$tmp["urlop"] = $row["urlop"];
			$tmp["zatwierdzony"] = $row["zatwierdzony"];
			$tmp["wyeksportowany"] = $row["wyeksportowany"];
			if ($row["zatwierdzony"] == 0)
				$tmp["stan"] = "Niezatwierdzony";
			elseif (($row["zatwierdzony"] == 1) and ($row["wyeksportowany"] == 0))
				$tmp["stan"] = "Zatwierdzony";
			else
				$tmp["stan"] = "ERP";

			$dane[$i] = $tmp;
			$i++;
		}
		$this->dane = $dane;
	}
	public function spisDat()
	{
		$dane = array();
		$i = 0;
		$sql = $this->conn->prepare("SELECT EXTRACT(YEAR_MONTH FROM data) dataRM FROM czasPracy GROUP BY dataRM DESC");
		$res = $this->dbQuery($sql);
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC)) {
			$tmp = array();
			$tmp["data"] = substr($row["dataRM"], 0, 4) . "-" . substr($row["dataRM"], 4, 2);
			$dane[$i] = $tmp;
			$i++;
		}
		$this->dane = $dane;
	}
	private function spisIdPracownikow()
	{
		$dzialy = array();
		$sDzialy = "0";
		$sPracownicy = "0";
		$sql = $this->conn->prepare("SELECT idDzialu FROM dzialy_has_pracownicy WHERE idPracownika=:idPracownika");
		$sql->bindValue(':idPracownika', $this->idPracownika(), PDO::PARAM_INT);
		$res = $this->dbQuery($sql);
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC))
			$dzialy = array_merge($dzialy, $this->spisDzialow($row["idDzialu"], array()));
		if (is_array($dzialy))
			$sDzialy = implode(",", $dzialy);

		$sql = $this->conn->prepare("SELECT idPracownika FROM dzialy_has_pracownicy WHERE idDzialu IN ($sDzialy) AND dzialPodstawowy=1");
		$res = $this->dbQuery($sql);
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC))
			$pracownicy[] = $row["idPracownika"];
		if (is_array($pracownicy))
			$sPracownicy = implode(",", $pracownicy);
		return $sPracownicy;
	}
	public function zmienStanRaportu()
	{
		if ($this->sprawdzUprawnienia("rcp_zatwierdz")) {
			$sql = $this->conn->prepare("UPDATE czasPracy SET zatwierdzony=:zatwierdzony, zatwierdzajacy=:zatwierdzajacy WHERE idCzasuPracy=:idCzasuPracy");
			$sql->bindValue(':idCzasuPracy', $this->arg["idCzasuPracy"], PDO::PARAM_INT);
			$sql->bindValue(':zatwierdzony', $this->arg["zatwierdzony"], PDO::PARAM_INT);
			if ($this->arg["zatwierdzony"] == 1)
				$sql->bindValue(':zatwierdzajacy', $this->nazwaPracownika($this->idPracownika()), PDO::PARAM_STR);
			else
				$sql->bindValue(':zatwierdzajacy', "", PDO::PARAM_STR);
			$res = $this->dbQuery($sql);
			$this->dane["wynik"] = 1;
		} else {
			$this->dane["wynik"] = 0;
		}
	}
	public function listaPracownikowWDziale() //wyświetla listę pracowników w dziale w którym pracuje zalogowany pracownik
	{
		$i = 0;
		$sql = $this->conn->prepare("SELECT DISTINCT p.idPracownika, CONCAT(nazwisko,' ',imie) AS nazwiskoImie 
			FROM pracownicy AS p JOIN dzialy_has_pracownicy AS dhp ON p.idPracownika = dhp.idPracownika AND dhp.idDzialu IN (
			SELECT idDzialu FROM dzialy_has_pracownicy WHERE idPracownika=:idPracownika) AND p.widoczny=1 ORDER BY nazwiskoImie");
		$sql->bindValue(':idPracownika', $this->idPracownika(), PDO::PARAM_INT);
		$res = $this->dbQuery($sql);
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC)) {
			$tmp = array();
			$tmp["idPracownika"] = $row["idPracownika"];
			$tmp["nazwiskoImie"] = $row["nazwiskoImie"];
			$this->dane[$i] = $tmp;
			$i++;
		}
	}
	public function spisZlecen()
	{
		$i = 0;
		if ($this->arg["wszystkieZlecenia"]) {
			$sql = $this->conn->prepare("SELECT z.idZlecenia, nrIFS, pozycjaIFS, temat FROM zlecenia z, pracownicy_has_zlecenia phz
								WHERE z.zamkniete=FALSE AND z.idZlecenia=phz.idZlecenia
								GROUP BY idZlecenia
								ORDER BY nrIFS ASC, pozycjaIFS ASC");
		} else {
			if ($this->sprawdzUprawnienia("rcp_raportowanieInnychPracownikow"))
				$spisPracownikow = $this->spisIdPracownikow();
			else
				$spisPracownikow = $this->idPracownika();
			$sql = $this->conn->prepare("SELECT z.idZlecenia, nrIFS, pozycjaIFS, temat FROM zlecenia z, pracownicy_has_zlecenia phz
								WHERE z.zamkniete=FALSE AND z.idZlecenia=phz.idZlecenia AND phz.idPracownika IN ($spisPracownikow)
								GROUP BY idZlecenia
								ORDER BY nrIFS ASC, pozycjaIFS ASC");
		}
		//	$sql->bindValue(':idPracownika', $arg["idPracownika"], PDO::PARAM_INT);
		$res = $this->dbQuery($sql);
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC)) {
			$tmp = array();
			$tmp["idZlecenia"] = $row["idZlecenia"];
			$tmp["nazwa"] = $row["nrIFS"];
			if ($row["pozycjaIFS"])
				$tmp["nazwa"] .= "." . $row["pozycjaIFS"];
			$tmp["nazwa"] .= " - " . $row["temat"];
			$this->dane[$i] = $tmp;
			$i++;
		}
	}
}

/*
function drzewoZlecen($arg) {
	GLOBAL $conn;
	$dane = array();
	$i=0;
	$sql=$conn->prepare("SELECT id, idRodzica, idDziecka, nazwa FROM drzewoWersjiZlecenia WHERE zlecenia_idZlecenia=:idZlecenia");
	$sql->bindValue(':idZlecenia', $arg["idZlecenia"], PDO::PARAM_INT);
	$res=dbQuery($sql);
	while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
	{
		$tmp=array();
		$tmp["id"] = $row["idDziecka"];
		$tmp["parentid"] = $row["idRodzica"];
		$tmp["value"] = $row["id"];
		$tmp["text"] = $row["nazwa"];
		$dane[$i] = $tmp;
		$i++;
	}
	return $dane;
}
function spisCzynnosci($arg)
{	
	GLOBAL $conn;
	$dane = array();
	$i=0;
	$sql=$conn->prepare("SELECT idCzynnosci, id, opis, dataPoczatek, dataKoniec, IF((CURRENT_DATE()>=dataPoczatek AND CURRENT_DATE()<=dataKoniec) OR dataPoczatek='0000-00-00',1,0) AS wlaczone 
						FROM czynnosci WHERE drzewoWersjiZlecenia_id=:idDrzewa AND zamkniete=0 ORDER BY CAST(id AS UNSIGNED) ASC");
	$sql->bindValue(':idDrzewa', $arg["idDrzewa"], PDO::PARAM_INT);
	$res=dbQuery($sql);
	while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
	{
		$tmp=array();
		$tmp["idCzynnosci"] = $row["idCzynnosci"];
		$tmp["nazwa"] = $row["id"]." - ".$row["opis"];
		$tmp["wlaczone"] = $row["wlaczone"];
		$dane[$i] = $tmp;
		$i++;
	}
	return $dane;
}
function daneFormularz($arg)
{
	GLOBAL $conn;
	$dane = array();
	$sql=$conn->prepare("SELECT * FROM czasPracy WHERE idCzasuPracy=:idCzasuPracy");
	$sql->bindValue(':idCzasuPracy', $arg["idCzasuPracy"], PDO::PARAM_INT);
	$res=dbQuery($sql);
	$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
	$dane["idPracownika"] = $row["idPracownika"];
	$dane["idCzasuPracy"] = $row["idCzasuPracy"];
	$dane["idZlecenia"] = $row["idZlecenia"];
	$dane["idCzynnosci"] = $row["idCzynnosci"];
	$dane["data"] = $row["data"];
	$dane["godziny"] = $row["godziny"];
	$dane["urlop"] = $row["urlop"];
	$dane["praceDlaSerwisu"] = $row["praceDlaSerwisu"];
	if ($row["skladnikPlac"]&1)
		$dane["zmiana"]=1; //zmiana A/B
	elseif ($row["skladnikPlac"]&2)
		$dane["zmiana"]=2; //zmiana C
	if ($row["skladnikPlac"]&4) //nadgodziny
		$dane["nadgodziny"]= 1;
	else
		$dane["nadgodziny"]= 0;
	if ($row["skladnikPlac"]&8) //zjazd
		$dane["zjazd"] = 1;
	else
		$dane["zjazd"] = 0;
	$dane["uwagi"] = $row["uwagi"];
	$dane["zatwierdzony"] = $row["zatwierdzony"];
	$dane["idDziecka"] = 0;
	$sql=$conn->prepare("SELECT dwz.idDziecka FROM czynnosci AS cz JOIN drzewoWersjiZlecenia AS dwz ON cz.drzewoWersjiZlecenia_id=dwz.id WHERE cz.idCzynnosci=:idCzynnosci");
	$sql->bindValue(':idCzynnosci', $row["idCzynnosci"], PDO::PARAM_INT);
	$res=dbQuery($sql);
	$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
	$dane["idDziecka"] = $row["idDziecka"];
	return $dane;
}

function zapisz($arg)
{
	GLOBAL $conn;
	$dane = array();
	if ($arg["idCzasuPracy"]==0)
	{
		if ($arg["urlop"]==1)
		{
			$sql = $conn->prepare("INSERT INTO czasPracy VALUES (NULL, NULL, NULL, :idPracownika, :data, :godziny, 1, :uwagi, :zatwierdzony, 0,
			:urlop, 0, NOW(), NULL, NULL, NULL, :tworzacy, NULL, :zatwierdzajacy, NULL, NULL,'')");
			$sql->bindValue(":idPracownika", $arg["idPracownika"], PDO::PARAM_INT);
			$sql->bindValue(":data", $arg["data"], PDO::PARAM_STR);
			$sql->bindValue(":godziny", str_replace(",",".",$arg["godziny"]), PDO::PARAM_STR);
//			$sql->bindValue(":godziny", "8", PDO::PARAM_STR);
			$sql->bindValue(":uwagi", $arg["uwagi"], PDO::PARAM_STR);
			$sql->bindValue(":urlop", $arg["urlop"], PDO::PARAM_STR);
			$sql->bindValue(":zatwierdzony", $arg["zatwierdzony"], PDO::PARAM_INT);
			if ($arg["zatwierdzony"]==1)
				$sql->bindValue(':zatwierdzajacy', nazwaPracownika(idPracownika()), PDO::PARAM_STR);
			else
				$sql->bindValue(':zatwierdzajacy', "", PDO::PARAM_STR);
			$sql->bindValue(":tworzacy", nazwaPracownika(idPracownika()), PDO::PARAM_STR);
			$res=dbQuery($sql);
			$idCzasuPracy = $conn->lastInsertId();
		}
		else
		{
			//sprawdzenie czy nie ma dwóch tych samych raportów z różnymi godzinami
			$sql = $conn->prepare("SELECT * FROM czasPracy WHERE idCzynnosci=:idCzynnosci AND idZlecenia=:idZlecenia AND idPracownika=:idPracownika AND
			data=:data AND godziny=:godziny AND skladnikPlac=:skladnikPlac AND uwagi=:uwagi	AND urlop=:urlop AND praceDlaSerwisu=:praceDlaSerwisu AND 
			tworzacy=:tworzacy");
			$sql->bindValue(":idCzynnosci", $arg["idCzynnosci"], PDO::PARAM_INT);
			$sql->bindValue(":idZlecenia", $arg["idZlecenia"], PDO::PARAM_INT);
			$sql->bindValue(":idPracownika", $arg["idPracownika"], PDO::PARAM_INT);
			$sql->bindValue(":data", $arg["data"], PDO::PARAM_STR);
			$sql->bindValue(":godziny", str_replace(",",".",$arg["godziny"]), PDO::PARAM_STR);
			$sql->bindValue(":skladnikPlac", $arg["skladnikPlac"], PDO::PARAM_STR);
			$sql->bindValue(":uwagi", $arg["uwagi"], PDO::PARAM_STR);
			$sql->bindValue(":urlop", $arg["urlop"], PDO::PARAM_STR);
			$sql->bindValue(":praceDlaSerwisu", $arg["praceDlaSerwisu"], PDO::PARAM_STR);
			$sql->bindValue(":tworzacy", nazwaPracownika(idPracownika()), PDO::PARAM_STR);
			$res=dbQuery($sql);
			if ($sql->rowCount()==0)
			{
				$sql = $conn->prepare("INSERT INTO czasPracy VALUES (NULL, :idCzynnosci, :idZlecenia, :idPracownika, :data, :godziny, :skladnikPlac, :uwagi,
				:zatwierdzony, 0, :urlop, :praceDlaSerwisu, NOW(), NULL, NULL, NULL, :tworzacy, NULL, :zatwierdzajacy, NULL, NULL,'')");
				$sql->bindValue(":idCzynnosci", $arg["idCzynnosci"], PDO::PARAM_INT);
				$sql->bindValue(":idZlecenia", $arg["idZlecenia"], PDO::PARAM_INT);
				$sql->bindValue(":idPracownika", $arg["idPracownika"], PDO::PARAM_INT);
				$sql->bindValue(":data", $arg["data"], PDO::PARAM_STR);
				$sql->bindValue(":godziny", str_replace(",",".",$arg["godziny"]), PDO::PARAM_STR);
				$sql->bindValue(":skladnikPlac", $arg["skladnikPlac"], PDO::PARAM_STR);
				$sql->bindValue(":uwagi", $arg["uwagi"], PDO::PARAM_STR);
				$sql->bindValue(":urlop", $arg["urlop"], PDO::PARAM_STR);
				$sql->bindValue(":zatwierdzony", $arg["zatwierdzony"], PDO::PARAM_INT);
				if ($arg["zatwierdzony"]==1)
					$sql->bindValue(':zatwierdzajacy', nazwaPracownika(idPracownika()), PDO::PARAM_STR);
				else
					$sql->bindValue(':zatwierdzajacy', "", PDO::PARAM_STR);
				$sql->bindValue(":praceDlaSerwisu", $arg["praceDlaSerwisu"], PDO::PARAM_STR);
				$sql->bindValue(":tworzacy", nazwaPracownika(idPracownika()), PDO::PARAM_STR);
				$res=dbQuery($sql);
				echo $res["blad"];
				$idCzasuPracy = $conn->lastInsertId();
			}
			else
				$idCzasuPracy=1;
		}
	}
	else
	{
		if ($arg["urlop"]==1)
		{
			$sql = $conn->prepare("UPDATE czasPracy SET idCzynnosci=NULL, idZlecenia=NULL, idPracownika=:idPracownika,
			data=:data, godziny=8, skladnikPlac=1, uwagi=:uwagi, zatwierdzony=:zatwierdzony, urlop=:urlop, praceDlaSerwisu=0,
			dataModyfikacji=NOW(), modyfikujacy=:modyfikujacy, zatwierdzajacy=:zatwierdzajacy
			WHERE idCzasuPracy=:idCzasuPracy");
			$sql->bindValue(":idCzasuPracy", $arg["idCzasuPracy"], PDO::PARAM_INT);
			$sql->bindValue(":idPracownika", $arg["idPracownika"], PDO::PARAM_INT);
			$sql->bindValue(":data", $arg["data"], PDO::PARAM_STR);
			$sql->bindValue(":uwagi", $arg["uwagi"], PDO::PARAM_STR);
			$sql->bindValue(":zatwierdzony", $arg["zatwierdzony"], PDO::PARAM_INT);
			if ($arg["zatwierdzony"]==1)
				$sql->bindValue(':zatwierdzajacy', nazwaPracownika(idPracownika()), PDO::PARAM_STR);
			else
				$sql->bindValue(':zatwierdzajacy', "", PDO::PARAM_STR);
			$sql->bindValue(":urlop", $arg["urlop"], PDO::PARAM_STR);
			$sql->bindValue(":modyfikujacy", nazwaPracownika(idPracownika()), PDO::PARAM_STR);
		}
		else
		{
			$sql = $conn->prepare("UPDATE czasPracy SET idCzynnosci=:idCzynnosci, idZlecenia=:idZlecenia, idPracownika=:idPracownika,
			data=:data, godziny=:godziny, skladnikPlac=:skladnikPlac, uwagi=:uwagi, zatwierdzony=:zatwierdzony, urlop=:urlop, praceDlaSerwisu=:praceDlaSerwisu,
			dataModyfikacji=NOW(), modyfikujacy=:modyfikujacy, zatwierdzajacy=:zatwierdzajacy
			WHERE idCzasuPracy=:idCzasuPracy");
			$sql->bindValue(":idCzasuPracy", $arg["idCzasuPracy"], PDO::PARAM_INT);
			$sql->bindValue(":idCzynnosci", $arg["idCzynnosci"], PDO::PARAM_INT);
			$sql->bindValue(":idZlecenia", $arg["idZlecenia"], PDO::PARAM_INT);
			$sql->bindValue(":idPracownika", $arg["idPracownika"], PDO::PARAM_INT);
			$sql->bindValue(":data", $arg["data"], PDO::PARAM_STR);
			$sql->bindValue(":godziny", str_replace(",",".",$arg["godziny"]), PDO::PARAM_STR);
			$sql->bindValue(":skladnikPlac", $arg["skladnikPlac"], PDO::PARAM_STR);
			$sql->bindValue(":zatwierdzony", $arg["zatwierdzony"], PDO::PARAM_INT);
			if ($arg["zatwierdzony"]==1)
				$sql->bindValue(':zatwierdzajacy', nazwaPracownika(idPracownika()), PDO::PARAM_STR);
			else
				$sql->bindValue(':zatwierdzajacy', "", PDO::PARAM_STR);
			$sql->bindValue(":uwagi", $arg["uwagi"], PDO::PARAM_STR);
			$sql->bindValue(":urlop", $arg["urlop"], PDO::PARAM_STR);
			$sql->bindValue(":praceDlaSerwisu", $arg["praceDlaSerwisu"], PDO::PARAM_STR);
			$sql->bindValue(":modyfikujacy", nazwaPracownika(idPracownika()), PDO::PARAM_STR);
		}
		$res=dbQuery($sql);
//		echo $res["blad"];
		$idCzasuPracy=$arg["idCzasuPracy"];
	}
	$dane["id"]=$idCzasuPracy;
	return $dane;
}
function usun($arg)
{
	GLOBAL $conn;
	$dane = array();
	$sql = $conn->prepare("DELETE FROM czasPracy WHERE idCzasuPracy=:idCzasuPracy");
	$sql->bindValue(':idCzasuPracy', $arg["idCzasuPracy"], PDO::PARAM_INT);
	$res=dbQuery($sql);
	if($res["blad"])
	{
		$ilosc=0;
	}
	else
	{
		$ilosc = $sql->rowCount();
	}
	$dane["id"]=$ilosc;
	return $dane;
}

function duplikacjaRaportu($arg)
{
	GLOBAL $conn;
	$dane = array();
	$dane["id"]=$idCzasuPracy;
	$sql = $conn->prepare("SELECT * FROM czasPracy WHERE idCzasuPracy=:idCzasuPracy");
	$sql->bindValue(':idCzasuPracy', $arg["idCzasuPracy"], PDO::PARAM_INT);
	$res=dbQuery($sql);
	$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
	if (czyZlecenieZamkniete($row["idZlecenia"])) {
		$dane["id"]=-1;
	}
	else {
		$sql = $conn->prepare("INSERT INTO czasPracy VALUES (NULL, :idCzynnosci, :idZlecenia, :idPracownika, :data, :godziny, :skladnikPlac, :uwagi, 0, 0,
		:urlop, :praceDlaSerwisu, NOW(), NULL, NULL, NULL, :tworzacy, NULL, NULL, NULL, NULL,'')");
		$sql->bindValue(":idCzynnosci", $row["idCzynnosci"], PDO::PARAM_INT);
		$sql->bindValue(":idZlecenia", $row["idZlecenia"], PDO::PARAM_INT);
		$sql->bindValue(":idPracownika", $row["idPracownika"], PDO::PARAM_INT);
		$dt = date("N",strtotime($row["data"]));
		$data = date_create($row["data"]);
		if ($dt > 4)
			date_add($data,date_interval_create_from_date_string((8-$dt)." days"));
		else
			date_add($data,date_interval_create_from_date_string("1 days"));
		$sql->bindValue(":data", date_format($data,"Y-m-d"), PDO::PARAM_STR);
		$sql->bindValue(":godziny", $row["godziny"], PDO::PARAM_STR);
		$sql->bindValue(":skladnikPlac", $row["skladnikPlac"], PDO::PARAM_STR);
		$sql->bindValue(":uwagi", $row["uwagi"], PDO::PARAM_STR);
		$sql->bindValue(":urlop", $row["urlop"], PDO::PARAM_STR);
		$sql->bindValue(":praceDlaSerwisu", $row["praceDlaSerwisu"], PDO::PARAM_STR);
		$sql->bindValue(":tworzacy", nazwaPracownika(idPracownika()), PDO::PARAM_STR);
		$res=dbQuery($sql);
		$dane["id"] = $conn->lastInsertId();
	}
	return $dane;
}
function czyZlecenieZamkniete($idZlecenia)
{
	GLOBAL $conn;
	$sql = $conn->prepare("SELECT * FROM zlecenia WHERE idZlecenia=:idZlecenia");
	$sql->bindValue(':idZlecenia', $idZlecenia, PDO::PARAM_INT);
	$res=dbQuery($sql);
	$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
	if ($row["zamkniete"]==1)
		return true;
	else
		return false;
}
function ustawDateFiltrowania($arg)
{
	$dane = array();
	$_SESSION["rcp"]["dataFiltrowania"]=$arg["data"];
	return $dane;
}
function przekroczenieGodzinNaCzynnosci($arg)
{
	GLOBAL $conn;
	$dane = array();
	$dane["godzinyPlanowane"] = 0;
	$dane["sumaZaraportowanychGodzin"] = 0;
	$sql = $conn->prepare("SELECT czynnosci.godzinyPlanowane , sum(ifnull(czasPracy.godziny,0))  AS sumaZaraportowanychGodzin 
		FROM czasPracy RIGHT JOIN czynnosci ON czasPracy.idCzynnosci=czynnosci.idCzynnosci 
		WHERE czynnosci.idCzynnosci=:idCzynnosci AND czynnosci.godzinyPlanowane is not null and czynnosci.godzinyPlanowane>0
		GROUP BY czynnosci.godzinyPlanowane"); 
	$sql->bindValue(':idCzynnosci', $arg["idCzynnosci"], PDO::PARAM_INT);
	$res=dbQuery($sql);
	if ($sql->rowCount()>0) {
		$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
		$dane["godzinyPlanowane"] = $row["godzinyPlanowane"];
		$dane["sumaZaraportowanychGodzin"] = $row["sumaZaraportowanychGodzin"];
	}
	return $dane;
}
function qrDaneZlecenia($arg)
{
	GLOBAL $conn;
	$dane = array();
	$sql = $conn->prepare("SELECT zlecenia.idZlecenia, concat(zlecenia.nrIFS, ' - ', zlecenia.temat) AS nazwaZlecenia, drzewoWersjiZlecenia.nazwa AS nazwaDrzewaZlecenia, czynnosci.idCzynnosci, czynnosci.opis AS opisCzynnosci, zlecenia.zamkniete AS zlecenieZamkniete, czynnosci.zamkniete AS czynnoscZamknieta
	FROM zlecenia JOIN drzewoWersjiZlecenia ON zlecenia.idZlecenia = drzewoWersjiZlecenia.zlecenia_idZlecenia JOIN czynnosci ON drzewoWersjiZlecenia.id = czynnosci.drzewoWersjiZlecenia_id
	WHERE czynnosci.idCzynnosci=:idCzynnosci"); 
	$sql->bindValue(':idCzynnosci', $arg["idCzynnosci"], PDO::PARAM_INT);
	$res=dbQuery($sql);
	if ($sql->rowCount()>0) {
		$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
		if ($row["zlecenieZamkniete"] == 1) {
			$dane["blad"] = "qrZlecenieZamkniete";
		} else if ($row["czynnoscZamknieta"] == 1) {
			$dane["blad"] = "qrCzynnoscZamknieta";
		} else {
			$dane["idZlecenia"] = $row["idZlecenia"];
			$dane["nazwaZlecenia"] = $row["nazwaZlecenia"];
			$dane["nazwaDrzewaZlecenia"] = $row["nazwaDrzewaZlecenia"];
			$dane["idCzynnosci"] = $row["idCzynnosci"];
			$dane["opisCzynnosci"] = $row["opisCzynnosci"];
			$dane["godzinyPlanowane"] = 0;
			$dane["sumaZaraportowanychGodzin"] = 0;
			$sql = $conn->prepare("SELECT czynnosci.godzinyPlanowane , sum(ifnull(czasPracy.godziny,0))  AS sumaZaraportowanychGodzin 
				FROM czasPracy RIGHT JOIN czynnosci ON czasPracy.idCzynnosci=czynnosci.idCzynnosci 
				WHERE czynnosci.idCzynnosci=:idCzynnosci AND czynnosci.godzinyPlanowane is not null and czynnosci.godzinyPlanowane>0
				GROUP BY czynnosci.godzinyPlanowane"); 
			$sql->bindValue(':idCzynnosci', $dane["idCzynnosci"], PDO::PARAM_INT);
			$res=dbQuery($sql);
			if ($sql->rowCount()>0) {
				$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
				$dane["godzinyPlanowane"] = $row["godzinyPlanowane"];
				$dane["sumaZaraportowanychGodzin"] = $row["sumaZaraportowanychGodzin"];
			}
		}
	}
	else {
		$dane["blad"] = "qrZlecenieBrak";
	}
	return $dane;

}
*/