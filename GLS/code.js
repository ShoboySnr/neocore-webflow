const addNewGL = document.getElementById("wf-form-Get-GL-Form")
addNewGL.addEventListener('submit', findGLByCode);

async function findGLByCode(event) {
    event.preventDefault();

    const cardContainer = document.getElementById("customers-container")
    const former_card = cardContainer.childNodes[1];

    const style = document.getElementById('sample-customer')
    const card = style.cloneNode(true)
    style.style.display = 'none';

    let formData = new FormData(this);
    let glcode = formData.get('field-glcode');

    if(glcode === '' || glcode === null) {
    alert('Please enter correct glcode');
    return;
    }

    let request = await cbrRequest('/gl/'+ glcode, 'GET', true);

    request.onload = function () {
    let data = JSON.parse(this.response)
    console.log(data);

    // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
    if (request.status >= 200 && request.status < 400) {

    const gl = data.data;

    card.style.display = 'block';

    card.addEventListener('click', function () {
        document.location.href = "/gls/account?id=" + gl.gLCode;
    });

    const id = card.getElementsByTagName('p')[0]
    id.textContent = '1';

    const glcode = card.getElementsByTagName('p')[1]
    glcode.textContent = gl.gLCode;

    const name = card.getElementsByTagName('p')[2]
    name.textContent = gl.name;

    const description = card.getElementsByTagName('p')[3]
    description.textContent = gl.description;

    const type_el = card.getElementsByTagName('p')[4]
    type_el.textContent = readGLType(gl.type);

    const usage = card.getElementsByTagName('p')[5]
    usage.textContent = readGLUsage(gl.usage);

    cardContainer.replaceChild(card, former_card);
    } else {
        alert('GL does not exits.');
        return;
    }
    }

    request.send();
}