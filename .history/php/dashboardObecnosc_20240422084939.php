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


        $API_key = "f000983f7ccf9d50418948aeb3eef18484fb354824ca383c64823bd7db18c41b82b90434b9ab30e4f310701d749fa158569573b16a13cbd15fd0b853af04ed77"

        $context = stream_context_create(array(
            'http' => array(
                'method' => "GET",
                'header' => "Authorization: Bearer YOUR_API_KEY\r\n"
            )
        ));

        $this->API_EH_session = file_get_contents('http://api.example.com/data', false, $context);
    }

    public function wyniki()
    {
        return $this->dane;
    }

    public function lista()
}