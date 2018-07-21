
$(".close").click(function () {
    $(this).parents(".modal").css("display", "none");
});

var config = {
    apiKey: "AIzaSyA4gKmw_YcZvb8DmVizWhz6iuy_c_cR7xE",
    authDomain: "train-scheduler-7e02f.firebaseapp.com",
    databaseURL: "https://train-scheduler-7e02f.firebaseio.com",
    projectId: "train-scheduler-7e02f",
    storageBucket: "train-scheduler-7e02f.appspot.com",
    messagingSenderId: "663172533805"
};
firebase.initializeApp(config);
var database = firebase.database();
var currentTime = moment().format("HH:mm:ss");

// Capture Button Click
$("#add-train").on("click", function (event) {
    // Don't refresh the page!
    event.preventDefault();
    // Get inputs
    var trainName = $("#name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstTrainTime = moment($("#first-train-input").val().trim(), "HH:mm").format("HH:mm");
    var isTimeValid = moment(firstTrainTime, "HH:mm").isValid();
    console.log(firstTrainTime);
    console.log(isTimeValid);
    var trainFrequency = $("#frequency-input").val().trim();

    if ($("#name-input").val() === "") {
        $("#holdMesssage").text("Please enter the name of the train.");
        $("#missingInput").css("display", "flex");
    }
    else if ($("#destination-input").val() === "") {
        $("#holdMesssage").text("Please enter the destination of the train.");
        $("#missingInput").css("display", "flex");
    }
    else if (isTimeValid === false) {
        $("#holdMesssage").text("Please enter the time of the first train in HH:mm format.");
        $("#missingInput").css("display", "flex");
    }
    else if ($("#frequency-input").val() === "") {
        $("#holdMesssage").text("Please enter the frequency of the train.");
        $("#missingInput").css("display", "flex");
    }
    else {
        database.ref().push({
            name: trainName,
            destination: trainDestination,
            frequency: trainFrequency,
            first: firstTrainTime,
        });
        //clear out all the inputs
        $("#name-input").val("");
        $("#destination-input").val("");
        $("#first-train-input").val("");
        $("#frequency-input").val("");
    }
});
database.ref().on("child_added", function (snapshot) {
    var newTrain = $("<tr>");
    var newName = $("<td>");
    var newDestination = $("<td>");
    var newFrequency = $("<td>");
    var newNextArrival = $("<td>");
    var newMinutesAway = $("<td>");

    newName.text(snapshot.val().name);
    newDestination.text(snapshot.val().destination);
    var freq = snapshot.val().frequency;
    newFrequency.text(freq);
    var firstTimeConverted = moment(snapshot.val().first, "HH:mm").subtract(1, "years");
    var differenceInTime = moment().diff(moment(firstTimeConverted), "minutes");
    var timeRemainder = differenceInTime % freq;
    var minutesAway = freq - timeRemainder;
    newMinutesAway.text(minutesAway);
    var nextArrival = moment().add(minutesAway, "minutes");
    nextArrivalConverted = moment(nextArrival).format("hh:mm a");
    newNextArrival.text(nextArrivalConverted);

    newTrain.append(newName);
    newTrain.append(newDestination);
    newTrain.append(newFrequency);
    newTrain.append(newNextArrival);
    newTrain.append(newMinutesAway);
    $("#storesTrains").append(newTrain);

    // If any errors are experienced, log them to console.
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});
//write a setInterval function to update every one minute
$("#timeHolder").text("Current Time: " + currentTime);
function timeKeeper() {
    currentTime = moment().format("HH:mm:ss");
    $("#timeHolder").text("Current Time: " + currentTime);
};