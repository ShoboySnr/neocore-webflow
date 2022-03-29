    var myUrl = new URL(document.location.href)
    var userID = myUrl.searchParams.get("id")

    fbauth.onAuthStateChanged((user) => {
        
      if(user) {
          fbauth.currentUser.getIdToken(true).then(async (idToken) => {


          })
        }
      });
    
    //activate customers
    document.getElementById("button-customer-activate-customer").addEventListener("click", function() { 
        const status = true;
      updateCustomerStatus(status)
    });
    //deactivate customer
    document.getElementById("button-customer-deactivate-customer").addEventListener("click", function() { 
        const status = false;
      updateCustomerStatus(status)
    });

    //profile picture modal
    document.getElementById("button-customer-update-picture").addEventListener("click", function(e) { 
        e.preventDefault();
        const profile_pictue = document.getElementById("profile_picture_id");
        profile_pictue.style.display = "block";
    });

    document.getElementById("close_profile_modal").addEventListener("click", function(e) {
      e.preventDefault();
      const profile_pictue = document.getElementById("profile_picture_id");
      profile_pictue.style.display = "none";
    })

    //Address modal
    document.getElementById("button-customer-update-home-address").addEventListener("click", function(e) { 
      e.preventDefault();
        const user_address_container = document.getElementById("user_address_container_id");
        user_address_container.style.display = "block";
    });

    document.getElementById("close_address_modal").addEventListener("click", function(e) {
      e.preventDefault();
      const user_address_container = document.getElementById("user_address_container_id");
      user_address_container.style.display = "none";
    })

    document.getElementById("update_address_button").addEventListener("click",function(e){
      e.preventDefault();
      const input_street1 = document.getElementById("street1").value

      const input_street2 = document.getElementById("street2").value

      const input_town = document.getElementById("town").value

      const input_state = document.getElementById("state").value

      const input_lga = document.getElementById("lga").value

      let request = cbrRequest(`/users/${userID}/homeAddress`,'POST',true);

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
        addNewProduct.reset();
        const success_message = data.message;
        
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
     
    })

    
    function updateCustomerStatus(activeStatus) {
        let request = cbrRequest(`/users/${userID}/activate/${activeStatus}`, 'PATCH', true)
      
      request.onload = function() {
      
        if (request.status >= 200 && request.status < 400) {
          document.location.reload()
        } else {
            return false
        } 
      }
      
      request.send()
    }