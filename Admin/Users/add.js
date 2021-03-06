var myUrl = new URL(document.location.href)
let parent_gls = [];

const addNewuser = document.getElementById("wf-form-create-user")
addNewuser.addEventListener('submit', createNewUser, true);

async function createNewUser(e) {
    //get all the submitted information
    e.preventDefault();
    document.getElementById("failed-message").style.display = 'none';
    document.getElementById("success-message").style.display= 'none';
    
    let formData = new FormData(this);
    let firstName = formData.get('field-first-name');
    let lastName = parseInt(formData.get('field-last-name'));
    let email = formData.get('field-email');
    let phoneNumber = formData.get('field-phone-number');
    
    //validations
    let error_count = 0;
    let error_message = '';

    if(firstName == '') {
    error_message += 'First Name cannot be empty <br />';
    error_count++;
    }

    if(lastName == '') {
    error_message += 'Last Name cannot be empty <br />';
    error_count++;
    }

    if(phoneNumber == '') {
    error_message += 'Phone Number cannot be empty <br />';
    error_count++;
    }

    if(email == '') {
    error_message += 'Email cannot be empty <br />';
    error_count++;
    }

    if(!ValidateEmail(email)) {
    error_message += 'Please enter a valid email <br />';
    error_count++;
    }

    if(error_count > 0) {
        document.getElementById("failed-message").style.display = 'block';
        document.getElementById("failed-message").innerHTML = error_message;
        return;
    }
    
    let data = {
    "firstName": firstName,
    "lastName": lastName,
    "email": email,
    "phone": phoneNumber,
    }

    const _this = this;
    
    let request = await cbrRequest(`/admin/user`, 'POST', true)
    
    request.onload = function() {
    let data = JSON.parse(this.response);
        // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
        if (request.status >= 200 && request.status < 400) {
            _this.reset();
            const success_message = data.message;
            
            //show success message
            let success_message_el = document.getElementById("success-message");
            success_message_el.innerHTML = success_message;
            success_message_el.style.display = "block";
        
        } else {
            const failed_message = data.message;
            let failed_message_el = document.getElementById("failed-message");
            failed_message_el.innerHTML = failed_message;
            failed_message_el.style.display = "block";
        }
    }
    
    request.send(JSON.stringify(data));
}