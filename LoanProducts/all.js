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
                modal_popup_clone.querySelector('#field-loan-name').textContent = di.Name;
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
                let Field_fees_el = modal_popup_clone.querySelector('#field-loan-fees');
                let fees = di.Fees;
                if(fees != null || fees != '') {
                    for(fee in fees) {
                        Field_fees_el.innerHTML += fees[fee] + '<br />';
                    }
                }
                modal_popup_clone.querySelector('#field-loan-principal-asset-gl').textContent = di.PrincipalAssetGL;
                modal_popup_clone.querySelector('#field-loan-overdue-principal-asset-gl').textContent = di.OverduePrincipalAssetGL;
                modal_popup_clone.querySelector('#field-loan-principal-loss-reserve-asset-or-liability-gl').textContent = di.PrincipalLossReserveAssetOrLiabilityGL;
                modal_popup_clone.querySelector('#field-loan-principal-loss-reserve-expense-gl').textContent = di.PrincipalLossReserveExpenseGL;
              

                document.body.appendChild(modal_popup_clone);

                const update_modal_popup = document.getElementById('update-modal-popup-section');
                const update_modal_popup_clone = update_modal_popup.cloneNode(true);
                update_modal_popup_clone.setAttribute('id', 'update-modal-popup-section-' + di.ID);
                update_modal_popup_clone.setAttribute('data-id', di.ID);
                update_modal_popup.querySelector('input[name="field-app-on"]').setAttribute('checked', true);

                document.body.appendChild(update_modal_popup_clone);
                                
                document.querySelector('#modal-popup-section-' + di.ID).addEventListener('click', (event) => {
                    let element = event.target;
                    element.setAttribute('style', 'display: none;');
                });

                document.querySelector('#modal-popup-section-' + di.ID + ' .modal-popup-container').addEventListener('click', (event) => {
                    event.stopPropagation();
                });

                                                
                document.querySelector('#update-modal-popup-section-' + di.ID).addEventListener('click', (event) => {
                    let element = event.target;
                    element.setAttribute('style', 'display: none;');
                });

                document.querySelector('#update-modal-popup-section-' + di.ID + ' .modal-popup-container').addEventListener('click', (event) => {
                    event.stopPropagation();
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
                action_el.innerHTML = '<a title="' + di.Name + '" href="javascript:void(0);" onclick="loanProductModalpopup(\'' + di.ID +'\');">View</a> || <a title="' + di.Name + '" href="javascript:void(0);" onclick="loanProductUpdateModalpopup(\'' + di.ID +'\');">Edit</a> ';

                cardContainer.appendChild(card);
            })
        }
    }

    request.send();
    
}

function updateLoanProduct(e) {
    e.preventDefault();
    document.getElementById("failed-message").style.display = 'none';
    document.getElementById("success-message").style.display= 'none';

    let formData = new FormData(this);
    let id = document.querySelector('#wf-form-Update-Loan-Product').getAttribute('data-id');
    let app_on = formData.get('field-app-on');

    let error_message = '';
    let error_count = 0;

    if(id == '' || id == null) {
        error_message += 'Coud not find the loan product id <br />';
        error_count++;
    }

    if(error_count > 0) {
        document.getElementById("failed-message").style.display = 'block';
        document.getElementById("failed-message").innerHTML = error_message;
        return;
    }

    app_on = (app_on != '');

    let data = {
        "id" : id,
        "app_on" : app_on,
    }

    let request = cbrRequest(`/loanProduct`, 'PUT', true)
  
    request.onload = function() {
        let data = JSON.parse(this.response);
    // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
        if (request.status >= 200 && request.status < 400) {
        _this.reset();
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

document.addEventListener('DOMContentLoaded', () => {
    getLoanProducts();
    const addLoanProduct = document.getElementById("wf-form-Update-Loan-Product")
    addLoanProduct.addEventListener('submit', updateLoanProduct);
});

function loanProductModalpopup(productID) {
    document.querySelector('#modal-popup-section-' + productID).setAttribute('style', 'display:flex');
    return;
}

function loanProductUpdateModalpopup(productID) {
    document.querySelector('#update-modal-popup-section-' + productID).setAttribute('style', 'display:flex');
    return;
}