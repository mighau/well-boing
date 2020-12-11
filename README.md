# well-boing
Course project for course "Web Software Development" in Aalto University School of Science

## Required databases (total of 3):

__users__, where each user row has an id, email, and password (in a crypted format):
```
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password CHAR(60) NOT NULL
);

CREATE UNIQUE INDEX ON users((lower(email)));
```

__morning_data__, where mornign entries are stored:
```
CREATE TABLE morning_data (
sleep_duration DECIMAL NOT NULL,
sleep_quality INTEGER NOT NULL,
generic_mood INTEGER NOT NULL,
date DATE,
user_id INTEGER REFERENCES users(id)
);

ALTER TABLE morning_data ALTER COLUMN date SET DEFAULT NOW();
```

__evening_data__, where evening entries are stored:
```
CREATE TABLE evening_data (
sport_time DECIMAL NOT NULL,
study_time DECIMAL NOT NULL,
eating_regularity INTEGER NOT NULL,
eating_quality INTEGER NOT NULL,
generic_mood INTEGER NOT NULL,
date DATE,
user_id INTEGER REFERENCES users(id)
);

ALTER TABLE evening_data ALTER COLUMN date SET DEFAULT NOW();
```
## Environment variables for the application

create a `.env` file that includes your database iformation and credentials:
```
PGPORT=[port on which PostgreSQL is running on]
PGDATABASE=[database name]
PGHOST=[database host (hostname)]
PGUSER=[database username]
PGPASSWORD=[database password]
```
place the `.env`file at the root of the application (same folde with `app.js` and `deps.js`)

## Running the application locally

After the previous steps, use the following command to start the application __form the application root folder__:
```
deno run --allow-all --unstable app.js
```
have fun!

## Running the pre-made tests
There are tests in the `/tests/` folder in order to ensure that the application works properly. To run the tests type the to the __application root folder__:
```
deno test --allow-all --unstable app.js