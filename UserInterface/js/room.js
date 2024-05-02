import { GreenhouseProxy } from "../api/api.js";
import * as Utils from "../js/utilities.js";

const proxy = new GreenhouseProxy();

const roomID = sessionStorage.getItem('roomID');

const createAgentBtn = document.getElementById('create-agent');
createAgentBtn.addEventListener('click', createAgent);

async function setRoomName() {
  const room = await proxy.getRoomByID(roomID);
  const roomName = room['name'];
  const roomNameText = document.getElementById('room-name-text');

  roomNameText.setAttribute('style', 'color: grey');

  // Get agent 
  // const agent = await proxy.getAgentByID(room['id'])
  const agents = await proxy.getAgents();
  let agent_ip = " [...]";
    agents.forEach(agent => {
      if (roomID == agent['room_id'])
        {
          agent_ip = ` [${agent['device_ip_address']}]`;
          roomNameText.setAttribute('style', 'color: black');
        }
    })

  roomNameText.textContent = roomName + agent_ip;

}

setRoomName();

const logoutLink = document.getElementById('logout-link');
logoutLink.addEventListener('click', Utils.logout);

async function createAgent() {
  console.log("Creating new agent for room: " + roomID);
  const message = "[LOG] Creating new agent for room: " + roomID;

  const servers = await proxy.getServers();
  const server_ip = servers[0]['ip_address']

  // Get user ID from access_token
  const jwt = Utils.getJwt();
  const userID = jwt['user_id'];

  const agentObj = getCreateAgentObject(server_ip);
  // Create agent in database
  await proxy.createAgent(agentObj);

  // Post message in notes
  await proxy.createRoomMessage(roomID, userID, message);
  console.log("[SUCCESS] Created new agent for room: " + roomID)

  redirectToDownloadAgent(server_ip) 
}
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

function getCreateAgentObject(server_ip) {

  const agent = {
    "duration": "00:00:03.000000",
    "ip_address": server_ip,
    "status": 0,
    "room_id": roomID,
    "server_id": 1
  }

  return agent;
}

// Function to redirect to a relative URL
function redirectToDownloadAgent(server_ip)
{
  let absoluteURL = `http://${server_ip}/servers/agents/${roomID}`;

  absoluteURL = new URL(absoluteURL);

  // Log the absolute URL (optional)
  console.log('Redirecting to:', absoluteURL.href);

  // Redirect to the absolute URL
  window.location.href = absoluteURL.href;
}

// Function to automatically adjust chart size upon resize
function setChartContainerHeight() {
  var chartContainer = document.getElementById('canvas-div');
  chartContainer.style.height = (chartContainer.clientWidth * 0.666) + 'px';
}

// Call the function when the window is resized
window.addEventListener('resize', setChartContainerHeight);

// Call the function when the page loads
window.addEventListener('load', setChartContainerHeight);