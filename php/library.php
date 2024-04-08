<?php
trait library
{
	public function idPracownika() {
		if (key_exists("idPracownika",$_SESSION)) {
			return $_SESSION["idPracownika"];
		} else {
			return 0;
		}
	}
	public function danePracownika() {
		$dane = array();
		$dane["imie"] = $_SESSION["imie"];
		$dane["nazwisko"] = $_SESSION["nazwisko"];
		$dane["dzial"] = $_SESSION["dzial"];
		return $dane;
	}
	public function spisUprawnien()
	{
		$dane = array();
		$sql=$this->conn->prepare("SELECT us.nazwa FROM uprawnienia u JOIN dzialy_has_pracownicy dhp ON u.idDzialu=dhp.idDzialu AND dhp.idPracownika=:idPracownika JOIN uprawnieniaSpis us ON us.idUprawnieniaSpis = u.idUprawnieniaSpis
									UNION	
									SELECT nazwa FROM uprawnienia u JOIN uprawnieniaSpis us ON us.idUprawnieniaSpis = u.idUprawnieniaSpis WHERE u.idPracownika=:idPracownika");
		$sql->bindValue(':idPracownika', $this->idPracownika(), PDO::PARAM_STR);
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC)) {
			$dane[] = $row["nazwa"];
		}
		return $dane;
	}
	public function spisDzialow($idDzialu,$dzialy) {
		$dzialy[$idDzialu]=$idDzialu;
		$sql=$this->conn->prepare("SELECT * FROM dzialy WHERE idRodzica=:idDzialu AND idDzialu!=:idDzialu");
		$sql->bindValue(':idDzialu', $idDzialu, PDO::PARAM_INT);
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$dzialy=$this->spisDzialow($row["idDzialu"],$dzialy);
		}
		return $dzialy;
	}
	public function nazwaPracownika($idPracownika)
	{
		$dane = array();
		$sql=$this->conn->prepare("SELECT imie,nazwisko FROM pracownicy WHERE idPracownika=:idPracownika");
		$sql->bindValue(':idPracownika', $idPracownika, PDO::PARAM_INT);
		$res=$this->dbQuery($sql);
		$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
		return $row["nazwisko"]." ".$row["imie"];
	}
	public function sprawdzUprawnienia($uprawnienie)
	{
		if (in_array($uprawnienie, $this->spisUprawnien()))
			return 1;
		else
			return 0;
	}
}