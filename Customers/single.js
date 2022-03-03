
  var myUrl = new URL(document.location.href)
  var userID = myUrl.searchParams.get("id")

  if(userID === '') {
    alert('No user is specified, please spicify a user and try again.');
    window.location.href = '/users/list';
  }
  
  let request = cbrRequest(`/users/${userID}`, 'GET', true)
  
  let activeStatus = false;
  
  request.onload = function() {
  
    let data = JSON.parse(this.response)
  
    // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
    if (request.status >= 200 && request.status < 400) {
      const customer = data.data;

      document.getElementById('title-field-full-name').innerHTML += `${customer.FirstName} ${customer.LastName} ${customer.OtherNames || ''}`;

      const customer_serial_number_el = document.getElementById('field-customer-serial-number');
      customer_serial_number_el.textContent = customer.SerialNumber;

      const customer_status_el = document.getElementById('field-customer-status');
      customer_status_el.innerHTML = readStatus(customer.Active);
      console.log(customer.Active);
      if(customer.Active) {
        document.getElementById('button-customer-deactivate-customer').setAttribute('style', 'display: block');
      } else {
        document.getElementById('button-customer-activate-customer').setAttribute('style', 'display: block');
      }

      const customer_first_name_el = document.getElementById('field-customer-first-name');
      customer_first_name_el.textContent = customer.FirstName;

      const customer_last_name_el = document.getElementById('field-customer-last-name');
      customer_last_name_el.textContent = customer.LastName;

      const customer_other_names_el = document.getElementById('field-customer-other-names');
      customer_other_names_el.textContent = customer.OtherNames;

      const customer_nickname_el = document.getElementById('field-customer-nickname');
      customer_nickname_el.textContent = customer.Nickname;

      // const customer_passport_el = document.getElementById('field-customer-passport');
      // customer_passport_el.textContent = customer.PassportID;

      const customer_gender_el = document.getElementById('field-customer-gender');
      customer_gender_el.textContent = readGender(customer.Gender);


      const customer_email_address_el = document.getElementById('field-customer-email-address');
      customer_email_address_el.textContent = customer.EmailAddress;

      const customer_phone_number_el = document.getElementById('field-customer-phone-number');
      customer_phone_number_el.textContent = customer.PhoneNumber;

      const customer_deposit_accounts_el = document.getElementById('field-customer-deposit-accounts');
      customer_deposit_accounts_el.textContent = customer.DepositAccounts;

      const customer_loan_accounts_el = document.getElementById('field-customer-loan-accounts');
      customer_loan_accounts_el.textContent = customer.LoanAccounts;

      const customer_bvn_el = document.getElementById('field-customer-bvn');
      customer_bvn_el.textContent = customer.LoanAccounts;

      const customer_date_of_birth_el = document.getElementById('field-customer-date-of-birth');
      customer_date_of_birth_el.textContent = readableDate(customer.Dob);

      const customer_device_id_el = document.getElementById('field-customer-device-id');
      customer_device_id_el.textContent = customer.DeviceID || '';

      const customer_saved_beneficiaries_el = document.getElementById('field-customer-saved-beneficiaries');
      customer_saved_beneficiaries_el.textContent = customer.SavedBeneficiaries || '';

      const customer_meta_el = document.getElementById('field-customer-meta');
      customer_meta_el.textContent = customer.Meta || '';

      //Work Information
      const work_info = customer.WorkInformation

      const customer_work_name_el = document.getElementById('field-work-name');
      customer_work_name_el.textContent = work_info.Name;

      const customer_role_type_el = document.getElementById('field-work-role-type');
      customer_role_type_el.textContent = readRoleType(work_info.RoleType);

      const customer_address_type_el = document.getElementById('field-work-address-type');
      customer_address_type_el.textContent = readAddressType(work_info.RoleType);

      const work_full_address = work_info.Address;
      const customer_work_full_address_el = document.getElementById('field-work-full-address');
      customer_work_full_address_el.textContent = `${work_full_address.Street} ${work_full_address.Street2} ${work_full_address.Town} ${work_full_address.State} ${work_full_address.Lga}`;

      //Customer Validations
      const customer_validations = customer.Validations;

      const customer_validations_bvn_el = document.getElementById('field-validations-bvn');
      customer_validations_bvn_el.textContent = readStates(customer_validations.BVN);

      const customer_validations_phone_number_el = document.getElementById('field-validations-phone-number');
      customer_validations_phone_number_el.textContent = readStates(customer_validations.PhoneNumber);

      const customer_validations_email_el = document.getElementById('field-validations-email');
      customer_validations_email_el.textContent = readStates(customer_validations.Email);

      const customer_validations_id_el = document.getElementById('field-validations-id');
      customer_validations_id_el.textContent = readStates(customer_validations.ID);

      const customer_validations_home_address_el = document.getElementById('field-validations-home-address');
      customer_validations_home_address_el.textContent = readStates(customer_validations.HomeAddress);

      const customer_validations_work_address_el = document.getElementById('field-validations-work-address');
      customer_validations_work_address_el.textContent = readStates(customer_validations.WorkAddress);

          
      //Customer Address
      const customer_address = customer.Address;

      const customer_address_street = document.getElementById('customer-address-street');
      customer_address_street.textContent = customer_address.Street;
      customer_address_street.style.textTransform = "capitalize";

      const customer_address_street2 = document.getElementById('customer-address-street2');
      customer_address_street2.textContent = customer_address.Street2;
      customer_address_street2.style.textTransform = "capitalize";

      const customer_address_town = document.getElementById('customer-address-town');
      customer_address_town.textContent = customer_address.Town;
      customer_address_town.style.textTransform = "capitalize";

      const customer_address_state = document.getElementById('customer-address-state');
      customer_address_state.textContent  = customer_address.State;
      customer_address_state.style.textTransform = "capitalize";

      const customer_address_lga = document.getElementById('customer-address-lga');
      customer_address_lga.textContent = customer_address.Lga;
      customer_address_lga.style.textTransform = "capitalize";
      

      // Edit Address in modal
      const edit_street1 = document.getElementById("street1")
      edit_street1.value = customer.Address.Street

      const edit_street2 = document.getElementById("street2")
      edit_street2.value = customer.Address.Street2

      const edit_town = document.getElementById("town")
      edit_town.value = customer.Address.Town

      const edit_state = document.getElementById("state")
      edit_state.value = customer.Address.State

      const edit_lga = document.getElementById("lga")
      edit_lga.value = customer.Address.Lga

      //Populate customer validations value in view
      const bvn_in_view = document.getElementById("field-validations-bvn")
      if (customer.Validations.BVN == true){
        bvn_in_view.textContent = '<i class="fa-solid fa-check"></i>'
      }else{
        bvn_in_view.textContent = '<i class="fa-solid fa-xmark"></i>'
      }

      const phonenumber_in_modal = document.getElementById("field-validations-phone-number")
      if (customer.Validations.PhoneNumber == true){
        bvn_in_view.textContent = '<i class="fa-solid fa-check"></i>'
      }else{
        bvn_in_view.textContent = '<i class="fa-solid fa-xmark"></i>'
      }

      const email_in_view = document.getElementById("field-validations-email")
      if (customer.Validations.Email == true){
        email_in_view.textContent = '<i class="fa-solid fa-check"></i>'
      }else{
        email_in_view.textContent = '<i class="fa-solid fa-xmark"></i>'
      }

      const idcard_in_view = document.getElementById("field-validations-id")
      if (customer.Validations.ID == true){
        idcard_in_view.textContent = '<i class="fa-solid fa-check"></i>'
      }else{
        idcard_in_view.textContent = '<i class="fa-solid fa-xmark"></i>'
      }

      const homeaddress_in_view = document.getElementById("field-validations-home-address")
      if (customer.Validations.HomeAddress == true){
        homeaddress_in_view.textContent = '<i class="fa-solid fa-check"></i>'
      }else{
        homeaddress_in_view.textContent = '<i class="fa-solid fa-xmark"></i>'
      }

      const workaddress_in_view = document.getElementById("field-validations-work-address")
      if (customer.Validations.WorkAddress == true){
        workaddress_in_view.textContent = '<i class="fa-solid fa-check"></i>'
      }else{
        workaddress_in_view.textContent = '<i class="fa-solid fa-xmark"></i>'
      }

      //Populate validate data modal
      const bvn_in_modal = document.getElementById("bvn")
      bvn_in_modal.checked = customer.Validations.BVN

      const phonenumber_in_modal = document.getElementById("phone_number")
      phonenumber_in_modal.checked = customer.Validations.PhoneNumber

      const email_in_modal = document.getElementById("email_address")
      email_in_modal.checked = customer.Validations.Email

      const idcard_in_modal = document.getElementById("id_card")
      idcard_in_modal.checked = customer.Validations.ID

      const homeaddress_in_modal = document.getElementById("home_address")
      homeaddress_in_modal.checked = customer.Validations.HomeAddress

      const workaddress_in_modal = document.getElementById("work_address")
      workaddress_in_modal.checked = customer.Validations.WorkAddress
      
      return;
    
    } else {
          console.log('error');
    }
  }
  
  //send request
  request.send();
  
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
        const profile_pictue = document.getElementById("profile_picture_id");
        profile_pictue.style.display = "flex";
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
        user_address_container.style.display = "flex";
    });

    document.getElementById("close_address_modal").addEventListener("click", function(e) {
      e.preventDefault();
      const user_address_container = document.getElementById("user_address_container_id");
      user_address_container.style.display = "none";
    })

    document.getElementById("edit-customer-address-form").addEventListener("submit", (e)=>{
      e.preventDefault();
      e.stopPropagation();
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

  document.getElementById('validate_button').addEventListener("submit",(e)=>{
    e.preventDefault();
    e.stopPropagation();

      const bvn_checkbox = document.getElementById("bvn").checked

      const phonenumber_checkbox = document.getElementById("phone_number").checked

      const email_checkbox = document.getElementById("email_address").checked

      const idcard_checkbox = document.getElementById("id_card").checked

      const homeaddress_checkbox= document.getElementById("home_address").checked

      const workaddress_checkbox= document.getElementById("work_address").checked

      let request = cbrRequest(`/users/${userID}/validateData`,'POST',true);

      let data ={
          "BVN": bvn_checkbox,
          "PhoneNumber": phonenumber_checkbox,
          "Email": email_checkbox,
          "ID": idcard_checkbox,
          "HomeAddress": homeaddress_checkbox,
          "WorkAddress": workaddress_checkbox
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

  })

  document.getElementById('button-customer-validate-data').addEventListener("click", function(e) {
    e.preventDefault();
    const user_validation = document.getElementById("manual_validate_container_id");
    user_validation.style.display = "flex";
  })
  
  document.getElementById('close-customer-manually-validate').addEventListener("click", function(e) {
    e.preventDefault();
    const user_validation = document.getElementById("manual_validate_container_id");
    user_validation.style.display = "none";
  })

  function updateCustomerStatus(userID, activeStatus) {

    let request = cbrRequest(`/users/${userID}/activate/${activeStatus}`, 'PATCH', true)
    
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

  function updateCustomerPassportPicture(userID) {
      let request = cbrRequest(`/users/${userID}/activate/passportPicture`, 'POST', true)
      
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
  