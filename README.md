# weather-app
Monorepo Weather app project in React + NestJS + Vitest.

### How to run

```
# Install node_modules from root
npm install

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

- [National Weather Service](!https://www.weather.gov/documentation/services-web-api#/): Free API that only covers United State territory. No need for API but using User-Agent header is encouraged.
- [ipAPI](!https://ipapi.co/): IP Location API with limited usage on free tier. Accurate enough to map its lat and lot to weather grids and inaccurate enough for location to not be sensible or intrusive. 
