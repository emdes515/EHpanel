$('#dashboard').jqxDocking({ 
    orientation: 'horizontal',
    width: '100%',
    height: '100%',
    mode: 'docked',
    theme: theme
});
$('#dashboard').jqxDocking('pinWindow', 'window1');
$('#dashboard').jqxDocking('pinWindow', 'window2');
$('#dashboard').jqxDocking('pinWindow', 'window3');
$('#dashboard').jqxDocking('pinWindow', 'window4');
$('#dashboard').jqxDocking('pinWindow', 'window5');
$('#dashboard').jqxDocking('disableWindowResize', 'window1');
$('#dashboard').jqxDocking('disableWindowResize', 'window2');
$('#dashboard').jqxDocking('disableWindowResize', 'window3');
$('#dashboard').jqxDocking('disableWindowResize', 'window4');
$('#dashboard').jqxDocking('disableWindowResize', 'window5');
$('#dashboard').jqxDocking('hideAllCloseButtons', 'window1');
$('#dashboard').jqxDocking('hideAllCloseButtons', 'window2');
$('#dashboard').jqxDocking('hideAllCloseButtons', 'window3');
$('#dashboard').jqxDocking('hideAllCloseButtons', 'window4');
$('#dashboard').jqxDocking('hideAllCloseButtons', 'window5');
$("#dashboard").jqxDocking('refresh', true);
