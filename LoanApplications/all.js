let loanAppProducts;

async function getLoanProducts() {
    let request = await cbrRequest('/loanAppProducts', 'GET', true); //, idToken);
                
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
              let data = JSON.parse(this.response);

              console.log(data);
            
              loanAppProducts = data.data;
              
              let parent_el = document.getElementById("field-loan-applications-products");
              appendToSelect(loanAppProducts, parent_el);

              document.getElementById('field-loan-applications-products').addEventListener('change', (event) => {
                let target = event.target;
                
                //add to the stages
                document.getElementById('field-loan-applications-stage').innerHTML = '';

              });
        }
      }
      request.send();
}

// populate stages
//field-loan-applications-products
let productFieldList = document.getElementById("field-loan-applications-products");
productFieldList.addEventListener("change", populateStage);

function populateStage(product_stages) {
    document.getElementById('field-loan-applications-stage').innerHTML = '';
    console.log("stages", product_stages);
    console.log("this", this);
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