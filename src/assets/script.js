function boxClicked(dayResult, hobby){
    if(['pending', 'not_done'].includes(dayResult.status)){
        $('#doneButton').show();
        $('#resetButton').hide();
        $('#formStatus').val('done');
    }else{
        $('#doneButton').hide();
        $('#resetButton').show();
        $('#formStatus').val('not_done');
    }
    $('#formDate').val(dayResult.dateString);
    $('#formHobby').val(hobby);
    $('#hobbyStat').modal('show');
}