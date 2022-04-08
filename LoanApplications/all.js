let loanAppProducts;

async function getLoanProducts() {
    let request = await cbrRequest('/loanAppProducts', 'GET', true); //, idToken);
                
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
              let data = JSON.parse(this.response);

              // console.log(data);
            
              loanAppProducts = data.data;
              
              let parent_el = document.getElementById("field-loan-applications-products");
              appendToSelect(loanAppProducts, parent_el);

              document.getElementById('field-loan-applications-products')
                  .addEventListener('change', (event) => {
                    //add to the stages
                    document.getElementById('field-loan-applications-stage').innerHTML = '';
                    let target = event.target;
                    let selectedProductId = target.value;
                    let productStages = loanAppProducts.filter(function(product) {
                        return product.product_id === selectedProductId;
                    });
                    let selectedStages = productStages[0].stages;
                    populateStage(selectedStages);
              });
        }
      }
      request.send();
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