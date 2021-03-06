async function getSingleUser() {
    var myUrl = new URL(document.location.href)
    var id = myUrl.searchParams.get("id")

    let request = await cbrRequest(`/users/${id}`, 'GET', true)

    request.onload = function() {

    let data = JSON.parse(this.response)
    // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
    if (request.status >= 200 && request.status < 400) {
            const user_data = data.data;
            console.log(user_data);
        
            const customer_title_bg = document.getElementById("card-details");
            
            document.getElementById("button-set-permission-link").href = '/admin/users/setpermission?id=' + user_data.ID;
            
            const status_el = document.getElementById("field-status");
            status_el.innerHTML = readStatus(user_data.Active);
            
            const first_name_el = document.getElementById("field-first-name");
            first_name_el.textContent = user_data.FirstName || '';
            
            const last_name_el = document.getElementById("field-last-name");
            last_name_el.textContent = user_data.LastName || '';
            
            const other_names_el = document.getElementById("field-other-names");
            other_names_el.textContent = user_data.OtherNames || '';

            const gender_el = document.getElementById("field-gender");
            gender_el.textContent = readGender(user_data.Gender);

            const email_el = document.getElementById("field-email");
            email_el.textContent = user_data.EmailAddress;

            const phone_number_el = document.getElementById("field-phone-number");
            phone_number_el.textContent = user_data.PhoneNumber;

            const work_name_el = document.getElementById("field-work-name");
            work_name_el.textContent = user_data.WorkInformation.Name;

            const work_role_type_el = document.getElementById("field-work-role-type");
            work_role_type_el.textContent = readRoleType(user_data.WorkInformation.RoleType);

            let work_address_value = '';
            for(address in user_data.WorkInformation.Address) {
                console.log(user_data.WorkInformation.Address[address]);
                work_address_value += ' ' + user_data.WorkInformation.Address[address];
            }

            const work_address_el = document.getElementById("field-work-address");
            work_address_el.textContent = work_address_value;

            const deposit_accounts_el = document.getElementById("field-deposit-accounts");
            deposit_accounts_el.textContent = user_data.DepositAccounts || '';

            const loan_accounts_el = document.getElementById("field-loan-accounts");
            loan_accounts_el.textContent = user_data.LoanAccounts || '';

            const bvn_el = document.getElementById("field-bvn");
            bvn_el.textContent = user_data.Bvn;

            let address_value = '';
            for(address in user_data.Address) {
                address_value += ' ' + user_data.WorkInformation.Address[address];
            }

            const address_el = document.getElementById("field-address");
            address_el.textContent = address_value;

            const dob_el = document.getElementById("field-dob");
            dob_el.textContent = readableDate(user_data.Dob);

            const kyc_el = document.getElementById("field-kyc-level");
            kyc_el.textContent = user_data.KycLevel;

            const validations_bvn_el = document.getElementById("field-validations-bvn");
            validations_bvn_el.textContent = user_data.Validations.BVN;

            const validations_phonenumber_el = document.getElementById("field-validations-phone-number");
            validations_phonenumber_el.textContent = user_data.Validations.PhoneNumber;

            const validations_email_el = document.getElementById("field-validations-email");
            validations_email_el.textContent = user_data.Validations.Email;

            const validations_id_el = document.getElementById("field-validations-id");
            validations_id_el.textContent = user_data.Validations.ID;

            const validations_home_address_el = document.getElementById("field-validations-home-address");
            validations_home_address_el.textContent = user_data.Validations.HomeAddress;

            const validations_work_address_el = document.getElementById("field-validations-work-address");
            validations_work_address_el.textContent = user_data.Validations.WorkAddress;

            const ids_el = document.getElementById("field-ids");
            ids_el.textContent = user_data.IDs || '';

            const saved_beneficiaries_el = document.getElementById("field-saved-beneficiaries");
            saved_beneficiaries_el.textContent = user_data.SavedBeneficiaries || '';

            const meta_el = document.getElementById("field-meta");
            meta_el.textContent = user_data.Meta || '';

            // BVN Information
            const bvn_bvn_el = document.getElementById("field-bvn-bvn");
            bvn_bvn_el.textContent = user_data.BvnData.BVN || '';

            const bvn_dob_el = document.getElementById("field-bvn-dob");
            bvn_dob_el.textContent = readableDate(user_data.BvnData.DOB);

            const bvn_first_name_el = document.getElementById("field-bvn-first-name");
            bvn_first_name_el.textContent = user_data.BvnData.FirstName;


            const bvn_last_name_el = document.getElementById("field-bvn-last-name");
            bvn_last_name_el.textContent = user_data.BvnData.LastName;


            const bvn_middle_name_el = document.getElementById("field-bvn-middle-name");
            bvn_middle_name_el.textContent = user_data.BvnData.MiddleName || '';

            const bvn_phone_number_el = document.getElementById("field-bvn-phone-number");
            bvn_phone_number_el.textContent = user_data.BvnData.PhoneNumber;

            const bvn_gender_el = document.getElementById("field-bvn-gender");
            bvn_gender_el.textContent = user_data.BvnData.Gender;
    
        } else {
                // handle error
            alert('There was an error that occurred');
            document.location.href='/admin/users/all';
        }
    
    }
    
    request.send();
}