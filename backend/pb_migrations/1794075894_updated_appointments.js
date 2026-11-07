/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_1037645436')

    // update collection data
    unmarshal(
      {
        listRule:
          '@request.auth.id != "" && (\n  user = @request.auth.id ||\n  doctor.user = @request.auth.id ||\n  @request.auth.role = "admin"\n)',
        viewRule:
          '@request.auth.id != "" && (\n  user = @request.auth.id ||\n  doctor.user = @request.auth.id ||\n  @request.auth.role = "admin"\n)',
      },
      collection,
    )

    return app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_1037645436')

    // update collection data
    unmarshal(
      {
        listRule: null,
        viewRule: null,
      },
      collection,
    )

    return app.save(collection)
  },
)
