function zamknijMenu() {
	if ($('#menu').css('left')=='0px')
			$('#menu').animate({ "left": "-=300px" }, "slow" );
}

$('#openMenu').on('click', function() {
	$('#menu').animate({ "left": "+=300px" }, "slow" );
});
$('#closeMenu').on('click', function() {
	zamknijMenu();
})
$("#menuDashboard").click(function() {
    $("#pulpit").load("html/dashboard.html");
    zamknijMenu();
});

