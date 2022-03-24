const firebaseConfig = {
    apiKey: "AIzaSyBa3KvM7J5DJXlEZcRik79YJCyPm66BaV8",
    authDomain: "pocketbanc.firebaseapp.com",
    projectId: "pocketbanc",
    storageBucket: "pocketbanc.appspot.com",
    messagingSenderId: "351723537194",
    appId: "1:351723537194:web:e3fd34b8a12586212bd453",
    measurementId: "G-YGDPQ47XQD"
};


const fbapp = firebase.initializeApp(firebaseConfig);
const fbauth = firebase.auth()
//firebase.analytics();

var publicPages = [
    '/signup',
    '/login',
  '/password-reset'
]

var currentPath = window.location.pathname;




// firebase.auth().onAuthStateChanged((user) => {
fbauth.onAuthStateChanged((user) => {
    console.log("checking state1")
    if (user) {
        // log details
        console.log('User is logged in')
        console.log('Email: ' + user.email)
        console.log('Name: ' + user.displayName)
        console.log('Token:' + user.getIdToken(true))


        // if logged in user tries to access a public page, redirect to dashboard
        if (publicPages.includes(currentPath)) {
            window.location.replace('/')
        } else {
            // show the logout button
            console.log("private")
            document.getElementById("loadingScreen").style.display = 'none'
            // logoutLink.style.display = 'block'
            // logoutLink.addEventListener('click', logOut)
            document.getElementById("userDisplayName").innerHTML = user.displayName
        }
    } else {
        // User is signed out
        console.log('No user is logged in')
        if (!publicPages.includes(currentPath)) {
            window.location.replace('/login')
        } else {
            document.getElementById("loadingScreen").style.display = 'none'
        }
    }
});

function logOut() {
    // firebase.auth().signOut().then(() => {
    fbauth.signOut().then(() => {
        loadingScreen.style.display = 'flex'
        //redirect to login.
        console.log('user logged out')
        window.location.replace('/login')
    }).catch((error) => {
        console.log('user logged failed because' + error)
        //signin failed
    })
}

async function cbrRequest(endpoint, method, async, payload) {
    let baseUrl = new URL('https://api.vault.ng/cbr');
    let request = new XMLHttpRequest();
    let url = baseUrl.toString() + endpoint;

    if (!publicPages.includes(currentPath)) { 
      console.log(fbauth.currentUser);
      // await firebase.auth().currentUser.getIdToken(true).then((idToken) => {
        fbauth.onAuthStateChanged((user) => {
          console.log("checking state1")
          if (user) {
            fbauth.currentUser.getIdToken(true).then((idToken) => {
              request.open(method, url, async)
              request.setRequestHeader('nc-user-token', idToken)
              request.setRequestHeader('Content-type', 'application/json');
              request.setRequestHeader('Accept', 'application/json'); 
              request.setRequestHeader('magicword', 'Obaatokpere')
              
              return request;
            }).catch((error) => {
              console.error(`Error: ${error}`);
              alert('Please login to continue');
              window.location.replace('/login')
            })
          } else {
            alert('You are currently signed out');
            window.location.href = '/login';
          }
      })
    } else {
        request.open(method, url, async)
        // request.setRequestHeader('nc-user-token', idToken)
        request.setRequestHeader('Content-type', 'application/json');
        request.setRequestHeader('Accept', 'application/json');
        request.setRequestHeader('magicword', 'Obaatokpere')
        
        return request;
    }
}

  function readableDate(date, split_date = false) {
  const standardDate = new Date(date)
  
  if ( !!standardDate.valueOf() ) {
    if(split_date) {
      const date_object = {
        day : standardDate.getDate(),
        month : standardDate.getMonth(),
        year : standardDate.getFullYear(),
      }
      
      return date_object
      }
  
      return standardDate.toDateString() 
  }
  
  return 'Invalid date'
}

  function readAddressType(address) {
  if(address === 1) {
    return 'Home'
  } else if(address === 2) {
    return 'Work'
  }
  
  return 'Not specified';
}

function readRoleType(role) {
  if(role === 1) {
    return 'Employee'
  } else if(role === 2) {
    return 'Owner'
  }
  
  return 'Not specified';
}

  function readGender(gender) {
  if(gender === 1) {
    return 'Male'
  } else if(gender === 2) {
    return 'Female'
  }
  
  return 'Not specified'
}

function readIDType(type) {
let card_type = 'Not Specified'

switch(type) {
  case (type === 1):
    card_type = "Driver's License"
    break;
  case (type === 2):
    card_type = "National ID"
    break;
  case (type === 3):
    card_type = "International Passport"
    break;
  case (type === 4):
    card_type = "Voter's Card"
    break;
  default:
    card_type = ""
    break;
}

return card_type;

}

function readGLType(type) {
let gl_type = 'Not Specified'

switch(type) {
  case 1:
    gl_type = "Asset"
    break;
  case 2:
    gl_type = "Liability"
    break;
  case 3:
    gl_type = "Income"
    break;
  case 4:
    gl_type = "Expense"
    break;
  case 4:
    gl_type = "Equity"
    break;
  default:
    gl_type = "Not Specified"
}

return gl_type;

}

function readGLUsage(type) {
let gl_usage = 'Not Specified'

switch(type) {
  case 1:
    gl_usage = "Detail"
    break;
  case 2:
    gl_usage = "Header"
    break;
  default:
    gl_usage = "Not Specified"
}

return gl_usage; 
}


function readCustomerName(userID) {
let customer_name = '';

if(userID.length > 1) {
 let request = cbrRequest(`/users/${userID}`, 'GET', true);
 
 request.onload = function () {
   let data = JSON.parse(this.response)  
   // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute
   if (request.status >= 200 && request.status < 400) {
     const customer = data.data; 
     console.log(`${customer.FirstName} ${customer.LastName} ${customer.OtherNames || ''}`)
     return `${customer.FirstName} ${customer.LastName} ${customer.OtherNames || ''}`         
   }
 }
 
  request.send();
}

return customer_name;
}

function format_currency(number) {
return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(number/10) 

}

function readEntryType(entry) {
let entry_type = '';

switch(type) {
  case 1:
    entry_type = "GL to GL"
    break;
  case 2:
    entry_type = "GL to Deposit Account"
    break;
  default:
    entry_type = "Reversal"
}

return entry_type; 
}


function readPaymentFrequency(value) {
let payment_frequency = '';

switch(value) {
  case 1:
    payment_frequency = "Daily"
    break;
  case 7:
    payment_frequency = "Weekly"
    break;
  case 30:
    payment_frequency = "Monthly"
    break;
  case 90:
    payment_frequency = "Quarterly"
    break;
  case 180:
    payment_frequency = "Bi-Annually"
    break;
 case 365:
    payment_frequency = "Annually"
}

return payment_frequency; 
}

function readFeeType(value) {
let fee_type = '';

switch(value) {
  case 1:
    fee_type = "Flat fee Per Transaction"
    break;
  case 2:
    fee_type = "Flat Fee Per Charge Interval"
    break;
  case 3:
    fee_type = "Percentage Per Transaction"
    break;
  case 4:
    fee_type = "Percentage on turnover during charge interval"
    break;
  default:
    fee_type = ""
}

return fee_type;
}

function readTransactionDirection(value) {
if(value == 1) {
  return "Inflow";
} else if(value == 2) {
  return "Outflow";
} else return '';
}


function returnSelected(element) {
  let result = [];
let options = element && element.options;
let opt;
let options_length = options.length

for (let i = 0; i < options_length; i++) {
  opt = options[i];

  if (opt.selected) {
    result.push(opt.value || opt.text);
  }
}

return result;
}

function readHumanBoolean(value) {
return value ? 'Yes' : 'No';
}

function readDepositProductLimit(value, return_default = 'No limit') {
return value == -1 ? return_default : value; 
}

function filterGLs(data, type = 0, parent_gl_select_el = '', selected_value = '') {
if(type != 0) {
data.forEach((gl, index) => {
  if(gl.usage === 1 && parseInt(type) == gl.type) {
      let option = document.createElement("option");

      option.value= gl.id;
      option.innerHTML = gl.name;
      
      if(gl.id == selected_value) {
          option.selected = true;
       }

      parent_gl_select_el.appendChild(option);
    }
  });
}
}

function filterInterestsFees(data, parent_gl_select_el = '', selected_value = null) {
if(data != '' || data.length > 0) {
data.forEach((di, index) => {
   let option = document.createElement("option");

      option.value= di.id;
      option.innerHTML = di.name;
      
      if(selected_value != null) {
          if(selected_value.includes(di.id)) {
            option.selected = true;
        }
      }

      parent_gl_select_el.appendChild(option);
  });
}
}

function appendCustomerSelectOption(data, parent_gl_select_el = '', selected_value = null) {
if(data != '' || data.length > 0) {
data.forEach((item, index) => {
   let option = document.createElement("option");

      option.value= item.ID;
      option.innerHTML = `${item.FirstName} ${item.LastName}`
      
      if(selected_value == item.ID) {
        option.selected = true;
      }

      parent_gl_select_el.appendChild(option);
  });
}
}

function appendSelectOption(data, parent_gl_select_el = '', selected_value = null) {
if(data != '' || data.length > 0) {
data.forEach((item, index) => {
   let option = document.createElement("option");

      option.value= item.id;
      option.innerHTML = `${item.name}`
      
      if(selected_value == item.id) {
        option.selected = true;
      }

      parent_gl_select_el.appendChild(option);
  });
}
}

function readStatus(status = false) {
return status ? '<span class="text-success">Active</span>': '<span class="text-danger">Inactive</span>';
}

function readStates(status = false) {
return status ? 'Yes' : 'No'
}

function ValidateEmail(email) 
{
if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
return true;
}

return false;
}

function convertSlugToTitle(slug) {
return slug.replace(/-/g, ' ').toUpperCase()
}

function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}

function channelCostFeePopUp(modal_popup_clone, ChannelCost, ChannelFee, di) {
if(di.CustomerId) {
  document.getElementById('channels-customer-id-container').style.display = 'block';
  document.getElementById('channels-customer-id').textContent = di.CustomerId;
}

if(di.InitiatedAt) {
  document.getElementById('channels-initiated-at-container').style.display = 'block';
  document.getElementById('channels-initiated-at').textContent = readableDate(di.InitiatedAt);
}

if(di.ConfirmedAt) {
  document.getElementById('channels-confirmed-at-container').style.display = 'block';
  document.getElementById('channels-confirmed-at').textContent = readableDate(di.ConfirmedAt);
}

if(di.Status) {
  document.getElementById('channels-type-status-container').style.display = 'block';
  document.getElementById('channels-type-status').textContent = convertSlugToTitle(di.Status);
}

if(di.AccountID) {
  document.getElementById('channels-account-id-container').style.display = 'block';
  document.getElementById('channels-account-id').textContent = di.AccountID;
}

if(di.Amount) {
  document.getElementById('channels-amount-container').style.display = 'block';
  document.getElementById('channels-amount').textContent = format_currency(di.Amount);
}

if(di.FeeOption) {
  document.getElementById('channels-fee-option-container').style.display = 'block';
  document.getElementById('channels-fee-option').textContent = di.FeeOption;
}

if(di.Fee) {
  document.getElementById('channels-type-fee-container').style.display = 'block';
  document.getElementById('channels-type-fee').textContent = format_currency(di.Fee);
}

if(di.Cost) {
  document.getElementById('channels-type-cost-container').style.display = 'block';
  document.getElementById('channels-type-cost').textContent = format_currency(di.Cost);
}

if(di.Scheduled) {
  document.getElementById('channels-scheduled-container').style.display = 'block';
  document.getElementById('channels-scheduled').textContent = readStates(di.Scheduled);
}

if(di.Narration) {
  document.getElementById('channels-narration-container').style.display = 'block';
  document.getElementById('channels-narration').textContent = di.Narration;
}

if(di.JournalEntryRef) {
  document.getElementById('channels-journal-entry-ref-container').style.display = 'block';
  document.getElementById('channels-journal-entry-ref').textContent = di.JournalEntryRef;
}

if(di.Retries) {
  document.getElementById('channels-retries-container').style.display = 'block';
  document.getElementById('channels-retries').textContent = di.Retries;
}

if(ChannelCost) {
  modal_popup_clone.querySelector('#channels-cost-name').textContent = ChannelCost.Name;
  modal_popup_clone.querySelector('#channels-cost-channel-Id').textContent = ChannelCost.ChannelID;
  modal_popup_clone.querySelector('#channels-cost-type').textContent = ChannelCost.Type;
  modal_popup_clone.querySelector('#channels-cost-percentage').textContent = ChannelCost.Percentage;
  modal_popup_clone.querySelector('#channels-cost-flat-amount').textContent = format_currency(ChannelCost.FlatAmt);
  modal_popup_clone.querySelector('#channels-cost-hidden').textContent = readStates(ChannelCost.Hidden);
  modal_popup_clone.querySelector('#channels-cost-cap').textContent = ChannelCost.Cap;

  const innerColumn = modal_popup_clone.querySelector('#modal-popup-inner');
  
  if(ChannelCost.Ranges){
      ChannelCost.Ranges.forEach((range,index) => {
          const rangeItem = document.getElementById('modal-popup-inner-table');
          const rangeItemClone = rangeItem.cloneNode(true);
          rangeItemClone.setAttribute('id','');
          rangeItemClone.style.display = 'block';
          
          const form_el = rangeItemClone.getElementsByTagName('p')[0];
          form_el.textContent  = format_currency(range.From);

          const to_el = rangeItemClone.getElementsByTagName('p')[1];
          to_el.textContent  = format_currency(range.To);

          const option_el = rangeItemClone.getElementsByTagName('p')[2];
          option_el.textContent  = range.Option;

          const optionCap_el = rangeItemClone.getElementsByTagName('p')[3];
          optionCap_el.textContent  = format_currency(range.OptionCap);

          const percentage_el = rangeItemClone.getElementsByTagName('p')[4];
          percentage_el.textContent  = readStates(range.IsPercentage);

          const fee_el = rangeItemClone.getElementsByTagName('p')[5];
          fee_el.textContent  = range.FeeOrPercentage;

          innerColumn.appendChild(rangeItemClone)
      })
  } 
}

if(ChannelFee) {
  modal_popup_clone.querySelector('#channels-fee-name').textContent = ChannelFee.Name || '';
  modal_popup_clone.querySelector('#channels-fee-channel-Id').textContent = ChannelFee.ChannelID;
  modal_popup_clone.querySelector('#channels-fee-type').textContent = ChannelFee.Type;
  modal_popup_clone.querySelector('#channels-fee-percentage').textContent = ChannelFee.Percentage;
  modal_popup_clone.querySelector('#channels-fee-flat-amount').textContent = ChannelFee.FlatAmt;
  modal_popup_clone.querySelector('#channels-fee-hidden').textContent = readStates(ChannelFee.Hidden);
  modal_popup_clone.querySelector('#channels-fee-cap').textContent = ChannelFee.Cap;

  const feeinnerColumn = modal_popup_clone.querySelector('#modal-fee-popup-inner');

  if(ChannelFee.Ranges){
  ChannelFee.Ranges.forEach((range,index) => {
    const feerangeItem = document.getElementById('modal-fee-popup-inner-table');
    const feerangeItemClone = feerangeItem.cloneNode(true);
    feerangeItemClone.setAttribute('id','');
    feerangeItemClone.style.display = 'block';
    
    const form_el = feerangeItemClone.getElementsByTagName('p')[0];
    form_el.textContent  = format_currency(range.From);

    const to_el = feerangeItemClone.getElementsByTagName('p')[1];
    to_el.textContent  = format_currency(range.To);

    const option_el = feerangeItemClone.getElementsByTagName('p')[2];
    option_el.textContent  = range.Option;

    const optionCap_el = feerangeItemClone.getElementsByTagName('p')[3];
    optionCap_el.textContent  = format_currency(range.OptionCap);

    const percentage_el = feerangeItemClone.getElementsByTagName('p')[4];
    percentage_el.textContent  = readStates(range.IsPercentage);

    const fee_el = feerangeItemClone.getElementsByTagName('p')[5];
    fee_el.textContent  = range.FeeOrPercentage;

    feeinnerColumn.appendChild(feerangeItemClone)
  })
  } 
}
}

function updateChannelStatus(channelID, status) {
status = !status;
let request = cbrRequest('/channels/'+ channelID +'/toggleactive?active='+status, 'PUT', true);

request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
        if(status) {
            alert('This channel successfully activated');
        } else {
            alert('This channel successfully deactivated');
        }

        window.location.reload();
    }
}

request.send();
}

function setMenuActive() {
  const nav_menus = ['dashboard', 'users', 'gls', 'deposit-interests', 'deposit-fees', 'deposit-products', 'deposit-accounts', 'channels', 'loan-products', 'loan-interests', 'loan-fees'];

  let pathname = window.location.pathname.toString();

  nav_menus.forEach((item, index) => {
      if(pathname.indexOf(item) > -1) {
          let menu_element = document.getElementById(item + '-menu');
          const selector = '#' + item + '-menu ~ nav.w-dropdown-list'
          if(document.querySelector(selector)) {
              menu_element.classList += ' w--open';
              document.querySelector(selector).classList += ' w--open';
              document.querySelector(selector).setAttribute('style', 'display: block;');
          }
      }
  });
}

function closeAllModalPopUp(event) {
    event.preventDefault();
    console.log(event);
    document.querySelectorAll('.modalpopup').forEach((element, index) => {
      element.setAttribute('style', 'display: none;');
    });
}

function stopClosePopUp(event) {
  event.stopPropagation();
}

document.addEventListener("DOMContentLoaded", () => {
    setMenuActive();
    document.querySelectorAll('.modalpopup').forEach((element, index) => {
      element.addEventListener('click', stopClosePopUp);
    });
    document.querySelectorAll('.cancel-button').forEach((element, index) => {
      element.addEventListener('click', closeAllModalPopUp);
    });

    document.querySelectorAll('.modal-popup-section').forEach((element, index) => {
      element.addEventListener('click', (event) => {
          console.log(event);
          event.preventDefault();
          element.setAttribute('style', 'display: none;');
      });
    });

    document.querySelectorAll('.modal-popup-section .modal-popup-container').forEach((element, index) => {
      element.addEventListener('click', (event) => {
          event.stopPropagation();
          event.preventDefault();
      });
    });
});