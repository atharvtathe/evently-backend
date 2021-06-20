# eventy-backend
Simple REST API for an event listing website.

To run first install node modules with the following command :

```
npm install
```
Put your database url in the environment variables as **DB_URL**

Then run with the following command :

```
npm start
```
## API endpoints

### user related endpoints

Open endpoints require no Authentication.
* create new user  : `POST /api/users/signup`
* login existing user  : `POST /api/users/login`

### events related endpoints

Open endpoints require no Authentication.
* all events list  : `GET /api/events/eventlist`
* get a specific event  : `GET /api/events/:eventID`

Endpoints that require **Authentication**
* create an event  : `POST /api/events/event`
* update an event  : `PATCH /api/events/:eventID`
* delete an event  : `DELETE /api/events/eventlist`
* get event created by specific user  : `GET /api/events/myevents/:userID`


