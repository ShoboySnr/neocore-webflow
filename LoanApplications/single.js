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
    let comment = formData.get('escalate-comment');

    if(comment.length < 3) {
        alert('Escalate Comment is required');
        return;
    }

    const data = {
        comment
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

const deescalateFormAction = async () => {
    let target = document.getElementById('wf-form-DeescalateForm');

    let formData = new FormData(target);
    let comment = formData.get('deescalate-comment');

    if(comment.length < 3) {
        alert('De-Escalate Comment is required');
        return;
    }

    const data = {
        comment
    }

    let endpoint = `/loanApplications/${applicationID}/deescalate`
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

const submitComment = async (event) => {
    event.preventDefault();

    let target = event.target;

    let formData = new FormData(target);
    let comment = formData.get('comments');

    if(comment.length < 3) {
        alert('Comment is required');
        return;
    }

    const data = {
        comment
    }

    let endpoint = `/loanApplications/${applicationID}/comment`
    let request = await cbrRequest(endpoint, 'POST', true);


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

const getLoanDeclineReasons = async () => {
    let request = await cbrRequest('/loanDeclineReasons', 'GET', true);

    request.onload = () => {

        let result = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            let data = data.data;

            let reasons_for_declining = data.reasons_for_declining;
            let reasons_for_undeclining = data.reasons_for_undeclining;

            populateDeclineUnDeclineSelect(reasons_for_declining, document.getElementById('decline-requests-options'));
            populateDeclineUnDeclineSelect(reasons_for_undeclining, document.getElementById('undecline-requests-options'));
        }

    }

    //send request
    request.send();
}

function populateDeclineUnDeclineSelect(reasons, parent_el) {
    parent_el.innerHTML = '';

    if(reasons && reasons.length > 0) {
        reasons.forEach((element) => {
            let option = document.createElement("option");

            option.value= di.stage_id;
            option.innerHTML = di.stage_name;

            parent_el.appendChild(option);
        })
    }
}

const getLoanApplicationRecommendationOptions = asyn


const declineUnDeclineApplication = async (target, path = 'decline') => {
    let formData = new FormData(target);
    let reason = formData.get('reason');
    let message_customer = formData.get('message_customer');

    let msg = '';
    let count = 0;

    if(reason.length < 2) {
        msg += 'Select a Decline request \n';
        count += 1;
    }

    if(message_customer.length < 2) {
        msg += 'Enter Decline Comments \n';
        count += 1;
    }

    if(count > 0) {
        alert(msg);
        return;
    }

    const data = {
        reason,
        message_customer
    }

    let endpoint = `/loanApplications/${applicationID}/${path}`
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

            //add event listener to open modals on click of the action buttons
            document.querySelectorAll('.modal-action-button').forEach((element) => {
                let el_id = element.getAttribute('id');
                element.addEventListener('click', (event) => {
                    event.preventDefault();
                    if(document.getElementById('modal-'+ el_id)) document.getElementById('modal-'+ el_id).setAttribute('style', 'display: flex;')
                });
            });

            //add action to the escalate form
            document.getElementById('escalate-submit-form').addEventListener('click', (event) => {
                event.preventDefault();
                escalateFormAction()
            });


            //add action to the escalate form
            document.getElementById('deescalate-submit-form').addEventListener('click', (event) => {
                event.preventDefault();
                deescalateFormAction()
            });

            //add action to the decline request
            document.getElementById('decline-request-submit-form').addEventListener('click', (event) => {
                event.preventDefault();
                declineUnDeclineApplication(document.getElementById('wf-form-DeclineRequestsForm'));
            });

            //add action to the decline request
            document.getElementById('undecline-request-submit-form').addEventListener('click', (event) => {
                event.preventDefault();
                declineUnDeclineApplication(document.getElementById('wf-form-DeclineRequestsForm'), 'undecline');
            });

            //add event listener to comments
            document.getElementById('wf-form-comments-form').addEventListener('submit', submitComment)


            document.querySelectorAll('.closemodal').forEach((el) => {
                el.addEventListener('click', () => {
                    document.querySelectorAll('.CardModalContainer').forEach((element) => {
                        element.setAttribute('style', 'display:none;');
                    });
                })
            });

            //populate reasons
            getLoanDeclineReasons();

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
