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
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'apikey: ' . 'f000983f7ccf9d50418948aeb3eef18484fb354824ca383c64823bd7db18c41b82b90434b9ab30e4f310701d749fa158569573b16a13cbd15fd0b853af04ed77',
            'accept: application/json'
        ));

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