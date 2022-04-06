var myUrl = new URL(document.location.href)
var id = myUrl.searchParams.get("id")
let parent_gls = [];
let deposit_interests = [];
let deposit_fees = [];

async function getDepositInterests(selected_interests_value = null) {
    let request = await cbrRequest('/deposit-interests', 'GET', true)

    request.onload = function() {

      if (request.status >= 200 && request.status < 400) {
        let data = JSON.parse(this.response);

        deposit_interests = data.data;

        let parent_gl_select_el = document.getElementById("field-interests");
        filterInterestsFees(deposit_interests, parent_gl_select_el, selected_interests_value);
      }
    }
    request.send();
}

async function getDepositFees(selected_fees_value = null) {
    let request = await cbrRequest('/fees', 'GET', true)

    request.onload = function() {

      if (request.status >= 200 && request.status < 400) {
        let data = JSON.parse(this.response);

        deposit_fees = data.data;

        let parent_gl_select_el = document.getElementById("field-fees");
        filterInterestsFees(deposit_fees, parent_gl_select_el, selected_fees_value);
      }
    }
    request.send();
}

async function getGLLiabilityAccounts(selected_value_overdraft = '', selected_value_liability = '') {
    let request = await cbrRequest('/gl-flat', 'GET', true)

    request.onload = function() {

      if (request.status >= 200 && request.status < 400) {
        let data = JSON.parse(this.response);

        parent_gls = data.data;

        let parent_gl_select_el = document.getElementById("field-overdraft-glid");
        filterGLs(parent_gls, 1, parent_gl_select_el, selected_value_overdraft);

        parent_gl_select_el = document.getElementById("field-liability-glid");
        filterGLs(parent_gls, 2, parent_gl_select_el, selected_value_liability);
      }
    }

    request.send();
}

  const addNewProduct = document.getElementById("wf-form-new-gl")
  addNewProduct.addEventListener('submit', updateDepositProduct);

  async function getDepositProducts() {
    let request = await cbrRequest(`/deposit-product/${id}`, 'GET', true)

    request.onload = function() {

        let data = JSON.parse(this.response)

        // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
        if (request.status >= 200 && request.status < 400) {
        const deposit_product = data.data;

        getGLLiabilityAccounts(deposit_product.overdraftGLId, deposit_product.liabilityGLId);
        getDepositInterests(deposit_product.interests);
        getDepositFees(deposit_product.fees);

        document.getElementById("button-view-link").href = '/deposit-products/view?id=' + deposit_product.id;

        document.getElementById("field-strict").value = deposit_product.strict;
        document.getElementById("field-name").value = deposit_product.name;
        document.getElementById("field-product-code").value = deposit_product.productCode;
        document.getElementById("field-term").value = deposit_product.term;
        document.getElementById("field-max-term-days").value = readDepositProductLimit(deposit_product.maxTermDays, '');
        document.getElementById("field-min-term-days").value = readDepositProductLimit(deposit_product.minTermDays, '');

        document.getElementById("field-has-nuban").value = deposit_product.hasNuban;
        document.getElementById("field-min-kyc-level").value = deposit_product.minKYCLevel;
        document.getElementById("field-dormancy-period").value = deposit_product.dormancyPeriodDays;
        document.getElementById("field-confirmation-limit").value = readDepositProductLimit(deposit_product.confirmationLimit, '');
        document.getElementById("field-minimum-balance").value = readDepositProductLimit(deposit_product.minimumBalance, '');
        document.getElementById("field-overdraft-limit").value = readDepositProductLimit(deposit_product.overdraftLimit, '');
        document.getElementById("field-requires-approval").value = deposit_product.requiresApproval;
        document.getElementById("field-allow-deposits").value = deposit_product.allowDeposits;
        document.getElementById("field-allow-withdrawals").value = deposit_product.allowWithdrawals;

        } else {
            // handle error
            alert('There was an error that occurred');
            document.location.href='/deposit-products/lists';
        }

    }

    request.send();
  }

  async function updateDepositProduct(e) {
    //get all the submitted information
    e.preventDefault();
    document.getElementById("failed-message").style.display = 'none';
    document.getElementById("success-message").style.display= 'none';

    let formData = new FormData(this);
    let strict = formData.get('field-strict');
    let name = formData.get('field-name');
    let product_code = formData.get('field-product-code');
    let term = formData.get('field-term');
    let minimum_term_days = formData.get('field-min-term-days');
    let maximum_term_days = formData.get('field-max-term-days');
    let interests = formData.get('field-interests');
    let fees = formData.get('field-fees');
    let has_nuban = formData.get('field-has-nuban');
    let dormancy_period = formData.get('field-dormancy-period');
    let confirmation_limit = formData.get('field-confirmation-limit');
    let min_kyc_level = formData.get('field-min-kyc-level');
    let minimum_balance = formData.get('field-minimum-balance');
    let overdraft_limit = formData.get('field-overdraft-limit');
    let requires_approval = formData.get('field-requires-approval');
    let allow_deposits = formData.get('field-allow-deposits');
    let allow_withdrawals = formData.get('field-allow-withdrawals');
    let overdraft_glid = formData.get('field-overdraft-glid');
    let liability_glid = formData.get('field-liability-glid');

    interests = returnSelected(document.getElementById('field-interests'))
    fees = returnSelected(document.getElementById('field-fees'))

    //validations
    let error_count = 0;
    let error_message = '';

    if(minimum_term_days == '' || minimum_term_days == null || parseInt(minimum_term_days) < 0) {
      minimum_term_days = -1;
    }

    if(maximum_term_days == '' || maximum_term_days == null || parseInt(maximum_term_days) < 0) {
      maximum_term_days = -1;
    }

    if(dormancy_period == '' || dormancy_period == null || parseInt(dormancy_period) < 0) {
      dormancy_period = -1;
    }

    if(confirmation_limit == '' || confirmation_limit == null || parseInt(confirmation_limit) < 0) {
      confirmation_limit = -1;
    }

    if(min_kyc_level == '' || min_kyc_level == null || parseInt(min_kyc_level) < 0) {
      min_kyc_level = -1;
    }

    if(minimum_balance == '' || minimum_balance == null || parseInt(minimum_balance) < 0) {
      minimum_balance = -1;
    }

    if(overdraft_limit == '' || overdraft_limit == null || parseInt(overdraft_limit) < 0) {
      overdraft_limit = -1;
    }

    if(interests.length <= 0) {
      interests = [];
    }

    if(fees.length <= 0) {
      fees = [];
    }

    if(name == '' || name == null) {
      error_message += 'Name of the deposit product cannot be empty <br />';
      error_count++;
    }

    if(product_code == '' || product_code == null) {
      error_message += 'Product code cannot be empty <br />';
      error_count++;
    }

    if(term == '' || term == null) {
      error_message += 'Term cannot be empty <br />';
      error_count++;
    }

    if(overdraft_glid == '' || overdraft_glid == null) {
      error_message += 'Please select one Overdraft GL <br />';
      error_count++;
    }

    if(liability_glid == '' || liability_glid == null) {
      error_message += 'Please select one Liability GL <br />';
      error_count++;
    }

    if(error_count > 0) {
      document.getElementById("failed-message").style.display = 'block';
      document.getElementById("failed-message").innerHTML = error_message;
      return;
    }

    strict = (strict === 'true');
    term = (term === 'true');
    has_nuban = (has_nuban === 'true');
    requires_approval = (requires_approval === 'true');
    allow_deposits = (allow_deposits === 'true');
    allow_withdrawals = (allow_withdrawals === 'true');

    let flow_type_ids = [];

    let data = {
      "strict" : strict,
      "productCode" : product_code,
      "term" : term,
      "maxTermDays" : parseInt(maximum_term_days),
      "minTermDays" : parseInt(minimum_term_days),
      "interests" : interests,
      "fees" : fees,
      "hasNuban" : has_nuban,
      "dormancyPeriodDays" : parseInt(dormancy_period),
      "confirmationLimit" : parseInt(confirmation_limit),
      "minKYCLevel" : parseInt(min_kyc_level),
      "minimumBalance" : parseInt(minimum_balance),
      "overdraftLimit" : parseInt(overdraft_limit),
      "requiresApproval": requires_approval,
      "allowDeposits" : allow_deposits,
      "allowWithdrawals" : allow_withdrawals,
      "flowTypeIDs" : flow_type_ids,
      "overdraftGLId" : overdraft_glid,
      "liabilityGLId" : liability_glid,
    }

    let request = await cbrRequest(`/deposit-product/${id}`, 'POST', true)

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

window.addEventListener('firebaseIsReady', () => {
    getDepositProducts();
})
