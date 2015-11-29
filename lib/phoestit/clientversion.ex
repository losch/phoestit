defmodule Phoestit.ClientVersion do
  @moduledoc """
  Stores an md5sum of the client code. This is used for determining whether
  the client has an older version of the client running.
  """

  def start_link do
    {:ok, bundleFile} = File.read("priv/static/js/bundle.js")
    hash = :crypto.hash(:md5, bundleFile) |> Base.encode16
    Agent.start_link(fn -> hash end, name: __MODULE__)
  end

  def get do
    Agent.get(__MODULE__, fn hash -> hash end)
  end
end