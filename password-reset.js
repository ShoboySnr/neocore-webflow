    Webflow.push(function() {
    // Disable submitting form fields during development
    $('form').submit(function() {
        return false;
    });
});
   // import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js'
   // import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js'

    function addEmailEntryInCaseOfFreshRequestListener() {
    document.getElementById("fresh-request-email").addEventListener("input", function() {
        listenForEmailEntry("fresh-request-email", "email-submit-button-fr")
    });
}
    function addEmailEntryInCaseOfInvalidLinkListener() {
    document.getElementById("invalid-link-email").addEventListener("input", function() {
        listenForEmailEntry("invalid-link-email", "email-submit-button-irl")
    });
}
    function changePassword(auth, actionCode, np) {

    confirmPasswordReset(auth, actionCode, np).then((resp) => {
        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("password-reset-form").style.display = "none";
        document.getElementById("password-change-succesful-container").style.display = "block";
        // TODO: Display a link back to the app, or sign-in the user directly
    }).catch((error) => {
        const npem = document.getElementById("new-password-error-message")
        npem.textContent = error.toString();
        npem.style.display = "block";
    });
}
    function handleResetPassword(auth, actionCode) {
    verifyPasswordResetCode(auth, actionCode).then((email) => {
        console.log("returned email: ", email)
        document.getElementById("password-1").addEventListener("input", function () {listenForPasswordEntry(auth,actionCode)});
        document.getElementById("password-2").addEventListener("input", function () {listenForPasswordEntry(auth,actionCode)});
        document.getElementById("password-reset-form").style.display = "block";
        document.getElementById("loadingScreen").style.display = "none";
    }).catch((error) => {
        console.log("oob-verify error: ", error)
        addEmailEntryInCaseOfInvalidLinkListener()
        document.getElementById("invalid-link-error").style.display = "block";
        document.getElementById("loadingScreen").style.display = "none";
    });
}
    function getFreshLink(email) {
    // display loader todo( put this in the button)
    document.getElementById("loadingScreen").style.display = "flex";
    let url = `https://api.vault.ng/cbr/admin/user/password?email=${email}`
    const ile =  document.getElementById("invalid-link-error")
    const iee =  document.getElementById("invalid-email-error")
    const fr = document.getElementById("fresh-request")
    fr.style.display = "none";
    axios.get(url)
    .then(function (response) {
    console.log(response);
    ile.style.display = "none";
    iee.style.display = "none";
    document.getElementById("new-link-recepient").textContent = email;
    document.getElementById("new-reset-link-sent-container").style.display = "block";
    document.getElementById("loadingScreen").style.display = "none";
})
    .catch(function (error) {
    console.log(error);
    // todo what if it's a network error??
    ile.style.display = "none";
    document.getElementById("users-wrong-email").textContent = email;
    document.getElementById("invalid-email-email").addEventListener("input", function() {
    listenForEmailEntry("invalid-email-email", "email-submit-button-ia")
});
    iee.style.display = "block";
    document.getElementById("loadingScreen").style.display = "none";
})

}
    function listenForEmailEntry(inputId, button) {
    let emailInput = document.getElementById(inputId)
    let email = emailInput.value
    let buttonObject = document.getElementById(button)
    const validateEmail = (email) => {
    return String(email)
    .toLowerCase()
    .match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
    if (!validateEmail(email)) {
    // todo return invalid email error
    emailInput.style.borderWidth = "1px"
    emailInput.style.borderStyle = "solid"
    emailInput.style.borderColor = "red"
    // style button
    buttonObject.style.backgroundColor = "#c0c8cf"
    buttonObject.removeEventListener("click",function (){getFreshLink(email)})

} else {
    buttonObject.style.backgroundColor = "#3898ec"
    buttonObject.addEventListener("click", function (){getFreshLink(email)});
}
}
    function listenForPasswordEntry(auth, actionCode) {
    let buttonObject = document.getElementById("password-submit-btn")
    let password1 = document.getElementById("password-1")
    let password2 = document.getElementById("password-2")
    let pv = validatePasswords(password1, password2)
    if (pv) {
    buttonObject.style.backgroundColor = "#3898ec"
    buttonObject.addEventListener("click", function() {
    changePassword(auth, actionCode, password1.value)
});
} else {
    buttonObject.style.backgroundColor = "#c0c8cf"
    buttonObject.removeEventListener("click", function() {
    changePassword(auth, actionCode)
});}
}
    function validatePasswords(pw1, pw2) {
    let chars = document.getElementById("pv-num-chars")
    let num = document.getElementById("pv-one-num")
    let sym = document.getElementById("pv-one-sym")
    let uppercase = document.getElementById("pv-one-uppercase")
    let lowercase = document.getElementById("pv-one-lowercase")
    let match = document.getElementById("pv-match")
    let validations = 0

    if (pw1.value.length < 8) {
    pvReqInvalid(chars)
} else {
    pvReqValid(chars)
    validations += 1
}

    let lc = /(?=.*[a-z])/;
    if (!pw1.value.match(lc)) {
    pvReqInvalid(lowercase)
} else {
    pvReqValid(lowercase)
    validations += 1
}
    let uc = /(?=.*[A-Z])/;
    if (!pw1.value.match(uc)) {
    pvReqInvalid(uppercase)
} else {
    pvReqValid(uppercase)
    validations += 1
}
    let spec = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (!pw1.value.match(spec)) {
    pvReqInvalid(sym)
} else {
    pvReqValid(sym)
    validations += 1
}
    let nr = /\d/g;
    if (!pw1.value.match(nr)) {
    pvReqInvalid(num)
} else {
    pvReqValid(num)
    validations += 1
}

    if (pw1.value !== pw2.value  && pw1.value !== "") {
    pvReqInvalid(match)
} else {
    pvReqValid(match)
    validations += 1
}
    return validations === 6;
}
    function pvReqValid(req) {
    req.style.color = "#00a259"
}
    function pvReqInvalid(req) {
    req.style.color = "#a20003"
}
    document.addEventListener('DOMContentLoaded', () => {
    const qs = window.location.search;
    const urlParams = new URLSearchParams(qs)
    const mode = urlParams.get('mode');
    const actionCode = urlParams.get('oobCode');
    const continueUrl = urlParams.get('continueUrl');
    //const apiKey = urlParams.get('apiKey');
    //const config = {'apiKey': "AIzaSyBa3KvM7J5DJXlEZcRik79YJCyPm66BaV8"};
    //const app = initializeApp(config);
    //const auth = getAuth(app);
    const invalidLinkError = document.getElementById("invalid-link-error")
    const freshRequest = document.getElementById("fresh-request")
    const loader = document.getElementById("loadingScreen")
    switch (mode) {
    case 'resetPassword':
    // handleResetPassword(auth, actionCode, continueUrl);
    handleResetPassword(fbauth, actionCode, continueUrl);
    break;
    case 'recoverEmail':
    addEmailEntryInCaseOfInvalidLinkListener()
    invalidLinkError.style.display = "block";
    loader.style.display = "none";
    break;
    case 'verifyEmail':
    addEmailEntryInCaseOfInvalidLinkListener()
    invalidLinkError.style.display = "block";
    loader.style.display = "none";
    break;
    case 'freshReset': //freshReset
    addEmailEntryInCaseOfFreshRequestListener()
    freshRequest.style.display = "block";
    loader.style.display = "none";
    break;
    default:
    addEmailEntryInCaseOfInvalidLinkListener()
    invalidLinkError.style.display = "block";
    loader.style.display = "none";
}
}, false);
