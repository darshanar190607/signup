// Toggle between Sign In and Sign Up forms
document.getElementById('sign-up-link').addEventListener('click', () => {
    document.querySelector('.sign-in-form').classList.remove('active');
    document.querySelector('.sign-up-form').classList.add('active');
});

document.getElementById('sign-in-link').addEventListener('click', () => {
    document.querySelector('.sign-up-form').classList.remove('active');
    document.querySelector('.sign-in-form').classList.add('active');
});

// Optional: Log form submissions
document.querySelector('.sign-in-form').addEventListener('submit', () => {
    console.log('Submitting Sign-In form...');
});

document.querySelector('.sign-up-form').addEventListener('submit', () => {
    console.log('Submitting Sign-Up form...');
});
