// let json = import("./sample-application.json");

async function getSingleCustomer() {
    fetch("sample-application.json")
        .then(response => response.json())
        .then(json => console.log(json));
    // console.log(json);
    return;
    let myUrl = new URL(document.location.href)
    let applicationID = myUrl.searchParams.get("id")
    console.log();

    if(applicationID === '') {
        alert('No loan is specified, please specify a user and try again.');
        window.location.href = '/loan-applications/loan-applications';
    }

    let request = await cbrRequest(`/loanApplications/${applicationID}`, 'GET', true)

    request.onload = function() {

        let data = JSON.parse(this.response)

        // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
        if (request.status >= 200 && request.status < 400) {
            console.log("new data", data);
            return;
            const customer = data.data;

            document.getElementById('title-field-full-name').innerHTML += `${customer.FirstName} ${customer.LastName} ${customer.OtherNames || ''}`;

            return;

        } else {
            console.log('error');
        }
    }

    //send request
    request.send();
}


window.addEventListener('firebaseIsReady', getSingleCustomer);
