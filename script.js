import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";
import { getDatabase, ref, update, once } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-database.js";

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAQ7B1gIKfaIp_vDsU0cLGX1RyEqDzjmkk",
    authDomain: "hackathon-156b1.firebaseapp.com",
    projectId: "hackathon-156b1",
    storageBucket: "hackathon-156b1.appspot.com",
    messagingSenderId: "664855328755",
    appId: "1:664855328755:web:8a279ccd4003f0ff09c486"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Function to create an entry
function createEntry(name, idea) {
  // Generate a unique key for the new entry
  var newEntryKey = firebase.database().ref().child('entries').push().key;
  
  // Define the data to be added
  var postData = {
    name: name,
    idea: idea
  };

  // Write the new entry's data to the database
  var updates = {};
  updates['/entries/' + newEntryKey] = postData;

  return firebase.database().ref().update(updates);
}

// Function to read all entries
function readEntries() {
  return firebase.database().ref('entries').once('value').then(function(snapshot) {
    var entries = [];
    snapshot.forEach(function(childSnapshot) {
      var entry = childSnapshot.val();
      entries.push(entry);
    });
    return entries;
  });
}

// Function to handle form submission
document.getElementById('inputForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission

  var name = document.getElementById('contributorName').value;
  var idea = document.getElementById('userIdea').value;

  // Call createEntry function with input values
  createEntry(name, idea)
    .then(function() {
      console.log("Entry created successfully!");
      // Reset form after successful submission
      document.getElementById('inputForm').reset();
      // Update entry list
      updateEntryList();
    })
    .catch(function(error) {
      console.error("Error creating entry: ", error);
    });
});

// Function to update the entry list
function updateEntryList() {
  var entryList = document.getElementById('entryList');

  // Clear previous entries
  entryList.innerHTML = "";

  // Read all entries and display them
  readEntries().then(function(entries) {
    entries.forEach(function(entry) {
      var listItem = document.createElement('li');
      listItem.textContent = entry.name + ": " + entry.idea;
      entryList.appendChild(listItem);
    });
  });
}

// Call updateEntryList initially to populate the list
updateEntryList();
