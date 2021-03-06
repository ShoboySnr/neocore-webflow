
async function getAllChannelTypes() {

    let request = await cbrRequest('/channel-types', 'GET', true)
    let channel_types_array = [];

    // When the 'request' or API request loads, do the following...
    request.onload = function () {
    let data = JSON.parse(this.response)
    let counter = 0;
    if (request.status >= 200 && request.status < 400) {
        
        const types = data.data.types ? data.data.types : null;

        if(types) {
            for(type in types) {
                channel_types_array.push(types[type]);
            }
        }

        const categories = data.data.categories ? data.data.categories : null;

        if(categories) {
            for(category in categories) {
                channel_types_array.push(categories[category]);
            }
        }

        const fee_and_cost_types = data.data.fee_and_cost_types ? data.data.fee_and_cost_types : null;

        if(fee_and_cost_types) {
            for(fee_and_cost_type in fee_and_cost_types) {
                channel_types_array.push(fee_and_cost_types[fee_and_cost_type]);
            }
        }

        const channel_transaction_statuses = data.data.channel_transaction_statuses ? data.data.channel_transaction_statuses : null;

        if(channel_transaction_statuses) {
            for(channel_transaction_status in channel_transaction_statuses) {
                channel_types_array.push(channel_transaction_statuses[channel_transaction_status]);
            }
        }

            appendToChannelType(channel_types_array);
        }
    }

    request.send();

}

function appendToChannelType(types) {
    const parent_channel_type_select_el = document.getElementById("types-categories");
    
    if(types.length > 0) {
        let option = document.createElement("option");
        types.forEach((type, index) => {
            let option = document.createElement("option");
            option.value= type;
            option.innerHTML = convertSlugToTitle(type);
            parent_channel_type_select_el.appendChild(option);
        });
    }
}

async function findTransactions(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById("failed-message").style.display = 'none';
    document.getElementById("success-message").style.display= 'none';
            
    const sample_custom_data = document.getElementsByClassName('requested-api-data');
    while(sample_custom_data.length > 0){
        sample_custom_data[0].parentNode.removeChild(sample_custom_data[0]);
    }

    let formData = new FormData(this);
    let types_categories = formData.get('types-categories');
    let date_from = formData.get('field-date-from');
    let date_to = formData.get('field-date-to');
    let status = formData.get('channel-status') === 'true';
    let errorMessage = '', errorCount = 0;

    if(types_categories.length < 2) {
        errorMessage += '<p>Choose a particular channel type and category';
        errorCount += 1;
    }

    if(errorCount > 0) {
        document.getElementById("failed-message").style.display = 'block';
        document.getElementById("failed-message").innerHTML = errorMessage;
        return;
    }

    let request = await cbrRequest(`/channels/${types_categories}/transactions?from=${date_from}&to=${date_to}&status=${status}`, 'GET', true)

    request.onload = function() {
        let data = JSON.parse(this.response);
            // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
            if (request.status >= 200 && request.status < 400) {
                const success_message = data.message;
                
                //show success message
                let success_message_el = document.getElementById("success-message");
                success_message_el.innerHTML = success_message;
                success_message_el.style.display = "block";

                const cardContainer = document.getElementById("customers-container")

                //append to the table
                data.data.forEach((di, index) => {
                    const style = document.getElementById('sample-customer')
                    const card = style.cloneNode(true)

                    card.setAttribute('id', '');
                    card.classList.add('requested-api-data')
                    card.style.display = 'block';

                    const transaction = di;

                    di = di.Channel;

                    card.addEventListener('click', function () {
                        document.location.href = '#mylightbox-' + di.ID;
                    });

                    const modal_popup = document.getElementById('channels-modal-popup');
                    const modal_popup_clone = modal_popup.cloneNode(true);
                    modal_popup_clone.setAttribute('id', 'mylightbox-' + di.ID);
                    modal_popup_clone.setAttribute('class', 'modal');
                    modal_popup_clone.setAttribute('style', '');

                    modal_popup_clone.querySelector('#channels-inflow').textContent = readStates(di.Inflow);
                    modal_popup_clone.querySelector('#channels-name').textContent = di.Name;
                    modal_popup_clone.querySelector('#channels-active').innerHTML = readStatus(di.Active);
                    modal_popup_clone.querySelector('#channels-status').textContent = di.Status;
                    modal_popup_clone.querySelector('#channels-category').textContent = di.Category;
                    modal_popup_clone.querySelector('#channels-fee').textContent = di.FeeGLID;
                    modal_popup_clone.querySelector('#channels-cost').textContent = di.CostGLID;
                    modal_popup_clone.querySelector('#channels-type').textContent = di.Type;
                    modal_popup_clone.querySelector('#channels-wallet').textContent = di.WalletGLID;

                    channelCostFeePopUp(modal_popup_clone, di.ChannelCost, di.ChannelFee, transaction);
                    
                    const name_el = card.getElementsByTagName('p')[0]
                    name_el.textContent = di.Name;

                    const inflow_el = card.getElementsByTagName('p')[1]
                    inflow_el.textContent = readStates(di.Inflow);
                    
                    const category_el = card.getElementsByTagName('p')[2]
                    category_el.textContent = convertSlugToTitle(di.Category);
                    
                    const active_el = card.getElementsByTagName('p')[3]
                    active_el.innerHTML = readStatus(di.Active);

                    let active_message;
                    if(di.Active) {
                        active_message = 'Deactivate Channel';
                    } else {
                        active_message = 'Activate Channel';
                    }

                    const action_el = card.getElementsByTagName('p')[4]
                    action_el.innerHTML = '<a title="' + di.Name + '" href="#mylightbox-' + di.ID +'" rel="modal:open">View</a>&nbsp;&nbsp;<a title="' + active_message + '" href="javascript:void();" onclick="updateChannelStatus(\''+ di.ID +'\', '+ di.Active + ');">' + active_message + '</a>';
                    
                    action_el.appendChild(modal_popup_clone);
                    cardContainer.appendChild(card);

                });
            
            } else {
                const failed_message = data.message;
                let failed_message_el = document.getElementById("failed-message");
                failed_message_el.innerHTML = failed_message;
                failed_message_el.style.display = "block";
            }
        }
        
        request.send();
    }

window.addEventListener("firebaseIsReady", function() {
    getAllChannelTypes();
    document.getElementById('wf-form-Get-Channel-Transaction-Form').addEventListener('submit', findTransactions, true)
});