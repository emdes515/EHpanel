<?php
class zleceniaWewnetrzneRodzajeZalaczanychDokumentow
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
	function zleceniaWewnetrzneRodzajeZalaczanychDokumentow()
	{
		if (function_exists($this->arg["funkcja"]))
			return $this->arg["funkcja"]($this->arg);
		else
		{
			die('Moduł: '.$this->arg['modul'].'<br>Brak funkcji: '.$this->arg["funkcja"]);
		}
	}
	function lista()
	{
		$i = 0; ;
		$sql = $this->conn->prepare("SELECT id, nazwa FROM zleceniaWewnetrzneRodzajZalaczanychDokumentow WHERE id not in (1,2) ORDER BY nazwa ASC");
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
	function daneFormularz()
	{
		$sql = $this->conn->prepare("SELECT id, nazwa FROM zleceniaWewnetrzneRodzajZalaczanychDokumentow WHERE id=:id");
		$sql->bindValue(':id', $this->arg["id"], PDO::PARAM_INT);
		$res=$this->dbQuery($sql);
		$row=$res["wynik"]->fetch(PDO::FETCH_ASSOC);
		$this->dane["id"] = $row["id"];
		$this->dane["nazwa"] = $row["nazwa"];
		return $this->dane;
	}
	function zapisz()
	{
		$sql = $this->conn->prepare("SELECT * FROM zleceniaWewnetrzneRodzajZalaczanychDokumentow WHERE nazwa=:nazwa AND id!=:id");
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
				$sql = $this->conn->prepare("INSERT INTO zleceniaWewnetrzneRodzajZalaczanychDokumentow VALUES (NULL, :nazwa)");
				$sql->bindValue(":nazwa", $this->arg["nazwa"], PDO::PARAM_STR);
				$res=$this->dbQuery($sql);
				echo $res["blad"];
				$idDzialuZglaszajacego = $this->conn->lastInsertId();
			}
			else
			{
				$sql = $this->conn->prepare("UPDATE zleceniaWewnetrzneRodzajZalaczanychDokumentow SET nazwa=:nazwa WHERE id=:id");
				$sql->bindValue(":id", $this->arg["id"], PDO::PARAM_INT);
				$sql->bindValue(":nazwa", $this->arg["nazwa"], PDO::PARAM_STR);
				$res=$this->dbQuery($sql);
				$idDzialuZglaszajacego=$this->arg["id"];
			}
		}
		$this->dane["id"]=$idDzialuZglaszajacego;
		return $this->dane;
	}
	function usun()
	{
	/*	$sql = $this->conn->prepare("SELECT * FROM zleceniaWewnetrzneRodzajZalaczanychDokumentow WHERE id = d");
		$res=$this->dbQuery($sql);
		$ile = $sql->rowCount();
		if ($ile>0)
		{
			$wynik = -1;
		}
		else
		{*/
				$sql = $this->conn->prepare("DELETE FROM zleceniaWewnetrzneRodzajZalaczanychDokumentow WHERE id=:id");
				$sql->bindValue(":id", $this->arg["id"], PDO::PARAM_INT);
				$res=$this->dbQuery($sql);
				$wynik = 1;
	//	}
		$this->dane["wynik"] = $wynik;
		return $this->dane;
	}
}
?>