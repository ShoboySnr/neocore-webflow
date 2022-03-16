let loans_forms = [];
let principal_assets_glid = [];

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

function getLoanFees() {
  let request = cbrRequest('/loanFee', 'GET', true)
  
  
    request.onload = function() {
        
      if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(this.response);
          
            let loan_forms = data.data;
            console.log(loan_forms);
            
            let parent_el = document.getElementById("field-fees");
            appendToSelect(loan_forms, parent_el);
      }
    }
    request.send();
}

function getLoanInterests() {
  let request = cbrRequest('/loanInterest', 'GET', true)
  
  
    request.onload = function() {
        
      if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(this.response);
          
            let loan_forms = data.data;
            console.log(loan_forms);
            
            let parent_el = document.getElementById("field-loan-interests");
            appendToSelect(loan_forms, parent_el);
      }
    }
    request.send();
}

function getGLLiabilityAccounts() {
    let request = cbrRequest('/gl-flat', 'GET', true)
    
    
    request.onload = function() {
        
    if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(this.response);
        
        parent_gls = data.data;
        
        let parent_gl_select_el = document.getElementById("field-principal-loss-reserve-assets-liability-gl");
        filterGL(1, parent_gl_select_el);
        
        parent_gl_select_el = document.getElementById("field-principal-loss-reserve-assets-liability-gl");
        filterGL(2, parent_gl_select_el);
        
        parent_gl_select_el = document.getElementById("field-overdue-principal-assets-gl");
        filterGL(1, parent_gl_select_el);

        parent_gl_select_el = document.getElementById("field-principal-assets-gl");
        filterGL(1, parent_gl_select_el);

        parent_gl_select_el = document.getElementById("field-principal-loss-reserve-expense-glid");
        filterGL(4, parent_gl_select_el);
        }
    }
    request.send();
}

function appendToSelect(data, parent_gl_select_el = '') {
  if(data != '' || data.length > 0) {
    data.forEach((di, index) => {
       let option = document.createElement("option");

          option.value= di.ID;
          option.innerHTML = di.Name;

          parent_gl_select_el.appendChild(option);
      });
   }
}

function filterGL(type = 0, parent_gl_select_el = '') {
    if(type != 0) {
    parent_gls.forEach((gl, index) => {
        if(gl.usage === 1 && parseInt(type) == gl.type) {
            let option = document.createElement("option");

            option.value= gl.id;
            option.innerHTML = gl.name;

            parent_gl_select_el.appendChild(option);
        }
        });
    }
}

function createNewLoanProduct(e) {
	//get all the submitted information
  e.preventDefault();
  document.getElementById("failed-message").style.display = 'none';
  document.getElementById("success-message").style.display= 'none';


  let formData = new FormData(this);
  let strict = formData.get('field-strict');
  let name = formData.get('field-name');
  let product_code = formData.get('field-product-code');
  let min_kyc_level = formData.get('field-min-kyc-level');
  let application_form_id = formData.get('field-application-form-id');
  let min_amount = formData.get('field-min-amount');
  let max_amount = formData.get('field-max-amount');
  let min_linked_account_balance = formData.get('field-min-linked-account-balance');
  let moratorium_days = formData.get('field-moratorium-days');
  let default_tenor_days = formData.get('field-default-tenor-days');
  let min_term_days = formData.get('field-minimum-term-days');
  let max_term_days = formData.get('field-maximum-term-days');
  let principal_repayment_frequency = formData.get('field-principal-repayment-frequency');
  let loan_interests = formData.get('field-loan-interests');
  let interest_repayment_frequency = formData.get('field-interest-repayment-frequency');
  let fees = formData.get('field-fees');
  let interest_type = formData.get('field-interest-type');
  let principal_assets_gl = formData.get('field-principal-assets-gl');
  let overdue_principal_assets_gl = formData.get('field-overdue-principal-assets-gl');
  let principal_loss_reserve_assets_liability_gl = formData.get('field-principal-loss-reserve-assets-liability-gl');
  let principal_loss_reserve_expense_gl = formData.get('field-principal-loss-reserve-expense-glid');

  
  fees = returnSelected(document.getElementById('field-fees'))
  
  //validations
  let error_count = 0;
  let error_message = '';
  
  if(min_term_days == '' || min_term_days == null || parseInt(min_term_days) < 0) {
  	min_term_days = -1;
  }
  
  if(max_term_days == '' || max_term_days == null || parseInt(max_term_days) < 0) {
  	maximum_term_days = -1;
  }
  
  if(min_kyc_level == '' || min_kyc_level == null || parseInt(min_kyc_level) < 0) {
  	min_kyc_level = 0;
  }
  
  if(min_linked_account_balance == '' || min_linked_account_balance == null || parseInt(min_linked_account_balance) < 0) {
  	min_linked_account_balance = 0;
  }
  
  if(moratorium_days == '' || moratorium_days == null || parseInt(moratorium_days) < 0) {
  	moratorium_days = 0;
  }
  
  if(default_tenor_days == '' || default_tenor_days == null || parseInt(default_tenor_days) < 0) {
  	default_tenor_days = 30;
  }

  if(interest_repayment_frequency == '' || interest_repayment_frequency == null || parseInt(interest_repayment_frequency) < 0) {
  	interest_repayment_frequency = 30;
  }

  if(principal_repayment_frequency == '' || principal_repayment_frequency == null || parseInt(principal_repayment_frequency) < 0) {
  	principal_repayment_frequency = 30;
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

  if(application_form_id == '' || application_form_id == null) {
    error_message += 'Application Form ID cannot be empty <br />';
    error_count++;
  }

  if(min_amount == '' || min_amount == null) {
    error_message += 'Minimum Amount cannot be empty <br />';
    error_count++;
  }

  if(max_amount == '' || max_amount == null) {
    error_message += 'Minimum Amount cannot be empty <br />';
    error_count++;
  }

  if(loan_interests == '' || loan_interests == null) {
    error_message += 'Please select one Loan Interest <br />';
    error_count++;
  }
  
  if(interest_type == '' || interest_type == null) {
    error_message += 'Please select one Interest Type <br />';
    error_count++;
  }

  if(principal_assets_gl == '' || principal_assets_gl == null) {
    error_message += 'Please select one Principal Assets GL <br />';
    error_count++;
  }

  if(overdue_principal_assets_gl == '' || overdue_principal_assets_gl == null) {
    error_message += 'Please select one Overdue Principal Assets GL <br />';
    error_count++;
  }

  if(principal_loss_reserve_assets_liability_gl == '' || principal_loss_reserve_assets_liability_gl == null) {
    error_message += 'Please select one Principal Loss Reserve Assets and Liability GL <br />';
    error_count++;
  }

  if(principal_loss_reserve_expense_gl == '' || principal_loss_reserve_expense_gl == null) {
    error_message += 'Please select one Principal Loss Reserve Expense GL <br />';
    error_count++;
  }

  if(error_count > 0) {
      document.getElementById("failed-message").style.display = 'block';
      document.getElementById("failed-message").innerHTML = error_message;
      return;
  }
  
  strict = (strict === 'true');

  let data = {
  	"strict" : strict,
    "name" : name,
    "productCode" : product_code,
    "minKYCLevel" : parseInt(min_kyc_level),
    "applicationFormId" : application_form_id,
    "minAmount" : parseInt(min_amount),
    "maxAmount" : parseInt(max_amount),
    "minLinkedAccountBalance" : parseInt(min_linked_account_balance),
    "moratoriumDays" : parseInt(moratorium_days),
    "defaultTenorDays" : parseInt(default_tenor_days),
    "minTermDays" : parseInt(min_term_days),
    "maxTermDays" : parseInt(max_term_days),
    "principalRepaymentFreq" : parseInt(principal_repayment_frequency),
    "loanInterest" : loan_interests,
    "interestRepaymentFreq": parseInt(interest_repayment_frequency),
    "interestType" : interest_type,
    "fees" : fees,
    "principalAssetGL" : principal_assets_gl,
    "overduePrincipalAssetGL" : overdue_principal_assets_gl,
    "principalLossReserveAssetOrLiabilityGL" : principal_loss_reserve_assets_liability_gl,
    "principalLossReserveExpenseGL" : principal_loss_reserve_expense_gl,
  }

  let _this = this;
  
  let request = cbrRequest(`/loanProduct`, 'POST', true)
  
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

window.addEventListener('DOMContentLoaded', () => {
    getLoanForms();
    getLoanFees();
    getGLLiabilityAccounts();
    const addLoanProduct = document.getElementById("wf-form-Create-New-Loan-Product")
    addLoanProduct.addEventListener('submit', createNewLoanProduct);
})