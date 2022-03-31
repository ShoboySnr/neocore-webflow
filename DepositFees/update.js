var myUrl = new URL(document.location.href)
var id = myUrl.searchParams.get("id")
let parent_gls = [];

async function getGLLiabilityAccounts(selected_value_income = '', selected_value_receivable = '', selected_value_unpaid = '') {
	let request = await cbrRequest('/gl-flat', 'GET', true)
  
  
  request.onload = function() {
  	
    if (request.status >= 200 && request.status < 400) {
    		let data = JSON.parse(this.response);
        
        parent_gls = data.data;
        
        let parent_gl_select_el = document.getElementById("field-income-glid");
       	filterGL(3, parent_gl_select_el, selected_value_income);
        
        parent_gl_select_el = document.getElementById("field-receivable-glid");
        filterGL(4, parent_gl_select_el, selected_value_receivable);
        
        parent_gl_select_el = document.getElementById("field-unpaid-glid");
        filterGL(1, parent_gl_select_el, selected_value_unpaid);
    }
  }
  request.send();
}

function filterGL(type = 0, parent_gl_select_el = '', selected_value = '') {
  if(type != 0) {
    parent_gls.forEach((gl, index) => {
      if(gl.usage === 1 && parseInt(type) == gl.type) {
          let option = document.createElement("option");

          option.value= gl.id;
          option.innerHTML = gl.name;
          
          if(selected_value == gl.id) {
          	option.selected = true;
          }

          parent_gl_select_el.appendChild(option);
        }
      });
   }
}

const feeType = document.getElementById("field-fee-type")
feeType.addEventListener('change', toggleFeeTypeFunction);

function toggleFeeTypeFunction() {
	const fee_type = this.value;
  
  document.getElementById("fee-parent").style.display = 'none';
  document.getElementById("percentage-parent").style.display = 'none';
  if(parseInt(fee_type) == 1 || parseInt(fee_type) == 2) {
  	document.getElementById("fee-parent").style.display = 'block';
    document.getElementById("percentage-parent").style.display = 'none';
  } else {
  	document.getElementById("fee-parent").style.display = 'none';
    document.getElementById("percentage-parent").style.display = 'block';
  }
}

function loadDefaultValues() {
	document.getElementById("field-fee").value = 0;
  document.getElementById("field-percentage").value = 0;
	document.getElementById("field-min").value = 0;
  document.getElementById("field-max").value = 0;
}

const updateFees = document.getElementById("wf-form-new-gl")
updateFees.addEventListener('submit', updateDepositFees);

async function getSingleDepositFees() {
    let request = await cbrRequest(`/fees/${id}`, 'GET', true)

    request.onload = function() {

    let data = JSON.parse(this.response)

    // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
    if (request.status >= 200 && request.status < 400) {
        const deposit_fees = data.data;
        
        getGLLiabilityAccounts(deposit_fees.incomeGL, deposit_fees.receivablesGL, deposit_fees.unpaidGL);
        
        document.getElementById("button-view-link").href = '/deposit-fees/view?id=' + deposit_fees.id;
        document.getElementById("fee-parent").style.display = 'none';
        document.getElementById("percentage-parent").style.display = 'none';
        if(parseInt(deposit_fees.feeType) == 1 || parseInt(deposit_fees.feeType) == 2) {
        document.getElementById("fee-parent").style.display = 'block';
        document.getElementById("percentage-parent").style.display = 'none';
        } else {
        document.getElementById("fee-parent").style.display = 'none';
        document.getElementById("percentage-parent").style.display = 'block';
        }
        
        
        document.getElementById("field-name").value = deposit_fees.name;
        document.getElementById("field-fee-type").value = deposit_fees.feeType || '';
        document.getElementById("field-percentage").value = deposit_fees.percentage * 100;
        document.getElementById("field-fee").value = deposit_fees.fee;
        document.getElementById("field-frequency").value = deposit_fees.frequency || '';
        document.getElementById("field-min").value = deposit_fees.minimum;
        document.getElementById("field-max").value = deposit_fees.maximum;
        document.getElementById("field-income-glid").value = deposit_fees.incomeGL;
        document.getElementById("field-receivable-glid").value = deposit_fees.receivablesGL;
        document.getElementById("field-unpaid-glid").value = deposit_fees.unpaidGL;
        document.getElementById("field-apply-vat").value = deposit_fees.applyVAT || '';
        document.getElementById("field-active").value = deposit_fees.active || '';
        document.getElementById("field-status").value = deposit_fees.status;
        } else {
                // handle error
            alert('There was an error that occurred');
            document.location.href='/deposit-fees/lists';
        }
    
    }
    
    request.send();
}

async function updateDepositFees(e) {
	//get all the submitted information
  e.preventDefault();
  document.getElementById("failed-message").style.display = 'none';
  document.getElementById("success-message").style.display= 'none';
  
  let formData = new FormData(this);
  let name = formData.get('field-name');
  let fee_type = parseInt(formData.get('field-fee-type'));
  
  let fee = 0;
  let percentage = 0;
  
  if(fee_type == 1 || fee_type == 2) {
  	fee = formData.get('field-fee');
  } else percentage = formData.get('field-percentage');
  
  let frequency = formData.get('field-frequency');
  let minimum = formData.get('field-min');
  let maximum = formData.get('field-max');
  let income_glid = formData.get('field-income-glid');
  let receivable_glid = formData.get('field-receivable-glid');
  let unpaid_glid = formData.get('field-unpaid-glid');
  let apply_vat = formData.get('field-apply-vat');
  let active = formData.get('field-active');
  let transaction_direction = formData.get('field-transaction-direction');
  let status = formData.get('field-status');
  
  //validations
  let error_count = 0;
  let error_message = '';
  
  if(minimum == '' || minimum == null) {
  	minimum = 0;
  }
  
  if(maximum == '' || maximum == null) {
  	maximum = 0;
  }
  
  
  if(name == '' || name == null) {
    error_message += 'Name of the deposit interest cannot be empty <br />';
    error_count++;
  }
  
 	if(fee_type == 1 || fee_type == 2) {
  	if(fee == '' || fee < 0) {
     	error_message += 'Fees cannot be empty <br />';
    	error_count++;
    }
  } else {
  	if(percentage < 0 || percentage >= 100) {
    	error_message += 'Percentage can only be between 0 and 100 <br />';
    	error_count++;
    }
  
  }

  if(frequency == '' || frequency == null) {
    error_message += 'Frequency cannot be empty <br />';
    error_count++;
  }

  if(income_glid == '' || income_glid == null) {
    error_message += 'Please select one Income GL <br />';
    error_count++;
  }
  
  if(receivable_glid == '' || receivable_glid == null) {
    error_message += 'Please select one Receivable GL <br />';
    error_count++;
  }

  if(unpaid_glid == '' || unpaid_glid == null) {
    error_message += 'Please select one Unpaid GL <br />';
    error_count++;
  }
  
  if(transaction_direction == '' || transaction_direction == null) {
    error_message += 'Please select a Transaction Direction <br />';
    error_count++;
  }

  if(error_count > 0) {
      document.getElementById("failed-message").style.display = 'block';
      document.getElementById("failed-message").innerHTML = error_message;
      return;
  }
 
  
  
  if(apply_vat === 'true') {
    apply_vat = true;
  } else apply_vat = false;

  if(active === 'true') {
    active = true;
  } else active = false;
  
  let transaction_types = [];
  
  let data = {
    "name" : name,
    "feeType" : parseInt(fee_type),
    "fee" : parseInt(fee),
    "percentage" : parseInt(percentage) / 100,
    "transactionTypes": transaction_types,
    "frequency" : parseInt(frequency),
    "minimum" : parseInt(minimum),
    "maximum" : parseInt(maximum),
    "incomeGL" : income_glid,
    "receivablesGL" : receivable_glid,
    "unpaidGL" : unpaid_glid,
    "applyVAT" : apply_vat,
    "active": active,
    "transactionDirection": parseInt(transaction_direction),
    "status" : status,
  }
  
  let request = await cbrRequest(`/fees/${id}`, 'POST', true)
  
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
    getSingleDepositFees();
})