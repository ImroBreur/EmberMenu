App.MainMenuController = Ember.ObjectController.extend(Ember.Evented, {
	init: function ()
	{
		var self = this;
		this.get('store').find('menu', 1).then(function (model)
		{
			self.set('content', model);
		});
	}
});

App.MainMenuItemsController = Ember.ArrayController.extend(Ember.Evented, {
	contentBinding: 'parentController.content.menuitems',

	filteredContent: Ember.computed( function() {
		return this.filter(function(item, ifx, en) {
			return (item.get('parent_id') == null);
		});
	}).property('content.[]'),


	removeItem: function(propName, value){
       var self = this,
       	   obj = this.findProperty(propName, value);

       this.get('content').removeObject(obj);
    }

});