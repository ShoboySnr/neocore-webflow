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

                    card.addEventListener('click', function () {
                        document.location.href ='/admin/users/user?id=' + di.id
                    });

                    const modal_popup = document.getElementById('permissions-modal-popup');
                    const modal_popup_clone = modal_popup.cloneNode(true);
                    modal_popup_clone.setAttribute('id', 'user-permission-view-' + di.ID);

                    modal_popup_clone.querySelector('.permission-title').textContent += `${di.first_name} ${di.last_name}`;
                    modal_popup_clone.querySelector('')
                    
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
                    action_el.innerHTML = '<a href="' + view_link + '" title="View ' + di.first_name + '">View</a> <br> <a href="' + permission_link + '" title="Update Permissions">Update Permissions</a>';
                

                    cardContainer.appendChild(card);
            })
        }
    }

    request.send();
   
}

document.addEventListener('DOMContentLoaded', () => {
    getAllUsers();
});