// let json = import("./sample-application.json");

// fetch("https://shoboysnr.github.io/neocore-webflow/LoanApplications/sample-application.json")
//     .then(response => response.json())
//     .then(function (json, response) {
//         console.log("json", json);
//         console.log("res", response)
//     });
// return;
let myUrl = new URL(document.location.href)
let applicationID = myUrl.searchParams.get("id")

const escalateFormAction = async () => {
    let target = document.getElementById('wf-form-EscalateForm');

    let formData = new FormData(target);
    let comments = formData.get('escalate-comment');

    if(comments.length < 3) {
        alert('Escalate Comment is required');
        return;
    }

    const data = {
        comments
    }

    let endpoint = `/loanApplications/${applicationID}/escalate`
    let request = await cbrRequest(endpoint, 'PUT', true);


    request.onload = function() {
        let result = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            let data = result.data;

            console.log(data);

        } else {
            const res = JSON.parse(request.response);
            let message = res.message;
            alert(message);
            return;
        }
    }

     //send request
     request.send(JSON.stringify(data));
}

async function getSingleCustomer() {
    console.log(applicationID);

    if(applicationID === '') {
        alert('No loan is specified, please specify a user and try again.');
        window.location.href = '/loan-applications/loan-applications';
    }

    const endpoint = `/loanApplications/${applicationID}`;
    console.log(endpoint);
    let request = await cbrRequest(endpoint, 'GET', true)

    request.onload = function() {

        let result = JSON.parse(this.response)

        // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
        if (request.status >= 200 && request.status < 400) {
            let data = result.data;

            const customer_info = data.customer_info;

            document.getElementById("customer-name").textContent = customer_info.name;
            document.getElementById("customer-name-inner").textContent = customer_info.name;
            document.getElementById("customer-bvn").textContent = readValidity(customer_info.bvn_validated);
            document.getElementById("customer-dob").textContent = customer_info.dob;
            document.getElementById("customer-phone").textContent = customer_info.phone;
            document.getElementById("customer-id-validated").textContent = readValidity(customer_info.id_validated);

            //add event listener to escalate buttons
            document.getElementById('customer-escalate-action').addEventListener('click', (event) => {
                event.preventDefault();
                document.getElementById('modal-escalate').setAttribute('style', 'display:flex;');
            });

            //add action to the escalate form
            document.getElementById('wf-form-EscalateForm').addEventListener('submit', escalateFormAction);
            document.getElementById('escalate-submit-form').addEventListener('click', (event) => {
                event.preventDefault();
                escalateFormAction()
                // document.getElementById('wf-form-EscalateForm').submit();
                return;
            });

            document.querySelectorAll('.closeModal').forEach(() => {
                document.querySelectorAll('.CardModalContainer').forEach((element) => {
                    element.setAttribute('style', 'display:none;');
                });
            });

            let application_data = document.getElementById("w-tabs-1-data-w-pane-0");

            document.getElementById('title-field-full-name').innerHTML += `${customer.FirstName} ${customer.LastName} ${customer.OtherNames || ''}`;

            return;

        } else {
            const res = JSON.parse(request.response);
            let message = res.message;
            alert(message);
            window.location.href = '/loan-applications/loan-applications';
            return;
        }
    }

    //send request
    request.send();
}


window.addEventListener('firebaseIsReady', getSingleCustomer);
