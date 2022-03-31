var myUrl = new URL(document.location.href)
let parent_gls = [];

async function getGLAccounts() {
    let request = await cbrRequest('/gl-flat', 'GET', true)
    
    request.onload = function() {
        
    if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(this.response);
            parent_gls = data.data;
            
            let parent_gl_select_el = document.getElementById("field-parent-glid");
            filterGL();
        }
    }
    request.send();
}

function filterGL(type = '') {
  const parent_gl_select_el = document.getElementById("field-parent-glid");
  parent_gl_select_el.options.length = 0;
  
  const parent_gl_div = document.getElementById("div-parent-gl");
  const top_level_value = document.getElementById("field-top-level").value;
  
  if(type.length > 0 && top_level_value === 'false') {
    parent_gl_div.style.display = 'block';

    let option = document.createElement("option");

    option.value= '';
    option.innerHTML = 'Select a GL';

    parent_gl_select_el.appendChild(option);

    parent_gls.forEach((gl, index) => {
      if(gl.usage === 2 && type == gl.type) {
          let option = document.createElement("option");

          option.value= gl.id;
          option.innerHTML = gl.name;

          parent_gl_select_el.appendChild(option);
        }
      });
   } else {
    parent_gl_div.style.display = 'none';
   }
}

const addNewGL = document.getElementById("wf-form-new-gl")
addNewGL.addEventListener('submit', createNewGL);

const filterUsageType = document.getElementById("field-type");
filterUsageType.addEventListener('change', filterGLByType);

const filterTopLevel = document.getElementById("field-top-level");
filterTopLevel.addEventListener('change', filterGLByType);

function filterGLByType(e) {
	const type = document.getElementById("field-type").value;
  
  const top_level_value = document.getElementById("field-top-level").value;
  filterGL(type);
}

async function createNewGL(e) {
	//get all the submitted information
  e.preventDefault();
  
  let formData = new FormData(this);
  let type = formData.get('field-type');
  let usage = formData.get('field-usage');
  const name = formData.get('field-name');
  const description = formData.get('field-description');
  let topLevel = formData.get('field-top-level');
  
  if(topLevel === 'true') {
    topLevel = true;
  } else topLevel = false;
  
  //const tags = formData.get('field-tags').split(',');
  const tags = '';
  
  type = parseInt(type);
  usage = parseInt(usage);
  
  let data = {
  	"type" : type,
    "usage": usage,
    "name": name,
    "description" : description,
    "topLevel": topLevel,
    "tags": {},
  }
  
  if(type > 0 && topLevel === false) {
  	data["parentGLID"] = formData.get('field-parent-glid');
  }
  
  let request = await cbrRequest(`/gl`, 'POST', true)
  
  request.onload = function() {
  
  // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
  	if (request.status >= 200 && request.status < 400) {
    	let data = JSON.parse(this.response);
    	addNewGL.reset();
      const success_message = data.message;
      const glcode = data.data.glcode;
      
      //show success message
      let success_message_el = document.getElementById("success-message");
      success_message_el.innerHTML = success_message;
      success_message_el.style.display = "block";
      
    } else {
   		const failed_message = data.message;
   		let failed_message_el = document.getElementById("failed-message");
      failed_message_el.innerHTML = failed_message;
      failed_message_el.style.display = "block";
    }
  }
  
  request.send(JSON.stringify(data));
}

window.addEventListener('firebaseIsReady', () => {
    getGLAccounts();
})