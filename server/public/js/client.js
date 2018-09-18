console.log('js');

$(document).ready(function () {
  console.log('JQ');

  // load existing jobs on page load
  getJobs();

  $('#updateJob').on('click', newJob); //end updateJob on click
  $('#viewJobs').on('click', '.editJob', editJob);
  $('#viewJobs').on('click', '.deleteJob', deleteJob);
  $('#viewJobs').on('click', '.getImageFileName', getImageFileName);

  // $('#viewJobs').on('click', '.showImage', showImage);

  var modal = document.querySelector(".modal");
  var trigger = document.querySelector(".trigger");
  var date_input = $('input[name="date"]'); //our date input has the name "date"
  var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
  date_input.datepicker({
    format: 'mm/dd/yyyy',
    container: container,
    todayHighlight: true,
    autoclose: true,
  })

  function newJob() {
    console.log('in add new job on click');

    let company = $('#company').val()
    let contact = $('#contact').val()
    let email = $('#email').val()
    let position = $('#position').val()
    let notes = $('textarea').val()
    let date = $('#date').val()
    let status = $('#status').val()
    let filename = $('#filename').val()

    if (checkInputs(company, notes, date)) {
      let objectToSend = {
        company: company,
        contact: contact,
        email: email,
        position: position,
        notes: notes,
        date: date,
        status: status,
        filename: filename
      };
      // call saveJob with the new obejct
      saveJob(objectToSend);
      console.log(objectToSend);

      $.ajax({
        type: 'PUT',
        url: '/jobs/update/' + jobID,
        data: objectToUpdate,
        success: function (response) {
          console.log('response', response);
          getJobs();
          $('#editJob').empty();
          $('#updateJob').on('click', newJob); //end updateJob on click
          $('#updateJob').off('click', updateJob);
          $('#formLabel').text('Add Job');
          $('#updateJob').text('Add Job');

          $('#company').val('');
          $('#contact').val('');
          $('#email').val('');
          $('#position').val('');
          $('textarea').val('');
          $('#date').val('');
          $('#status').val('');
          $('#filename').val('');
          $('#updateJob').val('');
        }
      });
    }
  }

  function updateJob() {

    let company = $('#company').val()
    let contact = $('#contact').val()
    let email = $('#email').val()
    let position = $('#position').val()
    let notes = $('#notes').val()
    console.log(notes);

    let date = $('#date').val()
    let status = $('#status').val()
    let filename = $('#filename').val()

    console.log(email);
    if (checkInputs(company, notes, date)) {
      let jobID = $(this).val();
      console.log(jobID);
      let objectToUpdate = {
        company: company,
        contact: contact,
        email: email,
        position: position,
        notes: notes,
        date: date,
        status: status,
        filename: filename

      };
      $.ajax({
        type: 'PUT',
        url: '/jobs/update/' + jobID,
        data: objectToUpdate,
        success: function (response) {
          console.log('response', response);
          getJobs();
          $('#editJob').empty();
          $('#updateJob').on('click', newJob); //end updateJob on click
          $('#updateJob').off('click', updateJob);
          $('#formLabel').text('Add Job');
          $('#updateJob').text('Add Job');

          $('#company').val('');
          $('#contact').val('');
          $('#email').val('');
          $('#position').val('');
          $('textarea').val('');
          $('#date').val('');
          $('#status').val('');
          $('#filename').val('');
          $('#updateJob').val('');
        }
      });
    }
  }

  function editJob() {

    $('#updateJob').text('Edit');
    $('#updateJob').off('click', newJob); //end updateJob on click
    $('#updateJob').on('click', updateJob);

    let editDiv = $('#editJob');
    let jobID = $(this).val();

    $.ajax({
      url: '/jobs/' + jobID,
      method: 'GET',
      success: function (response) {
        console.log('got one job:', jobID, response);

        $('#company').val(response[0].company).focus();
        $('#contact').val(response[0].contact);
        $('#email').val(response[0].email);
        $('#position').val(response[0].position);
        $('#notes').val(response[0].notes);
        $('#date').val(response[0].date);
        $('#status').val(response[0].status);
        $('#filename').val(response[0].filename);
        $('#updateJob').val(response[0].id);
      }
    });
  }

  function checkInputs(company, notes, date) {
    if (company == '' || notes == '' || date == '') {
      alert('Company name, summary, and date can not be empty, please review required fields.');
      return false;
    } else {
      return true;
    }
  }

  function getJobs() {
    console.log('in getJobs');
    // ajax call to server to get jobs
    $.ajax({
      url: '/jobs',
      type: 'GET',
      success: function (data) {
        console.log('got some jobs: ', data);

        displayJobs(data);
      }, // end success
      error: function (jqXHR, exception) {
        var msg = '';
        if (jqXHR.status === 0) {
          msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 404) {
          msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
          msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
          msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
          msg = 'Time out error.';
        } else if (exception === 'abort') {
          msg = 'Ajax request aborted.';
        } else {
          msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        alert(html(msg));
      }, //end ajax
      // display on DOM with buttons that allow edit of each
    })
  } // end getJobs


  // gets jobs form dB to display in table onload
  function displayJobs(data) {
    console.log(data);
    
    $('#viewJobs').empty();

    for (let i = 0; i < data.length; i++) {
      let newRow = $('<tr>');
      let convertedDate = data[i].date;
      convertedDate = convertedDate.split('T')[0];
      // convertedDate = moment().format('MM-DD-YYYY')

      // console.log(convertedDate);

      newRow.append('<td>' + data[i].id + '</td>');
      newRow.append('<td>' + data[i].company + '</td>');
      newRow.append('<td>' + data[i].contact + '</td>');
      newRow.append('<td>' + data[i].email + '</td>');
      newRow.append('<td>' + data[i].position + '</td>');
      newRow.append('<td>' + data[i].notes + '</td>');
      newRow.append('<td>' + convertedDate + '</td>');
      newRow.append('<td>' + data[i].status + '</td>');
      newRow.append('<td>' + data[i].filename + '</td>');
      newRow.append('<td><button type="button" class="getImageFileName btn btn-info" value="' + data[i].id + '"><i class="fa fa-image"></i></button></td>');
      newRow.append('<td><button type="button" class="editJob btn btn-success tableButton" value="' + data[i].id + '"><i class="fa fa-pencil"></i></button></td>');
      newRow.append('<td><button type="button" class="deleteJob btn btn-danger tableButton" value"' + data[i].id + '"><i class="fa fa-trash"></i></button></td>');

      $('#viewJobs').append(newRow);
    }
  }

  function getImageFileName() {
    let jobID = $(this).val();
    console.log('jobID: ', jobID);

    $.ajax({
      type: 'GET',
      url: '/jobs/filename/' + jobID,
      success: function (data) {
        console.log('imageFileName: ', data);
        displayImage(data);
      },
      error: function (err) {
        console.log('error getting image file name: ', err);
      }
    });
  }

  function displayImage(data) {
    console.log('image data ', data[0]);
    
  }

  let displayAllStatus = true;

  function saveJob(newJob) {
    console.log('in saveJob', newJob);

    $.ajax({
      url: '/jobs',
      type: 'POST',
      data: newJob,
      success: function (response) {
        console.log('got some jobs: ', response);
        getJobs();

        $('#company').val('').focus();
        $('#contact').val('');
        $('#email').val('');
        $('#position').val('');
        $('textarea').val('');
        $('#date').val('');
        $('#status').val('');
        $('#filename').val('');

      } // end success
    }); //end ajax
  }

  function deleteJob() {
    let jobID = $(this).val();
    $.ajax({
      type: 'DELETE',
      url: '/jobs/' + jobID,
      success: function (response) {
        console.log('response', response);
        getJobs();
      }
    });
  }

  function selectFile() {
    var file = document.getElementById('file').files[0];
    var filename = file.name;
    console.log(filename);


    document.getElementById('displayFileName').innerHTML = filename;
  }

  // Write on keyup event of keyword input element
  $("#search").keyup(function () {
    var searchText = $(this).val().toLowerCase();
    // Show only matching TR, hide rest of them
    $.each($("#table tbody tr"), function () {
      if ($(this).text().toLowerCase().indexOf(searchText) === -1)
        $(this).hide();
      else
        $(this).show();
    });
  });
});