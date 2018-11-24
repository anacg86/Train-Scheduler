//pseudocode

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCo2JdiRmk-PwMrkLjnZ993MeHZVgAQcSw",
    authDomain: "anacg86-83783.firebaseapp.com",
    databaseURL: "https://anacg86-83783.firebaseio.com",
    projectId: "anacg86-83783",
    storageBucket: "anacg86-83783.appspot.com",
    messagingSenderId: "361590753044"
};
firebase.initializeApp(config);
var database = firebase.database();

$(document).ready(function () {
    //when they click on submit add an entry to the database based on the inputs on the page
    $("#submitbtn").click(addTrainScheduleToDatabase);

    //When the database gets a new entry, execute this code to process the information
    database.ref().on("child_added", receiveTrainScheduleFromDatabase);
});

function addTrainScheduleToDatabase(eventInfo) {
    eventInfo.preventDefault();

    //takes away the spaces in the input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var time = $("#time-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    database.ref().push({
        trainName: trainName,
        destination: destination,
        time: time,
        frequency: frequency
    });
}

//when the database has a new child added, we bring back that information 
//in the form of a snapshot (an object that has all the values for that entry).
function receiveTrainScheduleFromDatabase(trainSnapshot) {
    //printing info with changes 
    var trainName = trainSnapshot.val().trainName;
    var destination = trainSnapshot.val().destination;
    var frequency = trainSnapshot.val().frequency;
    var time = trainSnapshot.val().time;

    //bring it back
    var firstTimeConverted = moment(time, "HH:mm").subtract(1, "years");
    console.log("first time converted: " + firstTimeConverted);

    //current time
    var currentTime = moment();
    console.log("current time: " + moment(currentTime).format("hh:mm"));

    //difference in time
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference in time: " + diffTime);

    //remainder 
    var remainder = diffTime % frequency;
    console.log("remainder: " + remainder);

    //mins away
    var minsAway = frequency - remainder;
    console.log("minutes away: " + minsAway);
    
    //next arrival
    var nextArrival = moment().add(minsAway, "minutes").format("HH:mm");
    console.log("next arrival: " + nextArrival);

    printToTable({
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        nextArrival: nextArrival,
        minsAway: minsAway
    });
}

function printToTable(trainInfo) {
    var row = $("<tr>");
    var trainNameData = $("<td>");
    var destinationData = $("<td>");
    var frequencyData = $("<td>")
    var nextArrivalData = $("<td>");
    var minutesAwayData = $("<td>");

    //printing info in html
    trainNameData.text(trainInfo.trainName);
    destinationData.text(trainInfo.destination);
    frequencyData.text(trainInfo.frequency);
    nextArrivalData.text(trainInfo.nextArrival);
    minutesAwayData.text(trainInfo.minsAway);

    //append info to the table's tds
    row.append(trainNameData, destinationData, frequencyData, nextArrivalData, minutesAwayData);

    //places the info in the table
    $("#train-table > tbody").append(row);
};

