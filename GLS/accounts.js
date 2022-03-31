async function getGLAccounts() {

    let request = await cbrRequest('/gl-flat', 'GET', true)

    // When the 'request' or API request loads, do the following...
    request.onload = function () {
        let data = JSON.parse(this.response)
        let counter = 0;
        if (request.status >= 200 && request.status < 400) {
            const cardContainer = document.getElementById("customers-container")
            data.data.forEach((gl, index) => {
                    const style = document.getElementById('sample-customer')
                const card = style.cloneNode(true)

                card.setAttribute('id', '');
                card.style.display = 'block';

                card.addEventListener('click', function () {
                    document.location.href = "/gls/account?id=" + gl.gLCode;
                });
                
                const glcode = card.getElementsByTagName('p')[0]
                glcode.textContent = gl.gLCode;

                const name = card.getElementsByTagName('p')[1]
                name.textContent = gl.name;
                
                const description = card.getElementsByTagName('p')[2]
                description.textContent = gl.description;
                
                const type_el = card.getElementsByTagName('p')[3]
                type_el.textContent = readGLType(gl.type);

                const usage = card.getElementsByTagName('p')[4]
                usage.textContent = readGLUsage(gl.usage);
                
                const balance = card.getElementsByTagName('p')[5]
                balance.textContent = format_currency(gl.balance);

                cardContainer.appendChild(card);
            })
        }
    }

    request.send();
    
}

window.addEventListener('firebaseIsReady', () => {
    getGLAccounts();
})