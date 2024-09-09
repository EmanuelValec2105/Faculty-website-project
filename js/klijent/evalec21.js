document.addEventListener('DOMContentLoaded', () => {
    const gumbMobilna = document.getElementById('button-mobilna');

    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function applyVersionFromCookie() {
        const version = getCookie('version');
        if (version === 'mobile') {
            document.body.classList.add('mobile');
            gumbMobilna.textContent = 'Vrati na stolnu verziju';
        } else {
            document.body.classList.remove('mobile');
            gumbMobilna.textContent = 'Prebaci na mobilnu verziju';
        }
    }

    applyVersionFromCookie();

    gumbMobilna.addEventListener('click', () => {
        if (document.body.classList.contains('mobile')) {
            document.body.classList.remove('mobile');
            gumbMobilna.textContent = 'Prebaci na mobilnu verziju';
            setCookie('version', 'desktop', 7);
        } else {
            document.body.classList.add('mobile');
            gumbMobilna.textContent = 'Vrati na stolnu verziju';
            setCookie('version', 'mobile', 7);
        }
    });
});
