async function getGLAccount() {
    var myUrl = new URL(document.location.href)
    var glcode = myUrl.searchParams.get("id")

    let request = await cbrRequest(`/gl/${glcode}`, 'GET', true)

    request.onload = function() {

    let data = JSON.parse(this.response)

    // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
    if (request.status >= 200 && request.status < 400) {
        const gl_details = data.data;
        
        const customer_title_bg = document.getElementById("card-details");
        
        const field_glcode = document.getElementById("field-glcode");
        field_glcode.textContent = gl_details.gLCode
        
        const field_usage = document.getElementById("field-usage");
        field_usage.textContent = readGLUsage(gl_details.usage)
        
        const field_type = document.getElementById("field-type");
        field_type.textContent = readGLType(gl_details.type)
        
        const name_el = document.getElementById("field-name");
        name_el.textContent = gl_details.name
        
        const description_el = document.getElementById("field-description");
        description_el.textContent = gl_details.description
        
        const total_el = document.getElementById("field-total");
        total_el.textContent = gl_details.total
        
        const balance_el = document.getElementById("field-balance");
        balance_el.textContent = format_currency(gl_details.balance)
    
        } else {
                // handle error
        }
    
    }
    
    request.send();
}

window.addEventListener('firebaseIsReady', () => {
    getGLAccount();
})