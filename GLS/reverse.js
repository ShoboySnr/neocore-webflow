const addNewGL = document.getElementById("wf-form-Get-GL-Form")
addNewGL.addEventListener('submit', findGLByCode);

async function findGLByCode(event) {
event.preventDefault();
document.getElementById('error-message').style.display = 'none';
document.getElementById('success-message').style.display = 'none';

let formData = new FormData(this);
let txn_ref = formData.get('field-transaction-ref');

if(txn_ref === '' || txn_ref === null) {
    alert('Please enter correct transaction reference number');
    return;
}

    let request = await cbrRequest('/transaction/'+ txn_ref + '/reverse', 'POST', true);
    
    request.onload = function () {
    let data = JSON.parse(this.response)

    // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
    if (request.status >= 200 && request.status < 400) {
        document.getElementById("wf-form-Get-GL-Form").reset();
        document.getElementById('success-message').style.display = 'block';
        document.getElementById('error-message').innerHTML = data.message;
    } else {
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-message').innerHTML = data.message;
    }
    }
    
    request.send();
}