<?PHP
class pracownicy
{
	use db;
	use library;

	private $arg;

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

	public function pracownicy($arg)
	{
		if (function_exists($arg["funkcja"]))
			return $arg["funkcja"]($arg);
		else {
			die('Moduł: ' . $arg['modul'] . '<br>Brak funkcji: ' . $arg["funkcja"]);
		}
	}

	public function lista()
	{
		$dane = array();
		$i = 0;
		$sql = $this->conn->prepare("SELECT idPracownika, imie, nazwisko, sambaLogin FROM pracownicy ORDER BY nazwisko ASC, imie ASC");
		$res = $this->dbQuery($sql);
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC)) {
			$tmp = array();
			$tmp["idPracownika"] = $row["idPracownika"];
			if (($row["imie"] == "") and ($row["nazwisko"] == ""))
				$tmp["nazwiskoImie"] = $row["sambaLogin"];
			else
				$tmp["nazwiskoImie"] = $row["nazwisko"] . " " . $row["imie"];
			$dane[$i] = $tmp;
			$i++;
		}

		$this->dane = $dane;
	}

	public function formularz()
	{
		$dane = array();
		$dane["dzial"] = array();
		$i = 0;
		$sql = $this->conn->prepare("SELECT * FROM pracownicy WHERE idPracownika=:idPracownika");
		$sql->bindValue(':idPracownika', $this->arg["idPracownika"], PDO::PARAM_INT);
		$res = $this->dbQuery($sql);
		$row = $res["wynik"]->fetch(PDO::FETCH_ASSOC);
		$dane["imie"] = $row["imie"];
		$dane["nazwisko"] = $row["nazwisko"];
		$dane["proxNetId"] = $row["proxNetId"];
		$dane["nrIFS"] = $row["nrIFS"];
		$dane["sambaLogin"] = $row["sambaLogin"];
		$dane["email"] = $row["email"];
		$dane["emailEH"] = $row["emailEH"];
		$dane["wyslacPasek"] = $row["wyslacPasek"];
		$dane["wyslacPowiadomieniaZleceniaWewnetrznego"] = $row["wyslacPowiadomieniaZleceniaWewnetrznego"];
		$dane["etat"] = $row["etat"];
		$dane["kierownik"] = $row["kierownik"];
		$dane["widoczny"] = $row["widoczny"];
		$sql = $this->conn->prepare("SELECT * FROM dzialy_has_pracownicy WHERE idPracownika=:idPracownika");
		$sql->bindValue(':idPracownika', $this->arg["idPracownika"], PDO::PARAM_INT);
		$res = $this->dbQuery($sql);
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC)) {
			$tmp = array();
			$tmp["idDzialu"] = $row["idDzialu"];
			$tmp["dzialPodstawowy"] = $row["dzialPodstawowy"];
			$dane["dzial"][$i] = $tmp;
			$i++;
		}

		$this->dane = $dane;
	}

	public function zapisz()
	{
		$dane = array();
		$blad = false;

		$algrotytmHashowania = 'sha256';

		if ($this->arg["email"] == "")
			$this->arg["wyslacPasek"] = 0;
		//	echo "UPDATE pracownicy SET proxNetId=".$arg["proxNetId"].", nrIFS=".$arg["nrIFS"].", imie=".$arg["imie"].", nazwisko=".$arg["nazwisko"].", sambaLogin=".$arg["sambaLogin"].", email=".$arg["email"].", etat=".$arg["etat"].", kierownik=".$arg["kierownik"].", widoczny=".$arg["widoczny"].", wyslacPasek=".$arg["wyslacPasek"].", emailEH=".$arg["emailEH"]." WHERE idPracownika=".$arg["idPracownika"]."";
		$sql = $this->conn->prepare("UPDATE pracownicy SET proxNetId=:proxNetId, nrIFS=:nrIFS, imie=:imie, nazwisko=:nazwisko, sambaLogin=:sambaLogin, email=:email, etat=:etat, kierownik=:kierownik, widoczny=:widoczny, wyslacPasek=:wyslacPasek, emailEH=:emailEH, wyslacPowiadomieniaZleceniaWewnetrznego=:wyslacPowiadomieniaZleceniaWewnetrznego WHERE idPracownika=:idPracownika");
		$sql->bindValue(":idPracownika", $this->arg["idPracownika"], PDO::PARAM_INT);
		$sql->bindValue(":proxNetId", $this->arg["proxNetId"], PDO::PARAM_STR);
		if (trim($this->arg["nrIFS"]) == "") $this->arg["nrIFS"] = null;
		$sql->bindValue(":nrIFS", $this->arg["nrIFS"], PDO::PARAM_STR);
		$sql->bindValue(":imie", $this->arg["imie"], PDO::PARAM_STR);
		$sql->bindValue(":nazwisko", $this->arg["nazwisko"], PDO::PARAM_STR);
		$sql->bindValue(":sambaLogin", $this->arg["sambaLogin"], PDO::PARAM_STR);
		$sql->bindValue(":email", $this->arg["email"], PDO::PARAM_STR);
		$sql->bindValue(":wyslacPasek", $this->arg["wyslacPasek"], PDO::PARAM_INT);
		$sql->bindValue(":etat", str_replace(",", ".", $this->arg["etat"]), PDO::PARAM_STR);
		$sql->bindValue(":kierownik", $this->arg["kierownik"], PDO::PARAM_INT);
		$sql->bindValue(":widoczny", $this->arg["widoczny"], PDO::PARAM_INT);
		$sql->bindValue(":emailEH", $this->arg["emailEH"], PDO::PARAM_STR);
		$sql->bindValue(":wyslacPowiadomieniaZleceniaWewnetrznego", $this->arg["wyslacPowiadomieniaZleceniaWewnetrznego"], PDO::PARAM_STR);
		$res = $this->dbQuery($sql);
		echo $res["blad"];
		if ($res["blad"]) $blad = true;

		if (($this->arg["noweHaslo"] <> "") && ($this->arg["noweHaslo"] == $this->arg["noweHaslo"])) {
			$sql = $this->conn->prepare("UPDATE pracownicy SET hasloZakodowane=:noweHaslo WHERE idPracownika=:idPracownika");
			$sql->bindValue(':idPracownika', $this->arg["idPracownika"], PDO::PARAM_INT);
			$sql->bindValue(':noweHaslo', hash($algrotytmHashowania, $this->arg["noweHaslo"]), PDO::PARAM_STR);
			$res = $this->dbQuery($sql);
			if ($res["blad"]) $blad = true;
		}
		$sql = $this->conn->prepare("DELETE FROM dzialy_has_pracownicy WHERE idPracownika=:idPracownika");
		$sql->bindValue(":idPracownika", $this->arg["idPracownika"], PDO::PARAM_INT);
		$res = $this->dbQuery($sql);
		if ($res["blad"]) $blad = true;
		//if (is_array($this->arg["dzial"]))
		//		while(list($klucz, $wartosc) = each($arg["dzial"]))
		//foreach ($this->arg["dzial"] as $klucz => $wartosc) {
		//			echo "zapisz";
		//$sql = $this->conn->prepare("INSERT INTO dzialy_has_pracownicy VALUES (:idDzialu, :idPracownika, :dzialPodstawowy)");
		//	$sql->bindValue(":idDzialu", $wartosc["idDzialu"], PDO::PARAM_INT);
		//	$sql->bindValue(":idPracownika", $this->arg["idPracownika"], PDO::PARAM_INT);
		//	$sql->bindValue(":dzialPodstawowy", $wartosc["dzialPodstawowy"], PDO::PARAM_INT);
		//	$res = $this->dbQuery($sql);
		if ($res["blad"]) $blad = true;

		if ($res["blad"])
			$dane["idPracownika"] = 0;
		else
			$dane["idPracownika"] = $this->arg["idPracownika"];

		$this->dane = $dane;
	}

	public function dodaj()
	{
		$dane = array();
		$blad = false;

		$algrotytmHashowania = 'MD5';

		if ($this->arg["email"] == "")
			$this->arg["wyslacPasek"] = 0;

		echo json_encode($this->arg["imie"]);

		$sql = $this->conn->prepare("INSERT INTO pracownicy 
		(proxNetId, nrIFS, imie, nazwisko, sambaLogin, email, wyslacPasek, etat, kierownik, widoczny, emailEH, wyslacPowiadomieniaZleceniaWewnetrznego, hasloZakodowane)
		VALUES
		(:proxNetId, :nrIFS, :imie, :nazwisko, :sambaLogin, :email, :wyslacPasek, :etat, :kierownik, :widoczny, :emailEH, :wyslacPowiadomieniaZleceniaWewnetrznego, :hasloZakodowane)");

		if (trim($this->arg["proxNetId"]) == "") $this->arg["proxNetId"] = null;
		$sql->bindValue(":proxNetId", $this->arg["proxNetId"], PDO::PARAM_STR);
		if (trim($this->arg["nrIFS"]) == "") $this->arg["nrIFS"] = null;
		$sql->bindValue(":nrIFS", $this->arg["nrIFS"], PDO::PARAM_STR);
		$sql->bindValue(":imie", $this->arg["imie"], PDO::PARAM_STR);
		$sql->bindValue(":nazwisko", $this->arg["nazwisko"], PDO::PARAM_STR);
		$sql->bindValue(":sambaLogin", $this->arg["sambaLogin"], PDO::PARAM_STR);
		$sql->bindValue(":email", $this->arg["email"], PDO::PARAM_STR);
		$sql->bindValue(":wyslacPasek", $this->arg["wyslacPasek"], PDO::PARAM_INT);
		$sql->bindValue(":etat", str_replace(",", ".", $this->arg["etat"]), PDO::PARAM_STR);
		$sql->bindValue(":kierownik", $this->arg["kierownik"], PDO::PARAM_INT);
		$sql->bindValue(":widoczny", $this->arg["widoczny"], PDO::PARAM_INT);
		$sql->bindValue(":emailEH", $this->arg["emailEH"], PDO::PARAM_STR);
		$sql->bindValue(":wyslacPowiadomieniaZleceniaWewnetrznego", $this->arg["wyslacPowiadomieniaZleceniaWewnetrznego"], PDO::PARAM_STR);
		$sql->bindValue(':hasloZakodowane', hash($algrotytmHashowania, $this->arg["noweHaslo"]), PDO::PARAM_STR);

		$res = $this->dbQuery($sql);

		$dane = $this->arg;

		$this->dane = $dane;
	}
}

/*
function pracownicy($arg)
{
if (function_exists($arg["funkcja"]))
return $arg["funkcja"]($arg);
else
{
die('Moduł: '.$arg['modul'].'<br>Brak funkcji: '.$arg["funkcja"]);
}
}
function lista($arg)
{
GLOBAL $conn;
$dane = array();
$i=0;
$sql = $conn->prepare("SELECT idPracownika, imie, nazwisko, sambaLogin FROM pracownicy ORDER BY nazwisko ASC, imie
ASC");
$res=dbQuery($sql);
while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
{
$tmp=array();
$tmp["idPracownika"] = $row["idPracownika"];
if (($row["imie"]=="") AND ($row["nazwisko"]==""))
$tmp["nazwiskoImie"]=$row["sambaLogin"];
else
$tmp["nazwiskoImie"]=$row["nazwisko"]." ".$row["imie"];
$dane[$i] = $tmp;
$i++;
}
return $dane;
}
function formularz($arg)
{
GLOBAL $conn;
$dane = array();
$dane["dzial"]=array();
$i=0;
$sql = $conn->prepare("SELECT * FROM pracownicy WHERE idPracownika=:idPracownika");
$sql->bindValue(':idPracownika', $arg["idPracownika"], PDO::PARAM_INT);
$res=dbQuery($sql);
$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
$dane["imie"] = $row["imie"];
$dane["nazwisko"] = $row["nazwisko"];
$dane["proxNetId"] = $row["proxNetId"];
$dane["nrIFS"] = $row["nrIFS"];
$dane["sambaLogin"] = $row["sambaLogin"];
$dane["email"] = $row["email"];
$dane["emailEH"] = $row["emailEH"];
$dane["wyslacPasek"] = $row["wyslacPasek"];
$dane["wyslacPowiadomieniaZleceniaWewnetrznego"] = $row["wyslacPowiadomieniaZleceniaWewnetrznego"];
$dane["etat"] = $row["etat"];
$dane["kierownik"] = $row["kierownik"];
$dane["widoczny"] = $row["widoczny"];
$sql = $conn->prepare("SELECT * FROM dzialy_has_pracownicy WHERE idPracownika=:idPracownika");
$sql->bindValue(':idPracownika', $arg["idPracownika"], PDO::PARAM_INT);
$res=dbQuery($sql);
while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
{
$tmp=array();
$tmp["idDzialu"]=$row["idDzialu"];
$tmp["dzialPodstawowy"]=$row["dzialPodstawowy"];
$dane["dzial"][$i] = $tmp;
$i++;
}
return $dane;
}
function zapisz($arg)
{
GLOBAL $conn;
$dane = array();
$blad = false;
if ($arg["email"]=="")
$arg["wyslacPasek"] = 0;
// echo "UPDATE pracownicy SET proxNetId=".$arg["proxNetId"].", nrIFS=".$arg["nrIFS"].", imie=".$arg["imie"].",
nazwisko=".$arg["nazwisko"].", sambaLogin=".$arg["sambaLogin"].", email=".$arg["email"].", etat=".$arg["etat"].",
kierownik=".$arg["kierownik"].", widoczny=".$arg["widoczny"].", wyslacPasek=".$arg["wyslacPasek"].",
emailEH=".$arg["emailEH"]." WHERE idPracownika=".$arg["idPracownika"]."";
$sql = $conn->prepare("UPDATE pracownicy SET proxNetId=:proxNetId, nrIFS=:nrIFS, imie=:imie, nazwisko=:nazwisko,
sambaLogin=:sambaLogin, email=:email, etat=:etat, kierownik=:kierownik, widoczny=:widoczny, wyslacPasek=:wyslacPasek,
emailEH=:emailEH, wyslacPowiadomieniaZleceniaWewnetrznego=:wyslacPowiadomieniaZleceniaWewnetrznego WHERE
idPracownika=:idPracownika");
$sql->bindValue(":idPracownika", $arg["idPracownika"], PDO::PARAM_INT);
$sql->bindValue(":proxNetId", $arg["proxNetId"], PDO::PARAM_STR);
if (trim($arg["nrIFS"])=="") $arg["nrIFS"]=null;
$sql->bindValue(":nrIFS", $arg["nrIFS"], PDO::PARAM_STR);
$sql->bindValue(":imie", $arg["imie"], PDO::PARAM_STR);
$sql->bindValue(":nazwisko", $arg["nazwisko"], PDO::PARAM_STR);
$sql->bindValue(":sambaLogin", $arg["sambaLogin"], PDO::PARAM_STR);
$sql->bindValue(":email", $arg["email"], PDO::PARAM_STR);
$sql->bindValue(":wyslacPasek", $arg["wyslacPasek"], PDO::PARAM_INT);
$sql->bindValue(":etat", str_replace(",",".",$arg["etat"]), PDO::PARAM_STR);
$sql->bindValue(":kierownik", $arg["kierownik"], PDO::PARAM_INT);
$sql->bindValue(":widoczny", $arg["widoczny"], PDO::PARAM_INT);
$sql->bindValue(":emailEH", $arg["emailEH"], PDO::PARAM_STR);
$sql->bindValue(":wyslacPowiadomieniaZleceniaWewnetrznego", $arg["wyslacPowiadomieniaZleceniaWewnetrznego"],
PDO::PARAM_STR);
$res=dbQuery($sql);
echo $res["blad"];
if($res["blad"]) $blad = true;

if (($arg["noweHaslo"]<>"") && ($arg["noweHaslo"]==$arg["noweHaslo"]))
	{
	$sql = $conn->prepare("UPDATE pracownicy SET hasloZakodowane=:noweHaslo WHERE idPracownika=:idPracownika");
	$sql->bindValue(':idPracownika', $arg["idPracownika"], PDO::PARAM_INT);
	$sql->bindValue(':noweHaslo', ntPassword($arg["noweHaslo"]), PDO::PARAM_STR);
	$res=dbQuery($sql);
	if($res["blad"]) $blad = true;
	}
	$sql = $conn->prepare("DELETE FROM dzialy_has_pracownicy WHERE idPracownika=:idPracownika");
	$sql->bindValue(":idPracownika", $arg["idPracownika"], PDO::PARAM_INT);
	$res=dbQuery($sql);
	if($res["blad"]) $blad = true;
	if (is_array($arg["dzial"]))
	// while(list($klucz, $wartosc) = each($arg["dzial"]))
	foreach($arg["dzial"] as $klucz=>$wartosc)
	{
	// echo "zapisz";
	$sql = $conn->prepare("INSERT INTO dzialy_has_pracownicy VALUES (:idDzialu, :idPracownika, :dzialPodstawowy)");
	$sql->bindValue(":idDzialu", $wartosc["idDzialu"], PDO::PARAM_INT);
	$sql->bindValue(":idPracownika", $arg["idPracownika"], PDO::PARAM_INT);
	$sql->bindValue(":dzialPodstawowy", $wartosc["dzialPodstawowy"], PDO::PARAM_INT);
	$res=dbQuery($sql);
	if($res["blad"]) $blad = true;
	}
	if($res["blad"])
	$dane["id"] = 0;
	else
	$dane["id"]=$arg["idPracownika"];
	return $dane;
	}
	*/