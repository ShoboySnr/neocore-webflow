import { fbauth } from 'https://shoboysnr.github.io/neocore-webflow/footer.js'
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js'


    var signInButton = document.getElementById("signInButton")
signInButton.addEventListener('click', signIn)

function signIn() {
    var email = signInEmail.value
    var password = signInPassword.value

    signInWithEmailAndPassword(fbauth, email, password)
        .then((userCredential) => {
            // Signed in
            console.log("Logged In, Creds:", userCredential);
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
