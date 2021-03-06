
const addNewGL = document.getElementById("wf-form-Get-GL-Form")
addNewGL.addEventListener('submit', findTransactionByDateRange, true);

async function findTransactionByDateRange(event) {
event.preventDefault();

const cardContainer = document.getElementById("customers-container")
const former_card = cardContainer.childNodes[1];

const style = document.getElementById('sample-customer')
        
const sample_custom_data = document.getElementsByClassName('sample-custom-data');
while(sample_custom_data.length > 0){
    sample_custom_data[0].parentNode.removeChild(sample_custom_data[0]);
}

let formData = new FormData(this);
let date_from = formData.get('field-date-from');
let date_to = formData.get('field-date-to');

if(date_from === '' || date_from === null || date_to === null || date_to === null) {
    alert('Please select a date range');
    return;
}

if(date_from !== '') {
    date_from = moment(date_from, "DD-MMM-YYYY", true).format('DD-MMM-YYYY-h-mm-ss')
}

if(date_to !== '') {
    date_to = moment(date_to, "DD-MMM-YYYY", true).format('DD-MMM-YYYY-h-mm-ss')
}

    let request = await cbrRequest('/transaction?from='+ date_from + '&to=' + date_to, 'GET', true);
    
    request.onload = function () {
    let data = JSON.parse(this.response)

    // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
    if (request.status >= 200 && request.status < 400) {
    const gl = data.data;
    let counter = 0;
    if(gl != null) {
        gl.forEach((gl, index) => {
        
            const style = document.getElementById('sample-customer')
            const card = style.cloneNode(true)
        
            card.setAttribute('id', '');
            
            card.classList.add("sample-custom-data");
            card.style.display = 'block';

            card.addEventListener('click', function () {
            document.location.href = "/gls/transaction?id=" + gl.txnRef;
            });
            
            const txn_ref = card.getElementsByTagName('p')[0]
            txn_ref.textContent = gl.txnRef;

            const posting_date = card.getElementsByTagName('p')[1]
            posting_date.textContent = '';
            if(gl.postingDate != '' || gl.postingDate != null) {
                posting_date.textContent = moment(gl.postingDate, "DD-MMM-YYYY-H-m-ss", true).format('DD MMMM YYYY, hh:mm:ss A');
            }

            const value_date = card.getElementsByTagName('p')[2]
            value_date.textContent = '';
            if(gl.valueDate != '' || gl.valueDate != null) {
                value_date.textContent = moment(gl.valueDate, "DD-MMM-YYYY-H-m-ss", true).format('DD MMMM YYYY, hh:mm:ss A');
            }
            
            const legs = gl.legs;
            let legContent = [];
            let leg_count = 0;
            legs.forEach(leg => {
                leg_count++;
                const amount = format_currency(leg.amount);
                const glcode = leg.gLCode;
                const type = leg.type;
                const narration = leg.narration;

                let leg_content = leg_count + '. <a href="/gls/account?id=' + glcode + '" title="' + narration + '">' + type + ' (' + amount + ') </a>';
                
                legContent.push(leg_content);
            });

            const leg_element = card.getElementsByTagName('p')[3]

            leg_element.innerHTML = legContent.join("<br><br>");

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

async function getGLTransactions() {

    let request = await cbrRequest('/transaction', 'GET', true);
    
    request.onload = function () {
    let data = JSON.parse(this.response)

    // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
    if (request.status >= 200 && request.status < 400) {
    const cardContainer = document.getElementById("customers-container")
    const gl = data.data;
    let counter = 0;
    if(gl) {
        gl.forEach((gl, index) => {
        
        const style = document.getElementById('sample-customer')
        const card = style.cloneNode(true)
        
        card.setAttribute('id', '');
        
        card.classList.add("sample-custom-data");
        card.style.display = 'block';

        card.addEventListener('click', function () {
            document.location.href = "/gls/transaction?id=" + gl.txnRef;
        });

        const id = card.getElementsByTagName('p')[0]
        id.textContent = ++counter;
        
        const txn_ref = card.getElementsByTagName('p')[1]
        txn_ref.textContent = gl.txnRef;

        const posting_date = card.getElementsByTagName('p')[2]
        posting_date.textContent = '';
        if(gl.postingDate !== '' || gl.postingDate !== null) {
            posting_date.textContent = moment(gl.postingDate, "DD-MMM-YYYY-H-m-ss", true).format('DD MMMM YYYY, hh:mm:ss A');
        }

        const value_date = card.getElementsByTagName('p')[3]
        value_date.textContent = '';
        if(gl.valueDate !== '' || gl.valueDate !== null) {
            value_date.textContent = moment(gl.valueDate, "DD-MMM-YYYY-H-m-ss", true).format('DD MMMM YYYY, hh:mm:ss A');
        }
        
        const legs = gl.legs;
        legs.forEach(leg => {
            let amount = format_currency(leg.amount);
            if (leg.type === 'Credit') {
            const credit_field = card.getElementsByTagName('p')[4]
            credit_field.textContent = amount;
            } else {
            const debit_field = card.getElementsByTagName('p')[5]
            debit_field.textContent = amount;
            }
        });

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
    // getGLTransactions();
});