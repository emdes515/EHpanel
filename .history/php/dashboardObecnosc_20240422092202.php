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
    }

    public function wyniki()
    {
        return $this->dane;
    }

    public function lista()
    {


        $url = 'https://api.elgor.com.pl/login'; // Zastąp tym adresem URL API
        $options = array(
            'http' => array(
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                'method'  => 'GET',
            ),
        );
        $context  = stream_context_create($options);
        $result = file_get_contents($url, false, $context);

        $this->dane = $this->dane;
    }
}