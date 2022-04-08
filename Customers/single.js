
  async function getSingleCustomer() {
      var myUrl = new URL(document.location.href)
      var applicationID = myUrl.searchParams.get("id")

      if(userID === '') {
        alert('No loan is specified, please spicify a user and try again.');
        window.location.href = '/loan-applications/loan-applications';
      }
    
      let request = await cbrRequest(`/users/${applicationID}`, 'GET', true)
      
      let activeStatus = false;
      
      request.onload = function() {
      
        let data = JSON.parse(this.response)
      
        // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
        if (request.status >= 200 && request.status < 400) {
          console.log("new data", data);
          return;
          const customer = data.data;

          document.getElementById('title-field-full-name').innerHTML += `${customer.FirstName} ${customer.LastName} ${customer.OtherNames || ''}`;
          
          return;
        
        } else {
              console.log('error');
        }
      }
      
      //send request
      request.send();
  }
  
  //activate customers
  document.getElementById("button-customer-activate-customer").addEventListener("click", function() { 
      updateCustomerStatus(userID, true)
  });

  document.getElementById("button-customer-deactivate-customer").addEventListener("click", function() { 
      updateCustomerStatus(userID, false)
  });

  //profile picture modal
  document.getElementById("button-customer-update-picture").addEventListener("click", function(e) { 
        e.preventDefault();
        const profile_pictue = document.getElementById("profile-picture-section");
        profile_pictue.style.display = "flex";
    });

    // document.getElementById("close_profile_modal").addEventListener("click", function(e) {
    //   e.preventDefault();
    //   const profile_pictue = document.getElementById("profile_picture_id");
    //   profile_pictue.style.display = "none";
    // })

    //Address modal
    document.getElementById("button-customer-update-home-address").addEventListener("click", function(e) { 
        e.preventDefault();
        const user_address_container = document.getElementById("user_address_container_id");
        user_address_container.style.display = "flex";
    });

    // document.getElementById("close_address_modal").addEventListener("click", function(e) {
    //   e.preventDefault();
    //   const user_address_container = document.getElementById("user_address_container_id");
    //   user_address_container.style.display = "none";
    // })

    document.getElementById("edit-customer-address-form").addEventListener("submit", async (e)=>{
      e.preventDefault();
      e.stopPropagation();
      const input_street1 = document.getElementById("street1").value

      const input_street2 = document.getElementById("street2").value

      const input_town = document.getElementById("town").value

      const input_state = document.getElementById("state").value

      const input_lga = document.getElementById("lga").value

      let request = await cbrRequest(`/users/${userID}/homeAddress`,'POST',true);

      let data ={
          "addressType": 1,
          "street": input_street1,
          "street2": input_street2,
          "town": input_town,
          "state": input_state,
          "lga": input_lga
        }

      request.onload = function() {
        
        let data = JSON.parse(this.response);
        // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
        if (request.status >= 200 && request.status < 400) {
        const success_message = data.message;
        
        //show success message
        let success_message_el = document.getElementById("edit-address-success-message");
        success_message_el.innerHTML = success_message;
        success_message_el.style.display = "block";
        
        } else {
                const failed_message = data.message;
                let failed_message_el = document.getElementById("edit-address-error-message");
            failed_message_el.innerHTML = failed_message;
            failed_message_el.style.display = "block";
        }
      }
      request.send(JSON.stringify(data));
     
    },true)
  
  document.getElementById('customer_validation_form').addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

      const bvn_checkbox = document.getElementById("bvn").checked

      const phonenumber_checkbox = document.getElementById("phone_number").checked

      const email_checkbox = document.getElementById("email_address").checked

      const idcard_checkbox = document.getElementById("id_card").checked

      const homeaddress_checkbox = document.getElementById("home_address").checked

      const workaddress_checkbox = document.getElementById("work_address").checked
      
      const liveness_checkbox = document.getElementById("liveness").checked

      const selfiematch_checkbox = document.getElementById("selfie_match").checked

      let request = await cbrRequest(`/users/${userID}/validateData`,'POST',true);

      let data ={
          "BVN": bvn_checkbox,
          "PhoneNumber": phonenumber_checkbox,
          "Email": email_checkbox,
          "ID": idcard_checkbox,
          "HomeAddress": homeaddress_checkbox,
          "WorkAddress": workaddress_checkbox,
          "Liveness": liveness_checkbox,
          "SelfieMatch": selfiematch_checkbox,
        }

      request.onload = function() {
        
        let data = JSON.parse(this.response);
        // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
        if (request.status >= 200 && request.status < 400) {
        const success_message = data.message;
        
        //show success message
        let success_message_el = document.getElementById("validate-data-success-message");
        success_message_el.innerHTML = success_message;
        success_message_el.style.display = "block";
        
        } else {
                const failed_message = data.message;
                let failed_message_el = document.getElementById("validate-data-error-message");
            failed_message_el.innerHTML = failed_message;
            failed_message_el.style.display = "block";
        }
      }
      request.send(JSON.stringify(data))

  },true)

  document.getElementById('button-customer-validate-data').addEventListener("click", function(e) {
    e.preventDefault();
    const user_validation = document.getElementById("manual_validate_container_id");
    user_validation.style.display = "flex";
  })
  
  if(document.getElementById('close-customer-manually-validate')) {
    document.getElementById('close-customer-manually-validate').addEventListener("click", function(e) {
      e.preventDefault();
      const user_validation = document.getElementById("manual_validate_container_id");
      user_validation.style.display = "none";
    })
  }

  async function updateCustomerStatus(userID, activeStatus) {

    let request = await cbrRequest(`/users/${userID}/activate/${activeStatus}`, 'PATCH', true)
    
    request.onload = function() {
    
      if (request.status >= 200 && request.status < 400) {
          const message = activeStatus ? 'Activated' : 'Deactivated';
          alert('Customer status successfully ' + message);
          document.location.reload()
      } else {
          alert('There was an error updating the customer status')
          return
      } 
    }
    
    request.send();
  }

  async function updateCustomerPassportPicture(userID) {
      let request = await cbrRequest(`/users/${userID}/activate/passportPicture`, 'POST', true)
      
      request.onload = function() {
      
        if (request.status >= 200 && request.status < 400) {
            const message = activeStatus ? 'Activated' : 'Deactivated';
            alert('Customer status successfully ' + message);
            document.location.reload()
        } else {
            alert('There was an error uploading customer passport')
            return
        } 
      }
      
      request.send();
  }

  window.addEventListener('firebaseIsReady', getSingleCustomer);
  