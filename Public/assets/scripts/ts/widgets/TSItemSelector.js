define("ts/widgets/TSItemSelector", [
	"ts/widgets/TSWidget",
	"ts/events/TSEvent",
	"ts/util/GenericUtil",
	"dojo/text!./htm/TSItemSelector.htm",
	"dojo/css!./css/TSItemSelector.css",
	"dojo/nls!./nls/TSItemSelector.json"
],function(TSWidget,TSEvent,GenericUtil,htm,css,json){
	"use strict";
	var i18n=TSWidget.prototype.i18n.createBranch(json);
	
	function TSItemSelector(){
		TSWidget.call(this);
		
		this.nameField = this.nameField || 'text';
		this.valueField = this.valueField || 'value';
		
		init.call(this);
		initEvent.call(this);
	}
	
	function init(){
		
		var that = this;
		
		this.left 		= this.role('left');
		this.right 		= this.role('right');
		
		this.add 		= this.role('add');
		this.addAll 	= this.role('addAll');
		this.remove 	= this.role('remove');
		this.removeAll 	= this.role('removeAll');

		this.leftFilter 	= this.role('leftFilter');
		this.rightFilter 	= this.role('rightFilter');
		InstallGetterSetter(this,"height",
            function getHeight(){
                return this.__data__.height;
            },
            function setHeight(v){
            	if(v>0){
            		v>>>=0;
            		this.__data__.height=v;
            		adjustHeight.call(this);
            	} else {
            		this.__data__.height= $(parent.window.document).height() + v;
            		adjustHeight.call(this);
            	}
            }
        );
	}
	
	function adjustHeight() {
		var that = this;
		setTimeout(function() {
			$('.s-container', that.rootElement).outerHeight(that.height)
			var selectHeight = $('.s-container', that.rootElement).outerHeight() - $('.ms-selectable', that.rootElement)[0].offsetTop * 2 - $('input[data-role=leftFilter]', that.rootElement).outerHeight();
			$('select', that.rootElement).outerHeight(selectHeight);
			
			
			var top = ($(that.role('btnDiv')).height() - $('>div', that.role('btnDiv')).height()) / 2 ;
			
			$('>div', that.role('btnDiv')).css('top', top + 'px')
		})
	}
	
	function loadData(data) {
		data = data || [];
		var that = this;
		data.forEach(function(item, i) {
			var oOption = document.createElement("option");
			oOption.text = item[that.nameField];
			oOption.value = item[that.valueField];
			$(oOption).dblclick(function() {
				moveSelectedItem.call(that, that.left, that.right, 'add')
			})
			that.left.add(oOption);
		})
	}
	
	function initEvent() {
		
		var that 		= this;
		var left 		= this.left;
		var right 		= this.right;
		
		var add 		= this.add;
		var addAll 		= this.addAll;
		var remove 		= this.remove;
		var removeAll 	= this.removeAll;

		var leftFilter 	= this.leftFilter;
		var rightFilter = this.rightFilter;
		
		$(add).click(function() {
			moveSelectedItem.call(that, left, right, 'add');
		})
		$(addAll).click(function() {
			moveAllItem.call(that, left, right, 'addAll');
		})
		$(remove).click(function() {
			moveSelectedItem.call(that, right, left, 'remove');
		})
		$(removeAll).click(function() {
			moveAllItem.call(that, right, left, 'removeAll');
		})
		
		$('option', left).dblclick(function(a) {
			moveSelectedItem.call(that,left,right, 'add');
		})
		$('option', right).dblclick(function(a) {
			moveSelectedItem.call(that,right,left, 'remove');
		})
		
		var filters = [leftFilter, this.role('rightFilter')];
		filters.forEach(function(filter, i) {
			$(filter).keyup(function() {
				$('option', filter.parentNode).each(function() {
					if(this.innerHTML.indexOf(filter.value) >= 0 || filter.value == '') {
						$(this).show(100);
					} else {
						$(this).hide(100);
					}
				})
			})
		})
	}
	
	function setValue(arr) {
		var that = this;
		if($.isArray(arr)) {
			arr.forEach(function(v, i) {
				var oOption = document.createElement("option");
				
				var matchingOption = $('option[value=' + v + ']', that.left);
				if(matchingOption.length == 0) {
					return;
				}
				oOption.text = matchingOption.html();
				oOption.value = v;
				that.right.add(oOption);
				$(oOption).dblclick(function() {
					moveSelectedItem.call(that, that.right, that.left, 'remove');
					that.dispatchEvent(new TSEvent('add'));
				});
				matchingOption.remove();
			});
		}
	}
	
	function getValue() {
		var v = [];
		$('option', this.right).each(function(i, option) {
			v.push(option.value);
		});
		return v;
	}
	
	function moveSelectedItem(from, target, tag) {
		var that = this;
		if (from.length > 0) {
			for (var i = 0; i < from.length; i++) {
				if (from.options[i].selected) {
					var oOption = document.createElement("option");
					oOption.text = from.options[i].text;
					oOption.value = from.options[i].value;
					$(oOption).dblclick(function() {
						moveSelectedItem.call(that, target, from, tag == 'add' ? 'remove' : 'add');
					})
					target.add(oOption);
				}
			}
			for (var i = 0; i < from.length; ) {
				if (from.options[i].selected) {
					from.options[i] = null;
					i = 0;
				} else {
					i++;
				}
			}
		}
		if(tag == 'add') {
			that.dispatchEvent(new TSEvent('add'));
		} else if(tag == 'remove') {
			that.dispatchEvent(new TSEvent('remove'));
		}
	}

	function moveAllItem(from, target, tag) {
		var that = this;
		var m = from.options.length;
		for (var i = 0; i < m; i++) {
			var oOption = document.createElement("option");
			oOption.text = from.options[i].text;
			oOption.value = from.options[i].value;
			$(oOption).dblclick(function() {
				moveSelectedItem.call(that, target, from, tag == 'addAll' ? 'remove' : 'add');
			});
			target.add(oOption);
		}
		for (var i = 0; i < m; i++) {
			from.removeChild(from.children[0]);
		}
		if(tag == 'addAll') {
			that.dispatchEvent(new TSEvent('addAll'));
		} else if(tag == 'removeAll') {
			that.dispatchEvent(new TSEvent('removeAll'));
		}
	}
	
	ExtendClass(TSItemSelector,TSWidget);
	
	SetProperties(TSItemSelector.prototype,DONT_ENUM,[
 	    "i18n",i18n,
 	    "template",htm
 	]);
 	
 	InstallFunctions(TSItemSelector.prototype,DONT_DELETE,GenericUtil.obj2Arr({
 		loadData: loadData,
 		setValue: setValue,
 		getValue: getValue
 	}));
	
	return TSItemSelector;
});