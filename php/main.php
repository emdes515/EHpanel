<?PHP
class main
{
	public $wyniki;
	private $parametry;
	public function __construct()
	{
		//		session_cache_limiter('private');
		//		session_cache_limiter('public');
		//		session_cache_expire(30);
		//		session_set_cookie_params(30*60);
		session_start();
		$dane = array();
		date_default_timezone_set("Europe/Warsaw");
		header('Content-type: application/json; charset=utf-8');
	}
	public function start()
	{
		$this->parametry = array_merge($_POST, $_GET);

		if (count($this->parametry) > 0) {
			$funkcja = (string)$this->parametry["funkcja"];
			$modul = new $this->parametry["modul"]($this->parametry);
			$modul->$funkcja($this->parametry);
			$this->wyniki = $modul->wyniki();
		} else {
			$this->wyniki = "";
		}
	}
	public function wyniki()
	{
		return json_encode($this->wyniki, JSON_HEX_QUOT | JSON_HEX_TAG);
	}
}
