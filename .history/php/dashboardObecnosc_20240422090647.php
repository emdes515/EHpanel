<?php

require 'vendor/autoload.php';

class dashboardObecnosc
{
    use db;
    use library;



    use GuzzleHttp\Client;
    private $arg;
    public $dane = array();

    public function __construct($arg)
    {
        $this->arg = $arg;




        $client = new Client([
            // Base URI is used with relative requests
            'base_uri' => 'http://api.example.com',
        ]);

        $response = $client->request('GET', '/data');
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
