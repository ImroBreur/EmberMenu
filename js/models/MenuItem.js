App.Menu = DS.Model.extend({
	name: DS.attr('string'),
	menuitems: DS.hasMany('menuitem', {embedded: 'always'})
});

App.Menuitem = DS.Model.extend({
	label: DS.attr('string'),
	menu_order: DS.attr('number'),
	parent_id: DS.attr('number'),
	// menuitem: DS.belongsTo('menuitem'),
	menu_id: DS.belongsTo('menu'),
	children: DS.hasMany('menuitem', {embedded: 'always'}),
});