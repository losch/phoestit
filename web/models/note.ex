defmodule Phoestit.Note do
  use Phoestit.Web, :model

  schema "notes" do
    field :api_id, :string
    field :contents, :string
    field :x, :integer
    field :y, :integer
    field :width, :integer
    field :height, :integer

    timestamps
  end

  @required_fields ~w(contents x y width height)
  @optional_fields ~w(api_id)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> validate_length(:contents, min: 0, max: 2000)
  end
end