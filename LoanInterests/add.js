async function getGLLiabilityAccounts() {
    let request = await cbrRequest('/gl-flat', 'GET', true)
    
    
    request.onload = function() {
        
        if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(this.response);
        
            parent_gls = data.data;
            
            let parent_gl_select_el = document.getElementById("field-income-gl");
            filterGL(3, parent_gl_select_el);
            
            parent_gl_select_el = document.getElementById("field-suspense-gl");
            filterGL(2, parent_gl_select_el);
            
            parent_gl_select_el = document.getElementById("field-past-due-gl");
            filterGL(1, parent_gl_select_el);

            parent_gl_select_el = document.getElementById("field-accrual-gl");
            filterGL(1, parent_gl_select_el);

            parent_gl_select_el = document.getElementById("field-loss-asset-liability-gl");
            filterGL(1, parent_gl_select_el);

            parent_gl_select_el = document.getElementById("field-loss-asset-liability-gl");
            filterGL(2, parent_gl_select_el);

            parent_gl_select_el = document.getElementById("field-loss-reserve-expense-gl");
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

async function createNewLoanInterest(e) {
	//get all the submitted information
  e.preventDefault();
  document.getElementById("failed-message").style.display = 'none';
  document.getElementById("success-message").style.display= 'none';


  let formData = new FormData(this);
  let name = formData.get('field-name');
  let rate = formData.get('field-rate');
  let income_gl = formData.get('field-income-gl');
  let suspense_gl = formData.get('field-suspense-gl');
  let past_due_gl = formData.get('field-past-due-gl');
  let accrual_gl = formData.get('field-accrual-gl');
  let loss_asset_liability_gl = formData.get('field-loss-asset-liability-gl');
  let loss_reserve_expense_gl = formData.get('field-loss-reserve-expense-gl');
  let income_recognition_gl = formData.get('field-income-recognition-type');
  let apply_wht = formData.get('field-aply-wht');
  
  //validations
  let error_count = 0;
  let error_message = '';
  
  if(name == '' || name == null) {
    error_message += 'Name of the deposit product cannot be empty <br />';
    error_count++;
  }
  
  if(rate == '' || rate == null) {
    error_message += 'Rate cannot be empty <br />';
    error_count++;
  }

  if(income_gl == '' || income_gl == null) {
    error_message += 'Please select one Income GL <br />';
    error_count++;
  }

  if(suspense_gl == '' || suspense_gl == null) {
    error_message += 'Please select one Suspense GL <br />';
    error_count++;
  }

  if(past_due_gl == '' || past_due_gl == null) {
    error_message += 'Please select one Past Due GL <br />';
    error_count++;
  }

  if(accrual_gl == '' || accrual_gl == null) {
    error_message += 'Please select one Accrual GL <br />';
    error_count++;
  }

  if(loss_asset_liability_gl == '' || loss_asset_liability_gl == null) {
    error_message += 'Please select one Loss Reserve Asset or Liability GL <br />';
    error_count++;
  }

  if(loss_reserve_expense_gl == '' || loss_reserve_expense_gl == null) {
    error_message += 'Please select one Loss Reserve Expense GL <br />';
    error_count++;
  }

  if(income_recognition_gl == '' || income_recognition_gl == null) {
    error_message += 'Please select one Income Recognition Type<br />';
    error_count++;
  }

  if(error_count > 0) {
      document.getElementById("failed-message").style.display = 'block';
      document.getElementById("failed-message").innerHTML = error_message;
      return;
  }

  apply_wht = apply_wht === 'true';

  let data = {
    "name" : name,
    "rate" : parseInt(rate),
    "incomeGL" : income_gl,
    "suspenseGL" : suspense_gl,
    "pastDueGL" : past_due_gl,
    "accrualGL" : accrual_gl,
    "lossReserveAssetOrLiabilityGL" :loss_asset_liability_gl,
    "lossReserveExpenseGL" : loss_reserve_expense_gl,
    "incomeRecognitionType" : income_recognition_gl,
    "applyWHT": apply_wht,
  }

  let _this = this;
  
  let request = await cbrRequest(`/loanInterest`, 'POST', true)
  
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

window.addEventListener('firebaseIsReady', () => {
    getGLLiabilityAccounts();
    const addLoanProduct = document.getElementById("wf-form-Create-New-Loan-Interest")
    addLoanProduct.addEventListener('submit', createNewLoanInterest);
})