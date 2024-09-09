document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('veza');

    form.addEventListener('submit', (event) => {
        let valid = true;

        // Provjera svih obaveznih polja
        const requiredFields = form.querySelectorAll('input, select, textarea');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showError(field, 'Ovo polje je obavezno');
                valid = false;
            } else {
                removeError(field);
            }
        });

        const visitDate = document.getElementById('visitDate');
        if (visitDate && !validateDate(visitDate.value)) {
            showError(visitDate, 'Datum mora biti između 2 dana i 1 mjeseca u budućnosti');
            valid = false;
        } else {
            removeError(visitDate);
        }

        const numberOfVisitors = document.getElementById('numberOfVisitors');
        if (numberOfVisitors && !validateNumber(numberOfVisitors.value, 1, 100)) {
            showError(numberOfVisitors, 'Broj posjetitelja mora biti između 1 i 100');
            valid = false;
        } else {
            removeError(numberOfVisitors);
        }

        const comments = document.getElementById('comments');
        if (comments && !validateComments(comments.value)) {
            showError(comments, 'Komentar mora početi velikim slovom, završavati točkom, imati točno 4 rečenice, i ne smije sadržavati znakove (<,>,#,-)');
            valid = false;
        } else {
            removeError(comments);
        }

        if (!valid) {
            event.preventDefault();
        }
    });

    function showError(element, message) {
        let errorElement = element.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('span');
            errorElement.classList.add('error-message');
            element.parentNode.insertBefore(errorElement, element.nextSibling);
        }
        errorElement.textContent = message;
        element.classList.add('error');
    }

    function removeError(element) {
        const errorElement = element.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
        element.classList.remove('error');
    }

    function validateDate(dateStr) {
        const date = new Date(dateStr);
        const today = new Date();
        const minDate = new Date(today);
        minDate.setDate(today.getDate() + 2);
        const maxDate = new Date(today);
        maxDate.setMonth(today.getMonth() + 1);
        return date >= minDate && date <= maxDate;
    }

    function validateNumber(value, min, max) {
        const number = parseInt(value, 10);
        return number >= min && number <= max;
    }

    function validateComments(text) {
        const sentences = text.split(/[.!?]/).filter(sentence => sentence.trim().length > 0);
        if (sentences.length !== 4) {
            return false;
        }
        const regex = /^[A-Z][^<>#-]*$/;
        return sentences.every(sentence => regex.test(sentence.trim()));
    }
});
