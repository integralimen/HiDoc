/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_53644091')

    // update collection data
    unmarshal(
      {
        createRule:
          '@request.auth.id != "" && (\n  @request.auth.role = "admin" ||\n  (\n    @request.auth.role = "doctor" &&\n    doctor.user = @request.auth.id &&\n    is_booked = false\n  )\n)',
        deleteRule:
          '@request.auth.id != "" &&\nis_booked = false &&\n(\n  @request.auth.role = "admin" ||\n  (\n    @request.auth.role = "doctor" &&\n    doctor.user = @request.auth.id\n  )\n)',
      },
      collection,
    )

    return app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_53644091')

    // update collection data
    unmarshal(
      {
        createRule: '@request.auth.id != "" && @request.auth.role = "admin"',
        deleteRule: '@request.auth.id != "" && @request.auth.role = "admin"',
      },
      collection,
    )

    return app.save(collection)
  },
)
