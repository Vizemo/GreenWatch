import { GreenhouseProxy } from "../api/api.js";

const proxy = new GreenhouseProxy();

/* Dark Mode Logic */
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
  const darkModeSwitch = document.getElementById('darkModeSwitch');

  // Check if the user has a preference stored in localStorage
  const isDarkMode = localStorage.getItem('darkMode') === "true";

  // Apply the stored preference
  darkModeSwitch.checked = isDarkMode;
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }

  // Listen for changes to the toggle switch
  darkModeSwitch.addEventListener('change', () => {
    if (darkModeSwitch.checked) {
      // Activate dark mode and store the preference
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      // Deactivate dark mode and store the preference
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
    renderRoomCards();
  });
});

const submitBtn = document.getElementById('submit-btn');
submitBtn.addEventListener('click', validateUser);

const invalidLoginText = document.getElementById('invalidCreds');

async function validateUser() {
  const username = document.getElementById('usernameTextbox').value;
  const password = document.getElementById('passwordTextbox').value;

  const user = {
    "username": username,
    "password": password
  }

  const jwt = await proxy.login(user);
  if (jwt) {
    invalidLoginText.style.visibility = 'hidden';

    const jwtStr = JSON.stringify(jwt);
    sessionStorage.setItem('jwt', jwtStr);

    sessionStorage.setItem('access_token', jwt['access_token']);
    sessionStorage.setItem('refresh_token', jwt['refresh_token']);
    window.location.assign('/home');
  }else{
    invalidLoginText.style.visibility = 'visible';
    // console.log("login failed");
  }
  // console.log(jwt);
}