$(document).ready(function () {
  // load existing jobs on page load
  getJobs();

  //clear button for search
  $('.search-wrapper').append('<button type="button" class="jobClearSearchBtn functionBtn btn btn-warning ">Clear</button>')

  //click events
  $('#updateJob').on('click', newJob);
  $('#viewJobs').on('click', '.editJob', editJob);
  $('#viewJobs').on('click', '.deleteJob', deleteJob);
  $('#viewJobs').on('click', '.getImageFileName', getImageFileName);
  $('.search-wrapper').on('click', '.clearSearch', clearSearch);


  //datepicker
  var date_input = $('input[name="date"]'); //our date input has the name "date"
  var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
  date_input.datepicker({
    format: 'mm/dd/yyyy',
    container: container,
    todayHighlight: true,
    autoclose: true,
  })

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDgjY9O33RPzuRDfVPHhFZ_9h_SkGD0BH4",
    authDomain: "gig-finder-75751.firebaseapp.com",
    databaseURL: "https://gig-finder-75751.firebaseio.com",
    projectId: "gig-finder-75751",
    storageBucket: "gig-finder-75751.appspot.com",
    messagingSenderId: "25565657670"
  };

  firebase.initializeApp(config)
  var uploader = document.getElementById('uploader');
  var fileButton = document.getElementById('fileButton');
  fileButton.addEventListener('change', function (e) {
    // Get file
    var file = e.target.files[0];
    // Create a storage ref
    var storageRef = firebase.storage().ref('screenshots/' + file.name);
    // console.log(file.name);
    // Upload file
    var task = storageRef.put(file)
    // Update progress bar
    task.on('state_changed',
      function progress(snapshot) {
        var percentage = (snapshot.bytesTransferred /
          snapshot.totalBytes) * 100;
        uploader.value = percentage;
      },
      function error(error) {
        window.alert('error uploading image, check console', error)
      },
      function complete() { }
    )
  });

  function getJobs() {
    // ajax call to server to get jobs
    $.ajax({
      url: '/jobs',
      type: 'GET',
      success: function (data) {
        displayJobs(data);
      },
      error: function (response) {
        console.log('error response', response);

      }
      // display on DOM with buttons that allow edit of each
    })
  } // end getJobs

  // gets jobs from dB to display in table onload
  function displayJobs(data) {
    $('#viewJobs').empty();
    for (let i = 0; i < data.length; i++) {
      let newRow = $('<tr>');
      // using MediaStreamErrorEvent.js to parse date into a readable format
      let convertedDate = data[i].date;
      convertedDate = convertedDate.split('T')[0];

      //appending rows to DOM
      newRow.append('<td>' + data[i].id + '</td>');
      newRow.append('<td>' + data[i].company + '</td>');
      newRow.append('<td>' + data[i].contact + '</td>');
      newRow.append('<td>' + data[i].email + '</td>');
      newRow.append('<td>' + data[i].position + '</td>');
      newRow.append('<td style="max-width: 100px;">' + data[i].notes + '</td>');
      newRow.append('<td>' + convertedDate + '</td>');
      newRow.append('<td class="status" style="color: white";>' + data[i].status + '</td>');
      newRow.append('<td>' + data[i].filename + '</td>');
      //edit row button
      newRow.append('<td><button type="button" class="editJob tableEditBtn btn btn-success tableButton" value="' + data[i].id + '"><i class="fas fa-pencil-alt"></i></button></td>');
      //delete row button
      newRow.append('<td><button type="button" class="deleteJob btn btn-danger tableButton" value="' + data[i].id + '"><i class="fa fa-trash"></i></button></td>');
      // display image button
      newRow.append('<td><button type="button" class="getImageFileName btn btn-info" data-toggle="image-modal" data-target="#image-modal" value="' + data[i].id + '"><i class="fa fa-image"></i></button></td>');
      $('#viewJobs').append(newRow);
    }
  }

  var status = $('.status');
  status.each(function (index) {
    if ($(this).text() == "Rejected") {
      $(this).css("color", "red");
    } else {
      if ($(this).text() == "Applied" || $(this).text() == "Phone interview" || $(this).text() == "First interview" || $(this).text() == "Second interview" || $(this).text() == "Additional interview") {
        $(this).css("color", "white");
      }
    }
  });

  function newJob() {

    //setting variables
    let company = $('#company').val()
    let contact = $('#contact').val()
    let email = $('#email').val()
    let position = $('#position').val()
    let notes = $('textarea').val()
    let date = $('#date').val()
    let status = $('#status').val()
    let filename = $('#filename').val()


    if (checkInputs(company, date)) {
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

      $.ajax({
        type: 'PUT',
        url: '/jobs/update/',
        data: objectToUpdate,
        success: function (response) {
          // console.log('response', response);
          getJobs();
          $('#editJob').empty();
          $('#updateJob').on('click', newJob); //end updateJob on click
          $('#updateJob').off('click', updateJob);
          $('#formLabel').text('Add Job');
          $('#updateJob').text('Add Job');

          //clear inputs after job updated
          $('#company').val('');
          $('#contact').val('');
          $('#email').val('');
          $('#position').val('');
          $('textarea').val('');
          $('#date').val('');
          $('#status').val('');
          $('#filename').val('');
          $('#updateJob').val('');
        },
        error: function (response) {
          console.log('error saving new job', response);

        }
      });
    }
  }

  function saveJob(newJob) {

    $.ajax({
      url: '/jobs',
      type: 'POST',
      data: newJob,
      success: function (response) {
        // console.log('got some jobs: ', response);
        getJobs();
        $('#company').val('').focus();
        $('#contact').val('');
        $('#email').val('');
        $('#position').val('');
        $('textarea').val('');
        $('#date').val('');
        $('#status').val('');
        $('#filename').val('');
      }, // end success
      error: function (response) {
        console.log('error saving job', response);

      }
    }); //end ajax
  }

  function updateJob() {

    let company = $('#company').val()
    let contact = $('#contact').val()
    let email = $('#email').val()
    let position = $('#position').val()
    let notes = $('#notes').val()

    let date = $('#date').val()
    let status = $('#status').val()
    let filename = $('#filename').val()

    if (checkInputs(company, notes, date)) {
      let jobID = $(this).val();
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
          getJobs();
          $('#editJob').empty();
          $('#updateJob').on('click', newJob);
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
        }, // end success
        error: function (response) {
          console.log('error in updating job', response);

        }
      });
    }
  }

  function editJob() {
    $('#myModalLabel').text('Edit Job');
    $('#updateJob').off('click', newJob); //end updateJob on click
    $('#updateJob').on('click', updateJob);

    let editDiv = $('#editJob');
    let jobID = $(this).val();
    // console.log('jobID from editJob, ', jobID);

    $.ajax({
      url: '/jobs/' + jobID,
      method: 'GET',
      success: function (response) {
        // console.log('response ', response);
        $('#company').val(response[0].company).focus();
        $('#contact').val(response[0].contact);
        $('#email').val(response[0].email);
        $('#position').val(response[0].position);
        $('#notes').val(response[0].notes);
        $('#date').val(response[0].date);
        $('#status').val(response[0].status);
        $('#filename').val(response[0].filename);
        $('#updateJob').val(response[0].id);

        $('#myModal').modal('show');
      }, // end success
      error: function (response) {
        console.log('error in edit job', response);

      }
    })
  }

  function getImageFileName() {
    let ID = $(this).val();
    $.ajax({
      type: 'GET',
      url: '/jobs/filename/' + ID,
      success: function (data) {
        // console.log('imageFileName: ', data);
        displayImage(data);

      }, // end success
      error: function (response) {
        console.log('error getting image filename', response);

      }
    });
  }

  function displayImage(data) {
    var imageData = data[0].filename;

    //Get image from storage
    let storageRef = storage.ref('screenshots/' + imageData);

    storageRef.getDownloadURL().then(function (url) {

      // This can be downloaded directly:
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function (event) {
        var blob = xhr.response;
      };

      xhr.open('GET', url);
      xhr.send();

      var img = document.getElementById('image-modal');
      img.src = url;

      // $('#image-modal').modal({
      //   show: true
      // }).html('<img src=' + url + '>');

      $('#imageSrc').attr('src', url);
      $('#image-modal').modal({
        show: true
      })

    }).catch(function (error) {
      console.log('Error displaying image ', error);

    });
  };

  function deleteJob() {
    let id = $(this).val();
    // console.log('id: ', id);
    $.ajax({
      type: 'DELETE',
      url: '/jobs/' + id,
      success: function (response) {
        // console.log('response', response);
        getJobs();
      },
      error: function (error) {
        console.log('Error deleting job ', error);
      }

    });
  }

  let storage = firebase.storage();

  function selectFile() {
    var file = document.getElementById('file').files[0];
    var filename = file.name;
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

  function clearSearch() {
    window.location.reload();
  }

  function checkInputs(company, notes, date) {
    if (company == '' || notes == '' || date == '') {
      alert('Company name, summary, and date can not be empty, please review required fields.');
      return false;
    } else {
      return true;
    }
  }

  $("#phone").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
      return false;
    }
    var curchr = this.value.length;
    var curval = $(this).val();
    if (curchr == 3 && e.which != 8 && e.which != 0) {
      $(this).val(curval + "-");
    } else if (curchr == 7 && e.which != 8 && e.which != 0) {
      $(this).val(curval + "-");
    }
    $(this).attr('maxlength', '12');
  });

  jQuery('.toggle-nav').click(function (e) {
    jQuery(this).toggleClass('active');
    jQuery('.menu ul').toggleClass('active');

    e.preventDefault();
  });

  function login() {
    console.log('in login');


    userEmail = document.getElementById("imputEmail").value;
    userPassword = document.getElementById("inputPassword").value;

    window.alert(userEmail + " " + userPassword);
  }
});