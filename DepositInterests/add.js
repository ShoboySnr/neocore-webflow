var myUrl = new URL(document.location.href)
let parent_gls = [];

async function getGLLiabilityAccounts() {
    let request = await cbrRequest('/gl-flat', 'GET', true)

    request.onload = function() {

    if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(this.response);
        
            parent_gls = data.data;
            
            let parent_gl_select_el = document.getElementById("field-accrual-glid");
            filterGL(2, parent_gl_select_el);
            
            parent_gl_select_el = document.getElementById("field-expense-glid");
            filterGL(4, parent_gl_select_el);
        }
    }
    
    request.send();
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

const addNewGL = document.getElementById("wf-form-new-gl")
addNewGL.addEventListener('submit', createNewDepositInterest);

async function createNewDepositInterest(e) {
	//get all the submitted information
  e.preventDefault();
  document.getElementById("failed-message").style.display = 'none';
  document.getElementById("success-message").style.display= 'none';
  
  let formData = new FormData(this);
  let name = formData.get('field-name');
  let rate = parseInt(formData.get('field-rate'));
  let payment_frequency = formData.get('field-payment-frequency');
  let min_activation_balance = parseInt(formData.get('field-min-activation-balance'));
  let expense_glid = formData.get('field-expense-glid');
  let accrual_glid = formData.get('field-accrual-glid');
  let apply_wht = formData.get('field-apply-wht');
  let active = formData.get('field-active');
  let status = formData.get('field-status');
  
  //validations
  let error_count = 0;
  let error_message = '';
  
  if(rate == '' || rate == null || rate < 1 || rate > 100) {
  	error_message += 'Rate must be between 1 and 100 <br />';
    error_count++;
  }
  
  if(min_activation_balance == '' || min_activation_balance == null || min_activation_balance < 5000) {
  	error_message += 'Minimum activation balance must not be less than 5000 <br />';
    error_count++;
  }

  if(name == '' || name == null) {
    error_message += 'Name of the deposit interest cannot be empty <br />';
    error_count++;
  }

  if(payment_frequency == '' || payment_frequency == null) {
    error_message += 'Payment frequency cannot be empty <br />';
    error_count++;
  }

  if(expense_glid == '' || expense_glid == null) {
    error_message += 'Please select one Expense GLID <br />';
    error_count++;
  }

  if(accrual_glid == '' || accrual_glid == null) {
    error_message += 'Please select one Accrual GLID <br />';
    error_count++;
  }

  if(error_count > 0) {
      document.getElementById("failed-message").style.display = 'block';
      document.getElementById("failed-message").innerHTML = error_message;
      return;
  }
  
  rate = rate/100;
  let principalFrom = 0;
  let principalTo = 0;
  
  
  if(apply_wht === 'true') {
    apply_wht = true;
  } else apply_wht = false;

  if(active === 'true') {
    active = true;
  } else active = false;
  
  let data = {
    "name" : name,
    "rate" : rate,
    "paymentFrequency" : parseInt(payment_frequency),
    "minimumActivationBalance" : min_activation_balance,
    "principalFrom" : principalFrom,
    "principalTo" : principalTo,
    "expenseGLID" : expense_glid,
    "accrualGLID" : accrual_glid,
    "status" : status,
    "applyWHT" : apply_wht,
    "active": active
  }
  
  let request = await cbrRequest(`/deposit-interests`, 'POST', true)
  
  request.onload = function() {
    let data = JSON.parse(this.response);
  // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
  	if (request.status >= 200 && request.status < 400) {
        addNewGL.reset();
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
    getGLLiabilityAccounts();
})