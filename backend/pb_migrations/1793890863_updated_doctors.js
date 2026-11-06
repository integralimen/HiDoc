/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_656799828')

    // update field
    collection.fields.addAt(
      1,
      new Field({
        autogeneratePattern: '',
        help: '',
        hidden: false,
        id: 'text3687080900',
        max: 0,
        min: 0,
        name: 'full_name',
        pattern: '',
        presentable: true,
        primaryKey: false,
        required: true,
        system: false,
        type: 'text',
      }),
    )

    return app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_656799828')

    // update field
    collection.fields.addAt(
      1,
      new Field({
        autogeneratePattern: '',
        help: '',
        hidden: false,
        id: 'text3687080900',
        max: 0,
        min: 0,
        name: 'full_name',
        pattern: '',
        presentable: false,
        primaryKey: false,
        required: true,
        system: false,
        type: 'text',
      }),
    )

    return app.save(collection)
  },
)
