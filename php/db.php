<?php
trait db 
{
	use config;
	public $conn;
	public function __construct()
	{
		if (!isset($this->conn))
			$this->dbconnect();
	}
	public function dbconnect()
	{
		try
		{
			$this->conn = new PDO('mysql:host='.$this->dbserver().';dbname='.$this->dbname(), $this->dbuser(), $this->dbpassword() );
			$this->conn->exec("set names utf8");
		}
		catch (PDOException $e) 
		{
			die ("Nie moĹĽna nawiÄ…zaÄ‡ poĹ‚Ä…czenia z bazÄ… danych");
		}

	}
	public function dbQuery($sql,$pokazBlad=TRUE)
	{
		$blad = null;
		try { 
			if (!isset($this->conn)) $this->dbConnect();
			$this->conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
			$sql->execute();  
		} catch(PDOException $e) {
			echo $e;
			$blad = $e;
		}
		return array("wynik"=>$sql,"blad"=>$blad,"ile"=> $sql->rowCount());
	}
}
?>
