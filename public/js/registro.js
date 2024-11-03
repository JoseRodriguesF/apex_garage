// /public/js/register.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                window.location.href = data.redirectUrl; 
            }
        })
        .catch(error => {
            alert(error.message); 
        });
    });
});
