<?php
class zleceniaWewnetrzneDzialyZglaszajace
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

	public function lista()
	{
		$i = 0;
		$dane = array();
		$sql = $this->conn->prepare("SELECT id, nazwa FROM zleceniaWewnetrzneDzialZglaszajacy ORDER BY nazwa ASC");
		$res = $this->dbQuery($sql);
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC)) {
			$tmp = array();
			$tmp["id"] = $row["id"];
			$tmp["nazwa"] = $row["nazwa"];
			$dane[$i] = $tmp;
			$i++;
		}
		$this->dane = $dane;
	}
	public function listaTypowWnioskow()
	{
		$i = 0;
		$sql = $this->conn->prepare("SELECT tw.id, tw.nazwa, ifnull(dztw.zleceniaWewnetrzneDzialZglaszajacy_id,0) AS wybranyTypWniosku FROM zleceniaWewnetrzneTypWniosku AS tw LEFT JOIN zwDzialZglaszajacy_has_zwTypWniosku AS dztw ON tw.id=dztw.zleceniaWewnetrzneTypWniosku_id
		WHERE dztw.zleceniaWewnetrzneDzialZglaszajacy_id=12 OR dztw.zleceniaWewnetrzneDzialZglaszajacy_id is null");
		//	$sql->bindValue(':id', $this->arg["id"], PDO::PARAM_INT);
		$res = $this->dbQuery($sql);
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC)) {
			$tmp = array();
			$tmp["id"] = $row["id"];
			$tmp["nazwa"] = $row["nazwa"];
			$tmp["wybranyTypWniosku"] = $row["wybranyTypWniosku"];
			$dane[$i] = $tmp;
			$i++;
		}
		$this->dane = $dane;
	}
	public function pracownicy()
	{
		$i = 0;
		$sql = $this->conn->prepare("SELECT idPracownika, concat(nazwisko, ' ', imie) AS nazwiskoImie FROM pracownicy
		WHERE emailEH IS NOT NULL AND emailEH!='' ORDER BY nazwiskoImie ASC");
		$res = $this->dbQuery($sql);
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC)) {
			$tmp = array();
			$tmp["id"] = $row["idPracownika"];
			$tmp["nazwiskoImie"] = $row["nazwiskoImie"];
			$dane[$i] = $tmp;
			$i++;
		}
		$this->dane = $dane;
	}

	public function daneFormularz()
	{
		$sql = $this->conn->prepare("SELECT id, nazwa FROM zleceniaWewnetrzneDzialZglaszajacy WHERE id=:id");
		$sql->bindValue(':id', $this->arg["id"], PDO::PARAM_INT);
		$res = $this->dbQuery($sql);
		$row = $res["wynik"]->fetch(PDO::FETCH_ASSOC);
		$dane["id"] = $row["id"];
		$dane["nazwa"] = $row["nazwa"];
		$dane["typyWnioskow"] = array();
		$dane["pracownicy"] = array();
		$sql = $this->conn->prepare("SELECT tw.id, ifnull(dztw.zleceniaWewnetrzneDzialZglaszajacy_id,0) AS wybranyTypWniosku FROM zleceniaWewnetrzneTypWniosku AS tw LEFT JOIN zwDzialZglaszajacy_has_zwTypWniosku AS dztw ON tw.id=dztw.zleceniaWewnetrzneTypWniosku_id
		WHERE dztw.zleceniaWewnetrzneDzialZglaszajacy_id=:id OR dztw.zleceniaWewnetrzneDzialZglaszajacy_id is null");
		$sql->bindValue(':id', $this->arg["id"], PDO::PARAM_INT);
		$res = $this->dbQuery($sql);
		$i = 0;
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC)) {
			$tmp = array();
			$tmp["id"] = $row["id"];
			$tmp["wybranyTypWniosku"] = $row["wybranyTypWniosku"];
			$dane["typyWnioskow"][$i] = $tmp;
			$i++;
		}
		$sql = $this->conn->prepare("SELECT pracownicy_idPracownika AS wybranyPracownik FROM zwDzialZglaszajacy_has_pracownicy WHERE zleceniaWewnetrzneDzialZglaszajacy_id=:id");
		$sql->bindValue(':id', $this->arg["id"], PDO::PARAM_INT);
		$res = $this->dbQuery($sql);
		$i = 0;
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC)) {
			$tmp = array();
			$tmp["id"] = $row["wybranyPracownik"];
			$dane["pracownicy"][$i] = $tmp;
			$i++;
		}
		$this->dane = $dane;
	}
	public function zapisz()
	{
		$sql = $this->conn->prepare("SELECT * FROM zleceniaWewnetrzneDzialZglaszajacy WHERE nazwa=:nazwa AND id!=:id");
		$sql->bindValue(":id", $this->arg["id"], PDO::PARAM_STR);
		$sql->bindValue(":nazwa", $this->arg["nazwa"], PDO::PARAM_STR);
		$res = $this->dbQuery($sql);
		$ile = $sql->rowCount();
		if ($ile > 0) {
			$idDzialuZglaszajacego = -1;
		} else {
			if ($this->arg["id"] == 0) {
				$sql = $this->conn->prepare("INSERT INTO zleceniaWewnetrzneDzialZglaszajacy VALUES (NULL, :nazwa,'Uniwersalna')");
				$sql->bindValue(":nazwa", $this->arg["nazwa"], PDO::PARAM_STR);
				$res = $this->dbQuery($sql);
				$idDzialuZglaszajacego = $this->conn->lastInsertId();
			} else {
				$sql = $this->conn->prepare("UPDATE zleceniaWewnetrzneDzialZglaszajacy SET nazwa=:nazwa WHERE id=:id");
				$sql->bindValue(":id", $this->arg["id"], PDO::PARAM_INT);
				$sql->bindValue(":nazwa", $this->arg["nazwa"], PDO::PARAM_STR);
				$res = $this->dbQuery($sql);
				$idDzialuZglaszajacego = $this->arg["id"];
			}

			$sql = $this->conn->prepare("DELETE FROM zwDzialZglaszajacy_has_zwTypWniosku WHERE zleceniaWewnetrzneDzialZglaszajacy_id=:id");
			$sql->bindValue(":id", $idDzialuZglaszajacego, PDO::PARAM_INT);
			$res = $this->dbQuery($sql);
			foreach ($this->arg["typyWnioskow"] as $klucz => $idWniosku) {
				$sql = $this->conn->prepare("INSERT INTO zwDzialZglaszajacy_has_zwTypWniosku VALUES (:idDzialu, :idWniosku)");
				$sql->bindValue(":idDzialu", $idDzialuZglaszajacego, PDO::PARAM_STR);
				$sql->bindValue(":idWniosku", $idWniosku, PDO::PARAM_STR);
				$res = $this->dbQuery($sql);
			}

			$sql = $this->conn->prepare("DELETE FROM zwDzialZglaszajacy_has_pracownicy WHERE zleceniaWewnetrzneDzialZglaszajacy_id=:id");
			$sql->bindValue(":id", $idDzialuZglaszajacego, PDO::PARAM_INT);
			$res = $this->dbQuery($sql);
			foreach ($this->arg["pracownicy"] as $klucz => $idPracownika) {
				$sql = $this->conn->prepare("INSERT INTO zwDzialZglaszajacy_has_pracownicy VALUES (:idDzialu, :idPracownika)");
				$sql->bindValue(":idDzialu", $idDzialuZglaszajacego, PDO::PARAM_STR);
				$sql->bindValue(":idPracownika", $idPracownika, PDO::PARAM_STR);
				$res = $this->dbQuery($sql);
			}
		}
		$dane["id"] = $idDzialuZglaszajacego;
		$this->dane = $dane;
	}
	public function usun()
	{
		/*	$sql = $conn->prepare("SELECT * FROM zleceniaWewnetrzneDzialZglaszajacy WHERE id = d");
	$res=dbQuery($sql);
	$ile = $sql->rowCount();
	if ($ile>0)
	{
		$wynik = -1;
	}
	else
	{*/
		$sql = $this->conn->prepare("DELETE FROM zleceniaWewnetrzneDzialZglaszajacy WHERE id=:id");
		$sql->bindValue(":id", $this->arg["id"], PDO::PARAM_INT);
		$res = $this->dbQuery($sql);
		$wynik = 1;
		//	}
		$dane["wynik"] = $wynik;
		$this->dane = $dane;
	}
}
