import { fbauth } from 'https://shoboysnr.github.io/neocore-webflow/footer.js'


    var signInButton = document.getElementById("signInButton")
signInButton.addEventListener('click', signIn)

function signIn() {
    var email = signInEmail.value
    var password = signInPassword.value

    fbauth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            window.location.replace('/dashboards/analytics')
            // var user = userCredential.user;
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error code:", errorCode);
            console.log("Error message:", errorMessage);
            signInError.innerText = errorMessage;
            signInError.style.display = 'block';
        });


}
