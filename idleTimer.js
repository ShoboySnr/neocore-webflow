function idleTimer() {
    let t;
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer;
    window.onclick = resetTimer; 
    window.onscroll = resetTimer;
    window.onkeypress = resetTimer;

    function timerLogout() {
        logOut();
    }

   function timerReload() {
          window.location = self.location.href;
   }

   function resetTimer() {
        clearTimeout(t);
        t = setTimeout(timerLogout, 1800000);
        t = setTimeout(timerReload, 300000);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    idleTimer();
});