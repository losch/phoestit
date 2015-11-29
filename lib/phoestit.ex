defmodule Phoestit do
  use Application

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      worker(Phoestit.ClientVersion, []),
      # Start the Ecto repository
      worker(Phoestit.Repo, []),
      # Here you could define other workers and supervisors as children
      # worker(Phoestit.Worker, [arg1, arg2, arg3]),
      worker(Phoestit.Notes, []),
      worker(Phoestit.ViewDimensions, []),
      # Start the endpoint when the application starts
      supervisor(Phoestit.Endpoint, [])
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Phoestit.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    Phoestit.Endpoint.config_change(changed, removed)
    :ok
  end
end
