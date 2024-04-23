<?php

class dashboardObecnosc
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
}
