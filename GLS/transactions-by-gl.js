let parent_gls = [];
count_leg = 1;

function toggleGLType(event) {
    const value = $(this).find('input').val();

    $(this).parents('.journal-column').find('.glcode-container').css('display', 'none');;
    $(this).parents('.journal-column').find('.customer-account-address-container').css('display', 'none');;

    if(value === 'glcode') {
        $(this).parents('.journal-column').find('.glcode-container').css('display', 'block');
    } else if(value === 'customer-account-number') {
        $(this).parents('.journal-column').find('.customer-account-address-container').css('display', 'block');
    }
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
        select_options[i].setAttribute('name', 'field-select-type['+ newsize + ']');
    }

    let deposit_accounts = leg_parent_clone.querySelectorAll('input.deposit-accounts');
    let deposit_accounts_size = deposit_accounts.length;
    for (let i = 0; i < deposit_accounts_size; i++) {
        deposit_accounts[i].setAttribute('name', 'deposit-accounts['+ newsize + ']');
    }

    leg_parent_clone.removeAttribute('id');
    leg_parent_clone.setAttribute('style','display:block');


    document.getElementById("journal-legs-parents").appendChild(leg_parent_clone);
    return;
}

// function initiateFirstLeg() {
//     const legs_parent = document.getElementById("cloned-element");
//     let leg_parent_clone = legs_parent.cloneNode(true);
//     const journal_column = document.querySelectorAll('.journal-column');
//     let size = journal_column.length;
//     const newsize = parseInt(size) + 1;

    
//     let select_options = leg_parent_clone.querySelectorAll('input.journal-select-options');
//     let select_options_size = select_options.length;
//     for (let i = 0; i < select_options_size; i++) {
//         select_options[i].setAttribute('name', 'field-select-type['+ newsize + ']');
//     }

//     let deposit_accounts = leg_parent_clone.querySelectorAll('input.deposit-accounts');
//     let deposit_accounts_size = deposit_accounts.length;
//     for (let i = 0; i < deposit_accounts_size; i++) {
//         deposit_accounts[i].setAttribute('name', 'deposit-accounts['+ newsize + ']');
//     }

//     leg_parent_clone.removeAttribute('id');
//     leg_parent_clone.setAttribute('style','display:block');

//     document.getElementById("journal-legs-parents").appendChild(leg_parent_clone);
// }

const createJournal = document.getElementById("wf-form-new-journal")
createJournal.addEventListener('submit', addNewJournalEntry);

function addNewJournalEntry(e) {
    //get all the submitted information
    e.preventDefault();
    let legs = {};
    
    let formData = new FormData(this);
    let poster = formData.get('field-poster');
    let entry_type = formData.get('field-entry-type');
    let force_overdrawn = formData.get('field-force-overdrawn');
    let value_date = formData.get('field-value-date');
    

    //get all legs
    legs_array = [];

    
    if(value_date != '') {
        value_date = moment(value_date, "DD-MMM-YYYY", true).format('DD-MMM-YYYY-h-mm-ss')
    }
    
    if(force_overdrawn === 'true') {
        force_overdrawn = true;
    } else force_overdrawn = false;

    const journal_column = document.querySelectorAll('.journal-column');
    let journal_size = journal_column.length;
    console.log(journal_size);
    for (let i = 0; i < journal_size; i++) {
        console.log(journal_column[i]);
        let glcodes = document.querySelector('input[name="field-select-type[' + i + ']"]:checked').value;
        
        let field_glcode = '';
        let field_account_number = 0;
        if(glcodes === 'glcode') {
            let field_glcode = journal_column[i].getElementsByName('field-glcode').value;
        } else if (glcodes === 'customer-account-number') {
            let field_account_number = journal_column[i].getElementsByName('field-customer-account-number').value;
        }

        let deposit_accounts = document.querySelector('input[name="deposit-accounts['  + i + '"]:checked').value;

        let field_amount = journal_column[i].getElementsByName('field-amount');
        let field_debit = journal_column[i].getElementsByName('field-debit');
        let field_narration = journal_column[i].getElementsByName('field-narration');

        const field_data = {
            "glCode": field_glcode,
            "customerAccountNumber": field_account_number,
            "narration": field_narration,
            "amount": field_amount,
            "debit": field_debit === 'true' ? true : false,
            "isDepositAccount": deposit_accounts === 'true' ? true  : false
        }

        console.log(field_data);

    }



    // let radio_glcodes_options = document.getElementsByName('field-select-type');
    // for(let radio_glcodes_option of radio_glcodes_options) {
    //     console.log(radio_glcodes_option);
    //     if(radio_glcodes_option.checked) {
    //         console.log(radio_glcodes_option.value);
    //     }
    // }
    
    
    
    let data = {
        "poster": poster,
        "entryType": parseInt(entry_type),
        "subType": 0,
        "forceOD": force_overdrawn,
        "tags": {},
        "valueDate": value_date
    }
    
    console.log(data);

    return;

}

function getGLAccounts() {

    let request = cbrRequest('/gl-flat', 'GET', true)
    let gls_array = [];

    // When the 'request' or API request loads, do the following...
    request.onload = function () {
    let data = JSON.parse(this.response)
    let counter = 0;
    if (request.status >= 200 && request.status < 400) {
        let data = JSON.parse(this.response);

        parent_gls = data.data;
        console.log(parent_gls.length);
        filterGL();
        }
    }

    request.send();

}

function filterGL(type = '') {
    const parent_gl_select_el = document.getElementsByClassName("glcode-selector");
    
    if(parent_gls.length > 0) {
    let option = document.createElement("option");

    for(let  i = 0; i < parent_gl_select_el.length; i++) {
        parent_gls.forEach((gl, index) => {
        let option = document.createElement("option");

        option.value= gl.id;
        option.innerHTML = gl.name;


        parent_gl_select_el[i].appendChild(option);
        });
        }
    }
}

window.addEventListener("firebaseIsReady", function() {
    getGLAccounts();
    // initiateFirstLeg();
    const addExtraLeg = document.getElementById("button-add-extra-legs");
    addExtraLeg.addEventListener('click', addExtraLegFunction); 
    document.querySelector('.select-option-type').addEventListener('change', toggleGLType);
    // $(document).on('change', '.select-option-type', toggleGLType);
});
