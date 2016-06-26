# Wingman

### Plan your perfect date.
### Version 1.0

<p align="center">
  <img src="https://raw.githubusercontent.com/Hive-Labs/Wingman/master/public/img/wingman.png"/>
</p>

#### How to run this project:
```
  git clone https://github.com/Hive-Labs/Wingman
  cd Wingman    
  npm install
  npm start or node app.js
```

#### Technology

    - [Express.js](http://expressjs.com/) - Framework used to build the REST-based backend.
    - [Node.js](https://nodejs.org/en/) - Evented I/O for the backend.
    - [jQuery](https://jquery.com/) - Make life easy.
    - [Bootstrap](http://getbootstrap.com/) - Template.
    - 3rd party API: GrubHub and Uber API.

#### Application workflow
###### Input:
    - Money you want to spend
    - How many people?
    - Type of foods (Chinese, Italian..etc)
    - Time (Dafault to Right now)
    - Location (Default to current location)
    - Uber
###### Background:
    - List of restaurants in your location.
    - Picking a restaurant will fire a Wingman API to get list of Movies.
    - Picking Movie will fire an API to get estimate price from Uber.
###### Output:
    - Total money
    - Total duration
    - The restaurant and movie

#### Wingman API

- GET */v1/find*
  - The *find* endpoint return list of movies and restaurants.
  - Query parameters:
      - slat - start latitude
      - slon - start longitude
      - food - food category
      - date - date in yyyy-mm-dd format           
      i.e: /v1/food?slat=41&slon=-72&food=chinese
- Get */v1/uber*
  - The *uber* endpoint return estimate price and time.
  - Query parameters:
      - slat - start latitude
      - slon - start longitude
      - elat - end latitude
      - elon - end longitude

#### License
MIT
