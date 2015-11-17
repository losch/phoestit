defmodule Phoestit.ViewDimensions do
  def start_link do
    Agent.start_link(fn -> %{ "width" => 0, "height" => 0 } end, 
                     name: __MODULE__)
  end

  def get do
    Agent.get(__MODULE__, fn dimensions -> dimensions end)
  end

  def update(dimensions) do
    Agent.update(__MODULE__, fn _ -> dimensions end)
  end
end
