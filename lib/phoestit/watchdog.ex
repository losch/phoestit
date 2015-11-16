defmodule Phoestit.Watchdog do
  @moduledoc """
  Watchdog module that waits for :feed message and sends :timeout message
  when not receiving more :feed messages for a second.
  """

  @doc """
  Starts watchdog process
  """
  def start_link(name, caller_pid) do
    pid = spawn_link fn -> loop(false, caller_pid) end
    Agent.start_link(fn -> pid end, name: name)
  end

  @doc """
  Feeds the watchdog
  """
  def feed(name) do
    Agent.get(name, fn(pid) -> send pid, {:feed} end)
  end

  defp loop(first_msg_received, pid) do
    # Start watchdog after receiving the first message
    case first_msg_received do
      true ->
        receive do
          {:feed} ->
            loop(true, pid)
        after
          1_000 ->
            send pid, {:timeout}
            loop(false, pid)
        end
      false ->
        receive do 
          {:feed} ->
            loop(true, pid)
        end
    end
  end
end