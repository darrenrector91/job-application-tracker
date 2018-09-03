console.log('js');

$(document).ready(function () {
  console.log('JQ');

  // load existing jobs on page load
  getJobs();

  $('#updateJob').on('click', newJob); //end updateJob on click
  $('#viewJobs').on('click', '.editJob', editJob);
  $('#viewJobs').on('click', '.deleteJob', deleteJob);

}); // end doc ready

function newJob() {
  console.log('in add new job on click');
  // get user input and put in an object
  // NOT WORKING YET :(
  // using a test object
  let company = $('#company').val()
  let contact = $('#contact').val()
  let email = $('#email').val()
  let notes = $('#notes').val()
  let date = $('#date').val()
  let status = $('#status').val()

  if (checkInputs(company, notes, date)) {
    let objectToSend = {
      company: company,
      contact: contact,
      email: email,
      notes: notes,
      date: date,
      status: status
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
        $('#notes').val('');
        $('#date').val('');
        $('#status').val('');
        $('#updateJob').val('');
      }
    });
  }
}

function updateJob() {

  let company = $('#company').val()
  let contact = $('#contact').val()
  let email = $('#email').val()
  let notes = $('#notes').val()
  let date = $('#date').val()
  let status = $('#status').val()

  console.log(email);
  if (checkInputs(company, notes, date)) {
    let jobID = $(this).val();
    console.log(jobID);
    let objectToUpdate = {
      company: company,
      contact: contact,
      email: email,
      notes: notes,
      date: date,
      status: status
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
        $('#notes').val('');
        $('#date').val('');
        $('#status').val('');
        $('#updateJob').val('');
      }
    });
  }
}

function editJob() {

  $('#updateJob').text('Edit Job');
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
      $('#notes').val(response[0].notes);
      $('#date').val(response[0].date);
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
    } // end success
  }); //end ajax
  // display on DOM with buttons that allow edit of each
} // end getJobs

function displayJobs(data) {
  // WORKING

  $('#viewJobs').empty();

  for (let i = 0; i < data.length; i++) {
      let newRow = $('<tr>');
      newRow.append('<td>' + data[i].id + '</td>');
      newRow.append('<td>' + data[i].company + '</td>');
      newRow.append('<td>' + data[i].contact + '</td>');
      newRow.append('<td>' + data[i].email + '</td>');
      newRow.append('<td>' + data[i].notes + '</td>');
      newRow.append('<td>' + data[i].date + '</td>');
      newRow.append('<td>' + data[i].status + '</td>');
      newRow.append('<td><button type="button" class="editJob btn btn-success tableButton" value="' + data[i].id + '"><i class="fa fa-pencil" aria-hidden="true"></i>Edit</button></td>');
      newRow.append('<td><button type="button" class="deleteJob btn btn-danger tableButton" value="' + data[i].id + '"><i class="fa fa-trash" aria-hidden="true"></i>Delete</button></td>');

      $('#viewJobs').append(newRow);
  }
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
      $('#notes').val('');
      $('#date').val('');
      $('#status').val('');
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