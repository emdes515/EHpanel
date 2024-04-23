<?php
class zleceniaWewnetrzneTypyWnioskow
{
	use db;
	use library;

	private $arg;

	public $dane = array();

	public function __construct($arg)
	{
		$this->arg = $arg;
		$this->dbconnect();
	}

	public function zleceniaWewnetrzneTypyWnioskow()
	{
		echo 'there';
		if (function_exists($this->arg["funkcja"]))
			return $this->arg["funkcja"]($this->arg);
		else {
			die('Moduł: ' . $this->arg['modul'] . '<br>Brak funkcji: ' . $this->arg["funkcja"]);
		}
	}

	public function wyniki()
	{
		return $this->dane;
	}

	public function lista()
	{
		$i = 0;
		$dane = array();
		$sql = $this->conn->prepare("SELECT id, nazwa FROM zleceniaWewnetrzneTypWniosku ORDER BY nazwa ASC");
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

	public function daneFormularz()
	{
		$dane = array();
		$sql = $this->conn->prepare("SELECT id, nazwa FROM zleceniaWewnetrzneTypWniosku WHERE id=:id");
		$sql->bindValue(':id', $this->arg["id"], PDO::PARAM_INT);
		$res = $this->dbQuery($sql);
		$row = $res["wynik"]->fetch(PDO::FETCH_ASSOC);
		$dane["id"] = $row["id"];
		$dane["nazwa"] = $row["nazwa"];
		$dane["dzialyZglaszajace"] = array();
		$sql = $this->conn->prepare("SELECT dz.id, ifnull(dztw.zleceniaWewnetrzneTypWniosku_id,0) AS wybranyDzialZglaszajacy FROM zleceniaWewnetrzneDzialZglaszajacy AS dz LEFT JOIN zwDzialZglaszajacy_has_zwTypWniosku AS dztw ON dz.id=dztw.zleceniaWewnetrzneDzialZglaszajacy_id
		WHERE dztw.zleceniaWewnetrzneTypWniosku_id=:id OR dztw.zleceniaWewnetrzneTypWniosku_id is null");
		$sql->bindValue(':id', $this->arg["id"], PDO::PARAM_INT);
		$res = $this->dbQuery($sql);
		$i = 0;
		while ($row = $res["wynik"]->fetch(PDO::FETCH_ASSOC)) {
			$tmp = array();
			$tmp["id"] = $row["id"];
			$tmp["wybranyDzialZglaszajacy"] = $row["wybranyDzialZglaszajacy"];
			$dane["dzialyZglaszajace"][$i] = $tmp;
			$i++;
		}
		$this->dane = $dane;
	}
	public function zapisz()
	{
		$dane = array();
		$sql = $this->conn->prepare("SELECT * FROM zleceniaWewnetrzneTypWniosku WHERE nazwa=:nazwa AND id!=:id");
		$sql->bindValue(":id", $this->arg["id"], PDO::PARAM_STR);
		$sql->bindValue(":nazwa", $this->arg["nazwa"], PDO::PARAM_STR);
		$res = $this->dbQuery($sql);
		$ile = $sql->rowCount();
		if ($ile > 0) {
			$idTypuWniosku = -1;
		} else {
			if ($this->arg["id"] == 0) {
				$sql = $this->conn->prepare("INSERT INTO zleceniaWewnetrzneTypWniosku VALUES (NULL, :nazwa)");
				$sql->bindValue(":nazwa", $this->arg["nazwa"], PDO::PARAM_STR);
				$res = $this->dbQuery($sql);
				echo $res["blad"];
				$idTypuWniosku = $this->conn->lastInsertId();
			} else {
				$sql = $this->conn->prepare("UPDATE zleceniaWewnetrzneTypWniosku SET nazwa=:nazwa WHERE id=:id");
				$sql->bindValue(":id", $this->arg["id"], PDO::PARAM_INT);
				$sql->bindValue(":nazwa", $this->arg["nazwa"], PDO::PARAM_STR);
				$res = $this->dbQuery($sql);
				$idTypuWniosku = $this->arg["id"];
			}
			$sql = $this->conn->prepare("DELETE FROM zwDzialZglaszajacy_has_zwTypWniosku WHERE zleceniaWewnetrzneTypWniosku_id=:id");
			$sql->bindValue(":id", $idTypuWniosku, PDO::PARAM_INT);
			$res = $this->dbQuery($sql);
			foreach ($this->arg["dzialyZglaszajace"] as $klucz => $idDzialuZglaszajacego) {
				$sql = $this->conn->prepare("INSERT INTO zwDzialZglaszajacy_has_zwTypWniosku VALUES (:idDzialu, :idTypuWniosku)");
				$sql->bindValue(":idDzialu", $idDzialuZglaszajacego, PDO::PARAM_STR);
				$sql->bindValue(":idTypuWniosku", $idTypuWniosku, PDO::PARAM_STR);
				$res = $this->dbQuery($sql);
			}
		}
		$dane["id"] = $idTypuWniosku;
		$this->dane = $dane;
	}

	public function usun()
	{
		$dane = array();
		/*	$sql = $this->conn->prepare("SELECT * FROM zleceniaWewnetrzneTypWniosku WHERE id = d");
	$res=$this->dbQuery($sql);
	$ile = $sql->rowCount();
	if ($ile>0)
	{
		$wynik = -1;
	}
	else
	{*/
		$sql = $this->conn->prepare("DELETE FROM zleceniaWewnetrzneTypWniosku WHERE id=:id");
		$sql->bindValue(":id", $this->arg["id"], PDO::PARAM_INT);
		$res = $this->dbQuery($sql);
		$wynik = 1;
		//	}
		$dane["wynik"] = $wynik;
		$this->dane = $dane;
	}
}