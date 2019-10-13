$(document).ready(function() {
  // load existing jobs on page load
  getJobs();

  $('.modal').modal({
    dismissible: false
  });
  $('select').formSelect();
  $('.datepicker').datepicker();

  //click events
  $('#updateJob').on('click', newJob);
  $('.logout').on('click', logout);
  $('#viewJobs').on('click', '.editJob', editJob);
  $('#viewJobs').on('click', '.deleteJob', deleteJob);
  $('#viewJobs').on('click', '.getImageFileName', getImageFileName);
  $('#viewJobs').on('click', '.getEmailAddress', getEmailAddress);

  // check if user is still logged in --- authentication
  uid = null;
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      uid = user.uid;
    } else {
      uid = null;
      window.location.replace('index.html');
    }
  });

  // firebase logout
  function logout() {
    firebase.auth().signout();
  }
  // firebase storage
  var uploader = document.getElementById('uploader');
  var fileButton = document.getElementById('fileButton');
  fileButton.addEventListener('change', function(e) {
    // Get file
    var file = e.target.files[0];
    // Create a storage ref
    var storageRef = firebase.storage().ref('screenshots/' + file.name);
    // console.log(file.name);
    // Upload file
    var task = storageRef.put(file);
    // Update progress bar
    task.on(
      'state_changed',
      function progress(snapshot) {
        var percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploader.value = percentage;
      },
      function error(error) {
        window.alert('error uploading image, check console', error);
      },
      function complete() {}
    );
  });

  function getJobs() {
    // ajax call to server to get jobs
    $.ajax({
      url: '/jobs',
      type: 'GET',
      success: function(data) {
        displayJobs(data);
      },
      error: function(response) {
        console.log('error response', response);
      }
      // display on DOM with buttons that allow edit of each
    });
  } // end getJobs

  // gets jobs from dB to display in table onload
  function displayJobs(data) {
    $('#viewJobs').empty();
    for (let i = 0; i < data.length; i++) {
      let newRow = $('<tr>');
      // using moment.js to parse date
      let convertedDate = data[i].date;
      convertedDate = convertedDate.split('T')[0];

      //appending rows to DOM
      newRow.append('<td>' + data[i].id + '</td>');
      newRow.append('<td>' + data[i].company + '</td>');
      newRow.append('<td>' + data[i].contact + '</td>');
      newRow.append('<td>' + data[i].email + '</td>');
      newRow.append('<td>' + data[i].position + '</td>');
      newRow.append('<td>' + data[i].notes + '</td>');
      newRow.append('<td>' + convertedDate + '</td>');
      newRow.append('<td>' + data[i].status + '</td>');
      newRow.append('<td>' + data[i].filename + '</td>');
      // get email address
      newRow.append(
        '<td><button type="button" class="getEmailAddress btn-floating btn-small orange tableButton" value="' +
          data[i].email +
          '"><i class="fas fa-envelope"></i></button></td>'
      );
      $('#viewJobs').append(newRow);
      //edit row button
      newRow.append(
        '<td><button type="button" class="editJob tableEditBtn btn-floating btn-small green tableButton modal-trigger" data-target="myModal" value="' +
          data[i].id +
          '"><i class="fas fa-pencil-alt"></i></button></td>'
      );
      // //delete row button
      newRow.append(
        '<td><button type="button" class="deleteJob btn-floating btn-small red tableButton" value="' +
          data[i].id +
          '"><i class="fa fa-trash"></i></button></td>'
      );
      // display image button
      newRow.append(
        '<td><button type="button" class="getImageFileName btn-floating btn-small light-blue darken-1 modal-trigger tableButton" data-target="image-modal" data-target="#image-modal" value="' +
          data[i].id +
          '"><i class="fa fa-image"></i></button></td>'
      );
      $('#viewJobs').append(newRow);
    }
  }

  function getEmailAddress() {
    let to = $(this).val();

    var form = document.createElement('form');

    //Set the form attributes
    form.setAttribute('method', 'post');
    form.setAttribute('enctype', 'text/plain');
    form.setAttribute('action', 'mailto:' + to);
    form.setAttribute('style', 'display:none');

    //Append the form to the body
    document.body.appendChild(form);

    //Submit the form
    form.submit();

    //Clean up
    document.body.removeChild(form);
  }

  // Create new job in modal
  function newJob() {
    var e = document.getElementById('status');
    var strStatus = e.options[e.selectedIndex].text;
    // console.log(strStatus)

    //setting variables
    let company = $('#company').val();
    let contact = $('#contact').val();
    let email = $('#email').val();
    let position = $('#position').val();
    let notes = $('#notes').val();
    let date = $('#date').val();
    let status = strStatus;
    let filename = $('#filename').val();

    if (checkInputs(company)) {
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

      $.ajax({
        type: 'POST',
        url: '/jobs',
        data: objectToSend,
        success: function(response) {
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
        error: function(response) {
          console.log('error saving new job', response);
        }
      });
    }
  }

  // receive job object from editjob update in dB
  function updateJob() {
    var e = document.getElementById('status');
    var strStatus = e.options[e.selectedIndex].text;
    console.log('inside update job');

    let company = $('#company').val();
    let contact = $('#contact').val();
    let email = $('#email').val();
    let position = $('#position').val();
    let notes = $('#notes').val();
    let date = $('#date').val();
    let status = strStatus;
    let filename = $('#filename').val();

    if (checkInputs(company)) {
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
        success: function(response) {
          getJobs();
          $('#editJob').empty();
          $('#updateJob').on('click', newJob);
          $('#updateJob').off('click', updateJob);
          $('#formLabel').text('Edit Job');
          $('#updateJob').text('Edit Job');

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
        error: function(response) {
          console.log('error in updating job', response);
        }
      });
    }
  }

  // get data from dB to edit job
  function editJob() {
    $('#myModalLabel').text('Edit Job');
    $('#updateJob').off('click', newJob); //end updateJob on click
    $('#updateJob').on('click', updateJob);

    let editDiv = $('#editJob');
    let jobID = $(this).val();
    console.log('jobID from editJob, ', jobID);

    $.ajax({
      url: '/jobs/' + jobID,
      method: 'GET',
      success: function(response) {
        console.log('response ', response);
        $('#company')
          .val(response[0].company)
          .focus();
        $('#contact').val(response[0].contact);
        $('#email').val(response[0].email);
        $('#position').val(response[0].position);
        $('#notes').val(response[0].notes);
        $('#date').val(response[0].date);
        $('#status').val(response[0].status);
        $('#filename').val(response[0].filename);
        $('#updateJob').val(response[0].id);
      }, // end success
      error: function(response) {
        console.log('error in edit job', response);
      }
    });
  }

  // Getting image filename to pass to firebase to search firebase storage
  function getImageFileName() {
    let ID = $(this).val();
    $.ajax({
      type: 'GET',
      url: '/jobs/filename/' + ID,
      success: function(data) {
        // console.log('imageFileName: ', data);
        displayImage(data);
      }, // end success
      error: function(response) {
        console.log('error getting image filename', response);
      }
    });
  }
  // display image after from google firebase storage
  function displayImage(data) {
    var imageData = data[0].filename;

    //Get image from storage
    let storageRef = storage.ref('screenshots/' + imageData);

    storageRef
      .getDownloadURL()
      .then(function(url) {
        // This can be downloaded directly:
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function(event) {
          var blob = xhr.response;
        };

        xhr.open('GET', url);
        xhr.send();

        var img = document.getElementById('image-modal');
        img.src = url;

        $('#imageSrc').attr('src', url);
        $('#image-modal').openModal();
      })
      .catch(function(error) {
        // console.log('Error displaying image ', error);
      });
  }

  // delete job from table
  function deleteJob() {
    let id = $(this).val();
    // console.log('id: ', id);
    $.ajax({
      type: 'DELETE',
      url: '/jobs/' + id,
      success: function(response) {
        // console.log('response', response);
        getJobs();
      },
      error: function(error) {
        console.log('Error deleting job ', error);
      }
    });
  }
  // Firebase code for file selection
  let storage = firebase.storage();

  function selectFile() {
    var file = document.getElementById('file').files[0];
    var filename = file.name;
    document.getElementById('displayFileName').innerHTML = filename;
  }
  // Write on keyup event of keyword input element
  $('#search').keyup(function() {
    console.log('in search');

    var searchText = $(this)
      .val()
      .toLowerCase();
    // Show only matching TR, hide rest of them
    $.each($('#table tbody tr'), function() {
      if (
        $(this)
          .text()
          .toLowerCase()
          .indexOf(searchText) === -1
      )
        $(this).hide();
      else $(this).show();
    });
  });

  // clear search using window reload
  // not the most sound method/will improve
  // TODO:improve clear search
  function clearSearch() {
    window.location.reload();
  }

  // check inputs/reduced to one do to testing
  // TODO: reimplement input verification
  function checkInputs(company) {
    if (company == '') {
      alert('Company can not be empty, please review required fields.');
      return false;
    } else {
      return true;
    }
  }
  // search on key up
  $('#phone').keypress(function(e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
      return false;
    }
    var curchr = this.value.length;
    var curval = $(this).val();
    if (curchr == 3 && e.which != 8 && e.which != 0) {
      $(this).val(curval + '-');
    } else if (curchr == 7 && e.which != 8 && e.which != 0) {
      $(this).val(curval + '-');
    }
    $(this).attr('maxlength', '12');
  });

  jQuery('.toggle-nav').click(function(e) {
    jQuery(this).toggleClass('active');
    jQuery('.menu ul').toggleClass('active');

    e.preventDefault();
  });

  // firebase login
  function login() {
    userEmail = document.getElementById('inputEmail').value;
    userPassword = document.getElementById('inputPassword').value;

    window.alert(userEmail + ' ' + userPassword);
  }
});
