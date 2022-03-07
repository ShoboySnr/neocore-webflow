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

                appendChannelTypesOptions(channel_categories_array, element_el);
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
    let category = formData.get('field-channel-category');
    let type = formData.get('field-channel-type');
    let wallet_glid = formData.get('field-wallet');
    let fee_glid = formData.get('field-fee-glid');
    let cost_glid = formData.get('field-cost-glid');

    //get channel fee details
    let channel_fee_name = formData.get('field-channel-fee-name');
    let channel_fee_type = document.querySelector('select[name="field-channel-fee-type"]').value;
    let channel_fee_flat_amount = 0;
    let channel_fee_percentage = 0;
    let channel_fee_hidden = formData.get('channel-fee-hidden') !== ''
    let channel_fee_cap = formData.get('field-channel-fee-cap');

    if(channel_fee_type === 'flat') {
        channel_fee_flat_amount = formData.get('field-channel-fee-flat-amount');
    }

    if(channel_fee_type === 'percent') {
        channel_fee_percentage =  formData.get('field-channel-fee-percentage');
    }

    const channel_fee_ranges_column = document.querySelectorAll('.ranges-fee-column');
    let fee_range_size = channel_fee_ranges_column.length;

    let fee_ranges = [];

    for (let i = 0; i < fee_range_size; i++) {
        let from_value = 0;
        let to_value = 0;
        let option = '';
        let option_cap = 0;
        let flat_amount = 0;
        let is_percentage = false;
        let fee_or_percentage = 0;
        let range_type = channel_fee_type;

        if(channel_fee_type == 'flat' || channel_fee_type == 'percent') {
            from_value = 0;
            to_value = 0;
            option = '';
            option_cap = 0;
            is_percentage = false;
            fee_or_percentage = 0;

            let range_data = {
                "from": from_value, "to": to_value, option, "option_cap": parseInt(option_cap), is_percentage, fee_or_percentage, range_type
            }

            fee_ranges.push(range_data);
            break;
        } else {
            if(channel_fee_type == 'range-percent') {
                is_percentage = true;
                from_value = document.querySelectorAll('input[name="field-channel-fee-from"]')[i].value * 100; // in kobo
                to_value = document.querySelectorAll('input[name="field-channel-fee-to"]')[i].value * 100; // in kobo
                fee_or_percentage = document.querySelectorAll('input[name="field-channel-fee-range-percentage"]')[i].value * 100;
            }

            if(channel_fee_type == 'range-flat') {
                from_value = document.querySelectorAll('input[name="field-channel-fee-from"]')[i].value * 100; // in kobo
                to_value = document.querySelectorAll('input[name="field-channel-fee-to"]')[i].value * 100; // in kobo
                fee_or_percentage = document.querySelectorAll('input[name="field-channel-fee-range-flat"]')[i].value * 100;
            }

            if(channel_fee_type === 'options-percent') {
                is_percentage = true;
                option = document.querySelectorAll('input[name="field-channel-fee-options"]')[i].value;
                option_cap = document.querySelectorAll('input[name="field-channel-fee-option-cap"]')[i].value;
                fee_or_percentage = document.querySelectorAll('input[name="field-channel-fee-range-percentage"]')[i].value * 100;
            }

            if(channel_fee_type === 'options-flat') {
                option = document.querySelectorAll('input[name="field-channel-fee-options"]')[i].value;
                option_cap = document.querySelectorAll('input[name="field-channel-fee-option-cap"]')[i].value;
                fee_or_percentage = document.querySelectorAll('input[name="field-channel-fee-range-flat"]')[i].value * 100;
            }

            if(channel_fee_type === 'range-combo') {
                option = document.querySelectorAll('input[name="field-channel-fee-options"]')[i].value;
                option_cap = document.querySelectorAll('input[name="field-channel-fee-option-cap"]')[i].value;
                flat_amount = document.querySelectorAll('input[name="field-channel-fee-range-flat"]')[i].value * 100;
                fee_or_percentage = document.querySelectorAll('input[name="field-channel-fee-range-percentage"]')[i].value * 100;
            }

            let range_data = {
                "from": from_value, "to": to_value, option, "option_cap": parseInt(option_cap), is_percentage, fee_or_percentage, range_type
            }

            fee_ranges.push(range_data);
        }
    }

    //get channel cost details
    let channel_cost_name = formData.get('field-channel-cost-name');
    let channel_cost_type = document.querySelector('select[name="field-channel-cost-type"]').value;
    let channel_cost_percentage = 0;
    let channel_cost_flat_amount = 0;
    let channel_cost_hidden = formData.get('channel-cost-hidden') === 'true'
    let channel_cost_cap = formData.get('field-channel-cost-cap');

    if(channel_cost_type === 'flat') {
        channel_cost_flat_amount = formData.get('field-channel-cost-flat-amount');
    }

    if(channel_cost_type === 'percent') {
        channel_cost_percentage = formData.get('field-channel-cost-percentage');
    }

    const channel_cost_ranges_column = document.querySelectorAll('.ranges-cost-column');
    let cost_range_size = channel_cost_ranges_column.length;


    let cost_ranges = [];

    for (let i = 0; i < cost_range_size; i++) {
        let from_value = 0;
        let to_value = 0;
        let option = '';
        let option_cap = 0;
        let is_percentage = false;
        let fee_or_percentage = 0;
        let range_type = channel_cost_type;

        if(channel_cost_type == 'flat' || channel_cost_type == 'percent') {
            from_value = 0;
            to_value = 0;
            option = '';
            option_cap = 0;
            is_percentage = false;
            fee_or_percentage = 0;

            let range_data = {
                "from": from_value, "to": to_value, option, "option_cap": parseInt(option_cap), is_percentage, fee_or_percentage, range_type
            }

            cost_ranges.push(range_data);
            break;
        } else {
            if(channel_cost_type == 'range-percent') {
                is_percentage = true;
                from_value = document.querySelectorAll('input[name="field-channel-cost-from"]')[i].value * 100; // in kobo
                to_value = document.querySelectorAll('input[name="field-channel-cost-to"]')[i].value * 100; // in kobo
                fee_or_percentage = document.querySelectorAll('input[name="field-channel-cost-range-percentage"]')[i].value * 100;
            }

            if(channel_cost_type == 'range-flat') {
                from_value = document.querySelectorAll('input[name="field-channel-cost-from"]')[i].value * 100; // in kobo
                to_value = document.querySelectorAll('input[name="field-channel-cost-to"]')[i].value * 100; // in kobo
                fee_or_percentage = document.querySelectorAll('input[name="field-channel-cost-range-flat"]')[i].value * 100;
            }

            if(channel_cost_type === 'options-percent') {
                is_percentage = true;
                option = document.querySelectorAll('input[name="field-channel-cost-options"]')[i].value;
                option_cap = document.querySelectorAll('input[name="field-channel-cost-option-cap"]')[i].value;
                fee_or_percentage = document.querySelectorAll('input[name="field-channel-cost-range-percentage"]')[i].value * 100;
            }

            if(channel_cost_type === 'options-flat') {
                option = document.querySelectorAll('input[name="field-channel-cost-options"]')[i].value;
                option_cap = document.querySelectorAll('input[name="field-channel-cost-option-cap"]')[i].value;
                fee_or_percentage = document.querySelectorAll('input[name="field-channel-cost-range-flat"]')[i].value * 100;
            }

            if(channel_cost_type === 'range-combo') {
                option = document.querySelectorAll('input[name="field-channel-cost-options"]')[i].value;
                option_cap = document.querySelectorAll('input[name="field-channel-cost-option-cap"]')[i].value;
                flat_amount = document.querySelectorAll('input[name="field-channel-cost-range-flat"]')[i].value * 100;
                fee_or_percentage = document.querySelectorAll('input[name="field-channel-cost-range-percentage"]')[i].value * 100;
            }

            let range_data = {
                "from": from_value, "to": to_value, option, "option_cap": parseInt(option_cap), is_percentage, fee_or_percentage, range_type
            }

            cost_ranges.push(range_data);
        }
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

    if(channel_fee_type === 'flat' || channel_fee_type === 'percent') {
        fee_ranges = null;
    }

    if(channel_cost_type === 'flat' || channel_cost_type === 'percent') {
        cost_ranges = null;
    }

    //mutiply the percentages by 100
    channel_fee_percentage *= 100;
    channel_cost_percentage *= 100;

    //flat amount in kobo
    channel_fee_flat_amount *= 100;
    channel_cost_flat_amount *= 100;

    

    const channel_fee_data = {
        "name": channel_fee_name,
        "channel_id": "",
        "type": channel_fee_type,
        "percentage": channel_fee_percentage,
        "flat_amt": channel_fee_flat_amount,
        "hidden": channel_fee_hidden,
        "ranges": fee_ranges,
        "cap": parseInt(channel_fee_cap)
    }

    const channel_cost_data = {
        "name": channel_cost_name,
        "channel_id": "",
        "type": channel_cost_type,
        "percentage": channel_cost_percentage,
        "flat_amt": channel_cost_flat_amount,
        "hidden": channel_cost_hidden,
        "ranges": cost_ranges,
        "cap": parseInt(channel_cost_cap)
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
        "channel_fee": channel_fee_data,
        "channel_cost": channel_cost_data
    }

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

function addExtraLegFunction(legs_parent, parent_element, slug, event) {
    event.preventDefault();

    let leg_parent_clone = legs_parent.cloneNode(true);

    const ranges_column = document.querySelectorAll('.ranges-' + slug + '-column');
    document.getElementById('field-channel-'+ slug + '-type').removeAttribute('disabled');

    if(ranges_column.length > 0) {
        document.getElementById('field-channel-'+ slug + '-type').setAttribute('disabled', true);
    } 

    let size = ranges_column.length;
    const newsize = parseInt(size);

    let select_all_inputs = leg_parent_clone.querySelectorAll('input');
    for(let i = 0; i < select_all_inputs.length; i++) {
        select_all_inputs[i].value = '';
        const name_attr = select_all_inputs[i].getAttribute('name')
        select_all_inputs[i].setAttribute('name', name_attr +'['+ newsize + ']');
        select_all_inputs[i].setAttribute('value', '');
    }

    leg_parent_clone.querySelector('.button-' + slug +'-remove-extra-legs').setAttribute('style','display:block');
    leg_parent_clone.removeAttribute('id');
    leg_parent_clone.setAttribute('style','display:block');

    leg_parent_clone.querySelector('.button-' + slug +'-remove-extra-legs').addEventListener('click', () => {
        leg_parent_clone.remove();
        const ranges_column_el = document.querySelectorAll('.ranges-' + slug + '-column');

        document.getElementById('field-channel-'+ slug + '-type').removeAttribute('disabled');

        if(ranges_column_el.length > 1) {
            document.getElementById('field-channel-'+ slug + '-type').setAttribute('disabled', true);
        } 
    });




    parent_element.appendChild(leg_parent_clone);
}

function effectFieldTypeChange(slug, event) {
    event.preventDefault();
    const ranges_column = document.querySelectorAll('.ranges-' + slug + '-column');

    document.getElementById('field-channel-'+ slug + '-type').removeAttribute('disabled');
    console.log(document.querySelectorAll('.button-' + slug +'-remove-extra-legs').length);
    
    if(document.querySelectorAll('.button-' + slug +'-remove-extra-legs').length > 1) {
        document.getElementById('field-channel-'+ slug + '-type').setAttribute('disabled', true);
        return;
    }

    const value = event.target.value;

    document.getElementById('range-' + slug + '-legs-parents').setAttribute('style', 'display: none');
    document.querySelector('.field-' + slug + '-range-percent').style.display = 'none';
    document.querySelector('.field-' + slug + '-options-cap').style.display = 'none';
    document.getElementById('field-channel-' + slug + '-to').style.display = 'none';
    document.getElementById('field-channel-' + slug + '-from').style.display = 'none';
    document.querySelector('.' + slug +'-to-container p').textContent = 'To';
    document.querySelector('.' + slug +'-from-container p').textContent = 'From';
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
        document.getElementById('range-' + slug +'-legs-parents').setAttribute('style', 'display:block');
    }

    if(value.includes('options')) {
        document.querySelector('.field-' + slug + '-options-cap').style.display = 'block';
        document.querySelector('#field-channel-' + slug + '-from').style.display = 'none';
        document.querySelector('.' + slug +'-to-container p').textContent = 'Options Cap';
        document.querySelector('#field-channel-'+slug +'-options').style.display = 'block';
        document.querySelector('.' + slug +'-from-container p').textContent = 'Options';
    } else {
        document.getElementById('field-channel-' + slug + '-to').style.display = 'block';
        document.getElementById('field-channel-' + slug + '-from').style.display = 'block';
    }

    if(['range-flat', 'options-flat'].includes(value)) {
        document.querySelector('.field-' + slug +'-title-options-cap p').textContent = 'Flat amount';
        document.querySelector('.field-' + slug + '-range-flat').style.display = 'block';
    }

    if(['range-percent', 'options-percent'].includes(value)) {
        document.querySelector('.field-' + slug +'-title-options-cap p').textContent = 'Percentage amount';
        document.querySelector('.field-' + slug + '-range-percent').style.display = 'block';
    }

    if(value.includes('combo')) {
        document.querySelector('.field-' + slug +'-title-options-cap p').textContent = 'Flat amount and Percentage';
        document.querySelector('.field-' + slug + '-range-flat').style.display = 'block';
        document.querySelector('.field-' + slug + '-range-percent').style.display = 'block';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    getGLAccounts();
    getAllChannelTypes();
    document.getElementById("button-add-extra-fee-legs").addEventListener('click', () => {
        const legs_parent = document.getElementById("cloned-fee-element");
        const leg_append = document.getElementById("append-fee-column");
        addExtraLegFunction(legs_parent, leg_append, 'fee', event)
    });
    document.getElementById("button-add-extra-cost-legs").addEventListener('click', () => {
        const legs_parent = document.getElementById("cloned-cost-element");
        const leg_append = document.getElementById("append-cost-column");
        addExtraLegFunction(legs_parent, leg_append, 'cost', event)
    });
    document.getElementById('field-channel-fee-type').addEventListener('change', () => {
        effectFieldTypeChange('fee', event)
    })
    document.getElementById('field-channel-cost-type').addEventListener('change', () => {
        effectFieldTypeChange('cost', event)
    })
    document.getElementById("wf-form-add-channel").addEventListener('submit', createNewChannel, true);
})