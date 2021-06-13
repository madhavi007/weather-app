# Weather-app
This is a Weather App which based on your detected current location, fetches information from the OpenWeatherMap API using the GraphQL wrapper given by https://github.com/konstantinmuenster/graphql-weather-api and stores data in redux store and use that data to implement other features. If you click on the refresh button, data will automatically be updated from the store. If there are any api response errors, it will display on the screen. 

I've tried to optimize the code in such a way that it won't make any redundant calls if the location coordinates don't change. 

# Note
Create Google API key from https://developers.google.com/maps/documentation/geocoding/get-api-key and enable geocoding. Use that in .env file and add the following variable `REACT_APP_GOOGLE_API_KEY= <Your-api-key>`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

# Future Enhancements 
- Currently I've added a background image to update based on a weather summary for two values which can be enhanced if I've exhaustive list of all weather summaries.
- Currently the prerequisite is the location is shared but we can add checks and notify users if not shared.
- Code can be transformed from flat to modular structure. For instance If I had multiple queries, I would move them to a separate folder for all Graphql wrappers.