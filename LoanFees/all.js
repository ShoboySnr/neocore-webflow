async function getLoanProducts () {

    let request = await cbrRequest('/loanFee', 'GET', true)
    let gls_array = [];

    // When the 'request' or API request loads, do the following...
    request.onload = function () {
        let data = JSON.parse(this.response)
        if (request.status >= 200 && request.status < 400) {
            const cardContainer = document.getElementById("customers-container")
            data.data.forEach((di, index) => {
                
                const style = document.getElementById('sample-loan-fees')
                const card = style.cloneNode(true)

                card.setAttribute('id', '');
                card.style.display = 'block';

                const modal_popup = document.getElementById('modal-popup-section');
                const modal_popup_clone = modal_popup.cloneNode(true);
                modal_popup_clone.setAttribute('id', 'modal-popup-section-' + di.ID);

                modal_popup_clone.querySelector('#field-id').textContent = di.ID;
                modal_popup_clone.querySelector('#field-active').innerHTML = readStatus(di.Active);
                modal_popup_clone.querySelector('#field-name').textContent = di.Name;
                modal_popup_clone.querySelector('#field-calculation').textContent = convertSlugToTitle(di.Calculation);
                modal_popup_clone.querySelector('#field-amount-if-flat').innerHTML = format_currency(di.AmtIfFlat);
                modal_popup_clone.querySelector('#field-percentage-if-pegged').innerHTML = di.PercentageIfPegged;
                modal_popup_clone.querySelector('#field-when-to-take').textContent = convertSlugToTitle(di.WhenToTake);
                modal_popup_clone.querySelector('#field-frequency').textContent = di.Frequency;
                modal_popup_clone.querySelector('#field-minimum').textContent = format_currency(di.Minimum);
                modal_popup_clone.querySelector('#field-maximum').textContent = format_currency(di.Maximum);
                modal_popup_clone.querySelector('#field-cash-only').innerHTML = readStates(di.CashOnly);
                modal_popup_clone.querySelector('#field-income-recognition').textContent = di.IncomeRecognition;
                modal_popup_clone.querySelector('#field-income-account-gl').textContent = di.IncomeAccountGL;
                modal_popup_clone.querySelector('#field-receivable-account-gl').textContent = di.ReceivableAccountGL;
                modal_popup_clone.querySelector('#field-suspense-account-gl').textContent = di.SuspenseAccountGL;
                modal_popup_clone.querySelector('#field-status').textContent = di.Status;
              

                document.body.appendChild(modal_popup_clone);
             
                document.querySelector('#modal-popup-section-' + di.ID).addEventListener('click', (event) => {
                    let element = event.target;
                    element.setAttribute('style', 'display: none;');
                });

                document.querySelector('#modal-popup-section-' + di.ID + ' .modal-popup-container').addEventListener('click', (event) => {
                    event.stopPropagation();
                });
                
                const name_el = card.getElementsByTagName('p')[0]
                name_el.textContent = di.Name;
                
                const income_recognition_el = card.getElementsByTagName('p')[1]
                income_recognition_el.textContent = convertSlugToTitle(di.IncomeRecognition);
                
                const frquency_el = card.getElementsByTagName('p')[2]
                frquency_el.textContent = di.Frequency;
                
                const active_el = card.getElementsByTagName('p')[3]
                active_el.innerHTML = readStatus(di.Active);

                const action_el = card.getElementsByTagName('p')[4];
                action_el.innerHTML = '<a title="' + di.Name + '" href="javascript:void(0);" onclick="loanFeeModalpopup(\'' + di.ID +'\');">View</a>';

                cardContainer.appendChild(card);
            })
        }
    }

    request.send();
    
}

document.addEventListener('firebaseIsReady', () => {
    getLoanProducts();
});

function loanFeeModalpopup(productID) {
    document.querySelector('#modal-popup-section-' + productID).setAttribute('style', 'display:flex');
    return;
}