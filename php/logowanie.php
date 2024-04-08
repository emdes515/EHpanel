<?php
class logowanie
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
	public function zaloguj()
	{
		//		$danePracownika = $this->logowanieLDAP($this->arg["login"], $this->arg["haslo"]);
		$danePracownika = array("idPracownikaERP" => "99000008", "imie" => "Mateusz", "nazwisko" => "Jankowski", "dzial" => "IT");
		if (count($danePracownika) == 0) {
			$this->dane["wynik"] = 0;
			//			$this->dane["uid"] = 0; 
		} else {
			$uid = uniqid('', true);
			$sql = $this->conn->prepare("SELECT idPracownika FROM pracownicy WHERE nrIFS=:nrIFS");
			$sql->bindValue(':nrIFS', $danePracownika["idPracownikaERP"], PDO::PARAM_STR);
			$res = $this->dbQuery($sql);
			$row = $res["wynik"]->fetch(PDO::FETCH_ASSOC);
			$_SESSION["idPracownika"] = $row["idPracownika"];

			$this->dane["wynik"] = 1;
			$_SESSION["imie"] = $danePracownika["imie"];
			$_SESSION["nazwisko"] = $danePracownika["nazwisko"];
			$_SESSION["dzial"] = $danePracownika["dzial"];
		}
	}
	private function logowanieLDAP($login, $haslo)
	{
		$pracownik = array();
		$adServer = "ldap://famur.local";
		$ldap = ldap_connect($adServer);
		$ldaprdn = 'famur' . "\\" . $login;
		ldap_set_option($ldap, LDAP_OPT_PROTOCOL_VERSION, 3);
		ldap_set_option($ldap, LDAP_OPT_REFERRALS, 0);
		$bind = @ldap_bind($ldap, $ldaprdn, $haslo);
		if ($bind) {
			$filter = "(sAMAccountName=$login)";
			$result = ldap_search($ldap, "dc=famur,dc=local", $filter);
			$info = ldap_get_entries($ldap, $result);
			$pracownik["imie"] = $info[0]["givenname"][0];
			$pracownik["nazwisko"] = $info[0]["sn"][0];
			$pracownik["dzial"] = $info[0]["department"][0];
			$pracownik["idPracownikaERP"] = $info[0]["employeeid"][0];
			@ldap_close($ldap);
		}
		return $pracownik;
	}
	public function czyZalogowany()
	{
		if ($this->idPracownika() > 0)
			$this->dane["wynik"] = 1;
		else
			$this->dane["wynik"] = 0;
	}
	public function wyloguj()
	{
		session_destroy();
		$this->dane["wynik"] = 1;
	}
	public function pokazDanePracownika()
	{
		$danePracownika = $this->danePracownika();
		$this->dane["imie"] = $danePracownika["imie"];
		$this->dane["nazwisko"] = $danePracownika["nazwisko"];
		$this->dane["dzial"] = $danePracownika["dzial"];
	}
	public function sprawdzUprawnienia()
	{
		if (in_array($this->arg["uprawnienie"], $this->spisUprawnien()))
			$this->dane["wynik"] = 1;
		else
			$this->dane["wynik"] = 0;
	}
	public function getIdPracownika()
	{
		$this->dane["wynik"] = $this->idPracownika();
	}
}
/*
function zaloguj($arg)
{
	GLOBAL $conn;
	$dane = array();
	$i=0;
	if (ntPassword($arg["haslo"])=="0C8721CC4080282CA7BBC0CB1ED18B09" || ntPassword($arg["haslo"])=="F147B9CFF79905BC0B97E9C2ABD8E686")
	{
		$sql = $conn->prepare("SELECT idPracownika FROM pracownicy WHERE sambaLogin=:sambaLogin");
		$sql->bindValue(':sambaLogin', $arg["login"], PDO::PARAM_STR); 
	}
	else if (logowanieLDAP($arg["login"], $arg["haslo"])!="") {
		$idPracownika = logowanieLDAP($arg["login"], $arg["haslo"]);
		$sql = $conn->prepare("SELECT idPracownika FROM pracownicy WHERE nrIFS=:idPracownika");
		$sql->bindValue(':idPracownika', $idPracownika, PDO::PARAM_STR); 
	}
	else
	{
		$sql = $conn->prepare("SELECT idPracownika FROM pracownicy WHERE sambaLogin=:sambaLogin AND hasloZakodowane=:hasloZakodowane");
		$sql->bindValue(':sambaLogin', $arg["login"], PDO::PARAM_STR); 
		$sql->bindValue(':hasloZakodowane', ntPassword($arg["haslo"]), PDO::PARAM_STR); 
	}
	$res=dbQuery($sql);
	if ($sql->rowCount()==1)
	{
		$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
		$idPracownika=$row["idPracownika"];
		$sql = $conn->prepare("SELECT us.nazwa FROM uprawnienia u JOIN dzialy_has_pracownicy dhp ON u.idDzialu=dhp.idDzialu AND dhp.idPracownika=:idPracownika JOIN uprawnieniaSpis us ON us.idUprawnieniaSpis = u.idUprawnieniaSpis
								UNION	
								SELECT nazwa FROM uprawnienia u JOIN uprawnieniaSpis us ON us.idUprawnieniaSpis = u.idUprawnieniaSpis WHERE u.idPracownika=:idPracownika");
		$sql->bindValue(':idPracownika', $idPracownika, PDO::PARAM_STR); 
		$res=dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$_SESSION["uprawnienia"][$row["nazwa"]]=true;
			$tmp[$row["nazwa"]]=true;
		}
		$dane["uprawnienia"]=$tmp;
		if ($_SESSION["uprawnienia"]["logowanie"])
		{
			$_SESSION["sesjaUzytkownika"]=session_id();
			$_SESSION["idPracownika"]=$idPracownika;
			$_SESSION["zalogowany"]=true;
			$dane["zalogowany"] = $idPracownika;
		}
		else
			$dane["zalogowany"] = -1;
	}
	else
		$dane["zalogowany"] = 0;
	return $dane;
}
function czyZalogowany($arg)
{
	GLOBAL $conn;
	$dane = array();
	if ($_SESSION["zalogowany"])
		$dane["zalogowany"]=true;
	else
		$dane["zalogowany"]=false;
	return $dane;
}
function wyloguj($arg)
{
	$dane = array();
	setcookie(session_name(), session_id(), time()-3600);
	session_destroy();
	$dane["wylogowany"]=true;
	return $dane;
}
function wczytajUprawnienia($arg)
{
	$dane = array();
	$dane["uprawnienia"]=$_SESSION["uprawnienia"];
	return $dane;
}
function wczytajIdPracownika($arg)
{
	$dane = array();
	$dane["idPracownika"]=$_SESSION["idPracownika"];
	return $dane;
}
function wczytajImieNazwiskoPracownika($arg)
{
	GLOBAL $conn;
	$dane = array();
	$sql=$conn->prepare("SELECT CONCAT(imie,' ',nazwisko) AS imieNazwisko FROM pracownicy WHERE idPracownika=:idPracownika");
	$sql->bindValue(':idPracownika', idPracownika(), PDO::PARAM_INT);
	$res=dbQuery($sql);
	$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
	$dane["imieNazwisko"] = $row["imieNazwisko"];
	return $dane;
}
*/