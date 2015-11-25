# Phöst-it!

Simple realtime note application.
Notes can be created, destroyed and their size and position can be changed by
dragging with mouse.

State is stored into database after updates from browsers stop for a while.

Requires Elixir, PostgreSQL and NodeJS to be installed for building and running
the application.

To build frontend (/priv/static/js/bundle.js):

  1. cd priv/frontend
  2. npm install
  3. npm run build

To start server:

  1. Install dependencies with `mix deps.get`
  2. Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  3. Start Phoenix endpoint with `mix phoenix.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

# Changing note contents via HTTP API

  1. Create a new note in the UI (or use an existing note for this)
  2. Click the note for entering editing mode
  3. Then click the ID field in note's left upper corner
  4. A prompt will ask for a new API ID. The API ID is a string.
  5. Note will change to orange color for indicating that it can be updated via API
  6. PUT and PATCH requests to /api/notes/:api_id with JSON payload changes the contents of a note

Example:

  curl -H "Content-Type: application/json" -X PUT -d '{"contents": "eggs"}' "http://localhost:4000/api/notes/ham"

This request updates note's which API ID is "ham" contents to "eggs".
