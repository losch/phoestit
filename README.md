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
