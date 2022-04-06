async function getDepositProducts() {

    let request = await cbrRequest('/deposit-product', 'GET', true)
    let gls_array = [];

    // When the 'request' or API request loads, do the following...
    request.onload = function () {
        let data = JSON.parse(this.response)
        let counter = 0;
        if (request.status >= 200 && request.status < 400) {
            const cardContainer = document.getElementById("customers-container")
            data.data.forEach((di, index) => {
                    const style = document.getElementById('sample-customer')
                const card = style.cloneNode(true)

                card.setAttribute('id', '');
                card.style.display = 'block';

                card.addEventListener('click', function () {
                    document.location.href = "/deposit-products/view?id=" + di.id;
                });
                
                const name_el = card.getElementsByTagName('p')[0]
                name_el.textContent = di.name;
                
                const product_code_el = card.getElementsByTagName('p')[1]
                product_code_el.textContent = di.productCode;
                
                const overdraft_gl_el = card.getElementsByTagName('p')[2]
                overdraft_gl_el.textContent = di.overdraftGLId;
                
                const liability_gl_el = card.getElementsByTagName('p')[3]
                liability_gl_el.textContent = di.overdraftGLId;

                cardContainer.appendChild(card);
            })
        }
    }

    request.send();
    
}
    
window.addEventListener('firebaseIsReady', () => {
    getDepositProducts();
})