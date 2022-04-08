let loanAppProducts;

async function getLoanProducts() {
    let request = await cbrRequest('/loanAppProducts', 'GET', true); //, idToken);
                
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
let searchBtn = searchForm.lastChild;
searchBtn.addEventListener("click", getLoanApplications( "one"));
document.getElementsByTagName("a", getLoanApplications( "two"));
searchForm.children[0].addEventListener("click", getLoanApplications( "three"));

async function getLoanApplications(which)
{
    // e.preventDefault();
    console.log("application started by", which);
    return;
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
    console.log(endpoint);
    return;
    let request = await cbrRequest('/loanApplications?productid=&stage=&from=&to=&status=', 'GET', true); //, idToken);

    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            let result = JSON.parse(this.response);

            console.log(result);

            let parent_el = document.getElementById("field-loan-applications-products");

        }
    }
    request.send();
}

function arrayToQueryString(data){
    var queryString = new Array();

    for(var key in data){
        queryString.push(key + '=' + encodeURIComponent(array_in[key]));
    }

    return queryString.join('&');
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


window.addEventListener('firebaseIsReady', () => {
    getLoanProducts();
});