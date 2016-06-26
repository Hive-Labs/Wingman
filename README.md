# Wingman

Plan your perfect date.

## Wingman API

- GET */v1/find*
  - The find endpoint return list of movies and restaurants.
  - Query parameters:
      - slat - start latitude
      - slon - start longitude
      - food - food category
      - date - date in yyyy-mm-dd format           
      i.e: /v1/food?slat=41&slon=-72&food=chinese
- Get */v1/uber*
  - The uber endpoint return estimate price and time.
  - Query parameters:
      - slat - start latitude
      - slon - start longitude
      - elat - end latitude
      - elon - end longitude
