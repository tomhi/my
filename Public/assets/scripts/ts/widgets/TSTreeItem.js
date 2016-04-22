define("ts/widgets/TSTreeItem",[
	"ts/widgets/TSTreeNode",
	"ts/util/GenericUtil",
],function(TSTreeNode,GenericUtil){
	"use strict";
	//----------------------------------------------------------------
	// TSTreeItem
	//----------------------------------------------------------------
	/**
	 * @namespace ts.widgets
	 * @class TSTreeItem
	 * @extends ts.widgets.TSTreeNode
	 * @constructor
	 * @param {String} id
	 * @param {Object} [initParams]
	 */
	function TSTreeItem(id,initParams){
		TSTreeNode.call(this,id,initParams);
		this.checkbox = this.rootElement.querySelector('input[type=checkbox]');
	}
	ExtendClass(TSTreeItem,TSTreeNode);
	SetNativeFlag(TSTreeItem);
	SetProperties(TSTreeItem.prototype,DONT_ENUM,GenericUtil.obj2Arr({
		template:[
		    '<li>',
		     	'<span data-role="span" class="button switch"></span>',
		     	'<input type="checkbox" />',
		     	'<a href="" data-role="link"></a>',
		    '</li>'
		].join('')
	}));
	InstallFunctions(TSTreeNode.prototype,NONE,GenericUtil.obj2Arr({
		check: function() {
			if(this.checkbox) {
				this.checkbox.indeterminate = false;
				this.checkbox.checked = true;
			}
		},
		uncheck: function() {
			if(this.checkbox) {
				this.checkbox.indeterminate = false;
				this.checkbox.checked = false;
			}
		},
		indeterminate: function() {
			if(this.checkbox) {
				this.checkbox.indeterminate = true;
			}
		},
		updateStatus: function(status) {
			if(status == 'checked') {
				this.check();
			} else if(status == 'unchecked') {
				this.uncheck();
			} else {
				this.indeterminate();
			}
		},
		getAllChildItems: function() {
			if (!this.roles.has("childlist")) {
				return [];
			}
			var childlist = $('li[data-widget-name=TSTreeItem]', this.roles.get("childlist"))
			if (!childlist.length) {
				return [];
			}
			
			var children = Array.prototype.reduce.call(childlist, function(arr, li) {
				arr.push(li.widget);
				return arr;
			}, []);
			
			return children;
		},
		getChildItems: function() {
			if (!this.roles.has("childlist")) {
				return [];
			}
			var childlist = $('>li[data-widget-name=TSTreeItem]', this.roles.get("childlist"))
			if (!childlist.length) {
				return [];
			}
			
			var children = Array.prototype.reduce.call(childlist, function(arr, li) {
				arr.push(li.widget);
				return arr;
			}, []);
			
			return children;
		},
		isChecked: function() {
			return this.checkbox.checked;
		},
		isIndeterminate: function() {
			return this.checkbox.indeterminate;
		}
	}));
	return TSTreeItem;
});
