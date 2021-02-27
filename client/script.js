
document.addEventListener("DOMContentLoaded", function () {
  if (document.title === "Uçuş Kontrol Sistemi - Ana Sayfa") {
    fetch("http://localhost:3000/api/flights", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        loadFlights(data["data"]), loadAirports(data["data"]);
      });
  } else if (document.title === "Uçuş Kontrol Sistemi - Rezervasyon Yap") {
    const flight = JSON.parse(localStorage.getItem(`flight`));
    fetch(
      `http://localhost:3000/api/reservation/${flight.Flight_number}/${flight.Leg_number}/${flight.Flight_date}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => loadFlightInfos(data["data"]));
  }else if(document.title === "Uçuş Kontrol Sistemi - Check-In"){
    const getReservation = document.getElementById('checkin-btn');
    const custPassportInput = document.getElementById('passport');
    getReservation.onclick = function()  {
      console.log(custPassportInput.value)
      fetch(
        `http://localhost:3000/api/reservation/${custPassportInput.value}`,
        {
          method: "GET",
        }
      )
      .then(response => response.json())
      .then(data => getReservations(data['data']))
    }
  }
});


function getReservations(data){
  console.log(data)
  const reservations = document.getElementById('reservations');
  console.log(data[0]['Flight_number'])
  data.forEach(element => {
    const reserv = document.createElement('div');
    reserv.className = 'reservation';
    const flight_number = document.createElement("h4");
    flight_number.innerText = element['Flight_number'] + " / " + element['Leg_number'];
    reserv.appendChild(flight_number);
    const date = document.createElement("h5");
    var flightDate = new Date(element['Flight_date']).toISOString().split("T");
    date.innerText =
      "Tarih: " + flightDate[0] + " " + flightDate[1].replace(".000Z", " ");
    reserv.appendChild(date);
    
    const seat = document.createElement("h5");
   seat.innerText =
      "Koltuk: " + element['Seat_number'];
    reserv.appendChild(seat);
    const checkinBtn = document.createElement('button')
    checkinBtn.innerText = 'Check-in Yap'
    reserv.appendChild(checkinBtn)
    checkinBtn.onclick = function () {
      createCheckin(element['Flight_number'],element['Leg_number'],element['Flight_date'],element['Seat_number'],element['Passport_number'])}
    reservations.appendChild(reserv)
  })
}

function createCheckin(flightN,legN,Fdate,seat,customer){
  console.log(flightN+' ' +legN +' ' +date +' ' + seat+' '+customer)
  var date = new Date(Fdate)//.toISOString().split('T')[0].replace(/[/]/g,"-");
  date.setDate(date.getDate() + 1)
  var newDate = new Date(date).toISOString().split('T')[0].replace(/[/]/g,"-");
  
  fetch(`http://localhost:3000/api/checkin/${flightN}/${legN}/${newDate}/${seat}/${customer}` , {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then(alert('Check-in oluşturuldu'))
    location.href = './flights.html'
}

function loadFlightInfos(data) {
  console.log(data);
  const infos = document.getElementById("flight-infos");
  const flight_number = document.createElement("h4");
  flight_number.innerText = data[0].Flight_number + " / " + data[0].Leg_number;
  infos.appendChild(flight_number);
  const departure_time = document.createElement("h5");
  var depDate = new Date(data[0].Departure_time).toISOString().split("T");
  departure_time.innerText =
    "Kalkış: " + depDate[0] + " " + depDate[1].replace(".000Z", " ");
  infos.appendChild(departure_time);
  const arrive_time = document.createElement("h5");
  var arrDate = new Date(data[0].Arrive_time).toISOString().split("T");
  arrive_time.innerText =
    "Kalkış: " + arrDate[0] + " " + arrDate[1].replace(".000Z", " ");
  infos.appendChild(arrive_time);

  const dep_airport = document.createElement("h5");
  dep_airport.innerText =
    "Kalkış Havalimanı: " + data[0].Departure_airport_code;
  const arr_airport = document.createElement("h5");
  arr_airport.innerText = "Varış Havalimanı: " + data[0].Arrival_airport_code;
  infos.appendChild(dep_airport);
  infos.appendChild(arr_airport);

  const selectSec = document.createElement("div");
  selectSec.className = "price-select";
  infos.appendChild(selectSec);
  const priceLabel = document.createElement("label");
  priceLabel.setAttribute("for", "price");
  priceLabel.innerText = "Ücret: ";
  selectSec.appendChild(priceLabel);
  const selectPrice = document.createElement("select");
  selectPrice.name = "price";
  selectPrice.id = "price";
  var disabledOption = document.createElement("option");
  disabledOption.disabled = true;
  disabledOption.selected = true;
  disabledOption.innerText = "Lütfen sınıf ve ücret seçiniz..";
  selectPrice.appendChild(disabledOption);
  data.forEach((element) => {
    var priceOption = document.createElement("option");
    priceOption.value = element["Amount"];
    priceOption.text = element["Fare_code"] + " - " + element["Amount"] + " TL";
    selectPrice.appendChild(priceOption);
  });
  selectSec.appendChild(selectPrice);

  const selectSecCus = document.createElement("div");
  selectSecCus.className = "price-select";
  infos.appendChild(selectSecCus);

  const customerLabel = document.createElement("label");
  customerLabel.setAttribute("for", "customer");
  customerLabel.innerText =
    "Rezervasyon oluturmak için pasaport numaranızı giriniz: ";
  const customer = document.createElement("input");
  customer.id = "customer";
  customer.type = "text";
  customer.name = "customer";
  selectSecCus.appendChild(customerLabel);
  selectSecCus.appendChild(customer);

  const createReservation = document.createElement("button");
  createReservation.innerText = "Rezervasyon Yap";
  infos.appendChild(createReservation);
  createReservation.onclick = function () {
    var priceAmount = parseInt(
      selectPrice.options[selectPrice.selectedIndex].value
    );
    console.log(priceAmount);
    console.log(customer.value);
    localStorage.setItem(`customer`, JSON.stringify(customer.value));
    console.log("clicked");
    calculateFare(customer.value,selectPrice.options[selectPrice.selectedIndex].value)
    
    setTimeout(() => {
      const priceDesc = document.createElement('p');
      priceDesc.className = 'price-desc';
      var data = localStorage.getItem(`price`);
      console.log(data)
      priceDesc.innerText = 'Tüm indirimler ve vergiler dahil bilet tutarınız: ' + data + ' TL ';
      infos.appendChild(priceDesc);
      const confirmReservation = document.createElement("button");
      confirmReservation.innerText = "Rezervasyonu Onayla";
      infos.appendChild(confirmReservation);
      const flight = JSON.parse(localStorage.getItem(`flight`));
      
    var date = new Date(flight.Flight_date)//.toISOString().split('T')[0].replace(/[/]/g,"-");
    date.setDate(date.getDate() + 1)
    var newDate = new Date(date).toISOString().split('T')[0].replace(/[/]/g,"-");
    confirmReservation.onclick = function(){
      createSeatReservation(flight.Flight_number,flight.Leg_number,newDate,customer.value)
    }
    }, 2000);
   
}
}

function createSeatReservation(flightN,legN,date,customer){
    console.log(flightN +' ' + legN +' ' + date + ' ' + customer )
    fetch(`http://localhost:3000/api/reservation/${flightN}/${legN}/${date}/${customer}` , {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then(alert('Rezervasyon oluşturuldu'))
    location.href = 'checkin.html'
}

 function calculateFare(customer,price) {
    console.log(customer)
    fetch(`http://localhost:3000/api/customer-segmentation/${customer}`, {
    method: 'GET',
    headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    })
      .then((response) => response.json())
      .then((data) => {
          console.log(data['data'][0]['Total_mileage_point'])
          if(parseInt(data['data'][0]["Total_mileage_point"]) < 1000){
            var amount = parseInt(price);
            localStorage.setItem(`price`, (amount));
          }
        else if (parseInt(data['data'][0]["Total_mileage_point"]) >= 1000) {
            var discount= 0.05;
            var amount = parseInt(price) - parseInt(price)*discount;
            localStorage.setItem(`price`, JSON.stringify(amount));
          } else if (parseInt(data['data'][0]["Total_mileage_point"]) >= 2000) {
            var discount= 0.07;
            var amount = parseInt(price) - parseInt(price)*discount;
          } else if (parseInt(data['data'][0]["Total_mileage_point"]) >= 3500) {
            var discount= 0.08;
            var amount = parseInt(price) - parseInt(price)*discount;
          } else if (parseInt(data['data'][0]["Total_mileage_point"]) >= 5000) {
            var discount= 0.1;
            var amount = parseInt(price) - parseInt(price)*discount;
          }
      })
}

function loadAirports(data) {
  const departureSelect = document.getElementById("departure");
  console.log(departureSelect);
  const arrivalSelect = document.getElementById("arrival");
  console.log("data" + data[1]);
  data[1].forEach((element) => {
    var depOption = document.createElement("option");
    depOption.value = element["Airport_code"];
    depOption.text = element["Airport_code"] + " - " + element["Airport_name"];
    departureSelect.appendChild(depOption);
    var arrOption = document.createElement("option");
    arrOption.value = element["Airport_code"];
    arrOption.text = element["Airport_code"] + " - " + element["Airport_name"];
    departureSelect.appendChild(depOption);
    arrivalSelect.appendChild(arrOption);
  });
}

function loadFlights(data) {
  console.log(data.length);
  console.log(data);
  const flightCards = document.getElementById("flights");

  if (data.length === 0) {
    flightCards.innerHTML =
      "<p> Aradığınız kriterlere göre uçuş bulunamadı.. </p>";
  } else {
    data[0].forEach((element) => {
      var flight = document.createElement("div");
      flight.className = "flight";
      var image = document.createElement("img");
      image.className = "flight-img";
      image.src = "/client/images/ucak.jpeg";
      flight.appendChild(image);
      var flightNumber = document.createElement("h6");
      flightNumber.className = "flight-number";
      flightNumber.innerText =
        element["Flight_number"] + " / " + element["Leg_number"];
      flight.appendChild(flightNumber);
      var flightDate = document.createElement("p");
      flightDate.className = "flight-date";
      var date = new Date(element["Flight_date"]);
      flightDate.innerText = date.toLocaleDateString();
      console.log("flightDate" + element["Flight_date"]);
      flight.appendChild(flightDate);
      var departureAirport = document.createElement("p");
      departureAirport.className = "Departure-airport";
      departureAirport.innerText =
        "Nereden : \n  " + element["Departure_airport_code"];
      flight.appendChild(departureAirport);
      var arrivalAirport = document.createElement("p");
      arrivalAirport.className = "Arrival-airport";
      arrivalAirport.innerText =
        "Nereye : \n  " + element["Arrival_airport_code"];
      flight.appendChild(arrivalAirport);
      var fare = document.createElement("p");
      fare.className = "fare";
      fare.innerText = element["Amount"] + " TL' den başlayan fiyatlarla";
      flight.appendChild(fare);

      var reservationButton = document.createElement("button");
      reservationButton.className = "reservation-button";
      reservationButton.setAttribute(
        "data-flight",
        element["Flight_number"] +
          "-" +
          element["Leg_number"] +
          "-" +
          element["Flight_date"]
      );
      reservationButton.innerText = "Rezervasyon Yap";
      reservationButton.onclick = function () {
        localStorage.setItem(`flight`, JSON.stringify(element));
        console.log("clicked");
        location.href = "reservation.html";
        var infosOfFlight = flightNumber.innerText.split(" / ");
        console.log(infosOfFlight[0]);
        console.log(infosOfFlight[1]);
        console.log(flightNumber.innerText);
      };
      flight.appendChild(reservationButton);

      flightCards.appendChild(flight);
    });
  }
}
