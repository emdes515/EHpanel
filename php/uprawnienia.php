<?php
class uprawnienia
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
	public function uprawnienia()
	{
		if (function_exists($this->arg["funkcja"]))
			return $this->arg["funkcja"]($this->arg);
		else {
			die('Moduł: ' . $this->arg['modul'] . '<br>Brak funkcji: ' . $this->arg["funkcja"]);
		}
	}

	public function listaPracownikow()
	{
		$i = 0;
		$sql = $this->conn->prepare("SELECT idPracownika, CONCAT(nazwisko,' ',imie) nazwiskoImie FROM pracownicy WHERE imie!='' AND nazwisko!='' ORDER BY nazwisko, imie ASC");
		$res = $this->dbQuery($sql);
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC)) {
			$tmp = array();
			$tmp["idPracownika"] = $row["idPracownika"];
			$tmp["nazwiskoImie"] = $row["nazwiskoImie"];
			$this->dane[$i] = $tmp;
			$i++;
		}
	}
	public function listaDzialow()
	{
		$i = 0;
		$sql = $this->conn->prepare("SELECT * FROM dzialy ORDER BY nazwa ASC");
		$res = $this->dbQuery($sql);
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC)) {
			$tmp = array();
			$tmp["id"] = $row["idDzialu"];
			if (($row["idDzialu"] == 1) and ($row["idRodzica"] == 1))
				$tmp["parentid"] = -1;
			else
				$tmp["parentid"] = $row["idRodzica"];
			$tmp["text"] = $row["nazwa"];
			$tmp["value"] = $row["idDzialu"];
			$this->dane[$i] = $tmp;
			$i++;
		}
	}
	public function listaUprawnien()
	{;
		$i = 0;
		$sql = $this->conn->prepare("SELECT idUprawnieniaSpis, CONCAT(us.opis,' (',us.nazwa,')') opisNazwa, ug.nazwa nazwaGrupy 
								FROM uprawnieniaSpis us JOIN uprawnieniaGrupa ug ON us.idUprawnieniaGrupa=ug.idUprawnieniaGrupa 
								ORDER BY ug.nazwa ASC, us.nazwa ASC");
		$res = $this->dbQuery($sql);
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC)) {
			$tmp = array();
			$tmp["title"] = $row["idUprawnieniaSpis"];
			$tmp["html"] = $row["opisNazwa"];
			$tmp["group"] = $row["nazwaGrupy"];
			$this->dane[$i] = $tmp;
			$i++;
		}
	}
	public function spisUprawnienPracownika()
	{
		$sql = $this->conn->prepare("SELECT idUprawnieniaSpis FROM uprawnienia WHERE idPracownika=:idPracownika");
		$sql = $this->conn->prepare("SELECT u.idUprawnieniaSpis, CONCAT(us.opis,' (',us.nazwa,')') opis, 'd' typ FROM 
									uprawnienia u JOIN dzialy_has_pracownicy dhp ON u.idDzialu=dhp.idDzialu AND dhp.idPracownika=:idPracownika 
									JOIN uprawnieniaSpis us ON us.idUprawnieniaSpis = u.idUprawnieniaSpis
								UNION	
								SELECT u.idUprawnieniaSpis, CONCAT(us.opis,' (',us.nazwa,')') opis, 'p' typ FROM 
									uprawnienia u JOIN uprawnieniaSpis us ON us.idUprawnieniaSpis = u.idUprawnieniaSpis
									WHERE u.idPracownika=:idPracownika");
		$sql->bindValue(':idPracownika', $this->arg["idPracownika"], PDO::PARAM_INT);
		$res = $this->dbQuery($sql);
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC)) {
			$this->dane["idUprawnienia"][] = $row["typ"] . $row["idUprawnieniaSpis"];
			$this->dane["opis"][] = $row["opis"];
		}
	}
	public function spisUprawnienDzialu()
	{
		$sql = $this->conn->prepare("SELECT idUprawnieniaSpis FROM uprawnienia WHERE idDzialu=:idDzialu");
		$sql->bindValue(':idDzialu', $this->arg["idDzialu"], PDO::PARAM_INT);
		$res = $this->dbQuery($sql);
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC)) {
			$this->dane[] = $row["idUprawnieniaSpis"];
		}
	}
	public function zapis()
	{
		if ($this->arg["idPracownika"] > 0) {
			$sql = $this->conn->prepare("DELETE FROM uprawnienia WHERE idPracownika=:idPracownika");
			$sql->bindValue(':idPracownika', $this->arg["idPracownika"], PDO::PARAM_INT);
			$res = $this->dbQuery($sql);
			if (count($this->arg["uprawnienia"]) > 0)
				while (list($klucz, $wartosc) = ($this->arg["uprawnienia"])) {
					$sql = $this->conn->prepare("INSERT INTO uprawnienia VALUES (:idPracownika,NULL,:idUprawnienia)");
					$sql->bindValue(':idPracownika', $this->arg["idPracownika"], PDO::PARAM_INT);
					$sql->bindValue(':idUprawnienia', $wartosc, PDO::PARAM_INT);
					$res = $this->dbQuery($sql);
				}
			$this->dane['id'] = 1;
		} else if ($this->arg["idDzialu"] > 0) {
			$sql = $this->conn->prepare("DELETE FROM uprawnienia WHERE idDzialu=:idDzialu");
			$sql->bindValue(':idDzialu', $this->arg["idDzialu"], PDO::PARAM_INT);
			$res = $this->dbQuery($sql);
			if (count($this->arg["uprawnienia"]) > 0) {
				//		ZAMIENIONE WHILE NA FOREACH (BRAK EACH W NOWEJ WERSJI PHP)
				foreach ($this->arg["uprawnienia"] as $klucz => $wartosc) {
					$sql = $this->conn->prepare("INSERT INTO uprawnienia VALUES (NULL,:idDzialu,:idUprawnienia)");
					$sql->bindValue(':idDzialu', $this->arg["idDzialu"], PDO::PARAM_INT);
					$sql->bindValue(':idUprawnienia', $wartosc, PDO::PARAM_INT);
					$res = $this->dbQuery($sql);
				}
			}
			$this->dane['id'] = 1;
		}
	}
}
