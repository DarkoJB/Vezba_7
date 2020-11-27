// Userlist data array for filling in info box
var userListData = [];
//var path = "/users";
var path = "/usersJson";

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // TO DO: On Add User button click call function addUser
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

});

// Functions =============================================================

// TO DO: Fill table with data
function populateTable() {
    $('#tableData').empty();
    $.get('http://localhost:3000/usersJson/userlist', function (data) {
        for(var i = 0; i < data.length; i++) {
            $('#tableData').append('<tr><td><a href="#" class="linkshowuser" id="'+ data[i]._id +'">'+ data[i].username +'</a></td><td>'+ data[i].email +'</td><td><a class="linkdeleteuser" rel="'+ data[i]._id +'" href="#">Delete</a></td></tr>');
        }
    });
};

// TO DO: Show User Info
function showUserInfo(event) {
    var id = event.currentTarget.id;
    $.get('http://localhost:3000/usersJson/userlist', function (data) {
        for(var i = 0; i < data.length; i++) {
            if(data[i]._id == id) {
                console.log(data[i]);
                $('#userInfoName').text(data[i].fullname);
                $('#userInfoAge').text(data[i].age);
                $('#userInfoGender').text(data[i].gender);
                $('#userInfoLocation').text(data[i].location);
            }
        }
    });

};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        // TO DO: create user object
        var newUser = {};
        newUser.username = $('#inputUserName').val();
        newUser.email = $('#inputUserEmail').val();
        newUser.fullname = $('#inputUserFullname').val();
        newUser.age = $('#inputUserAge').val();
        newUser.location = $('#inputUserLocation').val();
        newUser.gender = $('#inputUserGender').val();

        console.log(newUser);
        // To DO: Use AJAX to post the object to our adduser service
        // If blank message is returned clear inputs and update table
        // else alert response message and log the response.
        $.post('http://localhost:3000/usersJson/adduser', newUser , function (response) {
            if(response.msg == "") {
                $('#addUser input').each(function(index, val) {
                    $(this).val('');
                });
                populateTable();
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user'  +
        $(this).attr('rel') + '?' );

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: path + '/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};