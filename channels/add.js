function getAllChannelTypes() {
    let request = cbrRequest('/channel-types', 'GET', true)
    let channel_types_array = [];
    let channel_categories_array = [];
    let channel_fee_type_array = [];
    request.onload = function () {
        let data = JSON.parse(this.response)
        let counter = 0;
        if (request.status >= 200 && request.status < 400) {
            
            const types = data.data.types ? data.data.types : null;

            if(types) {
                for(type in types) {
                    channel_types_array.push(types[type]);
                }

                let element_el = document.getElementById("field-channel-type");

                appendToChannelType(channel_types_array, element_el);
            }

            const categories = data.data.categories ? data.data.categories : null;

            if(categories) {
                for(category in categories) {
                    channel_categories_array.push(categories[category]);
                }

                let element_el = document.getElementById("field-channel-category");

                appendToChannelType(channel_types_array, element_el);
            }

            const channel_types = data.data.fee_and_cost_types ? data.data.fee_and_cost_types : null;

            if(channel_types) {
                for(channel_type in channel_types) {
                    channel_fee_type_array.push(channel_types[channel_type]);
                }

                let channel_fee_type_costs_els = document.getElementById("field-channel-fee-type");
                appendToChannelType(channel_fee_type_array, channel_fee_type_costs_els);
                let channel_cost_type_costs_els = document.getElementById("field-channel-cost-type");
                appendToChannelType(channel_fee_type_array, channel_cost_type_costs_els);
            }
        }
    }

    request.send();

}

function createNewChannel(e) {
    //get all the submitted information
    e.preventDefault();
    e.stopPropagation();

    document.getElementById("failed-message").style.display = 'none';
    document.getElementById("success-message").style.display= 'none';
    
    let formData = new FormData(this);
    let inflow = formData.get('field-inflow') === 'true';
    let name = formData.get('field-name');
    let channel = formData.get('field-channel');
    let type = formData.get('field-type');
    let wallet_glid = formData.get('field-wallet');
    let fee_glid = formData.get('field-fee');
    let cost_glid = formData.get('field-cost');

    //get channel fee details
    let channel_fee_name = formData.get('field-channel-fee-name');
    let channel_fee_type = formData.get('field-channel-fee-type');
    let channel_fee_percentage = parseInt(formData.get('field-channel-fee-percentage')) * 100; //multiply channel by 100
    let channel_fee_flat_amount = formData.get('field-channel-fee-flat-amount');
    let channel_fee_hidden = formData.get('channel-hidden') === 'true'
    let channel_fee_cap = formData.get('channel-fee-cap');

    const channel_fee_ranges_column = document.querySelectorAll('.channel-fee-ranges-column');
    let fee_range_size = channel_fee_ranges_column.length;

    for (let i = 0; i < fee_range_size; i++) {
        
    }

    //get channel cost details
    let channel_cost_name = formData.get('field-channel-cost-name');
    let channel_cost_type = formData.get('field-channel-cost-type');
    let channel_cost_percentage = parseInt(formData.get('field-channel-cost-percentage')) * 100; //multiply channel by 100
    let channel_cost_flat_amount = formData.get('field-channel-cost-flat-amount');
    let channel_cost_hidden = formData.get('channel-hidden') === 'true'
    let channel_cost_cap = formData.get('channel-fee-cap');

    let active = true;
    
    //validations
    let error_count = 0;
    let error_message = '';

    if(firstName == '') {
    error_message += 'First Name cannot be empty <br />';
    error_count++;
    }

    if(lastName == '') {
    error_message += 'Last Name cannot be empty <br />';
    error_count++;
    }

    if(phoneNumber == '') {
    error_message += 'Phone Number cannot be empty <br />';
    error_count++;
    }

    if(email == '') {
    error_message += 'Email cannot be empty <br />';
    error_count++;
    }

    if(!ValidateEmail(email)) {
    error_message += 'Please enter a valid email <br />';
    error_count++;
    }

    if(error_count > 0) {
        document.getElementById("failed-message").style.display = 'block';
        document.getElementById("failed-message").innerHTML = error_message;
        return;
    }
    
    let data = {
    "firstName": firstName,
    "lastName": lastName,
    "email": email,
    "phone": phoneNumber,
    }

    const _this = this;
    
    let request = cbrRequest(`/admin/user`, 'POST', true)
    
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

function getGLAccounts() {
    let request = cbrRequest('/gl-flat', 'GET', true)
    
    
    request.onload = function() {
        
    if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(this.response);
            parent_gls = data.data;
            
            let parent_gl_select_el = document.getElementById("field-wallet");
            filterGL(1, parent_gl_select_el);
            
            parent_gl_select_el = document.getElementById("field-fee-glid");
            filterGL(3, parent_gl_select_el);

            parent_gl_select_el = document.getElementById("field-cost-glid");
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

function addExtraLegFunction(legs_parent, parent_element, event) {
    event.preventDefault();
    let leg_parent_clone = legs_parent.cloneNode(true);

    const ranges_column = document.querySelectorAll('.ranges-column');
    let size = ranges_column.length;
    const newsize = parseInt(size);

    let select_all_inputs = leg_parent_clone.querySelector('input');
    for(let i = 0; i < select_all_inputs.length; i++) {
        select_all_inputs[i].value = '';
        const name_attr = select_all_inputs[i].setAttribute('name')
        select_all_inputs[i].setAttribute('name', name_attr +'['+ newsize + ']');
    }

    leg_parent_clone.querySelector('.button-remove-extra-legs').setAttribute('style','display:block');
    leg_parent_clone.removeAttribute('id');
    leg_parent_clone.setAttribute('style','display:block');

    leg_parent_clone.querySelector('.button-remove-extra-legs').addEventListener('click', () => leg_parent_clone.remove());


    parent_element.appendChild(leg_parent_clone);
}

function effectFieldTypeChange(slug, event) {
    event.preventDefault();
    const value = event.target.value;
    console.log(value);

    document.getElementById('range-' + slug + '-legs-parents').setAttribute('style', 'display: none');
    document.querySelectorAll('field-' + slug +'-or-percentaage').forEach((element, index) => {
        element.style.display = 'block';
    });
    document.querySelector('.field-' + slug + '-title-options-cap p').textContent = 'Option Cap';
    document.querySelectorAll('.field-' + slug +'-options-cap').forEach((element, index) => {
        element.placeholder = 'Enter Option Cap Value'
    })

    if(!['flat', 'percentage'].includes(value)) {
        document.getElementById('range-' + slug +'-legs-parents').setAttribute('style', 'display: block');
    }

    if(!['range-percent', 'option-percent type'].includes(value)) {
        document.querySelectorAll('field-' + slug +'-or-percentaage').forEach((element, index) => {
            element.style.display = 'none';
        });
    }

    if(!['range-combo', 'options-combo'].includes(value)) {
        document.querySelector('.field-' + slug +'-title-options-cap p').textContent = 'Flat amount';
        document.querySelectorAll('.field-' + slug +'-options-cap').forEach((element, index) => {
            element.placeholder = 'Enter the Flat Amount'
        })
    }
}


document.addEventListener('DOMContentLoaded', () => {
    getGLAccounts();
    getAllChannelTypes();
    document.getElementById("button-add-extra-fee-legs").addEventListener('click', () => {
        const legs_parent = document.getElementById("cloned-fee-element");
        const leg_append = document.getElementById("range-fee-legs-parents");
        addExtraLegFunction(legs_parent, leg_append, event)
    });
    document.getElementById("button-add-extra-cost-legs").addEventListener('click', () => {
        const legs_parent = document.getElementById("cloned-cost-element");
        const leg_append = document.getElementById("range-cost-legs-parents");
        addExtraLegFunction(legs_parent, leg_append, event)
    });
    document.getElementById('field-channel-fee-type').addEventListener('change', () => {
        effectFieldTypeChange('fee', event)
    })
    document.getElementById('field-channel-cost-type').addEventListener('change', () => {
        effectFieldTypeChange('cost', event)
    })
    document.getElementById("wf-form-add-channel").addEventListener('submit', createNewChannel, true);
})