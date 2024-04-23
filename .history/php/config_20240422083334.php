<?PHP
trait config
{
	private $dbserver = '10.99.0.31';
	private $dbname = 'testpanel';
	private $dbuser = 'testpanel';
	private $dbpassword = 'Ky&4M3DmYZ^ettwA';

	public function dbserver()
	{
		return $this->dbserver;
	}
	public function dbname()
	{
		return $this->dbname;
	}
	public function dbuser()
	{
		return $this->dbuser;
	}
	public function dbpassword()
	{
		return $this->dbpassword;
	}
}
