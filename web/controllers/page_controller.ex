defmodule Phoestit.PageController do
  use Phoestit.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
