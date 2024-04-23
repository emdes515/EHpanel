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

        $command = 'curl -X GET -H "apikey: your_api_key" http://api.example.com/data';
        $response = shell_exec($command);



        $this->dane = $response;
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
