defmodule Phoestit.Router do
  use Phoestit.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Phoestit do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/view", PageController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", Phoestit do
  #   pipe_through :api
  # end
end
