defmodule Phoestit.Repo.Migrations.CreateNote do
    use Ecto.Migration
    def change do
        create table(:notes) do
            add :contents, :text
            add :x, :integer
            add :y, :integer
            add :width, :integer
            add :height, :integer
            timestamps
        end
    end
end
