let loanAppProducts;
let selectedProductObj;

async function getLoanProducts() {
    let request = await cbrRequest('/loanAppProducts', 'GET', true);
                
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
              let data = JSON.parse(this.response);

              console.log(data);
            
              loanAppProducts = data.data.products;
              
              let parent_el = document.getElementById("field-loan-applications-products");
              appendToSelect(loanAppProducts, parent_el);

              //populate stages
              document.getElementById('field-loan-applications-products')
                  .addEventListener('change', (event) => {
                    //add to the stages
                    document.getElementById('field-loan-applications-stage').innerHTML = '';
                    let target = event.target;
                    let selectedProductId = target.value;
                    let productStages = loanAppProducts.filter(function(product) {
                        return product.product_id === selectedProductId;
                    });
                    selectedProductObj = productStages[0];
                    if(productStages.length > 0)
                        populateStage(productStages[0].stages);
                    else;
              });

        //      Populate status
            populateStatus(data.data.statuses);

        }
      }
      request.send();
}

let searchForm = document.getElementById("email-form");
searchForm.addEventListener("submit", getLoanApplications);

async function getLoanApplications(e)
{
    e.preventDefault();
    let product_id = returnSelected(document.getElementById("field-loan-applications-products"));
    let product_stage = returnSelected(document.getElementById("field-loan-applications-stage"));
    let status = returnSelected(document.getElementById("field-loan-applications-status"));
    let from = document.getElementById("name").value;
    let to = document.getElementById("name-2").value;
    let valueArray = {
        "productid": product_id,
        "stage": product_stage,
        "from": from,
        "to": to,
        "status": status
    };
    let queryString = arrayToQueryString(valueArray);
    let endpoint = "/loanApplications?" + queryString;
    let request = await cbrRequest(endpoint, 'GET', true);

    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            let result = JSON.parse(this.response);

            console.log("result", result);
            let data = result.data;
            let message = result.message;

            if (data !== "" && data.length > 0)
            {
                const cardContainer = document.getElementById("application-receipt-table");
                const sampleRow  = document.getElementById("sample-application-tr");
                const receiptRow = sampleRow.cloneNode(true);
                receiptRow.setAttribute('id', '');
                receiptRow.setAttribute("class", "receipt-row");
                receiptRow.style.cursor = "pointer";

                data.forEach(application => {
                    const newRowElement = receiptRow;
                    receiptRow.addEventListener("click", function () {
                        document.location.href = "/loan-applications/loan-application?id=" + application.id;
                    });

                    const customerName = newRowElement.getElementsByTagName("div")[0];
                    customerName.textContent = application.customer;

                    const applicationDate = newRowElement.getElementsByTagName("div")[1];
                    applicationDate.textContent = application.submission_date;

                    const applicationStage = newRowElement.getElementsByTagName("div")[2];
                    applicationStage.textContent = setApplicationStageOnTable(application.stage); // stage_id

                    const applicationStatus = newRowElement.getElementsByTagName("div")[3];
                    applicationStatus.textContent = kebabToString(application.status);

                    cardContainer.appendChild(newRowElement);
                });
            }

            return;

            let parent_el = document.getElementById("field-loan-applications-products");

        }
    }
    request.send();
}

function arrayToQueryString(data){
    let queryString = new Array();
    for(let key in data){
        if (data[key] !== "")
        {
            queryString.push(key + '=' + encodeURIComponent(data[key]));
        }
    }
    return queryString.join('&');
}

function setApplicationStageOnTable(stage_id)
{
    let selectedStage = selectedProductObj.stages.filter(function(stage) {
        return stage.stage_id === stage_id;
    });
    return selectedStage[0].stage_name;
}

// populate stages

function populateStage(product_stages) {
    let parent_el = document.getElementById('field-loan-applications-stage');
    parent_el.innerHTML = '';
    if(product_stages != '' || product_stages.length > 0) {
        product_stages.forEach((di, index) => {
            let option = document.createElement("option");

            option.value= di.stage_id;
            option.innerHTML = di.stage_name;

            parent_el.appendChild(option);
        });
    }
}

function populateStatus(statuses)
{
    let parent_el = document.getElementById("field-loan-applications-status");
    console.log(statuses);
    let data = statuses; // loanAppProducts.status;
    if(data != '' || data.length > 0) {
        data.forEach((di, index) => {
            let option = document.createElement("option");

            option.value= di;
            option.innerHTML = kebabToString(di); //  di.toUpperCase();

            parent_el.appendChild(option);
        });
    }
}

function kebabToString(kebab)
{
    let string = kebab.charAt(0).toUpperCase() + kebab.slice(1);
    return string.replace(/-/g, " ");
}

function appendToSelect(data, parent_gl_select_el = '') {
    if(data != '' || data.length > 0) {
        data.forEach((di, index) => {
            let option = document.createElement("option");

            option.value= di.product_id;
            option.innerHTML = di.product_name;

            parent_gl_select_el.appendChild(option);
        });
    }
}


Webflow.push(function() {
    // Disable submitting form fields during development
    $('form').submit(function() {
        return false;
    });
});


window.addEventListener('firebaseIsReady', () => {
    getLoanProducts();
});