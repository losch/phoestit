defmodule Phoestit.Repo.Migrations.AddApiIdToNotes do
  use Ecto.Migration

  def change do
    alter table(:notes) do
      add :api_id, :string, default: ""
    end
  end
end
