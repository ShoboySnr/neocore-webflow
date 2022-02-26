    var myUrl = new URL(document.location.href)
    var userID = myUrl.searchParams.get("id")
    
    let request = cbrRequest(`/users/${userID}`, 'GET', true)
    
    let activeStatus = false;
    
    request.onload = function() {
    
      let data = JSON.parse(this.response)
    
      // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
      if (request.status >= 200 && request.status < 400) {
      const customer = data.data;
      
      const edit_url_link = document.getElementById("edit-customer-link")
      edit_url_link.href= `/customers/edit?id=${customer.ID}`; 
     
      const cardContainer = document.getElementById("customers-container")
      
      const customer_title_bg = document.getElementById("customer-title-bg")
      
      const customer_name_title = document.getElementById('title-field-full-name');
      customer_name_title.textContent += `${customer.FirstName} ${customer.LastName} ${customer.OtherNames || ''}`
      
      const member_card = document.getElementById("customer-info-card")
      
      const profile_info = member_card.getElementsByClassName('profile-info')[0]
      const customer_name_profile = profile_info.getElementsByClassName('profile-name')[0]
      customer_name_profile.textContent = `${customer.FirstName} ${customer.LastName} ${customer.OtherNames || ''}`
      
      const member_avatar_class = profile_info.getElementsByClassName('avatar')[0]
      if(customer.ImageUrl !== '') member_avatar_class.style.backgroundImage = "url('" + customer.ImageUrl + "')";
      
      const profile_details = profile_info.getElementsByClassName('profile-details')[0]
      const div = profile_details.getElementsByTagName('div')[0];
      div.textContent = customer.EmailAddress
      
      const phone_id = document.getElementById("phone")
      phone_id.textContent = customer.PhoneNumber
      
      const email_id = document.getElementById("email")
      email_id.textContent = customer.EmailAddress
      
      const dob_id = document.getElementById("dob")
      dob.textContent = readableDate(customer.Dob)
      
      const bvn_id = document.getElementById("bvn")
      bvn_id.textContent = customer.Bvn
      
      const active_status_id = document.getElementById("active-status")
      if(customer.Active) {
          let deactivate_button_el = document.getElementById("deactivate-customer");
          deactivate_button_el.classList.remove("hide")
          active_status_id.innerHTML = '<span class="text-success">Active</span>'
          document.getElementById('"button-customer-deactivate-customer').setAttribute('style', 'display:block');
      } else {
          let activate_button_el = document.getElementById("activate-customer");
          activate_button_el.classList.remove("hide")
          active_status_id.innerHTML = '<span class="text-danger">Inactive</span>';
          document.getElementById('"button-customer-activate-customer').setAttribute('style', 'display:block')
      }
      
      const gender_id = document.getElementById("gender")
      gender_id.textContent = readGender(customer.Gender)
      
      const kyc_level_id = document.getElementById("kyc-level")
      kyc_level_id.textContent = customer.KycLevel
      
      const deposit_accounts = document.getElementById("deposit-accounts")
      deposit_accounts.textContent = customer.DepositAccounts || ''
      
      const loan_accounts = document.getElementById("loan-accounts")
      loan_accounts.textContent = customer.LoanAccounts || ''
      
      const saved_beneficiaries = document.getElementById("saved-beneficiaries")
      saved_beneficiaries.textContent = customer.SavedBeneficiaries || ''
      
      const customer_meta = document.getElementById("customer-meta")
      customer_meta.textContent = customer.Meta || ''
      
      const customer_ids = document.getElementById("customer-ids")
      customer_ids.textContent = customer.IDs || ''
      
      const customer_device_id = document.getElementById("customer-device-id")
      customer_device_id.textContent = customer.DeviceID
      
      const address_type = document.getElementById("address-type")
      address_type.textContent = readAddressType(customer.AddressType)
      
      const address_street = document.getElementById("address-street")
      address_street.textContent = customer.Street
      
      const address_street_2 = document.getElementById("address-street-2")
      address_street_2.textContent = customer.Street2
        
      const address_town = document.getElementById("address-town")
      address_town.textContent = customer.Town
      
      const address_state = document.getElementById("address-state")
      address_state.textContent = customer.State
      
      const address_lga = document.getElementById("address-lga")
      address_lga.textContent = customer.Lga
      
      let workInformation = customer.WorkInformation
      const work_name = document.getElementById("work-name")
      work_name.textContent = workInformation.Name
      
      const work_role_type = document.getElementById("work-role-type")
      work_role_type.textContent = readRoleType(workInformation.RoleType)
      
      let workAddress = workInformation.Address
      const work_address_type = document.getElementById("work-address-type")
      work_address_type.textContent = readAddressType(workAddress.AddressType)
      
      const work_street = document.getElementById("work-street")
      work_street.textContent = workAddress.Street
      
      const work_street_2 = document.getElementById("work-street-2")
      work_street_2.textContent = workAddress.Street2
      
      const work_town = document.getElementById("work-town")
      work_town.textContent = workAddress.Town
      
      const work_state = document.getElementById("work-state")
      work_state.textContent = workAddress.State
      
      const work_lga = document.getElementById("work-lga")
      work_lga.textContent = workAddress.Lga

      // Edit Address
      const edit_street1 = document.getElementById("street1")
      edit_street1.value = customer.Street

      const edit_street2 = document.getElementById("street2")
      edit_street2.value = customer.Street2

      const edit_town = document.getElementById("town")
      edit_town.value = customer.Town

      const edit_state = document.getElementById("state")
      edit_state.value = customer.State

      const edit_lga = document.getElementById("lga")
      edit_lga.value = customer.Lga
      
      } else {
           console.log('error');
     }
    }
    
    //send request
    request.send();
    
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