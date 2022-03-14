const getLoanProducts = () => {

    let request = cbrRequest('/loanProduct', 'GET', true)
    let gls_array = [];

    // When the 'request' or API request loads, do the following...
    request.onload = function () {
        let data = JSON.parse(this.response)
        if (request.status >= 200 && request.status < 400) {
            const cardContainer = document.getElementById("customers-container")
            data.data.forEach((di, index) => {
                    const style = document.getElementById('sample-loan-products')
                const card = style.cloneNode(true)

                card.setAttribute('id', '');
                card.style.display = 'block';

                const modal_popup = document.getElementById('modal-popup-section');
                const modal_popup_clone = modal_popup.cloneNode(true);
                modal_popup_clone.setAttribute('id', 'modal-popup-section-' + di.ID);

                modal_popup_clone.querySelector('#field-loan-id').textContent = di.ID;
                modal_popup_clone.querySelector('#field-loan-strict').textContent = readStates(di.Strict);

                document.body.appendChild(modal_popup_clone);

                card.addEventListener('click', ()  => {
                    loanProductModalpopup(di.ID);
                });
                
                const name_el = card.getElementsByTagName('p')[0]
                name_el.textContent = di.Name;
                
                const product_code_el = card.getElementsByTagName('p')[1]
                product_code_el.textContent = di.ProductCode;
                
                const overdraft_gl_el = card.getElementsByTagName('p')[2]
                overdraft_gl_el.textContent = di.LoanInterest;
                
                const liability_gl_el = card.getElementsByTagName('p')[3]
                liability_gl_el.textContent = di.InterestType;

                const action_el = card.getElementsByTagName('p')[4];
                action_el.innerHTML = '<a title="' + di.Name + '" href="javascript:void(0);" onclick="loanProductModalpopup(\'' + di.ID +'\');">View</a>';

                cardContainer.appendChild(card);
            })
        }
    }

    request.send();
    
}

document.addEventListener('DOMContentLoaded', () => {
    getLoanProducts();
});

function loanProductModalpopup(productID) {
    document.querySelector('#modal-popup-section-' + productID).setAttribute('style', 'display:block');
}