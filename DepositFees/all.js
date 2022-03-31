
async function getGLAccounts() {
    let request = await cbrRequest('/fees', 'GET', true)
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
                    document.location.href = "/deposit-fees/view?id=" + di.id;
                });
                
                const id = card.getElementsByTagName('p')[0]
                id.textContent = ++counter;
                
                const name_el = card.getElementsByTagName('p')[1]
                name_el.textContent = di.name;

                const fee_type_el = card.getElementsByTagName('p')[2]
                fee_type_el.textContent = readFeeType(di.feeType);
                
                let amount = di.percentage;
                if(di.feeType == 1 || di.feeType == 2) amount = di.fee;
                
                const amount_el = card.getElementsByTagName('p')[3]
                amount_el.textContent = amount;
                
                const income_glid_el = card.getElementsByTagName('p')[4]
                income_glid_el.textContent = di.incomeGL;

                const receivable_glid_el = card.getElementsByTagName('p')[5]
                receivable_glid_el.textContent = di.receivablesGL;

                cardContainer.appendChild(card);
            })
        }
    }

    request.send();
    
}

window.addEventListener('firebaseIsReady', () => {
    getGLAccounts();
});