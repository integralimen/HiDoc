/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "createRule": "@request.body.role = \"patient\" && @request.body.verified:isset = false",
    "deleteRule": null,
    "listRule": "@request.auth.id != \"\" && id = @request.auth.id",
    "updateRule": "@request.auth.id != \"\" && id = @request.auth.id && @request.body.role:changed = false && @request.body.verified:changed = false",
    "viewRule": "@request.auth.id != \"\" && id = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "createRule": "",
    "deleteRule": "id = @request.auth.id",
    "listRule": "id = @request.auth.id",
    "updateRule": "id = @request.auth.id",
    "viewRule": "id = @request.auth.id"
  }, collection)

  return app.save(collection)
})
