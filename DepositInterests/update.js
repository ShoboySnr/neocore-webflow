
var myUrl = new URL(document.location.href)
var id = myUrl.searchParams.get("id")

async function getGLLiabilityAccounts(selected_value_expense = '', selected_value_accrual = '') {
    let request = await cbrRequest('/gl-flat', 'GET', true)


    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
        let data = JSON.parse(this.response);

        parent_gls = data.data;

        let parent_gl_select_el = document.getElementById("field-accrual-glid");
        filterGL(2, parent_gl_select_el, selected_value_accrual);

        parent_gl_select_el = document.getElementById("field-expense-glid");
        filterGL(4, parent_gl_select_el, selected_value_expense);
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

async function getSingleDepositInterests() {
    let request = await cbrRequest(`/deposit-interests/${id}`, 'GET', true)

  request.onload = function() {

    let data = JSON.parse(this.response)

    // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
    if (request.status >= 200 && request.status < 400) {
      const deposit_details = data.data;

      getGLLiabilityAccounts(deposit_details.expenseGLID, deposit_details.accrualGLID);

      document.getElementById("button-view-link").href = '/deposit-interests/view?id=' + deposit_details.id;

      document.getElementById("field-payment-frequency").value = deposit_details.paymentFrequency;
      document.getElementById("field-min-activation-balance").value = deposit_details.minimumActivationBalance;
      document.getElementById("field-expense-glid").value = deposit_details.expenseGLID;
      document.getElementById("field-accrual-glid").value = deposit_details.accrualGLID;
      document.getElementById("field-apply-wht").value = deposit_details.applyWHT;
      document.getElementById("field-active").value = deposit_details.active;
    } else {
      // handle error
      alert('There was an error that occurred');
      document.location.href='/deposit-interests/lists';
    }

  }

  request.send();
}

  const addNewGL = document.getElementById("wf-form-new-gl")
  addNewGL.addEventListener('submit', updateDepositInterest);

async function updateDepositInterest(e) {
    //get all the submitted information
    e.preventDefault();
    document.getElementById("failed-message").style.display = 'none';
    document.getElementById("success-message").style.display= 'none';

    let formData = new FormData(this);
    let payment_frequency = formData.get('field-payment-frequency');
    let min_activation_balance = parseInt(formData.get('field-min-activation-balance'));
    let expense_glid = formData.get('field-expense-glid');
    let accrual_glid = formData.get('field-accrual-glid');
    let apply_wht = formData.get('field-apply-wht');
    let active = formData.get('field-active');

    //validations
    let error_count = 0;
    let error_message = '';

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

    if(apply_wht === 'true') {
      apply_wht = true;
    } else apply_wht = false;

    if(active === 'true') {
      active = true;
    } else active = false;
    console.log(min_activation_balance);

    let data = {
      "paymentFrequency" : parseInt(payment_frequency),
      "minimumActivationBalance" : min_activation_balance,
      "expenseGLID" : expense_glid,
      "accrualGLID" : accrual_glid,
      "applyWHT" : apply_wht,
      "active": active
    }

    let request = await cbrRequest(`/deposit-interests/`+ id, 'POST', true)

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
    getSingleDepositInterests();
})