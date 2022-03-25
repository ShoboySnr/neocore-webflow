async function getCustomers() {
    let request = await cbrRequest('/users', 'GET', true)

    request.onload = function () {
        let data = JSON.parse(this.response)
        if (request.status >= 200 && request.status < 400) {
            const cardContainer = document.getElementById("customers-container")
            let counter = 0;
            data.data.forEach(customer => {
                const style = document.getElementById('sample-customer')
                const card = style.cloneNode(true)

                card.setAttribute('id', '');
                card.style.display = 'block';

                card.addEventListener('click', function () {
                    document.location.href = "/users/view?id=" + customer.ID;
                });

                const name = card.getElementsByTagName('p')[0]
                name.textContent = `${customer.FirstName} ${customer.LastName}`

                const email = card.getElementsByTagName('p')[1]
                email.textContent = customer.EmailAddress;

                const phone = card.getElementsByTagName('p')[2]
                phone.textContent = customer.PhoneNumber;

                const bvn = card.getElementsByTagName('p')[3]
                bvn.textContent = customer.Bvn;

                const status = card.getElementsByTagName('p')[4]
                status.innerHTML = readStatus(customer.Active);

                cardContainer.appendChild(card);
            })
        }
    }

    request.send();
}

window.addEventListener('DOMContentLoaded', () => {
    getCustomers();
})