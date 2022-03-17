const getLoanProducts = () => {

    let request = cbrRequest('/loanInterest', 'GET', true)
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
                modal_popup_clone.querySelector('#field-active').textContent = readStatus(di.Active);
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

                const update_modal_popup = document.getElementById('update-modal-popup-section');
                const update_modal_popup_clone = update_modal_popup.cloneNode(true);
                update_modal_popup_clone.setAttribute('id', 'update-modal-popup-section-' + di.ID);
                update_modal_popup_clone.setAttribute('data-id', di.ID);
                update_modal_popup.querySelector('input[name="field-app-on"]').setAttribute('checked', di.OnApp);

                const updateLoanProduct = (productID, event) => {
                        event.preventDefault();
                        console.log(event.target);
                        return;
                        
                        document.getElementById("failed-message").style.display = 'none';
                        document.getElementById("success-message").style.display= 'none';

                        let formData = new FormData(event.target);
                        let id = productID
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

                update_modal_popup_clone.querySelector('#wf-form-Update-Loan-Product').addEventListener('submit', () => {
                    updateLoanProduct(di.ID, event)
                });

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
                
                const rate_el = card.getElementsByTagName('p')[1]
                product_code_el.textContent = di.Rate;
                
                const income_recognition_el = card.getElementsByTagName('p')[2]
                income_recognition_el.textContent = convertSlugToTitle(di.IncomeRecognitionType);
                
                const active_el = card.getElementsByTagName('p')[3]
                active_el.textContent = readStatus(di.Active);

                const action_el = card.getElementsByTagName('p')[4];
                action_el.innerHTML = '<a title="' + di.Name + '" href="javascript:void(0);" onclick="loanInterestModalpopup(\'' + di.ID +'\');">View</a> || <a title="' + di.Name + '" href="javascript:void(0);" onclick="loanInterestUpdateModalpopup(\'' + di.ID +'\');">Edit</a> ';

                cardContainer.appendChild(card);
            })
        }
    }

    request.send();
    
}

document.addEventListener('DOMContentLoaded', () => {
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