function getLoanProducts() {
    fbauth.onAuthStateChanged((user) => {
        
        if(user) {
            await fbauth.currentUser.getIdToken(true).then((idToken) => {
                let request = cbrRequest('/loanAppProducts', 'GET', true, idToken);



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