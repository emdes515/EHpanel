<?PHP
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
//error_reporting(E_ERROR);
spl_autoload_register("panelAutoload");
function panelAutoload($classname)
{
	if (file_exists("./" . $classname . ".php")) {
		$filename = "./" . $classname . ".php";
		include($filename);
	} else
		return false;
}
$main = new main();
$main->start();
echo $main->wyniki();
