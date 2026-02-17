# weather-app
Monorepo Weather app project in React + NestJS + Vitest.

### How to run

```
# Install node_modules from root
npm install

# Install node_modules from root
npm install

#Create file apps/weather-backend/.env with variables
# Check section 'Third Party app' on documentation for urls 
IPAPI_BASE_URL=<ipapi_current_url>
NWS_BASE_URL=<nws_current_url>
NWS_CONTACT_URL=<app_url> #Can be any url that makes your instance identifiable
NWS_CONTACT_EMAIL=<app_email> #Can be any email that makes your instance identifiable
NWS_TIMEOUT=<wanted_time_out_ms>

# Run backend
npm run start:dev --ws=apps/weather-backend

# Run frontend
npm run dev --workspace=apps/weather-frontend
```

### How to test

```
# From root directory
# Run backend tests
npm test --workspace=apps/weather-backend

# Run backend tests in watch mode (Each change will rerun tests)
npm run test:watch --workspace=apps/weather-backend

# Run backend tests and reflect coverage
npm run test:cov --workspace=apps/weather-backend

# Run front end Vitests
npm run test --workspace=apps/weather-frontend
```

### Endpoint documentation

Documented with Swagger under the ```/api``` path. Once the app is running, browsing to that path will show details on each endpoint.

### Third Party API

- [National Weather Service](https://www.weather.gov/documentation/services-web-api#/): Free API that only covers United State territory. No need for API but using User-Agent header is encouraged.
- [ipAPI](https://ipapi.co/): IP Location API with limited usage on free tier. Accurate enough to map its lat and lot to weather grids and inaccurate enough for location to not be sensible or intrusive.


### How does development workflow work?

- Using Husky, pre-commit and pre-push tests are done to ensure functionality, eslint standards, branch naming and commit conventions.
- Using Github Workflows, a PR is ensured to pass tests and naming conventions.
- Integrated with Jira for cleaner task development and open to automation.


### What is next for this app?

- Currently fetched data from third-party apps is stored on local storage to keep it closer to client-side while loading. <br>
The amount of data can get bigger overtime to be non-efficient. Caching services such as Redis will become handy for these situations and or consider storing third party data on our end
to make calls less frequent as they might be limited.
- Expanding coverage outside of the US. Currently NWS only covers US-territory. Third party apps cover other countries but are request-limited.
This means that we'll need to optimize calls beforehand to make a smoother transition. On the meantime, if the obtained IP is not from the US, it defaults to 
Google's IP; additionally, NWS handles non-US lat and lon.
- Visualizing weather info in a map. This would require more frequent calls to either weather API so that each grid is covered, caches and loaded efficiently.
- User implementation with the possibility to keep track of weather on location's of interest, alerts and other features.
