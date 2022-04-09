// let json = import("./sample-application.json");

// fetch("https://shoboysnr.github.io/neocore-webflow/LoanApplications/sample-application.json")
//     .then(response => response.json())
//     .then(function (json, response) {
//         console.log("json", json);
//         console.log("res", response)
//     });
// return;

async function getSingleCustomer() {
    let myUrl = new URL(document.location.href)
    let applicationID = myUrl.searchParams.get("id")
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

            let application_data = document.getElementById("w-tabs-1-data-w-pane-0");

            document.getElementById('title-field-full-name').innerHTML += `${customer.FirstName} ${customer.LastName} ${customer.OtherNames || ''}`;

            return;

        } else {
            console.log(request);
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
