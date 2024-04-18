<?php
class dashboardZleceniaWewnetrzne
{
    use db;
    use library;
    private $arg;

    public $dane = array(
        "moduly" => [
            "zleceniaWewnetrzneDzialyZglaszajace" => "asa",
            "zleceniaWewnetrzneRodzajeWnioskowanejPracy" => "asa",
            "zleceniaWewnetrzneRodzajeZalaczanychDokumentow" => "asa",
            "zleceniaWewnetrzneRynki" => "asa",
            "zleceniaWewnetrzneTypyWnioskow" => "asa",
        ],
    );

    public function __construct($arg)
    {
        $this->arg = $arg;
        $this->dbconnect();
    }

    public function wyniki()
    {
        return $this->dane;
    }

    public function wczytaj()
    {
        $dane = array();

        $zleceniaWewnetrzneUprawnienia = [
            "menu_zleceniaWewnetrzne",
            "menu_zleceniaWewnetrzne_dzialZglaszajacy",
            "menu_zleceniaWewnetrzne_rodzajWnioskowanejPracy",
            "menu_zleceniaWewnetrzne_rodzajZalaczanychDokumentow",
            "menu_zleceniaWewnetrzne_rynkek",
            "menu_zleceniaWewnetrzne_typWniosku",
        ];

        $html = array(
            "menu_zleceniaWewnetrzne" => null,

            "menu_zleceniaWewnetrzne_dzialZglaszajacy" =>
            file_get_contents('../server_html/zleceniaWewnetrzneDzialyZglaszajace.html'),

            "menu_zleceniaWewnetrzne_rodzajWnioskowanejPracy" =>
            file_get_contents('../server_html/zleceniaWewnetrzneRodzajeWnioskowanejPracy.html'),

            "menu_zleceniaWewnetrzne_rodzajZalaczanychDokumentow" =>
            file_get_contents('../server_html/zleceniaWewnetrzneRodzajeZalaczanychDokumentow.html'),

            "menu_zleceniaWewnetrzne_rynkek" =>
            file_get_contents('../server_html/zleceniaWewnetrzneRynki.html'),

            "menu_zleceniaWewnetrzne_typWniosku" =>
            file_get_contents('../server_html/zleceniaWewnetrzneTypyWnioskow.html'),

            "zleceniaWewnetrzne_usun" => null,

            "zleceniaWewnetrzne_usunKrokZlecenia" => null,

            "zleceniaWewnetrzne_zamknij" => null
        );

        foreach ($zleceniaWewnetrzneUprawnienia as $indeks => $nazwaUprawnienia) {
            if ($this->sprawdzUprawnienia($nazwaUprawnienia)) $dane[$nazwaUprawnienia] = array($nazwaUprawnienia => true, 'html' => $html[$nazwaUprawnienia]);
            else $dane[$nazwaUprawnienia] = false;
        }


        $this->dane = $dane;
    }
}
