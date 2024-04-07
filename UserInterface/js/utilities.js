export const MAX_NAME_LENGTH = 30;

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Nov",
  "Dec"
]

export const powerButton = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-power" viewBox="0 0 16 16"><path d="M7.5 1v7h1V1z"/> <path d="M3 8.812a5 5 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812"/></svg> Power Status`;

// export const notificationBell = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16"> <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/></svg>';

export function storeUserObj(name, value) {
  if (name && value) {
    sessionStorage.setItem(name, value);
  }else{
    console.log("Storing Invalid Item");
  }
}

export function getUserObj() {
  const access_token = sessionStorage.getItem('user');
  return user;
}

export function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export function getJwt() {
  const jwtStr = sessionStorage.getItem('jwt');
  const jwt = JSON.parse(jwtStr);
  return jwt;
}

export function logout() {
  sessionStorage.clear();
}

export function toStandardTime(_hours) {
  let hours = _hours;
  let amPm = '';
  if (hours > 12) {
    amPm = 'PM';
    hours -= 12;
  } else if (hours == 0) {
    amPm = 'AM';
    hours = "12";
  }else if (hours < 12) {
    amPm = 'AM';
  }else{
    amPm = 'PM';
  }

  const hoursObj = {
    hours: hours,
    amPm: amPm
  }

  return hoursObj;
}

export function download(data, filename) {
 
  // Creating a Blob for having a csv file format
  // and passing the data with type
  const blob = new Blob([data], { type: 'text/csv' });

  // Creating an object for downloading url
  const url = window.URL.createObjectURL(blob)

  // Creating an anchor(a) tag of HTML
  const a = document.createElement('a')

  // Passing the blob downloading url
  a.setAttribute('href', url)

  // Setting the anchor tag attribute for downloading
  // and passing the download file name which will be the date range.
  a.setAttribute('download', filename);

  // Performing a download with click, simulates clicking essentially.
  a.click()
}

// for array of objects
export function csvMaker(data, roomID) {
  // Empty array for storing the values
  let csvRows = [];

  // Headers is basically a keys of an
  // object which will be based on first element
  const headers = Object.keys(data[0]);

  // As for making csv format, headers
  // must be separated by comma and
  // pushing it into array
  csvRows.push(headers.join(','));

  // Push each object values into the array
  data.forEach(measurement => {
    measurement['timestamp'] = `"${measurement['timestamp']}"`;
    const values = Object.values(measurement).join(',');
    csvRows.push(values);
  });

  // get first and last date to create name of file
  
  let csvData = csvRows.join('\n');
  const fileName = `${extractDate(data[0]['timestamp'])}_${extractDate(data[data.length - 1]['timestamp'])}_room${roomID}`;

  return {csv_data: csvData, file_name: fileName};
}

function extractDate(date) {
  const dateObj = new Date(date);
  const day = ('0' + dateObj.getDate()).slice(-2);
  const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);;
  const year = dateObj.getFullYear();

  return `${year}-${month}-${day}`;
}

export function withTimeout(promise, timeout) {
  // Create a promise that rejects after the timeout
  let timeoutPromise = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error('The operation timed out'));
    }, timeout);
  });
  
  // Race the passed promise against the timeout
  return Promise.race([promise, timeoutPromise]);
}

export function timeStringToSeconds(timeString) {
  // Split the time string into hours, minutes, and seconds
  let parts = timeString.split(':');

  // Convert each part to an integer. Parts are expected to be in HH:MM:SS format.
  let hours = parseInt(parts[0], 10);
  let minutes = parseInt(parts[1], 10);
  let seconds = parseInt(parts[2], 10);

  // Convert hours and minutes to seconds and add them together with the seconds part
  return hours * 3600 + minutes * 60 + seconds;
}

export function getCurrentDate() {
  // Function to set the current date as the default value of the #startDate input
  const today = new Date();
  const yyyy = today.getFullYear();
  // .getMonth() is zero-based; adding 1 to get correct month number
  // .padStart(2, '0') ensures the month and day are always 2 digits
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  
  // Formatting the date as YYYY-MM-DD
  const formattedToday = `${yyyy}-${mm}-${dd}`;
  
  return formattedToday;
}