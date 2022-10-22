let num = [0, 0, 0, 0, 0, 0]; //initial quantity of team item in menu
let cost = [0, 0, 0, 0, 0]; //num*price of each menu item
let subtotal = 0; //total without tax
let tax = 0; // tax on subtotal
let total = 0; //final price

// updates the values of cost, subtotal, tax, and total
function prices(){
    subtotal = 0;
    tax = 0;
    total = 0;
    let price = [5.50, 7.25, 6.80, 9.50, 3.25]; //price of each item
    for (let i = 0; i < 5; i++){
        cost[i] = (num[i] * price[i]);
        $("td input[name='cost']").eq(i).val(cost[i].toFixed(2));
        subtotal += cost[i];
    }    
    tax = subtotal * 0.0625;
    total = subtotal + tax;
    $("input[id=subtotal]").val(subtotal.toFixed(2));
    $("input[id=tax]").val(tax.toFixed(2));
    $("input[id=total]").val(total.toFixed(2));
}

// confirm that the user inputs are all valid
function valid(first_name, last_name, city, street, phone, delivery_check) {
    let error_count = 0;
    // if there is an error, iterate error_count and notify user
    if(last_name == null){
        error_count++;
        $("input[name=lname]").css('background-color', '#ffbdca'); //recolors the text box to highlight to user
    }
    if(phone == null){
        error_count++;
        $("input[name=phone]").css('background-color', '#ffbdca');
    } else if (phone.length != 7 && phone.length != 10){ //check if phone # is correct length
        error_count++;
        alert("Please enter a 7 or 10 digit phone number")
    }
    if(delivery_check){
        if (city == null){
            error_count++;
            $("input[name=city]").css('background-color', '#ffbdca');
        }
        if(street == null){
            error_count++;
            $("input[name=street]").css('background-color', '#ffbdca');
        }
    }
    if(error_count > 0 && (phone.length == 7 || phone.length == 10)){
        alert("Please fill in required fields!") 
    }
    if(subtotal === 0){
        error_count++;
        alert("You must purchase at least one item to continue.");
    }
    if(error_count === 0){
        alert("Thanks for your order!");
        new_page(first_name, last_name, delivery_check); //open new window with receipt if valid inputs
    }
}

// use the date class to recieve the time, and use that time to return the time at which
// the order will be delivered/ready for pickup
// takes whether or not food is delivered as parameter
function get_time(delivery_check) {
    let time, am_pm;
    // if the user picks delivery, the prep time is 40 minutes, if pickup then 20
    if(delivery_check){
        time = 40;
    } else {
        time = 20;
    }
    const date = new Date();
    let curr_min = date.getMinutes(); // current minute
    let minute = (date.getMinutes() + time) % 60; // minute of the completion time, mod operator in case it is over 60
    let hour = date.getHours(); // current hour
    // add one to the hour if the added time causes the minutes to go over 60
    if((curr_min + time) >= 60){
        hour++;
    }
    // to make the output look like proper time format
    if (minute < 10) {
        return hour + ":0" + minute;
    }
    // add AM/PM and change the time to standard and not military time
    if(hour >= 12 && hour != 24){
        am_pm = "PM";
    } else {
        am_pm = "AM";
    }
    if(hour > 12){
        hour = hour - 12;
    }
    // return the delivery time with AM/PM
    return hour + ":" + minute + " " + am_pm;
}

// open a new tab if all inputs are valid
// new tab includes a receipt of the order, listing items ordered, number of each item, all prices, and estimated time
// takes the user's name and whether or not the food is being delivered as a parameter
function new_page(first_name, last_name, delivery_check){
    let w = window.open();
    let title = first_name + " " + last_name + "'s Receipt:";
    w.document.write("<head><link rel='stylesheet' href='style.css'><title>Order Summary</title><\head>")
    w.document.write("<h1>" +title + "<\h1>")

    w.document.write("<div class = 'foodslist'>")
    let item = ["Chicken Chop Suey", "Sweet and Sour Pork", "Shrimp Lo Mein", "Moo Shi Chicken", "Fried Rice"]
    for(i = 0; i < 5; i++){
        w.document.write("<p>Price of " + num[i] + " " + item[i] + " = $" + cost[i].toFixed(2) + "</p>")
    }
    w.document.write("</div>")

    w.document.write("<div class = 'info'>")
    w.document.write("<p>Subtotal: $" + subtotal.toFixed(2) + "</p>")
    w.document.write("<p>Tax: $" + tax.toFixed(2) + "</p>")
    w.document.write("<p>Total Cost: $" + total.toFixed(2) + "</p>")
    if(delivery_check){
        w.document.write("<p>Estimated Delivery Time: " + get_time(delivery_check) + "</p>");
    } else {
        w.document.write("<p>Estimated Pickup Time: " + get_time(delivery_check) + "</p>");
    } 
    w.document.write("</div>")

}

// function that is run in response to user changes
$(document).ready(function () {
    // adjusting the cost values as the quantity of items changes
    for (let i = 0; i < 5; i++) {
        $('select[name=quan' + i.toString() + ']').change(function () {
            num[i] = this.value;
            prices();
        });
    }

    // only make the street and city boxes visible if the delivery
    // radio button is clicked
    let delivery_check;
    $("p[class='userInfo address']").hide(); 
    $("input[name=p_or_d]").change(function () {
        delivery_check = (this.value === "delivery");
        if (this.value === "delivery") {
            $("p[class='userInfo address']").fadeIn();
        } else {
            $("p[class='userInfo address']").fadeOut();
        }
    });

    // store the required input fields in variables and then call
    // the validate fcn when the user submits
    let first_name, last_name, street, city, phone;
    $("input[name=fname]").change(function () {
        first_name = this.value;
    });
    $("input[name=lname]").change(function () {
        last_name = this.value;
    });
    $("input[name=street]").change(function () {
        street = this.value;
    });
    $("input[name=city]").change(function () {
        city = this.value;
    });
    $("input[name=phone]").change(function () {
        phone = this.value;
    });
    $("input[type=button]").click(function () {
        valid(first_name, last_name, city, street, phone, delivery_check);
    });
});

