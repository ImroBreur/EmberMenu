// De echte app
window.App = Ember.Application.create();

DS.RESTAdapter.reopen({
  namespace: 'restful'
});

DS.JSONSerializer.reopen({ // or DS.RESTSerializer
    serializeHasMany: function(record, json, relationship) {
        var key = relationship.key,
            hasManyRecords = Ember.get(record, key),
            toBeDeleted = Ember.makeArray();
        // Embed hasMany relationship if records exist
        if (hasManyRecords && relationship.options.embedded == 'always') {
            json[key] = [];
            hasManyRecords.forEach(function(item){
                json[key].push(item.serialize({includeId: true}));
            });
        }
        // Fallback to default serialization behavior
        else {
            return this._super(record, json, relationship);
        }
    }
});

