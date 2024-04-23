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



        $context = stream_context_create(array(
            'http' => array(
                'method' => 'GET',
                'header' => "Accept: application/json\r\n" .
                    "apikey: $apikey\r\n"
            )
        ));

        $response = file_get_contents($url, false, $context);

        $response = curl_exec($ch);

        $this->dane = $response;
    }
}
