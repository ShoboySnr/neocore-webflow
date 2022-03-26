let customer_lists = [];

function getAllCustomerAccounts() {
    fbauth.onAuthStateChanged((user) => {
        
        if(user) {
            fbauth.currentUser.getIdToken(true).then(async (idToken) => {
                let request = await cbrRequest('/users', 'GET', true, idToken)
    
                request.onload = function() {
                    if (request.status >= 200 && request.status < 400) {
                        let data = JSON.parse(this.response);
                        
                        get_customers_account = data.data;
                    } else {
                        return []; 
                    }
                }
                request.send();
            });
        }
    });
}

    const addNewGL = document.getElementById("wf-form-Get-GL-Form")
    addNewGL.addEventListener('submit', filterDepositAccounts);
    
    function filterDepositAccounts(event) {
        event.preventDefault();
    
    const cardContainer = document.getElementById("customers-container")
    const former_card = cardContainer.childNodes[1];
    
    const style = document.getElementById('sample-customer')
            
    const sample_custom_data = document.getElementsByClassName('sample-custom-data');
    while(sample_custom_data.length > 0){
        sample_custom_data[0].parentNode.removeChild(sample_custom_data[0]);
    }
        
    let formData = new FormData(this);
    let customer_name = formData.get('field-customer-name');
    let nuban = formData.get('field-nuban');
    let product_name = formData.get('field-product-name');
    let account_status = formData.get('field-account-status');

    fbauth.onAuthStateChanged((user) => {
        
        if(user) {
            fbauth.currentUser.getIdToken(true).then(async (idToken) => {
                let request = await cbrRequest('/deposit-accounts?name='+ customer_name + '&nuban=' + nuban + '&product=' + product_name + '&status=' + account_status, 'GET', true, idToken);
        
                request.onload = function () {
                    let data = JSON.parse(this.response)

                // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
                if (request.status >= 200 && request.status < 400) {
                const deposit_accounts = data.data;
                let counter = 0;
                
                if(deposit_accounts != null) {
                    deposit_accounts.forEach((da, index) => {
                        const style = document.getElementById('sample-customer')
                        const card = style.cloneNode(true)
                    
                        card.setAttribute('id', '');
                        
                        card.classList.add("sample-custom-data");
                        card.style.display = 'block';
            
                        card.addEventListener('click', function () {
                        document.location.href = "/deposit-accounts/view?id=" + da.accountID;
                        });
                    
                        const id = card.getElementsByTagName('p')[0]
                        id.textContent = ++counter;
            
                        const serial_number_el = card.getElementsByTagName('p')[1]
                        serial_number_el.textContent = da.serialNumber
                        
                        const account_owner_el = card.getElementsByTagName('p')[2]
                        let customer = getCustomersById(da.accountOwnerID);
                        account_owner_el.textContent = `${customer.FirstName} ${customer.LastName}`;
                        
                        const nuban_el = card.getElementsByTagName('p')[3]
                        nuban_el.textContent = da.nuban;
                        
                        const product_name_el = card.getElementsByTagName('p')[4]
                        product_name_el.innerHTML = "<a href='/deposit-products/view?id=" + da.productId + "'>" + da.productName + "</a>";
            
                        const last_active_date_el = card.getElementsByTagName('p')[5]
                        last_active_date_el.textContent = '';
                        if(da.lastActiveDate != '' || da.lastActiveDate != null) {
                            last_active_date_el.textContent = moment(da.lastActiveDate, "DD-MMM-YYYY-H-m-ss", true).format('DD MMMM YYYY, hh:mm:ss A');
                        }
            
                        cardContainer.appendChild(card);
                    });
                    } else {
                        alert('No deposit accounts found.');
                        return;
                    }
                } else {
                    alert('There was a problem getting deposits accounts');
                    return;
                }
                }
                
                request.send();
            });
        }
        });
    }
    
    function getCustomersLists() {
        fbauth.onAuthStateChanged((user) => {
        
            if(user) {
                fbauth.currentUser.getIdToken(true).then(async (idToken) => {
                    let request = await cbrRequest('/users', 'GET', true, idToken);
        
                    request.onload = function () {
                        let data = JSON.parse(this.response)
                    
                        if (request.status >= 200 && request.status < 400) {
                                customer_lists = data.data;
                        
                        let parent_customer_list_el = document.getElementById('field-customer-id');
                        appendCustomerSelectOption(customer_lists, parent_customer_list_el);
                        }
                    }
                    
                    request.send()
                });
            }
        });
    }
    
    function getAccountProduct() {
        fbauth.onAuthStateChanged((user) => {
        
            if(user) {
                fbauth.currentUser.getIdToken(true).then(async (idToken) => {
                    let request = await cbrRequest('/deposit-product', 'GET', true);
        
                    request.onload = function () {
                        let data = JSON.parse(this.response)
                    
                        if (request.status >= 200 && request.status < 400) {
                                const account_product_lists = data.data;
                        
                        let parent_product_name_el = document.getElementById('field-product-name');
                        appendSelectOption(account_product_lists, parent_product_name_el);
                        }
                    }
                    
                    request.send()
                });
            }
        });
    }

    function getGLDepositAccounts(get_customers_account) {
        fbauth.onAuthStateChanged((user) => {
        
            if(user) {
                fbauth.currentUser.getIdToken(true).then(async (idToken) => {
                    let request = await cbrRequest('/deposit-accounts', 'GET', true, idToken);
                    
                    request.onload = function () {
                        let data = JSON.parse(this.response)

                    // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
                    if (request.status >= 200 && request.status < 400) {
                        const cardContainer = document.getElementById("customers-container")
                        const deposit_accounts = data.data;
                    if(deposit_accounts != null) {
                        deposit_accounts.forEach(async (da, index) => {
                                    const style = document.getElementById('sample-customer')
                                const card = style.cloneNode(true)
                        
                        card.setAttribute('id', '');
                        
                        card.classList.add("sample-custom-data");
                        card.style.display = 'block';

                        card.addEventListener('click', function () {
                            document.location.href = "/deposit-accounts/view?id=" + da.accountID;
                        });

                        const serial_number_el = card.getElementsByTagName('p')[0]
                        serial_number_el.textContent = da.serialNumber
                        
                        const account_owner_el = card.getElementsByTagName('p')[1]
                        console.log(get_customers_account);
                        let customer = getCustomersById(da.accountOwnerID);
                        await sleep(2000);
                        account_owner_el.textContent = customer.FirstName;
                        
                        const nuban_el = card.getElementsByTagName('p')[2]
                        nuban_el.textContent = da.nuban;
                        
                        const product_name_el = card.getElementsByTagName('p')[3]
                        product_name_el.innerHTML = "<a href='/deposit-products/view?id=" + da.productId + "'>" + da.productName + "</a>";

                        const balance_el = card.getElementsByTagName('p')[4]
                        balance_el.textContent = format_currency(da.accountBalance);
                        
                        const last_active_date_el = card.getElementsByTagName('p')[5]
                        last_active_date_el.textContent = '';
                        if(da.lastActiveDate != '' || da.lastActiveDate != null) {
                            last_active_date_el.textContent = moment(da.lastActiveDate, "DD-MMM-YYYY-H-m-ss", true).format('DD MMMM YYYY, hh:mm:ss A');
                        }

                        cardContainer.appendChild(card);
                        });
                        } else {
                        alert('No deposit accounts found.');
                            eturn;
                        }
                    } else {
                        alert('There was a problem getting the deposit accounts');
                        return;
                        }
                    }
                    
                    request.send();
                });
            }
        });
    
    }
    
    let get_customers_account = getAllCustomerAccounts();
    getCustomersLists();
    getAccountProduct();
    getGLDepositAccounts(get_customers_account);
    
    function getCustomersById(customer_id) {
        if(get_customers_account.length > 0) {
        get_customers_account.forEach(customer => {
            if(customer_id == customer.id) {
            return customer;
            }
        });
        }

        return get_customers_account;
}