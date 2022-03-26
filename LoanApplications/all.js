function getLoanProducts() {
    fbauth.onAuthStateChanged((user) => {
        
        if(user) {
            await fbauth.currentUser.getIdToken(true).then((idToken) => {
                let request = cbrRequest('/loanAppProducts', 'GET', true, idToken);
                
                request.onload = function() {
        
                    if (request.status >= 200 && request.status < 400) {
                          let data = JSON.parse(this.response);
                        
                          let loan_application_products = data.data;
                          console.log(loan_application_products);
                          
                          let parent_el = document.getElementById("field-loan-application-products");
                          appendToSelect(loan_application_products, parent_el);
                    }
                  }
                  request.send();


            });
        }
    });
}

function appendToSelect(data, parent_gl_select_el = '') {
    if(data != '' || data.length > 0) {
      data.forEach((di, index) => {
         let option = document.createElement("option");
  
            option.value= di.ID;
            option.innerHTML = di.Name;
  
            parent_gl_select_el.appendChild(option);
        });
     }
  }

window.addEventListener('DOMContentLoaded', () => {
    getLoanProducts();
});