$(document).ready(function () {

    // import getSearch from './bot';
    // let a = getSearch();
    // console.log(a);


    // load existing contacts on page load
    getContacts();
    getCompany();

    $('.dropdown-trigger').dropdown();

    $('.modal').modal({
        dismissible: false
    });

    //click events
    $('#updateContact').on('click', newContact);
    $('#viewContacts').on('click', '.editContact', editContact);
    $('#viewContacts').on('click', '.deleteContact', deleteContact);
    $('#viewContacts').on('click', '.getEmailAddress', getEmailAddress);
    $('.search-wrapper').on('click', '.contactClearSearchBtn', clearSearch);

    //datepicker
    var date_input = $('input[name="date"]'); //date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    date_input.datepicker({
        format: 'mm/dd/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true
    })

    function getContacts() {
        // ajax call to server to get jobs
        $.ajax({
            url: '/contacts',
            type: 'GET',
            success: function (data) {
                displayContacts(data);
            },
            error: function (response) {
                console.log('error response', response);

            }
            // display on DOM with buttons that allow edit of each
        })
    } // end getContacts

    function getCompany() {
        // ajax call to server to get company
        $.ajax({
            url: '/contacts/company',
            type: 'GET',
            success: function (data) {
                console.log(data);
                addCompanyToList(data);
            },
            error: function (response) {
                console.log('error response', response);
            }
            // display on DOM with buttons that allow edit of each
        })
    } // end getContacts


    function addCompanyToList(data) {
        console.log('inside displayCompanyTweets: ', data);

    }

    // gets jobs from dB to display in table onload
    function displayContacts(data) {
        $('#viewContacts').empty();
        for (let i = 0; i < data.length; i++) {
            let newRow = $('<tr>');
            // using MediaStreamErrorEvent.js to parse date into a readable format
            // let convertedDate = data[i].date;
            // convertedDate = convertedDate.split('T')[0];

            //appending rows to DOM
            newRow.append('<td>' + data[i].id + '</td>');
            newRow.append('<td>' + data[i].name + '</td>');
            newRow.append('<td>' + data[i].company + '</td>');
            newRow.append('<td>' + data[i].position + '</td>');
            newRow.append('<td>' + data[i].email + '</td>');
            newRow.append('<td>' + data[i].phone + '</td>');
            newRow.append('<td>' + data[i].notes + '</td>');
            // get email address
            newRow.append('<td><button type="button" class="getEmailAddress btn-floating btn-small orange" value="' + data[i].email + '"><i class="fas fa-envelope"></i></button></td>');
            $('#viewJobs').append(newRow);
            //edit row 
            newRow.append('<td><button type="button" class="editContact btn-floating btn-small green modal-trigger" data-target="contactModal" value="' + data[i].id + '"><i class="fas fa-pencil-alt"></i></button></td>');
            //delete row 
            newRow.append('<td><button type="button" class="deleteContact btn-floating btn-small red" value="' + data[i].id + '"><i class="fa fa-trash"></i></button></td>');

            $('#viewContacts').append(newRow);
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

    function newContact() {
        //setting variables
        let name = $('#name').val()
        let position = $('#position').val()
        let company = $('#company').val()
        let email = $('#email').val()
        let phone = $('#phone').val()
        let notes = $('#notes').val()

        // if (checkInputs(name)) {
        let objectToSend = {
            name: name,
            position: position,
            company: company,
            email: email,
            phone: phone,
            notes: notes
        };

        $.ajax({
            url: '/contacts',
            type: 'POST',
            data: objectToSend,
            success: function (response) {
                // console.log('got some jobs: ', response);
                getContacts();
                $('#name').val('');
                $('#position').val('');
                $('#company').val('');
                $('#email').val('');
                $('#phone').val('');
                $('#notes').val('');
            },
            error: function (response) {
                console.log('error response', response);
                // alert(response)

            }
        }); //end ajax
    }

    function updateContact() {

        let name = $('#name').val()
        let company = $('#company').val()
        let position = $('#position').val()
        let email = $('#email').val()
        let phone = $('#phone').val()
        let notes = $('#notes').val()

        if (checkInputs(name)) {
            let contactID = $(this).val();
            let data = {
                name: name,
                position: position,
                company: company,
                email: email,
                phone: phone,
                notes: notes,
            };
            $.ajax({
                type: 'PUT',
                url: '/contacts/update/' + contactID,
                data: data,
                success: function (response) {
                    getContacts();
                    $('#editContact').empty();
                    $('#updateContact').on('click', newContact);
                    $('#updateContact').off('click', updateContact);
                    $('#formLabel').text('Add Job');
                    $('#updateContact').text('Add Job');

                    $('#name').val('');
                    $('#contact').val('');
                    $('#email').val('');
                    $('#position').val('');
                    $('textarea').val('');
                    $('#date').val('');
                    $('#status').val('');
                    $('#filename').val('');
                    $('#updateContact').val('');
                },
                error: function (response) {
                    console.log('error response', response);

                }
            });
        }
    }

    function editContact() {
        $('#contactModalLabel').text('Edit Contact');
        $('#updateContact').off('click', newContact); //end updateContact on click
        $('#updateContact').on('click', updateContact);

        let editDiv = $('#editContact');
        let contactID = $(this).val();
        // console.log('contactID from editContact, ', contactID);

        $.ajax({
            url: '/contacts/' + contactID,
            method: 'GET',
            success: function (response) {
                // console.log('response ', response);
                $('#name').val(response[0].name).focus();
                $('#position').val(response[0].position);
                $('#company').val(response[0].company);
                $('#email').val(response[0].email);
                $('#phone').val(response[0].phone);
                $('#notes').val(response[0].notes);
                $('#updateContact').val(response[0].id);

                // $('#contactModal').modal('show');
            },
            error: function (response) {
                console.log('error response', response);

            }
        })
    }

    function deleteContact() {
        let id = $(this).val();
        // console.log('id: ', id);
        $.ajax({
            type: 'DELETE',
            url: '/contacts/' + id,
            success: function (response) {
                // console.log('response', response);
                getContacts();
            },
            error: function (error) {
                console.log('Error deleting job ', error);
            }

        });
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

    function checkInputs(name) {
        if (name == '') {
            alert('Name can not be empty, please review required fields.');
            return false;
        } else {
            return true;
        }
    }

    $("#phone").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
        var currentChar = this.value.length;
        var currentVal = $(this).val();
        if (currentChar == 3 && e.which != 8 && e.which != 0) {
            $(this).val(currentVal + "-");
        } else if (currentChar == 7 && e.which != 8 && e.which != 0) {
            $(this).val(currentVal + "-");
        }
        $(this).attr('maxlength', '12');
    });

    jQuery('.toggle-nav').click(function (e) {
        jQuery(this).toggleClass('active');
        jQuery('.menu ul').toggleClass('active');

        e.preventDefault();
    });
});