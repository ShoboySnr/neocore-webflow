async function getSingleDepositFees() {
    var myUrl = new URL(document.location.href)
var id = myUrl.searchParams.get("id")

let request = cbrRequest(`/fees/${id}`, 'GET', true)

request.onload = function() {

  let data = JSON.parse(this.response)

  // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
  if (request.status >= 200 && request.status < 400) {
  	const deposit_details = data.data;
    
    const customer_title_bg = document.getElementById("card-details");
    
    document.getElementById("button-edit-link").href = '/deposit-fees/edit?id=' + deposit_details.id;
    
  	const field_id_el = document.getElementById("field-id");
  	field_id_el.textContent = deposit_details.id
    
    const field_name_el = document.getElementById("field-name");
  	field_name_el.textContent = deposit_details.name;
    
   document.getElementById("title-field-name").innerHTML = 'Deposit Fees: ' + deposit_details.name;
    
    const field_fee_type_el = document.getElementById("field-fee-type");
  	field_fee_type_el.textContent = readFeeType(deposit_details.feeType);
    
    const field_fees_el = document.getElementById("field-fee");
  	field_fees_el.textContent = deposit_details.fee;
    
    const field_percentage_el = document.getElementById("field-percentage");
  	field_percentage_el.textContent = deposit_details.percentage;
    
    const field_freq_el = document.getElementById("field-frequency");
  	field_freq_el.textContent = readPaymentFrequency(deposit_details.frequency);
    
    const field_min_el = document.getElementById("field-min");
  	field_min_el.textContent = deposit_details.minimum;
    
    const field_max_el = document.getElementById("field-max");
  	field_max_el.textContent = deposit_details.maximum;
    
    const field_income_glid_el = document.getElementById("field-income-glid");
  	field_income_glid_el.textContent = deposit_details.incomeGL;
    
    const field_receivable_glid_el = document.getElementById("field-receivable-glid");
  	field_receivable_glid_el.textContent = deposit_details.receivablesGL;
    
    const field_unpaid_glid_el = document.getElementById("field-unpaid-glid");
  	field_unpaid_glid_el.textContent = deposit_details.unpaidGL;
    
      
    const field_apply_vat_el = document.getElementById("field-apply-vat");
  	field_apply_vat_el.textContent = deposit_details.applyVAT;
    
    const field_active = document.getElementById("field-active");
  	field_active.textContent = deposit_details.active
    
    const field_transaction_direction_active = document.getElementById("field-transaction-direction");
  	field_transaction_direction_active.textContent = readTransactionDirection(deposit_details.transactionDirection)
    
    const field_status_el = document.getElementById("field-status");
  	field_status_el.textContent = deposit_details.status;
 
    
  
  	} else {
    		// handle error
        alert('There was an error that occurred');
        document.location.href='/deposit-fees/lists';
  	}
  
  }
  
  request.send();
}

window.addEventListener('firebaseIsReady', () => {
    getSingleDepositFees();
});