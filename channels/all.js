async function getAllChannels() {

    let request = await cbrRequest('/channels', 'GET', true)

    // When the 'request' or API request loads, do the following...
    request.onload = function () {
        let data = JSON.parse(this.response)
        if (request.status >= 200 && request.status < 400) {
            const cardContainer = document.getElementById("customers-container")
            data.data.forEach((di, index) => {
                    const style = document.getElementById('sample-customer')
                const card = style.cloneNode(true)

                card.setAttribute('id', '');
                card.style.display = 'block';

                const modal_popup = document.getElementById('channels-modal-popup');
                const modal_popup_clone = modal_popup.cloneNode(true);
                modal_popup_clone.setAttribute('id', 'channel-view-' + di.ID);

                modal_popup_clone.querySelector('#cancel-button').addEventListener('click', () => {
                    closeAllModalPopUp(event);
                });

                modal_popup_clone.querySelectorAll('.modalpopup').forEach((element, index) => {
                    element.addEventListener('click', closeAllModalPopUp);
                });

                modal_popup_clone.querySelectorAll('.viewpermission').forEach((element, index) => {
                    element.addEventListener('click', stopClosePopUp);
                });

                modal_popup_clone.querySelector('#channels-inflow').textContent = readStates(di.Inflow);
                modal_popup_clone.querySelector('#channels-name').textContent = di.Name;
                modal_popup_clone.querySelector('#channels-active').innerHTML = readStatus(di.Active);
                modal_popup_clone.querySelector('#channels-status').textContent = di.Status;
                modal_popup_clone.querySelector('#channels-category').textContent = di.Category;
                modal_popup_clone.querySelector('#channels-fee').textContent = di.FeeGLID;
                modal_popup_clone.querySelector('#channels-cost').textContent = di.CostGLID;
                modal_popup_clone.querySelector('#channels-type').textContent = di.Type;
                modal_popup_clone.querySelector('#channels-wallet').textContent = di.WalletGLID;


                if(di.ChannelCost) {
                    modal_popup_clone.querySelector('#channels-cost-name').textContent = di.ChannelCost.Name;
                    modal_popup_clone.querySelector('#channels-cost-channel-Id').textContent = di.ChannelCost.ChannelID;
                    modal_popup_clone.querySelector('#channels-cost-type').textContent = di.ChannelCost.Type;
                    modal_popup_clone.querySelector('#channels-cost-percentage').textContent = di.ChannelCost.Percentage;
                    modal_popup_clone.querySelector('#channels-cost-flat-amount').textContent = di.ChannelCost.FlatAmt;
                    modal_popup_clone.querySelector('#channels-cost-hidden').textContent = readStates(di.ChannelCost.Hidden);
                    modal_popup_clone.querySelector('#channels-cost-cap').textContent = di.ChannelCost.Cap;
        
                    const innerColumn = modal_popup_clone.querySelector('#modal-popup-inner');
                    
                    if(di.ChannelCost.Ranges){
                        di.ChannelCost.Ranges.forEach((range,index) => {
                            const rangeItem = document.getElementById('modal-popup-inner-table');
                            const rangeItemClone = rangeItem.cloneNode(true);
                            rangeItemClone.setAttribute('id','');
                            rangeItemClone.style.display = 'block';
                            
                            const form_el = rangeItemClone.getElementsByTagName('p')[0];
                            form_el.textContent  = format_currency(range.From);

                            const to_el = rangeItemClone.getElementsByTagName('p')[1];
                            to_el.textContent  = format_currency(range.To);

                            const option_el = rangeItemClone.getElementsByTagName('p')[2];
                            option_el.textContent  = range.Option;

                            const optionCap_el = rangeItemClone.getElementsByTagName('p')[3];
                            optionCap_el.textContent  = format_currency(range.OptionCap);

                            const percentage_el = rangeItemClone.getElementsByTagName('p')[4];
                            percentage_el.textContent  = readStates(range.IsPercentage);

                            const fee_el = rangeItemClone.getElementsByTagName('p')[5];
                            fee_el.textContent  = range.FeeOrPercentage;

                            innerColumn.appendChild(rangeItemClone)
                        })
                    } 
                }

                if(di.ChannelFee) {
                    modal_popup_clone.querySelector('#channels-fee-name').textContent = di.ChannelFee.Name || '';
                    modal_popup_clone.querySelector('#channels-fee-channel-Id').textContent = di.ChannelFee.ChannelID;
                    modal_popup_clone.querySelector('#channels-fee-type').textContent = di.ChannelFee.Type;
                    modal_popup_clone.querySelector('#channels-fee-percentage').textContent = di.ChannelFee.Percentage;
                    modal_popup_clone.querySelector('#channels-fee-flat-amount').textContent = di.ChannelFee.FlatAmt;
                    modal_popup_clone.querySelector('#channels-fee-hidden').textContent = readStates(di.ChannelFee.Hidden);
                    modal_popup_clone.querySelector('#channels-fee-cap').textContent = di.ChannelCost.Cap;

                    const feeinnerColumn = modal_popup_clone.querySelector('#modal-fee-popup-inner');
                
                    if(di.ChannelFee.Ranges){
                    di.ChannelCost.Ranges.forEach((range,index) => {
                            const feerangeItem = document.getElementById('modal-fee-popup-inner-table');
                            const feerangeItemClone = feerangeItem.cloneNode(true);
                            feerangeItemClone.setAttribute('id','');
                            feerangeItemClone.style.display = 'block';
                            
                            const form_el = feerangeItemClone.getElementsByTagName('p')[0];
                            form_el.textContent  = format_currency(range.From);

                            const to_el = feerangeItemClone.getElementsByTagName('p')[1];
                            to_el.textContent  = format_currency(range.To);

                            const option_el = feerangeItemClone.getElementsByTagName('p')[2];
                            option_el.textContent  = range.Option;

                            const optionCap_el = feerangeItemClone.getElementsByTagName('p')[3];
                            optionCap_el.textContent  = format_currency(range.OptionCap);

                            const percentage_el = feerangeItemClone.getElementsByTagName('p')[4];
                            percentage_el.textContent  = readStates(range.IsPercentage);

                            const fee_el = feerangeItemClone.getElementsByTagName('p')[5];
                            fee_el.textContent  = range.FeeOrPercentage;

                            feeinnerColumn.appendChild(feerangeItemClone)
                        })
                    } 
                }
                
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
                action_el.innerHTML = '<a title="' + di.Name + '" href="javascript:void(0);" onclick="channelDetailsModalpopup(\'' + di.ID +'\');">View</a> || <a title="' + active_message + '" href="javascript:void();" onclick="updateChannelStatus(\''+ di.Type +'\', ' + di.Active + ');">' + active_message + '</a>';
                
                action_el.appendChild(modal_popup_clone);
                cardContainer.appendChild(card);
            })
        } else {
            alert('No channels found');
            window.location.href = '/dashboard';
        }
    }

    request.send();
   
}

function channelDetailsModalpopup(id) {
    document.querySelector('#channel-view-' + id).setAttribute('style', 'display:block');
}

async function updateChannelStatus(channelID, status) {
    status = !status;
    let request = await cbrRequest('/channels/'+ channelID +'/toggleactive?active='+status, 'PUT', true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            if(status) {
                alert('This channel successfully activated');
            } else {
                alert('This channel successfully deactivated');
            }

            window.location.reload();
        }
    }

    request.send();
}

async function getAllChannelTypes(channelID, status) {
    status = !status;
    let request = await cbrRequest('/channel-types', 'GET', true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(this.response)
            data.data.forEach((type, index) => {
                
            });
        }
    }

    request.send();
}

document.addEventListener('firebaseIsReady', () => {
    getAllChannels();
})