async function getSingleDepositInterests() {
    var myUrl = new URL(document.location.href)
    var id = myUrl.searchParams.get("id")

    let request = await cbrRequest(`/deposit-interests/${id}`, 'GET', true)

    request.onload = function() {

    let data = JSON.parse(this.response)

    // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
    if (request.status >= 200 && request.status < 400) {
        const deposit_details = data.data;
        
        const customer_title_bg = document.getElementById("card-details");
        
        document.getElementById("button-edit-link").href = '/deposit-interests/edit?id=' + deposit_details.id;
        
        const field_id_el = document.getElementById("field-id");
        field_id_el.textContent = deposit_details.id
        
        const field_name_el = document.getElementById("field-name");
        field_name_el.textContent = deposit_details.name;
        
    document.getElementById("title-field-name").innerHTML = 'Deposit Interest: ' + deposit_details.name;
        
        const field_rate_el = document.getElementById("field-rate");
        field_rate_el.textContent = deposit_details.rate;
        
        const field_payment_freq_el = document.getElementById("field-payment-frequency");
        field_payment_freq_el.textContent = readPaymentFrequency(deposit_details.paymentFrequency);
        
        const field_min_activation_balance_el = document.getElementById("field-min-activation-balance");
        field_min_activation_balance_el.textContent = deposit_details.minimumActivationBalance;
        
        const field_principal_from_el = document.getElementById("field-principal-from");
        field_principal_from_el.textContent = deposit_details.principalFrom;
        
        const field_principal_to_el = document.getElementById("field-principal-to");
        field_principal_to_el.textContent = deposit_details.principalTo;
        
        const field_expense_glid_el = document.getElementById("field-expense-glid");
        field_expense_glid_el.textContent = deposit_details.expenseGLID;
        
        const field_accrual_glid_el = document.getElementById("field-accrual-glid");
        field_accrual_glid_el.textContent = deposit_details.accrualGLID;
        
        const field_status_el = document.getElementById("field-status");
        field_status_el.textContent = deposit_details.status;
        
        const field_apply_wht_el = document.getElementById("field-apply-wht");
        field_apply_wht_el.textContent = deposit_details.applyWHT;
        
        const field_active = document.getElementById("field-active");
        field_active.textContent = deposit_details.active
    
        } else {
                // handle error
            alert('There was an error that occurred');
            document.location.href='/deposit-interests/lists';
        }
    
    }
    
    request.send();
}

window.addEventListener('firebaseIsReady', () => {
    getSingleDepositInterests();
})