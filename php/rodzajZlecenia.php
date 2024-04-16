<?PHP
class rodzajZlecenia {
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
	public function rodzajZlecenia()
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
		$i=0;
		$sql = $this->conn->prepare("SELECT * FROM rodzajZlecenia ORDER BY nazwa ASC"); 
		$res=$this->dbQuery($sql);
		while($row=$res["wynik"]->fetch(PDO::FETCH_ASSOC))
		{
			$tmp=array();
			$tmp["idRodzajZlecenia"] = $row["idRodzajZlecenia"];
			$tmp["nazwa"] = $row["nazwa"];
			$this->dane[$i] = $tmp;
			$i++;
		}
		return $this->dane;
	}
	public function zapisz()
	{
		if ($this->arg["idRodzajZlecenia"]==0)
		{
			$sql = $this->conn->prepare("INSERT INTO rodzajZlecenia VALUES(null,:nazwa)");
			$sql->bindValue(':nazwa', $this->arg["nazwa"], PDO::PARAM_STR);  
			$res=$this->dbQuery($sql);
			if($res["blad"])
				$id=0;
			else
				$id = $this->conn->lastInsertId();
		}
		else
		{
			$sql = $this->conn->prepare("UPDATE rodzajZlecenia SET nazwa=:nazwa WHERE idRodzajZlecenia=:idRodzajZlecenia");
			$sql->bindValue(':idRodzajZlecenia', $this->arg["idRodzajZlecenia"], PDO::PARAM_INT);  
			$sql->bindValue(':nazwa', $this->arg["nazwa"], PDO::PARAM_STR);
			$res=$this->dbQuery($sql);
			if($res["blad"])
				$id=0;
			else
				$id=$this->arg["idRodzajZlecenia"];
		}
		$this->dane["id"]=$id;
		return $this->dane;
	}
	public function usun()
	{
		$sql = $this->conn->prepare("DELETE FROM rodzajZlecenia WHERE idRodzajZlecenia=:idRodzajZlecenia");
		$sql->bindValue(':idRodzajZlecenia', $this->arg["idRodzajZlecenia"], PDO::PARAM_INT);  
		$res=$this->dbQuery($sql);
		if($res["blad"])
			$ilosc=0;
		else
			$ilosc = $sql->rowCount();
		$this->dane["ilosc"]=$ilosc;
		return $this->dane;
	}
}
?>