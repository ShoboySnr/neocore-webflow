async function getGLAccounts() {
    let request = await cbrRequest('/deposit-interests', 'GET', true)
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

                card.addEventListener('click', function () {
                    document.location.href = "/deposit-interests/view?id=" + di.id;
                });
                
                const id = card.getElementsByTagName('p')[0]
                id.textContent = ++counter;
                
                const name_el = card.getElementsByTagName('p')[1]
                name_el.textContent = di.name;

                const rate_el = card.getElementsByTagName('p')[2]
                rate_el.textContent = di.rate;
                
                const payment_frequency_el = card.getElementsByTagName('p')[3]
                payment_frequency_el.textContent = readPaymentFrequency(di.paymentFrequency);
                
                const expense_glid_el = card.getElementsByTagName('p')[4]
                expense_glid_el.textContent = di.expenseGLID;

                const accrual_glid_el = card.getElementsByTagName('p')[5]
                accrual_glid_el.textContent = di.accrualGLID;

                cardContainer.appendChild(card);
            })
        }
    }

    request.send();
    
}

window.addEventListener('firebaseIsReady', () => {
    getGLAccounts();
});