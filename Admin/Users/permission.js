var myUrl = new URL(document.location.href)
var id = myUrl.searchParams.get("id")

async function getUser() {
    let request = await cbrRequest(`/admin/user/${id}`, 'GET', true);
    
     // When the 'request' or API request loads, do the following...
     request.onload = function () {

        let data = JSON.parse(this.response)
        let counter = 0;

        if (request.status >= 200 && request.status < 400) {
            let users_info = data.data;
            console.log(users_info);
            document.getElementById('customer-name').innerHTML += ' ' + users_info.FirstName + ' ' +  users_info.LastName;

            document.getElementById('user-email').value = users_info.EmailAddress;
            document.getElementById('user-email').setAttribute('disabled', true);
        } else {
            alert('Unable to get this user');
            window.location.href = '/admin/users/all';
        }
    }

    request.send();

 }

async function setPermission() {
    let request = await cbrRequest('/admin/permissions', 'GET', true)
    let permission_arrays = [];

    // When the 'request' or API request loads, do the following...
    request.onload = function () {
        let data = JSON.parse(this.response)
        let counter = 0;
        if (request.status >= 200 && request.status < 400) {

            const user_permission = document.getElementById("users-permission-container")
            data.data.forEach((di, index) => {
                console.log(di);

                let label = document.createElement('label');
                label.className = 'w-checkbox';

                let input = document.createElement("input");

                input.type = 'checkbox';
                input.name = 'permission-checkbox['+index+']';
                input.value = di;
                input.className = 'w-checkbox-input permission-checkbox';

                let span = document.createElement("span");
                span.setAttribute('for', 'permission-checkbox['+index+']');
                span.innerHTML = di.replace(/-/g, ' ').toUpperCase();
                span.className = 'w-form-label';

                label.appendChild(input);
                label.appendChild(span)

                user_permission.appendChild(label);
            });

        } else {
            alert('Unable to get all permissions');
            window.location.href = '/admin/users/all';
        }

    }

    request.send();
}

async function updatePermission(event) {
    event.preventDefault();

    const email = document.getElementById('user-email').value;

    let userPermissions = []
    const permissions = this.querySelectorAll('input.permission-checkbox:checked');
    for (permission of permissions) {
        userPermissions.push(permission.value)
    }

    const data = {
        'userEmail': email,
        'userPermissions': userPermissions
    };

    let request = await cbrRequest('/admin/user/permissions', 'PUT', true);
    
    request.onload = function () {
        let data = JSON.parse(this.response)
    
        // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
        if (request.status >= 200 && request.status < 400) {
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


document.addEventListener('firebaseIsReady', function () {
    getUser();
    setPermission();
    document.getElementById('wf-form-create-user-permission').addEventListener('submit', updatePermission, true);
});