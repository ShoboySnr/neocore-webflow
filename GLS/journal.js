function toggleGLType(event) {
    const value = $(this).val();

    $(this).parents('.journal-column').find('.glcode-container').css('display', 'none');;
    $(this).parents('.journal-column').find('.customer-account-address-container').css('display', 'none');;

    if(value == 'glcode') {
        $(this).parents('.journal-column').find('.glcode-container').css('display', 'block');
    } else if(value == 'customer-account-number') {
        $(this).parents('.journal-column').find('.customer-account-address-container').css('display', 'block');
    }
}
    
function removeExtraLegFunction(){
    event.preventDefault();
    let remove_legs_parent = $(this).closest(".journal-column");
    remove_legs_parent.remove();
}

function addExtraLegFunction(event) {
    event.preventDefault();
    const legs_parent = document.getElementById("cloned-element");
    let leg_parent_clone = legs_parent.cloneNode(true);

    const journal_column = document.querySelectorAll('.journal-column');
    let size = journal_column.length;
    const newsize = parseInt(size);

    
    let select_options = leg_parent_clone.querySelectorAll('input.journal-select-options');
    let select_options_size = select_options.length;
        for (let i = 0; i < select_options_size; i++) {
        select_options[i].setAttribute('value','glcode');
        select_options[i].setAttribute('name', 'field-select-type['+ newsize + ']');
    }

    leg_parent_clone.querySelector('input.glcode').setAttribute('value','');
    leg_parent_clone.querySelector('input.customer-account-number').setAttribute('value','');
    leg_parent_clone.querySelector('select[name=field-debit]').setAttribute('value','');
    leg_parent_clone.querySelector('input[name=field-amount]').setAttribute('value','');
    leg_parent_clone.querySelector('.button-remove-extra-legs').setAttribute('style','display:block');
    leg_parent_clone.removeAttribute('id');
    leg_parent_clone.setAttribute('style','display:block');


    document.getElementById("journal-legs-parents").appendChild(leg_parent_clone);
}
    
const createJournal = document.getElementById("wf-form-new-journal")
createJournal.addEventListener('submit', addNewJournalEntry);
    
async function addNewJournalEntry(e) {
    e.preventDefault();
    let legs = [];
    
    let formData = new FormData(this);
    let poster = formData.get('field-poster');
    let entry_type = formData.get('field-entry-type');
    let force_overdrawn = formData.get('field-force-overdrawn');
    let value_date = formData.get('field-value-date');

    let errorMessage = '';
    let errorCount = 0;

    
    if(value_date.length < 1) {
        errorMessage += '<p>Enter the value date </p>';
        errorCount += 1;
    }

    if(value_date != '') {
        value_date = moment(value_date, "DD-MMM-YYYY", true).format('DD-MMM-YYYY-h-mm-ss')
    }
    
    if(force_overdrawn === '') {
        errorMessage += '<p>Choose the force overdrawn status</p>';
        errorCount += 1;
    }

    force_overdrawn === 'true';

    const journal_column = document.querySelectorAll('.journal-column');
    let journal_size = journal_column.length;

    for (let i = 0; i < journal_size; i++) {
        let glcodes = document.querySelector('input[name="field-select-type[' + i + ']"]:checked').value;
        
        let field_glcode = 0;
        let field_account_number = 0;
        let field_debit;
        if(glcodes === 'glcode') {
            field_debit = false;
            if(field_glcode = document.querySelectorAll('select[name="field-glcode"]')[i].value != '') {
                field_glcode = document.querySelectorAll('select[name="field-glcode"]')[i].value;
            } else {
                errorMessage += '<p>Select the appropriate GL Account in Leg ' + (i+1) +'</p>';
                errorCount += 1;
            }
        } else if (glcodes === 'customer-account-number') {
            field_debit = true;
            if(document.querySelectorAll('input[name="field-customer-account-number"]')[i].value !== '') {
                field_account_number = document.querySelectorAll('input[name="field-customer-account-number"]')[i].value;
            } else {
                errorMessage += '<p>Enter the appropriate Customer Account Number in Leg ' + (i+1) +'</p>';
                errorCount += 1;
            }
        }

        let deposit_accounts;
        if(document.querySelector('input[name="deposit-accounts['  + i + ']"]:checked')) {
            deposit_accounts = document.querySelector('input[name="deposit-accounts['  + i + ']"]:checked').value;
        } else {
            errorMessage += '<p>Select whether it is a deposit account in Leg ' + (i+1) +'</p>';
            errorCount += 1;
        }
        
        let field_amount
        if(document.querySelectorAll('input[name="field-amount"]')[i].value !== '') {
            field_amount = document.querySelectorAll('input[name="field-amount"]')[i].value;
        } else {
            errorMessage += '<p>Enter the amount in Leg ' + (i+1) +'</p>';
            errorCount += 1;
        }

        let field_narration
        if(document.querySelectorAll('textarea[name="field-narration"]')[i].value !== '') {
            field_narration = document.querySelectorAll('textarea[name="field-narration"]')[i].value;
        } else {
            errorMessage += '<p>Is Debit account empty in Leg ' + (i+1) +'</p>';
            errorCount += 1;
        }


        if(errorCount <= 0) {
            const field_data = {
                "glCode": parseInt(field_glcode),
                "customerAccountNumber": parseInt(field_account_number),
                "narration": field_narration,
                "amount": parseInt(field_amount) * 100,
                "debit": field_debit === 'true' ? true : false,
                "Tags": {},
                "isDepositAccount": deposit_accounts === 'true' ? true  : false
            }

            legs.push(field_data);
        }
    }

    if(errorCount > 0) {
        document.getElementById("failed-message").style.display = 'block';
        document.getElementById("failed-message").innerHTML = errorMessage;
        return;
    }
    
    let data = {
        "poster": poster,
        "entryType": 2,
        "subType": 0,
        "forceOD": force_overdrawn,
        "tags": {},
        "legs": legs,
        "valueDate": value_date
    }

    const _this = this;

    let request = await cbrRequest('/transaction', 'POST', true);
    
    request.onload = function () {
        let data = JSON.parse(this.response)
    
        if (request.status >= 200 && request.status < 400) {
            _this.reset();
            const success_message = data.message;
            
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
    
    let gls_array = [];
async function getGLCode(){
    let request = await cbrRequest('/gl-flat', 'GET', true)

        request.onload = function () {
        let data = JSON.parse(this.response)
        let counter = 0;
        if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(this.response);
                            
                    data.data.forEach((gl, index) => {
                        newGls_array = gl.gLCode;
                    gls_array.push(newGls_array);
                });                
        }
    }
            
    request.send();
}

function checkGLCode(){
    let inputGLCode=parseInt($(this).val());
    
    $(this).parents('.glcode-container').find('.glcode_error').css('display', 'none');
    if (gls_array.includes(inputGLCode)){
        $(this).parents('.glcode-container').find('.glcode_error').css('display', 'none');
    }else{
    $(this).parents('.glcode-container').find('.glcode_error').css('display', 'block');
        $(this).siblings('.glcode_error').html('<small class="text-danger small">GL Code is wrong !</small>');
    };
}
    
    
window.addEventListener("firebaseIsReady", function() {
    getGLCode();
    const addExtraLeg = document.getElementById("button-add-extra-legs");
    addExtraLeg.addEventListener('click', addExtraLegFunction); 
        
    $(document).on('change', '.select-option-type', toggleGLType);
    $(document).on('keyup', '.glcode', checkGLCode);
    $(document).on('click', '.button-remove-extra-legs', removeExtraLegFunction);
});