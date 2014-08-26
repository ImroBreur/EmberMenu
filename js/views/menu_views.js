App.MainMenuView = Ember.View.extend(Ember.Evented, {
	templateName: "menu",
	actions : {
		// Event vanuit view: Nieuw item toeveogen
        newMenuItem: function()
		{
			// Maak een nieuw item aan van het type menuitem en standaard label 'Nieuw Menuitem'
			var menuitem = this.get('controller.store').createRecord('menuitem',
				{
					label: 'Nieuw Menuitem'
				}
			);
			// Voeg het nieuwe item toe aan de store (collection) van menuitems
			this.get('controller.content.menuitems').addObject(menuitem);
        }
	},

	didInsertElement: function()
	{
		this.menu = this.$().find("#menu");
		this.bin = this.$().find('#menu_controls > .bin');
		this.setLibraries();
	},

	setLibraries: function()
	{
		var self = this;

		// Stel de prullenbak in met een jquery Droppable
        this.bin.droppable({
			drop: function(event, ui) {
				var draggable 	= $(ui.draggable),
					offset 		= draggable.offset(),
					width 		= draggable.width(),
					height 		= draggable.height();

				// Bepaal het id van het te verwijderen item
				var $this = ui.draggable,
					id = $this.data('id');
				id = id.split("_");
				id = id[1];

				// Zoek het te verwijderen model op in de store
				var model = self.get('controller.store').getById('menuitem', id);

				// Hack: bij deze demo kunnen we de nieuw aangemaakte models niet vinden in de store (model is dan null)
				// dus doen we niet echt de verwijderfunctie van het model
				if (model !== null)
					model.deleteRecord();

				// Verwijder nu de menuitem view uit de dom
				$this.remove();
				self.bin.css("background","#d95e36");
			},
			over : function(event, ui) {
				self.bin.css("background", "#962500");
			},
			out: function(event, ui) {
				self.bin.css("background", "#d95e36");
			}
	    });
	}
});

App.MainMenuItemView = Ember.View.extend({
	tagName: 'li',
	templateName: 'mainMenuItem',
	attributeBindings: ['data-id'],

	didInsertElement: function()
	{
		// Als we nog geen id hebben dan is het geen 'edit' maar een 'create'
		if (this.get('content.id') === null)
		{
			// Maak nu een tijdelijke ID aan voor het effect van als het opslaan wel zou werken
			var newId = this.get('parentView.content.content').length + 1;
			this.set('content.id', newId);
			// Zet het data-attribuut zodat jQueryUI ook weet met welk model (id) hij te maken heeft
			this.set('data-id', "list_" + newId);
			// Start de editor. Een nieuw item wil je altijd direct bewerken
			this.edit();
		} else
		{
			// Zet het data-attribuut zodat jQueryUI ook weet met welk model (id) hij te maken heeft
			this.set('data-id', "list_" + this.get('content.id'));
		}
	},

	edit: function()
	{
		this.$('> span > .label').hide();
		this.$('> span > div.editor').show();
	},

	actions:
	{
		edit: function()
		{
			this.$('> span > .label').hide();
			this.$('> span > div.editor').show();
		},

		save: function() {
			this.$('> span > .label').show();
			this.$('> span > div.editor').hide();
		}
	}
});

App.MainMenuItemsView = Ember.CollectionView.extend(Ember.Evented, {
	tagName: 'ul',
	elementId: 'menu',
	contentBinding: 'this.controller.content',
	itemViewClass: App.MainMenuItemView,
	didInsertElement: function ()
	{
		var self = this;
		// Maak deze view een jquery nestedSortable
		this.setSortable();
		// Luister naar het event reloadMenu zodat het hele menu opnieuw geladen kan worden indien nodig
        this.get('controller.parentController').on('reloadMenu', $.proxy(this.reloadMenu, this));
	},
	setSortable: function()
	{
		var self = this;
		this.$().nestedSortable({
			forcePlaceholderSize : true,
            handle : 'span',
            items: 'li',
            toleranceElement: ' > span',
            maxLevels : 3,
            distance: 3,
            listType : 'ul',
            tolerance: "pointer",
            revert: 250,
            opacity : .7,
            tabSize : 25,
            attribute: 'data-id',
            isTree: true,
            stop : function(event, ui)
            {
            	// Zet alle elementen om naar een array zodat we er doorheen kunnen lopen om alles op te slaan
            	var modelsHierachy = self.$().nestedSortable("toArray", {startDepthCount: 0});
            	// Roep de functie aan die alle modellen gaat updaten met nieuwe locaties en eventueel parents
            	self.updateModels(modelsHierachy);
            },
            change : function(event, ui) { },
            placeholder: "sortable-placeholder"
        });
	},
	updateModels: function(modelsHierachy)
	{
		// Loop door alle items heen
		for (i = 1; i < modelsHierachy.length; i++)
		{
			// Zoek het model op dat hoort bij het jquery (nestedSortable) element (LI)
			var modelchanges = modelsHierachy[i],
				model = this.get('controller.store').getById('menuitem', parseInt(modelchanges.item_id));

			// Hack voor de demo. Doordat we niet kunnen opslaan snapt de store niet dat het model erin staat
			if (model !== null)
			{
				// Als we wel een model hebben kunnen vinden:
				// Zet dan de nieuwe sorteer volgorde ID
				model.set('menu_order', i);
				// Zet de (mogelijk) nieuwe parent
				model.set('parent_id', modelchanges.parent_id);
			}
		}
	},
	reloadMenu: function()
	{
		console.log('test');
		this.rerender();
	}

});

App.SubMenuCollectionView = Ember.CollectionView.extend({
	tagName: 'ul',
	contentBinding: 'this.parentView.content.children',
	itemViewClass: App.MainMenuItemView,
});

App.MenuItemEditorView = Ember.View.extend({
	tagName: 'div',
	templateName: 'mainMenuEdit',
	actions: {

	}
});