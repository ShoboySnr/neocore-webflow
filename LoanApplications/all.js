async function getLoanProducts() {
    fbauth.onAuthStateChanged((user) => {
        
        if(user) {
            fbauth.currentUser.getIdToken(true).then(async (idToken) => {
                let request = await cbrRequest('/loanAppProducts', 'GET', true, idToken);
                
                request.onload = function() {
        
                    if (request.status >= 200 && request.status < 400) {
                          let data = JSON.parse(this.response);

                          console.log(data);
                        
                          let loan_application_products = data.data;
                          console.log(loan_application_products);
                          
                          let parent_el = document.getElementById("field-loan-applications-products");
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

window.addEventListener('firebaseIsReady', () => {
    getLoanProducts();
});