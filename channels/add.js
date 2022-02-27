function getAllChannelTypes() {
    let request = cbrRequest('/channel-types', 'GET', true)
    let channel_types_array = [];
    let channel_categories_array = [];
    let channel_fee_type_array = [];
    request.onload = function () {
        let data = JSON.parse(this.response)
        if (request.status >= 200 && request.status < 400) {
            
            const types = data.data.types ? data.data.types : null;

            if(types) {
                for(type in types) {
                    channel_types_array.push(types[type]);
                }

                let element_el = document.getElementById("field-channel-type");

                appendChannelTypesOptions(channel_types_array, element_el);
            }

            const categories = data.data.categories ? data.data.categories : null;

            if(categories) {
                for(category in categories) {
                    channel_categories_array.push(categories[category]);
                }

                let element_el = document.getElementById("field-channel-category");

                appendChannelTypesOptions(channel_types_array, element_el);
            }

            const channel_types = data.data.fee_and_cost_types ? data.data.fee_and_cost_types : null;

            if(channel_types) {
                for(channel_type in channel_types) {
                    channel_fee_type_array.push(channel_types[channel_type]);
                }

                let channel_fee_type_costs_els = document.getElementById("field-channel-fee-type");
                appendChannelTypesOptions(channel_fee_type_array, channel_fee_type_costs_els);
                
                let channel_cost_type_costs_els = document.getElementById("field-channel-cost-type");
                appendChannelTypesOptions(channel_fee_type_array, channel_cost_type_costs_els);
            }
        }
    }

    request.send();

}


function appendChannelTypesOptions(data, parent_gl_select_el = '', selected_value = null) {
    if(data != '' || data.length > 0) {
      data.forEach((item, index) => {
         let option = document.createElement("option");
  
            option.value= item;
            option.innerHTML = convertSlugToTitle(item);
  
            parent_gl_select_el.appendChild(option);
        });
     }
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
    let category = formData.get('field-channel');
    let type = formData.get('field-type');
    let wallet_glid = formData.get('field-wallet');
    let fee_glid = formData.get('field-fee');
    let cost_glid = formData.get('field-cost');

    //get channel fee details
    let channel_fee_name = formData.get('field-channel-fee-name');
    let channel_fee_type = formData.get('field-channel-fee-type');
    let channel_fee_percentage = parseInt(formData.get('field-channel-fee-percentage'))
    let channel_fee_flat_amount = formData.get('field-channel-fee-flat-amount');
    let channel_fee_hidden = formData.get('channel-fee-hidden') !== ''
    let channel_fee_cap = formData.get('channel-fee-cap');

    const channel_fee_ranges_column = document.querySelectorAll('.channel-fee-ranges-column');
    let fee_range_size = channel_fee_ranges_column.length;

    let fee_ranges = [];

    for (let i = 0; i < fee_range_size; i++) {
        let from_value = document.querySelectorAll('input[name="field-channel-fee-from"]')[i].value * 100; // in kobo
        let to_value = document.querySelectorAll('input[name="field-channel-fee-to"]')[i].value * 100; // in kobo
        let options_cap = document.querySelectorAll('input[name="field-channel-fee-option-cap"]')[i].value;
        let fee_or_percentage = document.querySelectorAll('input[name="field-channel-fee-fee-or-percent"]')[i].value;
        let range_type = channel_fee_type;
        let option = '';
        let flat_amount = '';

        let range_data = {
            "from": from_value,
            "to": to_value,
            "option": option,
            "option_cap": options_cap,
            "range_type": range_type,
            "flat_amount": flat_amount,
            "fee_or_percentage": fee_or_percentage
        };

        fee_ranges.push(range_data);

    }

    //get channel cost details
    let channel_cost_name = formData.get('field-channel-cost-name');
    let channel_cost_type = formData.get('field-channel-cost-type');
    let channel_cost_percentage = parseInt(formData.get('field-channel-cost-percentage'))
    let channel_cost_flat_amount = formData.get('field-channel-cost-flat-amount');
    let channel_cost_hidden = formData.get('channel-cost-hidden') === 'true'
    let channel_cost_cap = formData.get('channel-cost-cap');

    const channel_cost_ranges_column = document.querySelectorAll('.channel-cost-ranges-column');
    let cost_range_size = channel_cost_ranges_column.length;

    let cost_ranges = [];

    for (let i = 0; i < cost_range_size; i++) {
        let from_value = document.querySelectorAll('input[name="field-channel-cost-from"]')[i].value * 100; // in kobo
        let to_value = document.querySelectorAll('input[name="field-channel-cost-to"]')[i].value * 100; // in kobo
        let options_cap = document.querySelectorAll('input[name="field-channel-cost-option-cap"]')[i].value;
        let fee_or_percentage = document.querySelectorAll('input[name="field-channel-cost-fee-or-percent"]')[i].value;
        let range_type = channel_fee_type;
        let option = '';
        let flat_amount = '';

        let range_data = {
            "from": from_value,
            "to": to_value,
            "option": option,
            "option_cap": options_cap,
            "range_type": range_type,
            "flat_amount": flat_amount,
            "fee_or_percentage": fee_or_percentage
        };

        cost_ranges.push(range_data);

    }

    let active = true;
    
    //validations
    let error_count = 0;
    let error_message = '';

    if(name == '') {
        error_message += '<p>Name cannot be empty </p>';
        error_count++;
    }

    if(category.length < 3) {
        error_message += '<p>Select a Category. </p>';
        error_count++;
    }

    if(type.length < 3) {
        error_message += '<p> Select a channel type </p>';
        error_count++;
    }

    if(wallet_glid.length < 3) {
        error_message += '<p> Wallet GLID cannot be empty </p>';
        error_count++;
    }

    if(fee_glid.length < 3) {
        error_message += '<p>Field  GLID cannot be empty </p>';
        error_count++;
    }

    if(cost_glid.length < 3) {
        error_message += '<p>Cost  GLID cannot be empty </p>';
        error_count++;
    }


    if(error_count > 0) {
        document.getElementById("failed-message").style.display = 'block';
        document.getElementById("failed-message").innerHTML = error_message;
        return;
    }


    //conditions to check

    if(channel_fee_type === 'flat' || channel_fee_type === 'percentage') {
        fee_ranges = null;
    }

    if(channel_cost_type === 'flat' || channel_cost_type === 'percentage') {
        cost_ranges = null;
    }

    //mutiply the percentages by 100
    channel_fee_percentage *= 100;
    channel_cost_percentage *= 100;

    //flat amount in kobo
    channel_fee_flat_amount *= 100;
    channel_cost_flat_amount *= 100;
    for(fee_range in fee_ranges) {

    }

    

    const channel_fee_data = {
        "name": channel_fee_name,
        "channel_id": "",
        "type": channel_fee_type,
        "percentage": channel_fee_percentage,
        "flat_amt": channel_fee_flat_amount,
        "hidden": channel_fee_hidden,
        "ranges": fee_ranges,
        "cap": channel_fee_cap
    }

    const channel_cost_data = {
        "name": channel_cost_name,
        "channel_id": "",
        "type": channel_cost_type,
        "percentage": channel_cost_percentage,
        "flat_amt": channel_cost_flat_amount,
        "hidden": channel_cost_hidden,
        "ranges": cost_ranges,
        "cap": channel_cost_cap
    }

    
    let data = {
        "inflow": inflow,
        "name": name,
        "category": category,
        "type": type,
        "active": active,
        "wallet_glid": wallet_glid,
        "fee_glid": fee_glid,
        "cost_glid": cost_glid,
        "channel_fee": channel_fee_data
    }

    connsole.log(data);
    return;

    const _this = this;
    
    let request = cbrRequest('/channels', 'POST', true)
    
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

    document.getElementById('range-' + slug + '-legs-parents').setAttribute('style', 'display: none');
    document.querySelectorAll('.field-' + slug +'-or-percentaage').forEach((element, index) => {
        element.style.display = 'block';
    });
    document.querySelector('.field-' + slug + '-title-options-cap p').textContent = 'Option Cap';
    document.querySelectorAll('.field-' + slug +'-options-cap').forEach((element, index) => {
        element.placeholder = 'Enter Option Cap Value'
    });
    document.querySelector('.field-' + slug + '-range-flat').style.display = 'none';
    document.querySelector('.' + slug + '-percentage-container').style.display = 'none';
    document.querySelector('.' + slug + '-flat-amount-container').style.display = 'none';

    document.querySelector('#field-channel-'+slug +'-options').style.display = 'none';
    document.querySelector('#field-channel-' + slug + '-from').style.display = 'block';

    if('flat' === value) {
        document.querySelector('.' + slug + '-percentage-container').style.display = 'none';
        document.querySelector('.' + slug + '-flat-amount-container').style.display = 'block';
    }

    if('percentage' === value) {
        document.querySelector('.' + slug + '-percentage-container').style.display = 'block';
        document.querySelector('.' + slug + '-flat-amount-container').style.display = 'none';
    }

    if(['flat', 'percentage'].includes(value)) {
        document.getElementById('range-' + slug +'-legs-parents').setAttribute('style', 'display: none');
    } else {
        document.querySelector('.range' + slug +'-legs-parents').setAttribute('style', 'display:block');
    }

    if(!['range-percent', 'range-flat', 'options-percent'].includes(value)) {
        document.querySelectorAll('.field-' + slug +'-or-percentaage').forEach((element, index) => {
            element.style.display = 'none';
        });
    }

    if(['options-percent', 'options-flat'].includes(value)) {
        document.querySelector('#field-channel-' + slug + '-from').style.display = 'none';
        document.querySelectorAll('.' + slug +'-range-title-from-to')[0].innerHTML = 'Options';
        document.querySelector('#field-channel-'+slug +'-options').style.display = 'block';
    }

    if('range-flat' === value) {
        document.querySelector('.field-' + slug +'-title-options-cap p').textContent = 'Flat amount';
        document.querySelector('.field-' + slug + 'range-flat').style.display = 'block';
    }

    if(['range-combo', 'options-combo'].includes(value)) {
        document.querySelector('.field-' + slug +'-or-percentaage').style.display = 'block';
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