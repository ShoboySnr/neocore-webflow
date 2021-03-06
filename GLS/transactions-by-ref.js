
let myUrl = new URL(document.location.href)
let txn_ref = myUrl.searchParams.get("id")
document.getElementById('field-ref').value = txn_ref;

const addNewGL = document.getElementById("wf-form-Get-GL-Form")
addNewGL.addEventListener('submit', findTransactionById);

async function findTransactionById(event) {
    event.preventDefault();
    let search_params = myUrl.searchParams;
    myUrl.search = search_params.toString();


    const cardContainer = document.getElementById("customers-container")

    const style = document.getElementById('sample-customer')
            
    const sample_custom_data = document.getElementsByClassName('sample-custom-data');
    while(sample_custom_data.length > 0){
        sample_custom_data[0].parentNode.removeChild(sample_custom_data[0]);
    }
        
    let formData = new FormData(this);
    let txn_ref = formData.get('field-ref');

    if(txn_ref === '' || txn_ref === null) {
        alert('Please enter a transaction reference number');
        return;
    }

    search_params.set('id', txn_ref);
    document.getElementById("transaction-title").innerHTML = 'Showing Transaction: ';
    document.getElementById("field-trans-ref").innerHTML = '-';
    document.getElementById("field-posting-date").innerHTML = '-';
    document.getElementById("field-value-date").innerHTML = '-';


    history.replaceState(null, null, "?"+search_params.toString());


        let request = await cbrRequest('/transaction/'+ txn_ref, 'GET', true);
        
        request.onload = function () {
            let data = JSON.parse(this.response)

        // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
        if (request.status >= 200 && request.status < 400) {
            const cardContainer = document.getElementById("customers-container")
            const gl = data.data;
        let counter = 0;
        
        //add the transaction data gottien
        document.getElementById("transaction-title").innerHTML = 'Showing Transaction: ' + gl.txnRef;
        document.getElementById("field-trans-ref").innerHTML = gl.txnRef;
        document.getElementById("field-posting-date").innerHTML = moment(gl.postingDate, "DD-MMM-YYYY-H-m-ss", true).format('DD MMMM YYYY, hh:mm:ss A');
        document.getElementById("field-value-date").innerHTML = moment(gl.valueDate, "DD-MMM-YYYY-H-m-ss", true).format('DD MMMM YYYY, hh:mm:ss A');

        const legs = gl.legs;
        if(legs != null) {
            legs.forEach((leg, index) => {
                        const style = document.getElementById('sample-customer')
                    const card = style.cloneNode(true)
            
            card.setAttribute('id', '');
            
            card.classList.add("sample-custom-data");
            card.style.display = 'block';

            card.addEventListener('click', function () {
                document.location.href = "/gls/account?id=" + leg.gLCode;
            });

            const glcode_el = card.getElementsByTagName('p')[0]
            glcode_el.textContent = leg.gLCode;
            
            const amount_el = card.getElementsByTagName('p')[1]
            amount_el.textContent = format_currency(leg.amount);

            const type_el = card.getElementsByTagName('p')[2]
            type_el.textContent = leg.type;
            
            const narration_el = card.getElementsByTagName('p')[3]
            narration_el.textContent = leg.narration;

            cardContainer.appendChild(card);
            });
            } else {
            alert('No transaction found.');
            return;
            }
        } else {
            alert('There was a problem getting transactions');
            return;
        }
    }
        
    request.send();
}

async function getGLTransaction() {
    let request = await cbrRequest('/transaction/'+ txn_ref, 'GET', true);
    
    request.onload = function () {
        let data = JSON.parse(this.response)

    // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
    if (request.status >= 200 && request.status < 400) {
        const cardContainer = document.getElementById("customers-container")
        const gl = data.data;
    let counter = 0;
    
    //add the transaction data gottien
    document.getElementById("transaction-title").innerHTML = 'Showing Transaction: ' + gl.txnRef;
    document.getElementById("field-trans-ref").innerHTML = gl.txnRef;
    document.getElementById("field-posting-date").innerHTML = moment(gl.postingDate, "DD-MMM-YYYY-H-m-ss", true).format('DD MMMM YYYY, hh:mm:ss A');
    document.getElementById("field-value-date").innerHTML = moment(gl.valueDate, "DD-MMM-YYYY-H-m-ss", true).format('DD MMMM YYYY, hh:mm:ss A');

    const legs = gl.legs;
    if(legs != null) {
        legs.forEach((leg, index) => {
                    const style = document.getElementById('sample-customer')
                const card = style.cloneNode(true)
        
        card.setAttribute('id', '');
        
        card.classList.add("sample-custom-data");
        card.style.display = 'block';

        card.addEventListener('click', function () {
            document.location.href = "/gls/account?id=" + leg.gLCode;
        });

        const glcode_el = card.getElementsByTagName('p')[0]
        glcode_el.textContent = leg.gLCode;
        
        const amount_el = card.getElementsByTagName('p')[1]
        amount_el.textContent = format_currency(leg.amount);

        const type_el = card.getElementsByTagName('p')[2]
        type_el.textContent = leg.type;
        
        const narration_el = card.getElementsByTagName('p')[3]
        narration_el.textContent = leg.narration;

        cardContainer.appendChild(card);
        });
        } else {
        alert('No transaction found.');
        return;
        }
    } else {
        alert('There was a problem getting transactions');
        return;
    }
    }
    
    request.send();
    
}

window.addEventListener('firebaseIsReady', () => {
    getGLTransaction();
});