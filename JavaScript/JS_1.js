function changeBackground() {
    let vbc_input = document.getElementById("virtual_bar_code");

    if (vbc_input.value.toString() === ''){
        vbc_input.style.backgroundColor = "white";
    } else {
        vbc_input.style.backgroundColor = "lightgrey";
    }
}

function decode () {
    let cad = $('#virtual_bar_code').val();

    if (cad === "" || cad === null){
        alert("Virtual bar code is empty");
    }else if(cad.length !== 54) {
        alert("Virtual bar code is not correct (length different of 54)");
    } else if(isNaN(cad)){
        alert("Virtual bar code is not a number");
    } else {//TODO : Blank for IDAN and Reference 
        $('#payeesIBAN').html(cad.substring(1,16));
        $('#amount').html(Number(cad.substring(17,23) + "." + cad.substring(23,25))+"€");

        let i;
        if (Number(cad.substring(0,1)) === 4) {
            $('#reference').html(Number(cad.substring(28, 28 + 20)).toString());
            i = 28+20;
        } else if (Number(cad.substring(0,1)) === 5){
            $('#reference').html(Number(cad.substring(25, 25 + 23)).toString());
            i = 25+23;
        }
        $('#due_date').html(cad.substring(i+4,i+6) + '-' + cad.substring(i+2,i+4) + '-' + cad.substring(i,i+2));
        JsBarcode("#bar_code_picture", cad, {
            format: "CODE128",
            lineColor: "#0aa",
            width:4,
            height:40,
            displayValue: true
        });
    }
}


function slide_up_down() {
    if($('#bar_code_info').is(':visible')){
        $('#bar_code_info').slideUp();
        $('#hide_button').html('Show');
    }else{
        $('#bar_code_info').slideDown();
        $('#hide_button').html('Hide');
    }
}


window.onload = function() {
    document.getElementById("virtual_bar_code").addEventListener('input', changeBackground, false);
    $('#decode').on('click', decode);
    $('#hide_button').on('click', slide_up_down);
}