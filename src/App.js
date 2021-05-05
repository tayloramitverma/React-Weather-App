import React, {useState} from 'react'
import './App.css'

function App() {

  const [latitude, setLatitude] = useState(26.9124);
  const [longitude, setLongitude] = useState(75.7873);

  const updateWeather = () => {
        const actionBtn = document.getElementById('checkWeather');
        const errorMessage = document.querySelector('.errorMessage');
        actionBtn.innerText = 'Processing..';

        let regValidate = new RegExp('^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}');

        if(latitude !== '' && longitude !== ''){
            if(regValidate.test(latitude) && regValidate.test(longitude)){
                getWeather(latitude, longitude);
            }else{
                errorMessage.innerText = 'Your entered latitude and longitude is not valid!';
                errorMessage.style.display = 'block';
                actionBtn.innerText = 'Re-Check Weather';
            }
        }else{
            errorMessage.innerText = 'Please enter valid latitude and longitude!';
            errorMessage.style.display = 'block';
            actionBtn.innerText = 'Re-Check Weather';
        }
  }

  const getWeather = (latitude, longitude) => {

    const errorMessage = document.querySelector('.errorMessage');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weatherApiCode = 'e9c64818f9551211310596b72a2e389c';
    const actionBtn = document.getElementById('checkWeather');

    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+latitude+'&lon='+longitude+'&units=metric&appid='+weatherApiCode+'&exclude=hourly,minutely,alerts')
    .then(res=>res.json())
    .then(finalres=>{
        errorMessage.style.display = 'none';
        if(finalres.current){
            let curretDate = new Date(finalres.current.dt).toUTCString();
            let d = new Date(finalres.current.dt*1000);
            let dayName = days[d.getDay()];
            var currentWeather = `<div class="weather-date-location">
                                <h3>`+dayName+`</h3>
                                <p class="text-gray"> <span class="weather-date">`+curretDate+`</span> <span class="weather-location">`+finalres.timezone+`</span> </p>
                            </div>
                            <div class="weather-data d-flex">
                                <div class="mr-auto">
                                    <h4 class="display-3">`+finalres.current.temp+` <span class="symbol">°</span>C</h4>
                                    <p> `+finalres.current.weather[0].main+` </p>
                                </div>
                            </div>`;

            document.getElementById('current_weather').innerHTML = currentWeather;
        }

        var weatherData = '';
        if(finalres.daily){
            for(let i=0;i<finalres.daily.length-1;i++){
                let d = new Date(finalres.daily[i].dt*1000);
                let dayName = days[d.getDay()];
                weatherData += `<div class="weakly-weather-item">
                                    <p class="mb-1"> `+dayName+` </p> <img src="http://openweathermap.org/img/w/`+finalres.daily[i].weather[0].icon+`.png" width="32" height="32" alt="`+dayName+`">
                                    <p class="mb-0"> `+finalres.daily[i].temp.min+`° - `+finalres.daily[i].temp.max+`° </p>
                                </div>` 
            }
            document.getElementById('week_weather').innerHTML = weatherData;
        }
        actionBtn.innerText = 'Check Weather';

    }).catch(err => {
        errorMessage.innerText = 'There is something wrong with your weather api!';
        errorMessage.style.display = 'blcok';
    });
  }

  return (
        <div className="page-content page-container" id="page-content">
            <div className="padding">
                <div className="row container d-flex justify-content-center">
                    <div className="col-lg-8 grid-margin stretch-card">

                        <div className="alert alert-danger errorMessage" style={{display:'none'}} role="alert"></div>

                        <form className="form-inline">
                            <div className="form-group mb-2">
                                <label htmlFor="latitude" className="sr-only">Latitude</label>
                                <input type="text" className="form-control" onChange={(e)=>setLatitude(e.target.value)} id="latitude" value={latitude} />
                            </div>
                            <div className="form-group mx-sm-3 mb-2">
                                <label htmlFor="longitude" className="sr-only">Longitude</label>
                                <input type="text" className="form-control" onChange={(e)=>setLongitude(e.target.value)} id="longitude" value={longitude} />
                            </div>
                            <button type="button" onClick={updateWeather} id="checkWeather" className="btn btn-primary mb-2">Check Weather</button>
                        </form>

                        <div className="card card-weather">
                            <div className="card-body" id="current_weather">
                        
                            </div>
                            <div className="card-body p-0">
                                <div className="d-flex weakly-weather" id="week_weather">
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
  );
}

export default App;
