const getLoanProducts = () => {

    let request = cbrRequest('/loanProduct', 'GET', true)
    let gls_array = [];

    // When the 'request' or API request loads, do the following...
    request.onload = function () {
        let data = JSON.parse(this.response)
        if (request.status >= 200 && request.status < 400) {
            const cardContainer = document.getElementById("customers-container")
            data.data.forEach((di, index) => {
                    const style = document.getElementById('sample-loan-products')
                const card = style.cloneNode(true)

                card.setAttribute('id', '');
                card.style.display = 'block';

                const modal_popup = document.getElementById('modal-popup-section');
                const modal_popup_clone = modal_popup.cloneNode(true);
                modal_popup_clone.setAttribute('id', 'modal-popup-section-' + di.ID);

                modal_popup_clone.querySelector('#field-loan-id').textContent = di.ID;
                modal_popup_clone.querySelector('#field-loan-strict').innerHTML = readStates(di.Strict);
                modal_popup_clone.querySelector('#field-loan-product-code').textContent = di.ProductCode;
                modal_popup_clone.querySelector('#field-loan-min-kyc-level').textContent = di.MinKYCLevel;
                modal_popup_clone.querySelector('#field-loan-application-form').textContent = di.ApplicationForm;
                modal_popup_clone.querySelector('#field-loan-description-form').textContent = di.Description;
                modal_popup_clone.querySelector('#field-field-loan-on-app').innerHTML = readStatus(di.OnApp);
                modal_popup_clone.querySelector('#field-loan-min-amount').textContent = format_currency(di.MinAmount);
                modal_popup_clone.querySelector('#field-loan-max-amount').textContent = format_currency(di.MaxAmount);
                modal_popup_clone.querySelector('#field-loan-min-linked-account-balance').textContent = di.MinLinkedAccountBalance;
                modal_popup_clone.querySelector('#field-loan-moratorium-days').textContent = di.MoratoriumDays;
                modal_popup_clone.querySelector('#field-loan-default-tenor-days').textContent = di.DefaultTenorDays;
                modal_popup_clone.querySelector('#field-loan-min-term-days').textContent = readDepositProductLimit(di.MinTermDays);
                modal_popup_clone.querySelector('#field-loan-max-term-days').textContent = readDepositProductLimit(di.MaxTermDays);
                modal_popup_clone.querySelector('#field-loan-principal-repayment-freq').textContent = di.PrincipalRepaymentFreq;
                modal_popup_clone.querySelector('#field-loan-loan-interest').textContent = di.LoanInterest;
                modal_popup_clone.querySelector('#field-loan-loan-interest-replayment-freq').textContent = di.InterestRepaymentFreq;
                modal_popup_clone.querySelector('#field-loan-interest-type').textContent = di.InterestType;
                Field_interests_el = modal_popup_clone.querySelector('#field-loan-fees');
                let fees = di.Fees;
                if(fees != null || fees != '') {
                    for(fee in fees) {
                        Field_interests_el.textContent += fee + '<br />';
                    }
                }
                modal_popup_clone.querySelector('#field-loan-principal-asset-gl').textContent = di.PrincipalAssetGL;
                modal_popup_clone.querySelector('#field-loan-overdue-principal-asset-gl').textContent = di.OverduePrincipalAssetGL;
                modal_popup_clone.querySelector('#field-loan-principal-loss-reserve-asset-or-liability-gl').textContent = di.PrincipalLossReserveAssetOrLiabilityGL;
                modal_popup_clone.querySelector('#field-loan-principal-loss-reserve-expense-gl').textContent = di.PrincipalLossReserveExpenseGL;
                document.body.appendChild(modal_popup_clone);

                card.addEventListener('click', ()  => {
                    loanProductModalpopup(di.ID);
                });
                
                const name_el = card.getElementsByTagName('p')[0]
                name_el.textContent = di.Name;
                
                const product_code_el = card.getElementsByTagName('p')[1]
                product_code_el.textContent = di.ProductCode;
                
                const overdraft_gl_el = card.getElementsByTagName('p')[2]
                overdraft_gl_el.textContent = di.LoanInterest;
                
                const liability_gl_el = card.getElementsByTagName('p')[3]
                liability_gl_el.textContent = di.InterestType;

                const action_el = card.getElementsByTagName('p')[4];
                action_el.innerHTML = '<a title="' + di.Name + '" href="javascript:void(0);" onclick="loanProductModalpopup(\'' + di.ID +'\');">View</a>';

                cardContainer.appendChild(card);
            })
        }
    }

    request.send();
    
}

document.addEventListener('DOMContentLoaded', () => {
    getLoanProducts();
});

function loanProductModalpopup(productID) {
    document.querySelector('#modal-popup-section-' + productID).setAttribute('style', 'display:flex');
}