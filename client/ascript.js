



  
  
  
  
  
  
  const flight = JSON.parse(localStorage.getItem(`flight`))
  
  
  console.log(flight.Leg_number)
  

  fetch(
    `http://localhost:3000/api/reservation/${flight["Flight_number"]}/${flight["Leg_number"]}/${flight["Flight_date"]}`,
    {
      method: "GET",
    }
  )
  .then(
      response => response.json()
  )
  .then(data => loadFlightInfos(data['data']))