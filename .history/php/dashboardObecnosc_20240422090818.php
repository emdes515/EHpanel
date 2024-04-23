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


        $ch = curl_init("https://api.elgor.com.pl/login");

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
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
