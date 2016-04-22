define("ts/widgets/TSAccordion", [
	"ts/widgets/TSWidget",
	"ts/events/TSEvent",
	"ts/util/GenericUtil",
	"dojo/text!./htm/TSAccordion.htm",
	"dojo/css!./css/TSAccordion.css",
	"dojo/nls!./nls/TSAccordion.json"
],function(TSWidget,TSEvent,GenericUtil,htm,css,json){
	"use strict";
	var i18n=TSWidget.prototype.i18n.createBranch(json);
	
	function TSAccordion(opts){
		TSWidget.call(this);
		
		this.childrenField 	= this.childrenField || 'children';
		this.textField 		= this.textField || 'text';
		this.iconField 		= this.iconField || 'icon';
		
		init.call(this);
		initEvent.call(this);
		window.a = this;
	}
	
	function init(){
		//this.initProperties();
		//this.load();
		this.items = [];
	}
	
	function initEvent() {
		
		var that = this;
		that.lastClickItem = null;	// 记录上次点击的title或node
		this.addEventListener('load', function() {
			//this.active(0);
		});
		this.addEventListener('itemclick', function(e) {
			
			var currentRadioType = $('input:first', e.item.rootElement).attr('name');
			var lastClickRadioType = $('input:first', that.lastClickItem && that.lastClickItem.rootElement).attr('name');
			
			// 不是同一级　并且　当前点击节点不是上一次点击的子节点　并且　当前点击有子节点
			if(e.item.parentWidget != that.lastClickItem && currentRadioType != lastClickRadioType) {
				if(!e.item.data.children || e.item.data.children.length == 0) {
					$('input[type=radio][name=AccordionNode]').prop('checked', false);
				}
			}
		});
	}
	
	function load(url){
		var that = this;
		//url='accordionData.json';
		
		$.post(url, null, function (data) {
			loadData.call(that, data);
		}, 'json');
	}
	
	function loadData(data) {
		
		var that = this;
		
		this.items = [];
		data.forEach(function(item, i) {
			var title = new AccordionTitle();
			
			that.items.push(title);
			
			title.root = that;
			title.initData(item);
			
			$('label:first', title.rootElement).on('click', function(e) {
				
				var lastStatus = $(this).prev()[0].checked;
				
				var event = new TSEvent('itemclick');
				event.index = i;
				event.item = title;
				event.lastStatus = lastStatus;
				
				$(that.rootElement).find('article').height(0); 	// 所有的高度置为0
				var article = $(this).siblings('article');
				var height = article.find('ul').outerHeight(true);
				if($('input', title.rootElement).prop('checked')) {
					if(!title.data.children || !title.data.children.length) {
						return;
					}
					
					if(article.height() == 0) {
						var offsetTop = article.find('ul')[0].offsetTop;
	 					article.height(height + offsetTop * 2);
					} else {
						article.height(0);
					}
				} else {
 					if(article.length > 0) {
 						var offsetTop = article.find('ul')[0].offsetTop;
 						article.height(height + offsetTop * 2);
 					}
 				}
				
				that.dispatchEvent(event);

				that.lastClickItem = title;
			});

			title.placeAt(that.rootElement, 'beforeEnd');
		});
		
		var event = new TSEvent("load");
		that.dispatchEvent(event);
	}
	
	// 标题
	function AccordionTitle() {
		TSWidget.call(this);
		this.init();
	}
	
	ExtendClass(AccordionTitle,TSWidget);
	
	SetProperties(AccordionTitle.prototype,DONT_ENUM,GenericUtil.obj2Arr({
 	    i18n: i18n,
 	    template: [
			"<div name=AccordionTitle>",
				'<input name="AccordionTitle" type="radio"/>',
				'<label class="channel-bgbb">',
					'<em>',
						'<img src="/assets/images/icon-bgbb.png" />',
					'</em>',
					'<span></span>',
				'</label>',
			"</div>"
 	    ].join('')
	}));
 	
 	InstallFunctions(AccordionTitle.prototype,DONT_DELETE,GenericUtil.obj2Arr({
 	    init:function() {
 			var id = new Date().getTime();
 			$('input:first', this.rootElement).attr('id', id);
 			$('label:first', this.rootElement).attr('for', id);
 	    },
 	    initData:function(data) {
 	    	var title = this;
 	    	var that = title.root;
 	    	this.data = data;
 			if(data.text != undefined) {
 				$('span:first', this.rootElement).html(data.text);
 			}
 			if(data.icon != undefined) {
 				var icon = data.icon || '/assets/images/icon-bgbb.png';
 				$('img:first', this.rootElement).attr('src', icon);
 			}
 			if($.isArray(data.children) && data.children.length > 0) {
 				
 				///$('input:first', this.rootElement).attr('type', 'checkbox');
 				
 				var article = $('<article class="ac-small"></article>');
 				var ul = $('<ul></ul>');
 				article.append(ul);
 				
 				$(title.rootElement).append(article);
 				
 				data.children.forEach(function(it, i) {
 					var node = new AccordionNode();
 					node.root = that;
 					node.placeAt(ul, 'beforeEnd');
 					
 					node.initData(it);
 					
 					$('a:first', node.rootElement).bind('click', function() {
 						
 						var lastStatus = $(this).prev()[0].checked;
 						
 						$(this).prev().click();

 						var event = new TSEvent('itemclick');
 						event.index = i;
 						event.item = node;
 						event.lastStatus = lastStatus;
 						that.dispatchEvent(event);
 						
 						that.lastClickItem = node;
 					});
 				});
 			}
 	    },
 	    getPath: function() {
 	    	return this.data.text;
 	 	}
 	}));
 	
 	function AccordionNode() {
		TSWidget.call(this);
	}
	
	ExtendClass(AccordionNode,TSWidget);
	
	SetProperties(AccordionNode.prototype,DONT_ENUM,GenericUtil.obj2Arr({
 	    "template": [
 	        '<li>',
 	        	'<input name="AccordionNode" type="radio"/>',
	 	    	'<a href="javascript:void(0);"></a>',
	 	    '</li>'
 	    ].join('')
	}));
	InstallFunctions(AccordionNode.prototype,DONT_DELETE,GenericUtil.obj2Arr({
 	    "initData":function(data) {
 	    	var that = this;
 	    	this.data = data;
 	    	$('a', this.rootElement).html(data.text);
 	    	
 	    	if($.isArray(data.children) && data.children.length > 0) {
 				var div = $('<div></div>');
 				var ul = $('<ul></ul>');
 				div.append(ul);
 				
 				$(that.rootElement).append(div);
 				
 				data.children.forEach(function(it, i) {
 					var node = new AccordionNode();
 					node.root = that.root;
 					node.placeAt(ul, 'beforeEnd');
 					
 					node.initData(it);
 					
 					$('a:first', node.rootElement).bind('click', function(e) {
 						
 						var lastStatus = $(this).prev()[0].checked;
 						
 						$(this).prev().click();
 						var event = new TSEvent('itemclick');
 						event.index = i;
 						event.item = node;
 						event.lastStatus = lastStatus;
 						node.root.dispatchEvent(event);
 						
 						that.lastClickItem = node;
 					});
 				});
 			}
 	    },
 	    getPath: function() {
 	    	var that = this;
 	    	var arr = [that.data.text];
 	    	while((that = that.parentWidget) && (that instanceof AccordionTitle || that instanceof AccordionNode)) {
 	    		arr.push(that.data.text);
 	    	}
 	    	return arr.reverse().join(' > ');
 	    }
 	}));
	
	
 	// TSAccordion
	ExtendClass(TSAccordion,TSWidget);
	
	SetProperties(TSAccordion.prototype,DONT_ENUM,[
 	    "i18n",i18n,
 	    "template",htm
 	]);
 	
 	InstallFunctions(TSAccordion.prototype,DONT_DELETE,GenericUtil.obj2Arr({
 	    //"initProperties":initProperties,
 	    //"setClickCallback":setClickCallback,
 	    load: load,
 	    loadData:loadData,
 	    /*getCheckedItem: function() {
 	    	var radios = this.rootElement.querySelectorAll('input[type=radio]');
 			return Array.prototype.reduce.call(radios, function (arr, radio) {
 				console.log(radio.checked);
 				if(radio.checked) {
 					arr.push(radio.parentNode.widget);
 				}
 				return arr;
 			}, [])[0];
 	    },*/
 	    active: function(index) {
 	    	$('input:first', this.items[index].rootElement).attr('checked', true);
 	    	var event = new TSEvent('active');
 	    	event.item = this.items[index];
 	    	event.index = index;
 	    	this.dispatchEvent(event);
 	    }
 	}));
	
	return TSAccordion;
});
