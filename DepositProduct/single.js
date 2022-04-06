async function getSingleDpositProduct() {
    var myUrl = new URL(document.location.href)
    var id = myUrl.searchParams.get("id")

    let request = cbrRequest(`/deposit-product/${id}`, 'GET', true)

    request.onload = function() {

    let data = JSON.parse(this.response)
    // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
    if (request.status >= 200 && request.status < 400) {
        const deposit_product = data.data;

        const customer_title_bg = document.getElementById("card-details");

        document.getElementById("button-edit-link").href = '/deposit-products/edit?id=' + deposit_product.id;

        const field_id_el = document.getElementById("field-id");
        field_id_el.textContent = deposit_product.id

        const field_strict_el = document.getElementById("field-strict");
        field_strict_el.textContent = readHumanBoolean(deposit_product.strict);

        const field_name_el = document.getElementById("field-name");
        field_name_el.textContent = deposit_product.name;

        const field_product_code_el = document.getElementById("field-product-code");
        field_product_code_el.textContent = deposit_product.productCode;

        document.getElementById("title-field-name").innerHTML = 'Deposit Product: ' + deposit_product.name;

        const field_term_el = document.getElementById("field-term");
        field_term_el.textContent = readHumanBoolean(deposit_product.term);

        const field_max_term_days_el = document.getElementById("field-max-term-days");
        field_max_term_days_el.textContent = readDepositProductLimit(deposit_product.maxTermDays);

        const field_min_term_days_el = document.getElementById("field-min-term-days");
        field_min_term_days_el.textContent = readDepositProductLimit(deposit_product.minTermDays);

        const field_interests_el = document.getElementById("field-interests");
        let interests = deposit_product.interests;
        if(interests != null || interests != '') {
        for(interest in interests) {
            field_interests_el.innerHTML += interest + '<br />';
        }
        }

        const field_fees_el = document.getElementById("field-fees");
        let fees = deposit_product.fees;
        if(fees != null || fees != '') {
        for(fee in fees) {
            field_fees_el.innerHTML += fee + '<br />';
        }
        }

        const field_has_boolean_el = document.getElementById("field-has-nuban");
        field_has_boolean_el.textContent = readHumanBoolean(deposit_product.hasNuban);

        const field_min_kyc_el = document.getElementById("field-min-kyc-level");
        field_min_kyc_el.textContent = deposit_product.minKYCLevel;

        const field_dormancy_period_el = document.getElementById("field-dormancy-period-days");
        field_dormancy_period_el.textContent = deposit_product.dormancyPeriodDays;

        const field_confirmation_limit_el = document.getElementById("field-confirmation-limit");
        field_confirmation_limit_el.textContent = readDepositProductLimit(deposit_product.confirmationLimit);

        const field_minimum_balance_el = document.getElementById("field-minimum-balance");
        field_minimum_balance_el.textContent = readDepositProductLimit(deposit_product.minimumBalance);

        const field_overdraft_limit_el = document.getElementById("field-overdraft-limit");
        field_overdraft_limit_el.textContent = readDepositProductLimit(deposit_product.overdraftLimit);

        const field_requires_approval_el = document.getElementById("field-requires-approval");
        field_requires_approval_el.textContent = readHumanBoolean(deposit_product.requiresApproval);

        const field_allow_deposits_el = document.getElementById("field-allow-deposits");
        field_allow_deposits_el.textContent = readHumanBoolean(deposit_product.allowDeposits);

        const field_allow_withdrawals_el = document.getElementById("field-allow-withdrawals");
        field_allow_withdrawals_el.textContent = readHumanBoolean(deposit_product.allowWithdrawals);

        const field_overdraft_glid_el = document.getElementById("field-overdraft-glid");
        field_overdraft_glid_el.textContent = deposit_product.overdraftGLId;

        const field_liability_glid_el = document.getElementById("field-liability-glid");
        field_liability_glid_el.textContent = deposit_product.liabilityGLId;

    } else {
        // handle error
        alert('There was an error that occurred');
        document.location.href='/deposit-products/lists';
    }

    }

    request.send();
}

window.addEventListener('firebaseIsReady', () => {
    getSingleDpositProduct();
})