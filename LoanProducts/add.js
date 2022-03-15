let parent_gls = [];
let deposit_interests = [];
let deposit_fees = [];
let loans_forms = [];

function getLoanForms() {
    let request = cbrRequest('/loanForms', 'GET', true)
  
  
    request.onload = function() {
        
      if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(this.response);
          
            let loan_forms = data.data;
            console.log(loan_forms);
            
            let parent_el = document.getElementById("field-application-form-id");
            appendToSelect(loan_forms, parent_el);
      }
    }
    request.send();
}

function appendToSelect(data, parent_gl_select_el = '') {
  if(data != '' || data.length > 0) {
    data.forEach((di, index) => {
       let option = document.createElement("option");

          option.value= di.id;
          option.innerHTML = di.name;

          parent_gl_select_el.appendChild(option);
      });
   }
}

function createNewLoanProduct(e) {
	//get all the submitted information
  e.preventDefault();
  document.getElementById("failed-message").style.display = 'none';
  document.getElementById("success-message").style.display= 'none';

  return;
  
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
    "name" : name,
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
  
  let request = cbrRequest(`/deposit-product`, 'POST', true)
  
  request.onload = function() {
    let data = JSON.parse(this.response);
  // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
  	if (request.status >= 200 && request.status < 400) {
        addNewProduct.reset();
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

window.addEventListener('DOMContentLoaded', () => {
    getLoanForms();
    const addLoanProduct = document.getElementById("wf-form-new-loan-product")
    addLoanProduct.addEventListener('submit', createNewLoanProduct);
})