import "./Weather.css";
import Search from "../assets/search.png";
import Clear from "../assets/clear.png";
import Cloud from "../assets/cloud.png";
import Drizzle from "../assets/drizzle.png";
import Rain from "../assets/rain.png";
import Snow from "../assets/snow.png";
import Wind from "../assets/wind.png";
import Humidity from "../assets/humidity.png";
import UV from "../assets/UV.svg";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [uvWarning, setUvWarning] = useState("");

  const allIcons = {
    "01d": Clear,
    "01n": Clear,
    "02d": Cloud,
    "02n": Cloud,
    "03d": Cloud,
    "03n": Cloud,
    "04d": Drizzle,
    "04n": Drizzle,
    "09d": Rain,
    "09n": Rain,
    "10d": Rain,
    "10n": Rain,
    "13d": Snow,
    "13n": Snow,
  };

  const search = async (city) => {
    if (city === "") {
      alert("Enter City Name");
      return;
    }
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;

      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      if (!weatherResponse.ok) {
        alert(weatherData.message);
        return;
      }

      const { lat, lon } = weatherData.coord;

      const uvUrl = `https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}&alt=0`;

      const uvResponse = await fetch(uvUrl, {
        headers: {
          "x-access-token": import.meta.env.VITE_UV_API_KEY,
        },
      });

      const uvData = await uvResponse.json();

      if (!uvResponse.ok) {
        alert(uvData.message);
        return;
      }

      const icon = allIcons[weatherData.weather[0].icon] || Clear;

      const uvIndex = uvData.result.uv;

      // UV Index Warning Logic
      let warningMessage = "";
      if (uvIndex < 3) {
        warningMessage =
          "Low UV index. Safe to be outdoors without sun protection.";
      } else if (uvIndex < 6) {
        warningMessage = "Moderate UV index. Consider wearing sunscreen.";
      } else if (uvIndex < 8) {
        warningMessage = "High UV index. Wear sunscreen, hat, and sunglasses.";
      } else if (uvIndex < 11) {
        warningMessage =
          "Very high UV index. Take extra precautions - sunscreen, hat, sunglasses.";
      } else {
        warningMessage =
          "Extreme UV index. Avoid being outdoors during peak hours.";
      }

      setUvWarning(warningMessage);

      setWeatherData({
        Humidity: weatherData.main.humidity,
        windspeed: weatherData.wind.speed,
        temperature: Math.floor(weatherData.main.temp),
        location: weatherData.name,
        icon: icon,
        UV: Math.floor(uvIndex),
      });
    } catch (error) {
      setWeatherData(false);
      console.error("Error in Fetching weather data:", error);
    }
  };

  useEffect(() => {
    search(inputRef.current.value);
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input type="text" placeholder="Search" ref={inputRef} />
        <img
          src={Search}
          alt="search"
          onClick={() => search(inputRef.current.value)}
        />
      </div>
      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}&#xb0; C</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={Humidity} alt="" />
              <div>
                <p>{weatherData.Humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={Wind} alt="" />
              <div>
                <p>{weatherData.windspeed} kmph</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
          <div className="uv-index">
            <div className="uv-data">
              <img src={UV} alt="" />
              <p>{weatherData.UV}</p>
            </div>
            <div className="uv-warning">
              <p>{uvWarning}</p>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Weather;
