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




        $this->dane = curl_exec($ch);
    }

    public function wyniki()
    {
        return $this->dane;
    }

    public function lista()
    {
        $this->dane = $this->dane;
    }
}
