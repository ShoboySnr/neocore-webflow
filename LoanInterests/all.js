async function getLoanProducts() {

    let request = await cbrRequest('/loanInterest', 'GET', true)
    let gls_array = [];

    // When the 'request' or API request loads, do the following...
    request.onload = function () {
        let data = JSON.parse(this.response)
        if (request.status >= 200 && request.status < 400) {
            const cardContainer = document.getElementById("customers-container")
            data.data.forEach((di, index) => {
                
                const style = document.getElementById('sample-loan-interests')
                const card = style.cloneNode(true)

                card.setAttribute('id', '');
                card.style.display = 'block';

                const modal_popup = document.getElementById('modal-popup-section');
                const modal_popup_clone = modal_popup.cloneNode(true);
                modal_popup_clone.setAttribute('id', 'modal-popup-section-' + di.ID);

                modal_popup_clone.querySelector('#field-id').textContent = di.ID;
                modal_popup_clone.querySelector('#field-active').innerHTML = readStatus(di.Active);
                modal_popup_clone.querySelector('#field-name').textContent = di.Name;
                modal_popup_clone.querySelector('#field-rate').textContent = di.Rate;
                modal_popup_clone.querySelector('#field-income-gl').innerHTML = di.IncomeGL;
                modal_popup_clone.querySelector('#field-suspense-gl').innerHTML = di.SuspenseGL;
                modal_popup_clone.querySelector('#field-past-due-gl').textContent = di.PastDueGL;
                modal_popup_clone.querySelector('#field-accrual-gl').textContent = di.AccrualGL;
                modal_popup_clone.querySelector('#field-loss-reserve-asset-or-liability-gl').textContent = di.LossReserveAssetOrLiabilityGL;
                modal_popup_clone.querySelector('#field-loss-reserve-expense-gl').textContent = di.LossReserveExpenseGL;
                modal_popup_clone.querySelector('#field-income-recognition-type').innerHTML = di.IncomeRecognitionType;
                modal_popup_clone.querySelector('#field-status').textContent = di.status;
                modal_popup_clone.querySelector('#field-apply-wth').textContent = di.ApplyWHT;
              

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
                
                const rate_el = card.getElementsByTagName('p')[1]
                rate_el.textContent = di.Rate;
                
                const income_recognition_el = card.getElementsByTagName('p')[2]
                income_recognition_el.textContent = convertSlugToTitle(di.IncomeRecognitionType);
                
                const active_el = card.getElementsByTagName('p')[3]
                active_el.innerHTML = readStatus(di.Active);

                const action_el = card.getElementsByTagName('p')[4];
                action_el.innerHTML = '<a title="' + di.Name + '" href="javascript:void(0);" onclick="loanInterestModalpopup(\'' + di.ID +'\');">View</a> ';

                cardContainer.appendChild(card);
            })
        }
    }

    request.send();
    
}

document.addEventListener('firebaseIsReady', () => {
    getLoanProducts();
});

function loanInterestModalpopup(productID) {
    document.querySelector('#modal-popup-section-' + productID).setAttribute('style', 'display:flex');
    return;
}

function loanInterestUpdateModalpopup(productID) {
    document.querySelector('#update-modal-popup-section-' + productID).setAttribute('style', 'display:flex');
    return;
}