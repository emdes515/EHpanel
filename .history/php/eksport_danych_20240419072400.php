<?PHP
require 'vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat\Wizard\Currency1;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat\Currency;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat\Wizard\Number1;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat\Number;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat\Wizard\Accounting;
use PhpOffice\PhpSpreadsheet\IOFactory;


function eksport_danych($arg)
{
	if (function_exists($arg["funkcja"]))
		return $arg["funkcja"]($arg);
	else
	{
		die('Moduł: '.$arg['modul'].'<br>Brak funkcji: '.$arg["funkcja"]);
	}
}
function eksport_zlecen($arg)
{
	header('Content-Type: application/csv');
	header('Content-Disposition: attachment; filename=zlecenia.csv');
	header('Pragma: no-cache');
	$dane=json_decode($arg["content"]);
	echo "Nr zlecenia\tOpis\tTyp\tStatus\r\n";
	foreach ($dane as $key => $value) {
		$v = (array)$value;
		echo $v["Nr zlecenia"]."\t".$v["Opis"]."\t".$v["Typ"]."\t".$v["Status"]."\r\n";
	}
}
function eksport_czasuPracy($arg)
{
	header('Content-Type: application/csv');
	header('Content-Disposition: attachment; filename=czasPracy.csv');
	header('Pragma: no-cache');
	$dane=json_decode($arg["content"]);
	echo "Pracownik\tData\tNr zlec. / proj.\tCzynność\tGodziny\tTyp godzin\tUwagi\tStan\r\n";
	foreach ($dane as $key => $value) {
		$v = (array)$value;
		echo $v["Pracownik"]."\t".$v["Data"]."\t".$v["Nr zlec. / proj."]."\t".$v["Czynność"]."\t".$v["Godziny"]."\t".$v["Typ godzin"]."\t".czyscLancuch($v["Uwagi"])."\t".$v["Stan"]."\r\n";
	}
}
function eksport_przegladRaportowCzasuPracy($arg)
{
	header('Content-Type: application/csv');
	header('Content-Disposition: attachment; filename=czasPracy.csv');
	header('Pragma: no-cache');
	$dane=json_decode($arg["content"]);
	echo "Dział\tNr Pracownika\tImię Nazwisko\tTyp zlecenia\tRodzaj zlecenia\tOdp. za zlecenie\tNr zlec./proj.\tNazwa zlecenia\tNr działania\tNazwa działania\tTyp godzin\tUwagi\tStan\tGodziny\tData\r\n";
	foreach ($dane as $key => $value) {
		$v = (array)$value;
		echo $v["Dział"]."\t".$v["Nr pracownika"]."\t".$v["Imię Nazwisko"]."\t".$v["Typ zlecenia"]."\t".$v["Rodzaj zlecenia"]."\t".
		$v["Odp. za zlecenie"]."\t".
		$v["Nr zlec. / proj."]."\t".
		$v["Nazwa zlecenia"]."\t".
		$v["Nr działania"]."\t".
		$v["Nazwa działania"]."\t".
		$v["Typ godzin"]."\t".
		czyscLancuch($v["Uwagi"])."\t".
		$v["Stan"]."\t".
		$v["Godziny"]."\t".
		$v["Data"]."\t"."\r\n";
	}
}
function czyscLancuch($str)
{
	$search  = array(chr(10), chr(13), chr(9));
	$replace = array('','','');
	return str_replace($search, $replace,strip_tags(htmlspecialchars_decode($str)));
}
function eksport_ewidencjiPostepowanOfertowych($arg)
{
	$dane=json_decode($arg["content"],true);
//	print_r($dane);
	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Disposition: attachment;filename="epo_eksport.xlsx"');
	header('Cache-Control: max-age=0');
	header('Cache-Control: max-age=1');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
	header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
	header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
	header('Pragma: public'); // HTTP/1.0
	$spreadsheet = new Spreadsheet();
	$sheet = $spreadsheet->getActiveSheet();
	$y=2;
	$spreadsheet->getActiveSheet()->setCellValueExplicit("A1","Nr",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("B1","Szybka ścieżka",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("C1","Ilość wniosków",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("D1","Państwo",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("E1","Spółka",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("F1","Odbiorca",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("G1","Ruch",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("H1","Zamawiający",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("I1","Nazwa pliku",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("J1","Nazwa pliku",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("K1","Nr projektu",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("L1","Nr postępowania",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("M1","Data złożenia oferty",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("N1","Temat oferty",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("O1","Prowadzący",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("P1","Kwota oferty",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("Q1","Wadium wartość",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	
	// $euro = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
	// $euro->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
	// $euro->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_LESSTHAN);
	// $euro->addCondition('*€');
	// //! $euro->formatCode()->setFormatCode(value);
	// $euro->getStyle()->getFont()->setBold(true);

	// $conditional2 = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
	// $conditional2->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_CELLIS);
	// $conditional2->setOperatorType(\PhpOffice\PhpSpreadsheet\Style\Conditional::OPERATOR_GREATERTHANOREQUAL);
	// $conditional2->addCondition('0');
	// $conditional2->getStyle()->getFont()->getColor()->setARGB(\PhpOffice\PhpSpreadsheet\Style\Color::COLOR_GREEN);
	// $conditional2->getStyle()->getFont()->setBold(true);

	// $conditionalStyles = $spreadsheet->getActiveSheet()->getStyle('B2')->getConditionalStyles();
	// $conditionalStyles[] = $euro;
	// $conditionalStyles[] = $conditional2;
	// $spreadsheet->getActiveSheet()->getStyle('B2')->setConditionalStyles($conditionalStyles);

	// Set Cell value
	// $spreadsheet->getCell('C20')->setValue(-12345.67890);

	// $euroMask = new Currency1(
	// 	'€',
	// 	2,
	// 	Number1::WITH_THOUSANDS_SEPARATOR,
	// 	Currency1::TRAILING_SYMBOL,
	// 	Currency1::SYMBOL_WITH_SPACING
	// );
	// $spreadsheet->getCell('C20')
    // ->getStyle()->getNumberFormat()
    // ->setFormatCode($euroMask);
	// $spreadsheet = new Spreadsheet();
	// $sheet = $spreadsheet->getActiveSheet();
	// $y = 20; // assuming that the data is in the 20th row
	// $cell = $sheet->getCell('C' . $y);
	// var_dump($cell);

	// var_dump($spreadsheet->getCell('C20')
    // ->getStyle()->getNumberFormat()->getFormatCode()); // #,##0.00 €
	// var_dump($spreadsheet->getCell('C20')->getFormattedValue()); // -12,345.68 €

	$spreadsheet->getActiveSheet()->setCellValueExplicit("R1","Wadium rodzaj",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("S1","Data odbioru końcowego",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("T1","Data ważności oferty",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("U1","Oferta zabezpieczona ?",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("V1","Nr umowy",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("W1","Kwota kontraktu",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("X1","Data dostawy",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("Y1","Informacje",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("Z1","Uzupełnienie informacji",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("AA1","Data zakończenia przetragu",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("AB1","Proces w toku",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("AC1","Zakończono",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("AD1","Wygrano",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("AE1","Usunięto",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("AF1","Najem",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	foreach($dane as $key => $value)
	{
		$spreadsheet->getActiveSheet()->setCellValueExplicit("A".$y,str_replace(",","",$value["Nr"]),\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_NUMERIC);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("B".$y,$value["Szybka<br>ścieżka"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("C".$y,$value["Ilość<br>wniosków"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("D".$y,$value["Państwo"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("E".$y,$value["Spółka"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("F".$y,$value["Odbiorca"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("G".$y,$value["Ruch"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("H".$y,$value["Zamawiający"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("I".$y,$value["Nazwa pliku 1"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("J".$y,$value["Nazwa pliku 2"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("K".$y,$value["Nr projektu"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("L".$y,$value["Nr postępowania"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("M".$y,$value["Data<br>złożenia oferty"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("N".$y,$value["Temat oferty"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("O".$y,$value["Prowadzący"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		// ! TU COS JEST
		$spreadsheet->getActiveSheet()->setCellValueExplicit("P".$y,str_replace(".",",",$value["Kwota<br>oferty"]),\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_NUMERIC);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("Q".$y,str_replace(".",",",$value["Wadium<br>wartość"]),\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("R".$y,str_replace(".",",",$value["Wadium<br>rodzaj"]),\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("S".$y,$value["Data odbioru<br>końcowego"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("T".$y,$value["Data ważności<br>oferty"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("U".$y,$value["Oferta<br>zabezpieczona ?"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("V".$y,$value["Nr umowy"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("W".$y,str_replace(".",",",$value["Kwota<br>kontraktu"]),\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("X".$y,$value["Data<br>dostawy"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("Y".$y,$value["Informacje"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("Z".$y,$value["Uzupełnienie informacji"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("AA".$y,$value["Data zakończenia<br>przetragu"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("AB".$y,$value["Proces<br>w toku"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("AC".$y,$value["Zakończono"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("AD".$y,$value["Wygrano"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("AE".$y,$value["Usunięto"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("AF".$y,$value["Najem"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$y++;
	}
	for ($i = 'A'; $i !=  $spreadsheet->getActiveSheet()->getHighestColumn(); $i++) {
		$spreadsheet->getActiveSheet()->getColumnDimension($i)->setAutoSize(TRUE);
	}
	$writer = new Xlsx($spreadsheet);
	$writer->save('php://output');
	die();
}
function eksport_zleceniaWewnetrzne($arg)
{
	$dane=json_decode($arg["content"],true);
//	echo "<pre>";
//	print_r($dane);
//	die();
	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Disposition: attachment;filename="zleceniaWewnetrzne_eksport.xlsx"');
	header('Cache-Control: max-age=0');
	header('Cache-Control: max-age=1');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
	header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
	header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
	header('Pragma: public'); // HTTP/1.0
	$spreadsheet = new Spreadsheet();
	$sheet = $spreadsheet->getActiveSheet();
	$y=2;
	$spreadsheet->getActiveSheet()->setCellValueExplicit("A1","Nr wniosku",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("B1","Data wniosku",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("C1","Nr EPO",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("D1","Zgłaszający",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("E1","Dział zgłaszający",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("F1","Dział realizujący",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("G1","Konstruktor",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("H1","Typ wniosku",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("I1","Godziny planowane",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("J1","Godziny wykonania",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("K1","Nr zlecenia",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("L1","Planowana data wykonania",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("M1","Konstruktor data wysłania",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("N1","Rzeczywista data wykonania",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("O1","Status",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	foreach($dane as $key => $value)
	{
		$godzinyPlanowane = $value["H plan"];
		$godzinyWykonania = $value["H wykon"];
		if ($godzinyPlanowane == "-") $godzinyPlanowane=0;
		if ($godzinyWykonania == "-") $godzinyWykonania=0;

		$spreadsheet->getActiveSheet()->setCellValueExplicit("A".$y,$value["Nr wniosku"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("B".$y,$value["Data wniosku"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("C".$y,$value["Nr EPO"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("D".$y,$value["Zgłaszający"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("E".$y,$value["Dział zgłaszający"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("F".$y,$value["Dział realizujący"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("G".$y,$value["Konstruktor"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("H".$y,$value["Typ wniosku"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("I".$y,$godzinyPlanowane,\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_NUMERIC);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("J".$y,$godzinyWykonania,\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_NUMERIC);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("K".$y,$value["Nr zlecenia"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("L".$y,$value["Planowana data<br>wykonania"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("M".$y,$value["Konstruktor<br>data wysłania"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("N".$y,$value["Rzeczywista data<br>wykonania"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("O".$y,$value["Status"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$y++;
	}
	for ($i = 'A'; $i !=  $spreadsheet->getActiveSheet()->getHighestColumn(); $i++) {
		$spreadsheet->getActiveSheet()->getColumnDimension($i)->setAutoSize(TRUE);
	}
	$writer = new Xlsx($spreadsheet);
	$writer->save('php://output');
	die();
}
function export_raport1($arg)
{
	$dane=json_decode($arg["content"],true);
	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Disposition: attachment;filename="raport.xlsx"');
	header('Cache-Control: max-age=0');
	header('Cache-Control: max-age=1');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
	header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
	header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
	header('Pragma: public'); // HTTP/1.0
	$spreadsheet = new Spreadsheet();
	$sheet = $spreadsheet->getActiveSheet();
	$y=2;
	$spreadsheet->getActiveSheet()->setCellValueExplicit("A1","Zlecenie",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	$spreadsheet->getActiveSheet()->setCellValueExplicit("B1","Suma godzin",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
	foreach($dane as $key => $value)
	{
		$spreadsheet->getActiveSheet()->setCellValueExplicit("A".$y,$value["Zlecenie"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("B".$y,$value["Suma godzin"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_NUMERIC);
		$y++;
	}
	for ($i = 'A'; $i !=  'C'; $i++) {
		$spreadsheet->getActiveSheet()->getColumnDimension($i)->setAutoSize(TRUE);
	}
	$spreadsheet->getActiveSheet()->setCellValue("B".$y , "=SUM(B2:B".($y-1).")");
	$writer = new Xlsx($spreadsheet);
	$writer->save('php://output');
	die();
}
function export_raport2($arg)
{
	$dane=json_decode($arg["content"]);
	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Disposition: attachment;filename="raport.xlsx"');
	header('Cache-Control: max-age=0');
	header('Cache-Control: max-age=1');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
	header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
	header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
	header('Pragma: public'); // HTTP/1.0
	$spreadsheet = new Spreadsheet();
	$sheet = $spreadsheet->getActiveSheet();
	$y=1;
	foreach($dane as $key => $value)
	{
		$x="A";
		foreach($dane[$key] as $pole => $wartosc) // wstaw nagłówek z nazwami kolumn
		{
			if ($key==0)
			{
				$spreadsheet->getActiveSheet()->setCellValueExplicit($x."1",$pole,\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
				$x++;
			}
		}
		if ($key == 0) // po wstawieniu nagłówka przesuń się linie niżej
		{
			$x="A";
			$y++;
		}
		foreach($dane[$key] as $pole => $wartosc)
		{
			if ($x=="A")
				$spreadsheet->getActiveSheet()->setCellValueExplicit($x.$y,$wartosc,\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
			else
			{
				if ($wartosc == "")
					$wartosc=0;
				$spreadsheet->getActiveSheet()->setCellValueExplicit($x.$y,$wartosc,\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_NUMERIC);
			}
			$x++;
		}
		$y++;
	}
	for ($i = 'A'; $i !=  $spreadsheet->getActiveSheet()->getHighestColumn(); $i++) {
		$spreadsheet->getActiveSheet()->getColumnDimension($i)->setAutoSize(TRUE);
		if ($i == "A")
			$spreadsheet->getActiveSheet()->setCellValueExplicit($i.$y,"Suma godzin",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);			
		if ($i>"A")
			$spreadsheet->getActiveSheet()->setCellValue($i.$y , "=SUM(".$i."2:".$i.($y-1).")");
	}
	$spreadsheet->getActiveSheet()->setCellValue($i.$y , "=SUM(".$i."2:".$i.($y-1).")");
	$writer = new Xlsx($spreadsheet);
	$writer->save('php://output');
	die();	
}
function export_raport4($arg)
{
	$dane=json_decode($arg["content"],true);
	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Disposition: attachment;filename="raport.xlsx"');
	header('Cache-Control: max-age=0');
	header('Cache-Control: max-age=1');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
	header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
	header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
	header('Pragma: public'); // HTTP/1.0
	$styleArrayFirstRow = [
		'font' => [
			'bold' => true,
		]
	];
	$spreadsheet = new Spreadsheet();
	$sheet = $spreadsheet->getActiveSheet();

	$y=1;
	$zlecenie = "";
	foreach($dane as $key => $value)
	{
		if ($y==1)
		{
			$spreadsheet->getActiveSheet()->setCellValueExplicit("A".$y,"Raport za okres ".$value["data_od"]." - ".$value["data_do"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
			$spreadsheet->getActiveSheet()->getStyle("A".$y)->applyFromArray($styleArrayFirstRow);
			$spreadsheet->getActiveSheet()->mergeCells("A".$y.":Z".$y);
			$y++;
		}
		if ($zlecenie != $value["Zlecenie"])
		{
			$zlecenie = $value["Zlecenie"];
			$spreadsheet->getActiveSheet()->setCellValueExplicit("A".$y,$zlecenie,\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
			$spreadsheet->getActiveSheet()->getStyle("A".$y)->applyFromArray($styleArrayFirstRow);
			$spreadsheet->getActiveSheet()->mergeCells("A".$y.":Z".$y);
			$y++;
		}
		$spreadsheet->getActiveSheet()->setCellValueExplicit("B".$y,$value["Nazwisko Imię"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("C".$y,$value["Suma godzin"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_NUMERIC);
//		echo $value["Zlecenie"]."<br>";
//		echo $value["Nazwisko Imię"]."<br>";
//		echo $value["Suma godzin"]."<br>";
		$y++;
	}
	$spreadsheet->getActiveSheet()->getColumnDimension("B")->setAutoSize(TRUE);
	$spreadsheet->getActiveSheet()->getColumnDimension("C")->setAutoSize(TRUE);
	$writer = new Xlsx($spreadsheet);
	$writer->save('php://output');
	die();
}
function export_raport5($arg)
{
	$dane=json_decode($arg["content"],true);
	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Disposition: attachment;filename="raport.xlsx"');
	header('Cache-Control: max-age=0');
	header('Cache-Control: max-age=1');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
	header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
	header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
	header('Pragma: public'); // HTTP/1.0
	$styleArrayFirstRow = [
		'font' => [
			'bold' => true,
		]
	];
	$spreadsheet = new Spreadsheet();
	$sheet = $spreadsheet->getActiveSheet();

	$y=1;
	$pracownik = "";
	foreach($dane as $key => $value)
	{
		if ($y==1)
		{
			$spreadsheet->getActiveSheet()->setCellValueExplicit("A".$y,"Raport za okres ".$value["data_od"]." - ".$value["data_do"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
			$spreadsheet->getActiveSheet()->getStyle("A".$y)->applyFromArray($styleArrayFirstRow);
			$spreadsheet->getActiveSheet()->mergeCells("A".$y.":Z".$y);
			$y++;
		}
		if ($pracownik != $value["Imię nazwisko"])
		{
			$pracownik = $value["Imię nazwisko"];
			$spreadsheet->getActiveSheet()->setCellValueExplicit("A".$y,$pracownik,\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
			$spreadsheet->getActiveSheet()->getStyle("A".$y)->applyFromArray($styleArrayFirstRow);
			$spreadsheet->getActiveSheet()->mergeCells("A".$y.":Z".$y);
			$y++;
		}
		$spreadsheet->getActiveSheet()->setCellValueExplicit("B".$y,$value["Zlecenie"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("C".$y,$value["Suma godzin"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_NUMERIC);
		$y++;
	}
	$spreadsheet->getActiveSheet()->getColumnDimension("B")->setAutoSize(TRUE);
	$spreadsheet->getActiveSheet()->getColumnDimension("C")->setAutoSize(TRUE);
	$writer = new Xlsx($spreadsheet);
	$writer->save('php://output');
	die();
}
function export_raport6($arg)
{
	$dane=json_decode($arg["content"],true);
	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Disposition: attachment;filename="raport.xlsx"');
	header('Cache-Control: max-age=0');
	header('Cache-Control: max-age=1');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
	header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
	header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
	header('Pragma: public'); // HTTP/1.0
	$styleArrayFirstRow = [
		'font' => [
			'bold' => true,
		]
	];
	$spreadsheet = new Spreadsheet();
	$sheet = $spreadsheet->getActiveSheet();

	$y=1;
	$dzial = "";
	foreach($dane as $key => $value)
	{
		if ($y==1)
		{
			$spreadsheet->getActiveSheet()->setCellValueExplicit("A".$y,"Raport za okres ".$value["data_od"]." - ".$value["data_do"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
			$spreadsheet->getActiveSheet()->getStyle("A".$y)->applyFromArray($styleArrayFirstRow);
			$spreadsheet->getActiveSheet()->mergeCells("A".$y.":Z".$y);
			$y++;
		}
		if ($dzial != $value["Dział"])
		{
			$dzial = $value["Dział"];
			$spreadsheet->getActiveSheet()->setCellValueExplicit("A".$y,$dzial,\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
			$spreadsheet->getActiveSheet()->getStyle("A".$y)->applyFromArray($styleArrayFirstRow);
			$spreadsheet->getActiveSheet()->mergeCells("A".$y.":Z".$y);
			$y++;
		}
		$spreadsheet->getActiveSheet()->setCellValueExplicit("B".$y,$value["Zlecenie"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("C".$y,$value["Suma godzin"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_NUMERIC);
		$y++;
	}
	$spreadsheet->getActiveSheet()->getColumnDimension("B")->setAutoSize(TRUE);
	$spreadsheet->getActiveSheet()->getColumnDimension("C")->setAutoSize(TRUE);
	$writer = new Xlsx($spreadsheet);
	$writer->save('php://output');
	die();
}
function export_raport7($arg)
{
	$dane=json_decode($arg["content"],true);
	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Disposition: attachment;filename="raport.xlsx"');
	header('Cache-Control: max-age=0');
	header('Cache-Control: max-age=1');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
	header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
	header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
	header('Pragma: public'); // HTTP/1.0
	$styleArrayFirstRow = [
		'font' => [
			'bold' => true,
		]
	];
	$spreadsheet = new Spreadsheet();
	$sheet = $spreadsheet->getActiveSheet();

	$y=1;
	$dzial = "";
	$zlecenie = "";
	foreach($dane as $key => $value)
	{
		if ($y==1)
		{
			$spreadsheet->getActiveSheet()->setCellValueExplicit("A".$y,"Raport za okres ".$value["data_od"]." - ".$value["data_do"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
			$spreadsheet->getActiveSheet()->getStyle("A".$y)->applyFromArray($styleArrayFirstRow);
			$spreadsheet->getActiveSheet()->mergeCells("A".$y.":Z".$y);
			$y++;
		}
		if ($dzial != $value["Dział"])
		{
			$dzial = $value["Dział"];
			$spreadsheet->getActiveSheet()->setCellValueExplicit("A".$y,$dzial,\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
			$spreadsheet->getActiveSheet()->getStyle("A".$y)->applyFromArray($styleArrayFirstRow);
			$spreadsheet->getActiveSheet()->mergeCells("A".$y.":Z".$y);
			$y++;
		}
		if ($zlecenie != $value["Zlecenie"])
		{
			$zlecenie = $value["Zlecenie"];
			$spreadsheet->getActiveSheet()->setCellValueExplicit("B".$y,$zlecenie,\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
			$spreadsheet->getActiveSheet()->getStyle("B".$y)->applyFromArray($styleArrayFirstRow);
			$spreadsheet->getActiveSheet()->mergeCells("B".$y.":Z".$y);
			$y++;
		}
		$spreadsheet->getActiveSheet()->setCellValueExplicit("C".$y,$value["Nazwisko Imię"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("D".$y,$value["Suma godzin"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_NUMERIC);
		$y++;
	}
	$spreadsheet->getActiveSheet()->getColumnDimension("C")->setAutoSize(TRUE);
	$spreadsheet->getActiveSheet()->getColumnDimension("D")->setAutoSize(TRUE);
	$writer = new Xlsx($spreadsheet);
	$writer->save('php://output');
	die();
}
function export_raport8($arg)
{
	$dane=json_decode($arg["content"],true);
	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Disposition: attachment;filename="raport.xlsx"');
	header('Cache-Control: max-age=0');
	header('Cache-Control: max-age=1');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
	header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
	header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
	header('Pragma: public'); // HTTP/1.0
	$styleArrayFirstRow = [
		'font' => [
			'bold' => true,
		]
	];
	$spreadsheet = new Spreadsheet();
	$sheet = $spreadsheet->getActiveSheet();

	$y=1;
	$dzial = "";
	$nazwiskoImie = "";
	foreach($dane as $key => $value)
	{
		if ($y==1)
		{
			$spreadsheet->getActiveSheet()->setCellValueExplicit("A".$y,"Raport za okres ".$value["data_od"]." - ".$value["data_do"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
			$spreadsheet->getActiveSheet()->getStyle("A".$y)->applyFromArray($styleArrayFirstRow);
			$spreadsheet->getActiveSheet()->mergeCells("A".$y.":Z".$y);
			$y++;
		}
		if ($dzial != $value["Dział"])
		{
			$dzial = $value["Dział"];
			$spreadsheet->getActiveSheet()->setCellValueExplicit("A".$y,$dzial." (".$value["data_od"]." - ".$value["data_do"].")",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
			$spreadsheet->getActiveSheet()->getStyle("A".$y)->applyFromArray($styleArrayFirstRow);
			$spreadsheet->getActiveSheet()->mergeCells("A".$y.":Z".$y);
			$y++;
		}
		if ($nazwiskoImie != $value["Nazwisko Imię"])
		{
			$nazwiskoImie = $value["Nazwisko Imię"];
			$spreadsheet->getActiveSheet()->setCellValueExplicit("B".$y,$nazwiskoImie." (".$value["data_od"]." - ".$value["data_do"].")",\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
			$spreadsheet->getActiveSheet()->getStyle("B".$y)->applyFromArray($styleArrayFirstRow);
			$spreadsheet->getActiveSheet()->mergeCells("B".$y.":Z".$y);
			$y++;
		}
		$spreadsheet->getActiveSheet()->setCellValueExplicit("C".$y,$value["Zlecenie"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
		$spreadsheet->getActiveSheet()->setCellValueExplicit("D".$y,$value["Suma godzin"],\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_NUMERIC);
		$y++;
	}
	$spreadsheet->getActiveSheet()->getColumnDimension("C")->setAutoSize(TRUE);
	$spreadsheet->getActiveSheet()->getColumnDimension("D")->setAutoSize(TRUE);
	$writer = new Xlsx($spreadsheet);
	$writer->save('php://output');
	die();
}
?>
