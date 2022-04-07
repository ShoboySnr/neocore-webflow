async function getLoanAccounts() {
    let request = await cbrRequest('/loanAccounts?name=&amtFrom=&amtTp=&product=&status&disbFrom=&disbTo=', 'GET', true)

    request.onload = function () {
        let data = JSON.parse(this.response)
        if (request.status >= 200 && request.status < 400) {
            const cardContainer = document.getElementById("customers-container")
            let counter = 0;
            data.data.forEach(account => {
                const style = document.getElementById('sample-customer')
                const card = style.cloneNode(true)

                card.setAttribute('id', '');
                card.style.display = 'block';

                card.addEventListener('click', function () {
                    document.location.href = "/users/view?id=" + customer.ID;
                });

                const customer_name_el = card.getElementsByTagName('p')[0]
                customer_name_el.textContent = account.customer_name;

                const product_id_el = card.getElementsByTagName('p')[1]
                product_id_el.textContent = account.product_id;

                const amount_el = card.getElementsByTagName('p')[2]
                amount_el.textContent = format_currency(account.amount);

                const outstanding_el = card.getElementsByTagName('p')[3]
                outstanding_el.textContent = format_currency(account.outstanding);

                const arrears_el = card.getElementsByTagName('p')[4]
                arrears_el.textContent = format_currency(account.arrears);

                const status_el = card.getElementsByTagName('p')[4]
                status_el.textContent = account.status;

                cardContainer.appendChild(card);
            })
        }
    }

    request.send();
}



window.addEventListener('firebaseIsReady', () => {
   getLoanAccounts();
})
    
    