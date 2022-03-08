function getAllUsers() {

    let request = cbrRequest('/admin/user', 'GET', true)
    let gls_array = [];

    // When the 'request' or API request loads, do the following...
    request.onload = function () {
        let data = JSON.parse(this.response)
        let counter = 0;
        if (request.status >= 200 && request.status < 400) {
            const cardContainer = document.getElementById("customers-container")
            data.data.forEach((di, index) => {
                        const style = document.getElementById('sample-customer')
                    const card = style.cloneNode(true)

                    card.setAttribute('id', '');
                    card.style.display = 'block';

                    const view_link = "/admin/users/user?id=" + di.id;

                    const permission_link = '/admin/users/setpermission?id=' + di.email;

                    // card.addEventListener('click', function () {
                    //     document.location.href ='/admin/users/user?id=' + di.id
                    // });

                    const modal_popup = document.getElementById('permissions-modal-popup');
                    const modal_popup_clone = modal_popup.cloneNode(true);
                    modal_popup_clone.setAttribute('id', 'user-permission-view-' + di.id);

                    modal_popup_clone.querySelector('.permission-title').textContent += `${di.first_name} ${di.last_name}`;

                    modal_popup_clone.querySelector('.create-user-permission').addEventListener('submit', () => {
                        updatePermission(di.email, modal_popup_clone, event)
                    }, true);

                    setPermission(modal_popup_clone, di.roles);

                    modal_popup_clone.querySelector('#cancel-button').addEventListener('click', () => {
                        closeAllModalPopUp(event);
                    });
                    
                    const first_name_el = card.getElementsByTagName('p')[0]
                    first_name_el.textContent = di.first_name;

                    const last_name_el = card.getElementsByTagName('p')[1]
                    last_name_el.textContent = di.last_name;

                    const email_el = card.getElementsByTagName('p')[2]
                    email_el.textContent = di.email;


                    const phonenumber_el = card.getElementsByTagName('p')[3]
                    phonenumber_el.textContent = di.phone;
                    
                    const active_el = card.getElementsByTagName('p')[4]
                    active_el.innerHTML = readStatus(di.Active);


                    const action_el = card.getElementsByTagName('p')[5]
                    action_el.innerHTML = '<a href="' + view_link + '" title="View ' + di.first_name + '">View</a> || <a href="javascript:void();" onclick="userPermissionsDetailsModalpopup(\'' + di.id +'\');" title="Update Permissions">Update Permissions</a> || <a href="javascript:void();" onclick="sendPasswordReset(\'' + di.email +'\');" title="Reset Password">Reset Password</a>';
                    document.querySelector('.footer').appendChild(modal_popup_clone);
                

                    cardContainer.appendChild(card);
            })
        }
    }

    request.send();
   
}

function userPermissionsDetailsModalpopup(id) {
    document.querySelector('#user-permission-view-' + id).setAttribute('style', 'display:block');
}


function sendPasswordReset(email) {
    let request = cbrRequest('/admin/user/password?email='+email, 'GET', true)

    request.onload = function () {
        let data = JSON.parse(this.response)
        if (request.status >= 200 && request.status < 400) {
            alert('Password reset sent successfully to the email - ' + email);
            window.location.reload();

        } else {
            alert('Unable to reset password, please try again');
            return;
        }

    }

    request.send();
}


function setPermission(user_permission, roles) {
    let request = cbrRequest('/admin/permissions', 'GET', true)

    request.onload = function () {
        let data = JSON.parse(this.response)
        if (request.status >= 200 && request.status < 400) {
            data.data.forEach((di, index) => {

                let label = document.createElement('label');
                label.className = 'w-checkbox';

                let input = document.createElement("input");

                input.type = 'checkbox';
                input.name = 'permission-checkbox['+index+']';
                input.value = di;
                input.className = 'w-checkbox-input permission-checkbox';

                if(roles && roles.includes(di)) {
                    input.checked = true;
                }

                let span = document.createElement("span");
                span.setAttribute('for', 'permission-checkbox['+index+']');
                span.innerHTML = di.replace(/-/g, ' ').toUpperCase();
                span.className = 'w-form-label';

                label.appendChild(input);
                label.appendChild(span)

                user_permission.querySelector('#users-permission-container').appendChild(label);

            });

        } else {
            alert('Unable to get all permissions');
        }

    }

    request.send();
}

function updatePermission(email, parent_el, event) {
    event.preventDefault();

    let userPermissions = []
    const permissions = parent_el.querySelectorAll('input.permission-checkbox:checked');
    for (permission of permissions) {
        userPermissions.push(permission.value)
    }

    const data = {
        'userEmail': email,
        'userPermissions': userPermissions
    };

    let request = cbrRequest('/admin/user/permissions', 'PUT', true);
    
    request.onload = function () {
        let data = JSON.parse(this.response)
    
        // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
        if (request.status >= 200 && request.status < 400) {
            const success_message = data.message;
            
            //show success message
            let success_message_el = parent_el.querySelector("#success-message");
            alert('Permission for ' + email + ' updated!');
            window.location.reload();
        } else {
            const failed_message = data.message;
            alert('Permission for ' + email + ' faled! Reason: ' + failed_message);
        }
    }

    request.send(JSON.stringify(data));
    
    return;
}


document.addEventListener('DOMContentLoaded', () => {
    getAllUsers();
});