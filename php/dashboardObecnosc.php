<?php

class dashboardObecnosc
{
    use db;
    use library;
    private $arg;
    public $dane = array();

    private $api_url;
    private $api_key;

    public function __construct($arg)
    {
        $this->arg = $arg;

        $this->api_url = 'http://10.99.0.31:3000';
        $this->api_key = 'f000983f7ccf9d50418948aeb3eef18484fb354824ca383c64823bd7db18c41b82b90434b9ab30e4f310701d749fa158569573b16a13cbd15fd0b853af04ed77';

        $this->getToken();
    }


    public function wyniki()
    {
        return $this->dane;
    }

    public function listaPracownikow()
    {
        $dane = $this->zapytanieAPI("impuls/pracownicy");

        foreach ($dane as $key => &$value) {
            $value['nazwiskoImie'] = $value['nazwisko'] . ' ' . $value['imie'];
        }

        $this->dane = $dane;
    }

    public function danePracownika()
    {
        $nrEwidencyjny = $this->arg['nrEwidencyjny'];

        $dane = $this->zapytanieAPI("impuls/pracownicy/$nrEwidencyjny");


        $this->dane = $dane;
    }


    private function getToken()
    {
        $newToken = null;

        echo $_SESSION['token'];

        if (!isset($_SESSION['token'])) {

            $dane = $this->zapytanieAPI('login');

            $newToken = $dane['token'];
            $refreshToken = $dane['refreshToken'];

            $_SESSION['refreshToken'] = $refreshToken;
        } elseif (
            (time() - $_SESSION['token_time']) > 3600
        ) {
            $dane = $this->zapytanieAPI('refreshToken', true);

            $newToken = $dane['token'];
        } else {
            return $_SESSION['token'];
        }

        echo (time() - $_SESSION['token_time']) > 3600;

        $_SESSION['token'] = $newToken;
        $_SESSION['token_time'] = time();

        return $_SESSION['token'];
    }

    private function zapytanieAPI($adres, $isRefreshing = false)
    {
        $ch = curl_init();

        $headers = array(
            'Accept: application/json',
        );

        if ($isRefreshing) {
            array_push($headers, "refreshToken: " . $_SESSION['refreshToken']);
        } elseif ($adres === 'login') {
            array_push($headers, "apikey: $this->api_key");
        } else {
            array_push($headers, "token: " . $_SESSION["token"]);
        }

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_URL, "$this->api_url/$adres");
        curl_setopt($ch, CURLOPT_POST, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

        return json_decode(curl_exec($ch), true);
    }
}
