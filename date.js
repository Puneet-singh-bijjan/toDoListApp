exports.getDate = getDate;

function getDate() {

    var today = new Date;
    var currentDay = today.getDay();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    var day = today.toLocaleDateString("en-US", options);
    return day;
}