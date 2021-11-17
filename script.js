/**
 * Composant prévision
 */
const WeatherCard = {
  /* Props récupérable par le composant */
  props: {
    dateTime: String,
    temp: Number,
    tempMin: Number,
    tempMax: Number,
    speed: Number,
    description: String,
    icon: String,
  },

  /* Template */
  template: `
    <div class="weather-card">
        <img :src="'http://openweathermap.org/img/wn/' + icon + '@2x.png'" />
        <h3 class="date">{{dateTime}}</h3>
        <p class="description">{{description}}</p>
        <p>Température: {{temp}}°c</p>
        <p>Températures prévues: {{tempMin}}°c -  {{tempMax}}°c</p>
        <p>Vitesse du vent: {{speed}}km/h</p>
    </div>
    `,
};

/**
 * Composant racine
 */
const RootComponent = {
  /* Enregistrement des composant utilisables */
  components: {
    WeatherCard: WeatherCard,
  },

  /* Data properties */
  data() {
    return {
      forecastList: [],
      forecastLocation: "",
    };
  },

  /* Hook mounted - Fonction appelée lors du montage de l'instance */
  async mounted() {
    // L'adresse de la requête pour la météo de Nice
    const url =
      "https://api.openweathermap.org/data/2.5/forecast?q=Le Cannet,fr&appid=7524b547972909bbc321d4e184e23f48&units=metric&lang=fr";

    // Envoi de la requête et récupération de la réponse
    const response = await fetch(url);

    // Lecture du body
    const data = await response.json();

    // Assignation des données reçues dans des data properties
    this.forecastList = data.list;
    this.forecastLocation = data.city.name;
  },

  /* Méthodes */
  methods: {
    getForecastByLocation() {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // L'adresse de la requête pour la météo de Nice
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=7524b547972909bbc321d4e184e23f48&units=metric&lang=fr`;

        // Envoi de la requête et récupération de la réponse
        const response = await fetch(url);

        // Lecture du body
        const data = await response.json();

        // Assignation des données reçues dans des data properties
        this.forecastList = data.list;
        this.forecastLocation = data.city.name;
      });
    },
  },

  /* Template */
  template: `
        <div>
            <h1>La météo à {{forecastLocation}}</h1>
          
            <div class="weather-cards-container">
                <WeatherCard
                    v-for="forecast in forecastList"

                    :dateTime="forecast.dt_txt"
                    :temp="forecast.main.temp"
                    :tempMin="forecast.main.temp_min"
                    :tempMax="forecast.main.temp_max"
                    :speed="forecast.wind.speed"
                    :description="forecast.weather[0].description"
                    :icon="forecast.weather[0].icon"
                />
            </div>

            <button @click="getForecastByLocation">Se localiser</button>
        </div>
    `,
};

/******* Création de l'application *******/
Vue.createApp(RootComponent).mount("#root");
