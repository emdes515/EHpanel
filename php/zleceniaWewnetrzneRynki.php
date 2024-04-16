<?php
class zleceniaWewnetrzneRynki
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
	public function zleceniaWewnetrzneRynki($arg)
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
		$i = 0; 
		$sql = $this->conn->prepare("SELECT id, nazwa FROM zleceniaWewnetrzneRynek ORDER BY nazwa ASC");
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$tmp=array();
			$tmp["id"] = $row["id"];
			$tmp["nazwa"] = $row["nazwa"];
			$this->dane[$i] = $tmp;
			$i++;
		}
		return $this->dane;
	}
	public function daneFormularz()
	{
		$sql = $this->conn->prepare("SELECT id, nazwa FROM zleceniaWewnetrzneRynek WHERE id=:id");
		$sql->bindValue(':id', $this->arg["id"], PDO::PARAM_INT);
		$res=$this->dbQuery($sql);
		$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
		$dane["id"] = $row["id"];
		$dane["nazwa"] = $row["nazwa"];
		return $this->dane;
	}
	public function zapisz()
	{
		$sql = $this->conn->prepare("SELECT * FROM zleceniaWewnetrzneRynek WHERE nazwa=:nazwa AND id!=:id");
		$sql->bindValue(":id", $this->arg["id"], PDO::PARAM_STR);
		$sql->bindValue(":nazwa", $this->arg["nazwa"], PDO::PARAM_STR);
		$res=$this->dbQuery($sql);
		$ile = $sql->rowCount();
		if ($ile>0)
		{
			$idDzialuZglaszajacego = -1;
		}
		else
		{
			if ($this->arg["id"]==0)
			{
				$sql = $this->conn->prepare("INSERT INTO zleceniaWewnetrzneRynek VALUES (NULL, :nazwa)");
				$sql->bindValue(":nazwa", $this->arg["nazwa"], PDO::PARAM_STR);
				$res=$this->dbQuery($sql);
				echo $res["blad"];
				$idDzialuZglaszajacego = $this->conn->lastInsertId();
			}
			else
			{
				$sql = $this->conn->prepare("UPDATE zleceniaWewnetrzneRynek SET nazwa=:nazwa WHERE id=:id");
				$sql->bindValue(":id", $this->arg["id"], PDO::PARAM_INT);
				$sql->bindValue(":nazwa", $this->arg["nazwa"], PDO::PARAM_STR);
				$res=$this->dbQuery($sql);
				$idDzialuZglaszajacego=$this->arg["id"];
			}
		}
		$this->dane["id"]=$idDzialuZglaszajacego;
		return $this->dane;
	}
	public function usun()
	{
	/*	$sql = $this->conn->prepare("SELECT * FROM zleceniaWewnetrzneRynek WHERE id = d");
		$res=$this->dbQuery($sql);
		$ile = $sql->rowCount();
		if ($ile>0)
		{
			$wynik = -1;
		}
		else
		{*/
				$sql = $this->conn->prepare("DELETE FROM zleceniaWewnetrzneRynek WHERE id=:id");
				$sql->bindValue(":id", $this->arg["id"], PDO::PARAM_INT);
				$res=$this->dbQuery($sql);
				$wynik = 1;
	//	}
	$this->dane["wynik"] = $wynik;
		return $this->dane;
	}
}
?>