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

        $options = array(
            'http' => array(
                'method' => "GET",
                'header' => "Authorization: Bearer YOUR_API_KEY\r\n"
            )
        );
        $context = stream_context_create($options);
        $result = file_get_contents('http://api.example.com/data', false, $context);
    }

    public function wyniki()
    {
        return $this->dane;
    }

    public function lista()
}