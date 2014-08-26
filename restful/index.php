<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_URI"] == "/restful/menus/1")
{
?>
{
	"menus": {"id": 1, "name": "Hoofdmenu", "menuitems": [1,2]},
	"menuitems": [
		{"id": 1, "menu_id": 1, "label": "Menuitem 1", "menu_order": 1, "parent_id": null},
		{"id": 2, "menu_id": 1, "label": "Menuitem 2", "menu_order": 2, "parent_id": null, "children": [3]},
		{"id": 3, "menu_id": 1, "label": "Submenu item 1", "menu_order": 1, "parent_id": 2}
	]
}
<?php
} elseif ($_SERVER["REQUEST_URI"]== "/restful/menuitems/")
{

}
?>
