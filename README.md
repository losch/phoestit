# Phöst-it!

Simple realtime note application.

Notes can be created, destroyed and their size and position can be changed by
dragging with mouse. Note contents can be updated either via UI or via HTTP API.

Notes' state is stored to database after updates from browsers stop for a while.

## Installation and running

Requires Erlang, Elixir, PostgreSQL and NodeJS to be installed for building
and running the application.

To build frontend (`/priv/static/js/bundle.js`):

  1. Change to frontend code's directory with `cd priv/frontend`
  2. Install dependencies with `npm install`
  3. Build bundle.js with `npm run build`

To start server:

  1. Install dependencies with `mix deps.get`
  2. Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  3. Start Phoenix endpoint with `mix phoenix.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## Changing note contents via HTTP API

Note contents can be changed by sending PUT or PATCH request to
`/api/notes/:api_id` with the following payload in JSON format:

    {
      "contents": "contents for the note"
    }

For a note to be updatable via API, it must have an identifier called *API ID*
which is used for targeting the updates to the correct note. This identifier
is added via UI. Note's position and size are also controlled via UI.

##### Steps for creating a note that can be updated via API

  1. Create a new note in the UI (or use an existing note for this)
  2. Click the note for entering editing mode
  3. Then click the ID field at note's left upper corner
  4. A prompt will ask for a new API ID. The API ID is a string.
  5. Note's background will switch to orange color which indicates that the
     contents may be updated and overwritten via API at any time.
  6. Sending PUT or PATCH requests to `/api/notes/:api_id` changes the contents
     of a note

##### PUT request example:

    curl -H "Content-Type: application/json" -X PUT -d '{"contents": "eggs"}' "http://localhost:4000/api/notes/ham"

This request updates note's which API ID is "ham" contents to "eggs".

## Development

Backend is Phoenix Framework. It handles socket and HTTP APIs and connection to
database. It also serves the index.html and all static files.

Frontend uses Webpack and Babel as a toolchain for building bundle.js. Frontend
handles state with Redux and does rendering with React and Material UI. Socket
connection to backend is done with Phoenix Framework's socket library.
