async function getAllChannels() {

    let request = await cbrRequest('/channel-types', 'GET', true)

    // When the 'request' or API request loads, do the following...
    request.onload = function () {
        let data = JSON.parse(this.response)
        if (request.status >= 200 && request.status < 400) {
            document.getElementById('sample-customer').style.display = 'block';
            const types = data.data.types ? data.data.types : null;

            if(types) {
                const parent_innercolunm = document.getElementById('channel-types-parent-inner-column');

                for(type in types) {
                    const innercolunm = document.getElementById('channels-types-inner-column');
                    const innercolunm_clone = innercolunm.cloneNode(true);

                    innercolunm_clone.setAttribute('id', '');
                    innercolunm_clone.style.display = 'block';

                    const name_el = innercolunm_clone.getElementsByTagName('p')[0];
                    name_el.textContent  = convertSlugToTitle(types[type]);

                    const deactivate_link_el = innercolunm_clone.getElementsByTagName('p')[1];
                    deactivate_link_el.innerHTML = '<p><a href="javascript:void(0);" onclick=deactivateChannelTypes("' + types[type] + '")> Toggle Active </a></p>';

                    parent_innercolunm.appendChild(innercolunm_clone);
                }
            }

            const categories = data.data.categories ? data.data.categories : null;

            if(categories) {
                const parent_innercolunm = document.getElementById('channel-categories-parent-inner-column');

                for(category in categories) {
                    const innercolunm = document.getElementById('channels-categories-inner-column');
                    const innercolunm_clone = innercolunm.cloneNode(true);

                    innercolunm_clone.setAttribute('id', '');
                    innercolunm_clone.style.display = 'block';

                    const name_el = innercolunm_clone.getElementsByTagName('p')[0];
                    name_el.textContent  = convertSlugToTitle(categories[category]);

                    const deactivate_link_el = innercolunm_clone.getElementsByTagName('p')[1];
                    deactivate_link_el.innerHTML = '<p><a href="javascript:void(0);" onclick=deactivateChannelTypes("' + categories[category] + '")> Toggle Active </a></p>';

                    parent_innercolunm.appendChild(innercolunm_clone);
                }
            }

            const fee_and_cost_types = data.data.fee_and_cost_types ? data.data.fee_and_cost_types : null;

            if(fee_and_cost_types) {
                const parent_innercolunm = document.getElementById('channel-fee-parent-inner-column');

                for(fee_and_cost_type in fee_and_cost_types) {
                    const innercolunm = document.getElementById('channels-fee-inner-column');
                    const innercolunm_clone = innercolunm.cloneNode(true);

                    innercolunm_clone.setAttribute('id', '');
                    innercolunm_clone.style.display = 'block';

                    const name_el = innercolunm_clone.getElementsByTagName('p')[0];
                    name_el.textContent  = convertSlugToTitle(fee_and_cost_types[fee_and_cost_type]);

                    const deactivate_link_el = innercolunm_clone.getElementsByTagName('p')[1];
                    deactivate_link_el.innerHTML = '<p><a href="javascript:void(0);" onclick=deactivateChannelTypes("' + fee_and_cost_types[fee_and_cost_type] + '")> Toggle Active </a></p>';

                    parent_innercolunm.appendChild(innercolunm_clone);
                }
            }

            const channel_transaction_statuses = data.data.channel_transaction_statuses ? data.data.channel_transaction_statuses : null;

            if(channel_transaction_statuses) {
                const parent_innercolunm = document.getElementById('channel-transaction-parent-inner-column');

                for(channel_transaction_status in channel_transaction_statuses) {
                    const innercolunm = document.getElementById('channels-transaction-inner-column');
                    const innercolunm_clone = innercolunm.cloneNode(true);

                    innercolunm_clone.setAttribute('id', '');
                    innercolunm_clone.style.display = 'block';

                    const name_el = innercolunm_clone.getElementsByTagName('p')[0];
                    name_el.textContent  = convertSlugToTitle(channel_transaction_statuses[channel_transaction_status]);

                    const deactivate_link_el = innercolunm_clone.getElementsByTagName('p')[1];
                    deactivate_link_el.innerHTML = '<p><a href="javascript:void(0);" onclick=deactivateChannelTypes("' + channel_transaction_statuses[channel_transaction_status] + '")> Toggle Active </a></p>';

                    parent_innercolunm.appendChild(innercolunm_clone);
                }
            }
        } else {
            alert('No channels Types found');
            window.location.href = '/dashboard';
        }
    }

    request.send();
}


async function deactivateChannelTypes(channel_type) {
    let request = await cbrRequest('/channels/'+ channel_type +'/toggleactive?active=true', 'PUT', true);

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

document.addEventListener('firebaseIsReady', () => {
    getAllChannels();
})