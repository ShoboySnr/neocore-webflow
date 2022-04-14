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
            console.log("escalator", data);
            alert('Successfully escalated this loan');

            return;
            window.location.reload();

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

            alert('Successfully De-escalated this loan');
            window.location.reload();

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
            console.log("submit comment", data);

            alert('Successfully submitted comments');
            return;
            window.location.reload();

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
        console.log("loan decline reasons", this.response);
        return;

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

const getLoanApplicationRecommendationOptions = async () => {
    let request = await cbrRequest(`/loanApplications/${applicationID}/recommend`, 'GET', true);

    request.onload = () => {

        console.log("loan application recommendation", this.response);
        return;

        let result = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            let data = data.data;

            console.log(data);
        }

    }

    //send request
    request.send();
}


const addRecommendations = async () => {
    let target = document.getElementById('wf-form-Recommendation-Form');

    let formData = new FormData(target);
    let amount = parseInt(formData.get('amount'));
    let product_id = formData.get('product_id');
    let interest_id = formData.get('interest_id');
    let days = parseInt(formData.get('days'));
    let fees_id = formData.get('fees_id');
    let notes = formData.get('notes');

    let msg = '';
    let count = 0;

    if(amount == '' || amount.length < 2) {
        msg += 'Amount is required \n';
        count += 1;
    }

    if(product_id == '' || amount.length < 2) {
        msg += 'Select a specific product \n';
        count += 1;
    }

    if(days == '' || days.length < 1) {
        msg += 'Enter the number of days \n';
        count += 1;
    }

    if(interest_id == '' || interest_id.length < 1) {
        msg += 'Select a specific interest \n';
        count += 1;
    }

    if(fees_id == '' || fees_id.length < 1) {
        msg += 'Select at least one fee \n';
        count += 1;
    }

    if(notes == '' || notes.length < 1) {
        msg += 'Enter Notes \n';
        count += 1;
    }

    if(count > 0) {
        alert(msg);
        return;
    }

    const data = {
        amount,
        product_id,
        interest_id,
        days,
        fees_id,
        notes
    }

    let endpoint = `/loanApplications/${applicationID}/recommend`
    let request = await cbrRequest(endpoint, 'POST', true);


    request.onload = function() {
        let result = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            let data = result.data;

            alert('Successfully added a recommendation');
            window.location.reload();

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

const getApplicationData = async () => {
    let data;
    fetch("https://shoboysnr.github.io/neocore-webflow/LoanApplications/sample-application.json")
        .then(response => response.json())
        .then(json => {
            data = json;
        });
    return data;
}

async function getSingleCustomer() {

    if(applicationID === '') {
        alert('No loan application is specified, please specify an application and try again.');
        window.location.href = '/loan-applications/loan-applications';
    }

    const endpoint = `/loanApplications/${applicationID}`;
    let request = await cbrRequest(endpoint, 'GET', true);

    const url = "https://shoboysnr.github.io/neocore-webflow/LoanApplications/sample-application.json";
    const jsonRequest = await fetch(url);
    let jsonData = await jsonRequest.json();

    request.onload = function() {

        let result = JSON.parse(this.response)

        // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
        if (request.status >= 200 && request.status < 400) {
            let data = result.data;
            data = jsonData; // clear this
            // console.log(data);

            const customer_info = data.customer_info;
            applicationFormField(data.form_info);
            creditHistory(data.credit_history);
            populateUploadedFiles(data.uploaded_files);
            populatePendingActions(data.pending_actions);
            populateLinkedAccounts(data.external_accounts);
            populateComments(data.comments);

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

            //add toggel action to table
            document.querySelectorAll(".toggle-list").forEach(element => {
                element.addEventListener("click", toggleUploadedFiles);
            })

            //populate reasons
            getLoanDeclineReasons();
            getLoanApplicationRecommendationOptions();

            let application_data = document.getElementById("w-tabs-1-data-w-pane-0");

            // document.getElementById('title-field-full-name').innerHTML += `${customer.FirstName} ${customer.LastName} ${customer.OtherNames || ''}`;

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

const reloadPage = () => {
    window.location.reload();
}

function creditHistory(credit_history)
{
    //group each into diff source arrays using map
    let crcFullSource = credit_history.filter(function(ch) {
        return ch.source.toLowerCase() === "crcfull";
    });
    let crcNanoSource = credit_history.filter(function(ch) {
        return ch.source.toLowerCase() === "crcnano";
    });
    let firstCentralSource = credit_history.filter(function(ch) {
        return ch.source.toLowerCase() === "firstcentral";
    });

    const sourceList = [crcFullSource, crcNanoSource, firstCentralSource];

    sourceList.forEach(mySource => {
        let counter = 0;
        mySource.forEach((history) => {
            counter++;
            const source = history.source.toLowerCase();
            const sourceTabId = source + "-tab";
            let sourceTab = document.getElementById(sourceTabId);
            let sourceTabCols = sourceTab.querySelectorAll(".w-col-6");
            let sourceTabColOneItems = sourceTabCols[0].querySelectorAll("h6");
            let sourceTabColTwoItems = sourceTabCols[1].querySelectorAll("h6");
            setContent(sourceTabColOneItems[0]);
            if (history.status.toLowerCase() == "closed") setContent(sourceTabColOneItems[1]);
            if (history.status.toLowerCase() == "open") setContent(sourceTabColOneItems[2]);
            if (history.classification == "Non Performing") setContent(sourceTabColOneItems[3]);
            let outstanding = parseFloat(history.amount) - parseFloat(history.balance);
            setContent(sourceTabColTwoItems[0], history.amount);
            setContent(sourceTabColTwoItems[1], outstanding);
            setContent(sourceTabColTwoItems[2], history.amount_overdue);
            // for (let i in sourceTabColTwoItems)
            // {
            //     let item = sourceTabColTwoItems[i].innerText.split(": ");
            //     item[1] = format_currency(item[1]);
            //     item = item.join(": ");
            //     sourceTabColTwoItems[i].innerText = item;
            // }

        //    table update
            let receiptTable = document.getElementById(source + "-table");
            let sampleRow = document.getElementById(source + "-table-row");// sourceTab.querySelectorAll(".receipt-row")[1];//[0];
            let sampleRowClone = sampleRow.cloneNode(true);
            sampleRowClone.setAttribute("id", "");
            sampleRow.style.display = "none";

            sampleRowClone.getElementsByTagName("div")[0].innerText = counter;
            sampleRowClone.getElementsByTagName("div")[1].innerText = history.institution;
            sampleRowClone.getElementsByTagName("div")[2].innerText = format_currency(history.amount);
            sampleRowClone.getElementsByTagName("div")[3].innerText = history.disbursal_date;
            sampleRowClone.getElementsByTagName("div")[4].innerText = history.maturity_date;
            sampleRowClone.getElementsByTagName("div")[5].innerText = format_currency(history.amount_overdue);
            sampleRowClone.getElementsByTagName("div")[6].innerText = format_currency(parseFloat(history.amount) - parseFloat(history.balance));
            sampleRowClone.getElementsByTagName("div")[7].remove();
            sampleRowClone.style.display = "flex";
            receiptTable.appendChild(sampleRowClone);
        });
    });
}

function populateUploadedFiles(uploaded_files)
{
    uploaded_files.forEach((file) => {
        let tableContainer = document.getElementById("uploaded-files-table");
        let sampleRowElement = document.getElementById("uploaded-file-row");
        let cloneElement = sampleRowElement.cloneNode(true);
        cloneElement.setAttribute("id", "");
        cloneElement.setAttribute("class", "receipt-row");
        cloneElement.style.cursor = "pointer";
        let name = cloneElement.getElementsByTagName("div")[0];
        name.textContent = file.name;
        console.log(file.name);
        const fileIds = file.ids;
        let fileIdContent = `<div class='collapsed-list' style="display: flex; justify-content: space-between;"><div>📁 (${fileIds.length})</div><div class="expand-list toggle-list">&plus;</div></div><div class='expanded-list' style="display: none; justify-content: space-between;"><div>`;
        for (let i in fileIds)
        {
            console.log("file", fileIds[i]);
            // getFileUrl(fileIds[i]);
            let count = parseInt(i) + 1;
            fileIdContent += `📁 ${count} of ${fileIds.length} <br />`;
        }
        fileIdContent += "</div><div class='collapse-list toggle-list'>&minus;</div></div>"
        cloneElement.getElementsByTagName("div")[1].innerHTML = fileIdContent;
        cloneElement.style.display = "flex";
        tableContainer.appendChild(cloneElement);
    })
}

function populatePendingActions(pending_actions)
{

    const checkbox = `<div className="w-form">
            <form id="email-form" name="email-form" data-name="Email Form" method="get" aria-label="Email Form">
                <label className="w-checkbox">
                    <input type="checkbox" name="checkbox-2" id="checkbox-2" data-name="Checkbox 2" className="w-checkbox-input checkbox-2">
                    <span className="checkbox-label-2 w-form-label" htmlFor="checkbox-2">Checkbox</span>
                </label>
            </form>
            <div className="w-form-done" class="hide" tabIndex="-1" role="region" aria-label="Email Form success">
                <div>Thank you! Your submission has been received!</div>
            </div>
            <div className="w-form-fail" tabIndex="-1" class="hide" role="region" aria-label="Email Form failure">
                <div>Oops! Something went wrong while submitting the form.</div>
            </div>
        </div>`;
    pending_actions.forEach((action) => {
        let tableContainer = document.getElementById("pending-action-table");
        let sampleRowElement = document.getElementById("pending-action-row");
        let cloneElement = sampleRowElement.cloneNode(true);
        cloneElement.setAttribute("id", "");
        cloneElement.setAttribute("class", "receipt-row");
        // cloneElement.style.cursor = "pointer";
        cloneElement.getElementsByTagName("div")[0].textContent = action.item;
        cloneElement.getElementsByTagName("div")[1].textContent = action.note;
        cloneElement.getElementsByTagName("div")[2].textContent = action.status;
        cloneElement.getElementsByTagName("div")[3].innerHTML = checkbox;
        cloneElement.style.display = "flex";
        tableContainer.appendChild(cloneElement);
    })
}

function populateLinkedAccounts(linked_accounts)
{
    linked_accounts.forEach((account) => {
        let tableContainer = document.getElementById("linked-accounts-table");
        let sampleRowElement = document.getElementById("linked-account-row");
        let cloneElement = sampleRowElement.cloneNode(true);
        cloneElement.setAttribute("id", "");
        cloneElement.setAttribute("class", "receipt-row");
        // cloneElement.style.cursor = "pointer";
        cloneElement.getElementsByTagName("div")[0].textContent = account.bank;
        cloneElement.getElementsByTagName("div")[1].textContent = account.account_number;
        cloneElement.getElementsByTagName("div")[2].textContent = account.source || "Mono";
        cloneElement.getElementsByTagName("div")[3].textContent = account.status == true ? "Available": "Not Available";
        cloneElement.getElementsByTagName("div")[4].textContent = account.last_update;
        cloneElement.getElementsByTagName("div")[5].textContent = account.options || "S, LB,";
        cloneElement.style.display = "flex";
        tableContainer.appendChild(cloneElement);
    })
}

// <a href="#" className="notification-item inbox w-inline-block">
//     <div className="notification-item-icon _1"></div>
//     <div className="notification-item-body">
//         <div className="notification-item-title">Anny Sanders</div>
//         <div className="notification-item-text">This is some text inside of a div block asdsadasdasd.</div>
//     </div>
//     <div className="notification-item-date">1h ago</div>
// </a>

function populateComments(comments)
{
    comments.forEach(comment => {
        let commentsContainer = document.getElementById("comments-section");
        let sampleComment = document.getElementById("comment-item");
        let sampleCommentClone = sampleComment.cloneNode(true);
        sampleCommentClone.setAttribute("id", "");
        // let commentBody = sampleCommentClone.getElementsByClassName("notification-item-body")
        sampleCommentClone.getElementsByTagName("div")[0].innerText = "";
        let commentBody = sampleCommentClone.getElementsByTagName("div")[1];
        commentBody.children[0].textContent = comment.commenter;
        commentBody.children[1].textContent = comment.body;
        sampleCommentClone.getElementsByTagName("div")[2].textContent = comment.date;
        sampleCommentClone.style.display = "flex";
        commentsContainer.appendChild(sampleCommentClone);
    })
}

function toggleUploadedFiles(e)
{
    let element = e.target.parentElement;
    let display = element.style.display.toLowerCase() === "flex" ? "none":"flex";
    let otherDisplay = element.style.display.toLowerCase() === "flex" ? "flex":"none";
    let otherElement = element.classList.value.toLowerCase() === "collapsed-list" ? "expanded-list":"collapsed-list";
    let otherNode = element.parentElement.getElementsByClassName(otherElement);
    element.style.display = display;
    otherNode[0].style.display = otherDisplay;
}

function setContent(item, value, type)
{
    let content = item.innerText.split(":");
    content[1] = content[1] == '' ? 0 : parseFloat(content[1]);
    if (value)
        content[1] += parseFloat(value);
    else
        content[1]++;
    content = content.join(": ");
    item.innerText = content;
}

function applicationFormField(form_info)
{
    let applicationDataContainer = document.getElementById("w-tabs-1-data-w-pane-0");
    applicationDataContainer.innerHTML = '';
    form_info.forEach((form) => {
        let formContainer = document.createElement("div");
        let fieldElement = '<div className="profile-info-heading"><strong>' + form.field_label + '</strong></div>';
        const formValue = form.value;
        const valueType = form.type;
        fieldElement += '<p>';
        if (Array.isArray(formValue))
        {
            formValue.forEach((value) => {
                fieldElement += '- ' + formValue + '<br>'
            })
        }
        else {
            if (typeof formValue == "object")
            {
                if (valueType === "name")
                    fieldElement += '<p>' + formValue.firstName + ' ' + formValue.lastName;
            }
            else {
                fieldElement += '<p>' + formValue;
            }
        }
        fieldElement += '</p>';
        formContainer.innerHTML = fieldElement;
        applicationDataContainer.appendChild(formContainer);
    });
}


// dismiss modal
document.querySelectorAll(".cardmodalcontainer").forEach((element) => {
    element.addEventListener('click', (event) => {
        if (event.target.classList.value == "cardmodalcontainer") event.target.style.display = "none";
    });
});

document.addEventListener("keyup", (event) => {
    if (event.key == "Escape")
    {
        document.querySelectorAll(".cardmodalcontainer").forEach((element) => {
            element.style.display = "none";
        })
    }
});


window.addEventListener('firebaseIsReady', getSingleCustomer);
