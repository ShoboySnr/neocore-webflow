function getGLLiabilityAccounts() {
    let request = cbrRequest('/gl-flat', 'GET', true)
    
    
    request.onload = function() {
        
        if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(this.response);
        
            parent_gls = data.data;
            
            let parent_gl_select_el = document.getElementById("field-income-gl");
            filterGL(3, parent_gl_select_el);
            
            parent_gl_select_el = document.getElementById("field-suspense-account-gl");
            filterGL(2, parent_gl_select_el);
            
            parent_gl_select_el = document.getElementById("field-receivable-account-gl");
            filterGL(1, parent_gl_select_el);
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

function createNewLoanFee(e) {
	//get all the submitted information
  e.preventDefault();
  document.getElementById("failed-message").style.display = 'none';
  document.getElementById("success-message").style.display= 'none';


  let formData = new FormData(this);
  let name = formData.get('field-name');
  let calculation = formData.get('field-calculation');
  let when_to_take = formData.get('field-when-to-take');
  let minimum = formData.get('field-minimum');
  let maximum = formData.get('field-maximum');
  let cash_only = formData.get('field-cash-only');
  let income_recognition = formData.get('field-income-recognition');
  let income_gl = formData.get('field-income-gl');
  let receivable_income_gl = formData.get('field-receivable-account-gl');
  let suspense_account_gl = formData.get('field-suspense-account-gl');

  let amount_if_flat = 0;
  let percentage_if_pegged = 0;
  if(calculation == 'on-fixed') {
    amount_if_flat = formData.get('field-amount-if-fixed');
  } else {
    percentage_if_pegged = formData.get('field-percentage-if-pegged');
  }

  let frequency = 0;
  if(when_to_take == 'at-interval') {
    frequency = formData.get('field-frequency');
  }
  
  //validations
  let error_count = 0;
  let error_message = '';
  
  if(name == '' || name == null) {
    error_message += 'Name of the Loan Fee  cannot be empty <br />';
    error_count++;
  }
  
  if(calculation == '' || calculation == null) {
    error_message += 'Calculation cannot be empty <br />';
    error_count++;
  }

  if(when_to_take == '' || when_to_take == null) {
    error_message += 'Please select one When to Take the Loan <br />';
    error_count++;
  }

  if(minimum == '' || minimum == null) {
    error_message += 'Please enter the minimum amount <br />';
    error_count++;
  }

  if(maximum == '' || maximum == null) {
    error_message += 'Please enter the maximum amount <br />';
    error_count++;
  }

  if(minimum !== '' && maximum !== '' && minimum > maximum) {
    error_message += 'The Minimum amount has to be lower than the maximum amount <br />';
    error_count++;
  }

  if(cash_only == '' || cash_only == null) {
    error_message += 'Please select whether Cash Only <br />';
    error_count++;
  }

  if(amount_if_flat == '' || amount_if_flat == null) {
    error_message += 'Please Enter the Fixed Amount <br />';
    error_count++;
  }

  if(percentage_if_pegged == '' || percentage_if_pegged == null) {
    error_message += 'Please Enter the Percentage Pegged Amount <br />';
    error_count++;
  }

  if(frequency == '' || frequency == null) {
    error_message += 'Please Enter the Frequency <br />';
    error_count++;
  }

  if(income_recognition == '' || income_recognition == null) {
    error_message += 'Please select one Field Income Recognition <br />';
    error_count++;
  }

  if(income_gl == '' || income_gl == null) {
    error_message += 'Please select one Income Account GL <br />';
    error_count++;
  }

  if(receivable_income_gl == '' || receivable_income_gl == null) {
    error_message += 'Please select one Receivable Account GL <br />';
    error_count++;
  }

  if(suspense_account_gl == '' || suspense_account_gl == null) {
    error_message += 'Please select one Suspense Account GL<br />';
    error_count++;
  }

  if(error_count > 0) {
      document.getElementById("failed-message").style.display = 'block';
      document.getElementById("failed-message").innerHTML = error_message;
      return;
  }

  cash_only = cash_only === 'true';

  let data = {
    "name" : name,
    "calculation" : calculation,
    "amt_if_flat" : parseInt(amount_if_flat),
    "percentage_if_pegged" : parseInt(percentage_if_pegged),
    "when_to_take" : when_to_take,
    "frequency" : parseInt(frequency),
    "minimum" : parseInt(minimum),
    "maximum" : parseInt(maximum),
    "cash_only" : cash_only,
    "income_recognition" : income_recognition,
    "income_account_gl" : income_account_gl,
    "receivable_account_gl" : receivable_account_gl,
    "suspense_account_gl" : suspense_account_gl,
  }

  let _this = this;
  
  let request = cbrRequest(`/loanFee`, 'POST', true)
  
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
    getGLLiabilityAccounts();
    const addLoanFee = document.getElementById("wf-form-Create-New-Loan-Fee")
    addLoanFee.addEventListener('submit', createNewLoanFee);

    //add event listener to calculation
    document.querySelector('#field-calculation').addEventListener('change' , () => {
      document.querySelector('.amount-if-fixed-container').setAttribute('style', 'display:none;');
      document.querySelector('.percentage-if-pegged-container').setAttribute('style', 'display:none;');
      const value = this.value;

      if(value === 'on-fixed') {
        document.querySelector('.amount-if-fixed-container').setAttribute('style', 'display:block;');
      } else {
        document.querySelector('.percentage-if-pegged-container').setAttribute('style', 'display:block;');
      }
    });

    document.querySelector('#field-when-to-take').addEventListener('change' , () => {
      document.querySelector('.frequency-container').setAttribute('style', 'display:none;');
      const value = this.value;

      if(value === 'at-interval') {
        document.querySelector('.frequency-container').setAttribute('style', 'display:block;');
      }
    });
})