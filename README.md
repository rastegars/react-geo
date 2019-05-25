## Installation
```
git clone https://github.com/rastegars/react-geo.git
cd react-geo/
npm install
npm start
```

## Back-End Installation
```
git clone https://github.com/rastegars/geo-coding-api.git
cd geo-coding-api/
bundle install
rails db:create; rails db:migrate
rails s -p 3004 -b 0.0.0.0
```
https://github.com/rastegars/geo-coding-api

## Configuration
To run the app, you need to add `REACT_APP_API_HOST` and `REACT_APP_GOOGLE_MAP_API_KEY` inside the appropriate `.env` files:
```
# .env.development.local
REACT_APP_API_HOST=http://localhost:3004
REACT_APP_GOOGLE_MAP_API_KEY=yourgooglemapapikey
```

### Geocoding Service ("Lookup")
This app supports a variety of street geocoding services. The default lookups is :nominatim.  
To create a Rails initializer with sample configuration:
```
rails generate geocoder:config
```
```
# config/initializers/geocoder.rb
Geocoder.configure(
  # geocoding service (default :nominatim)
  lookup: :yandex,

  # API key:
  api_key: "...",

  # geocoding service request timeout, in seconds (default 3):
  timeout: 5,
)
```
