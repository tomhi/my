define("ts/common/PanelTest", [
	"ts/widgets/TSWidget",
	'jquery'
],
function(TSWidget, $){
    var i18n=TSWidget.prototype.i18n.createBranch({});
    
    function PanelTest(opts){
    	$.extend(this, {
    		permission: ['re23vx3fdsa', 'xad3q3ew3ewq', 'tds3fdll9ds2'],	// 权限，从session传来
    		childWidget: {
    			're23vx3fdsa' : {
    				widgetName : 'ts/widgets/TSButton',
    				placeAt : 'div1',
    				param : {
    					buttonName : '新增',
    					click : function () {
    						console.log(this.buttonName);
    					}
    				}
    			},
    			'xad3q3ew3ewq' : {
    				widgetName : 'ts/widgets/TSButton',
    				placeAt : 'div2',
    				param : {
    					buttonName : '修改',
    					click : function () {
    						console.log(this.buttonName);
    					}
    				}
    			},
    			'tds3fdll9ds2' : {
    				widgetName : 'ts/widgets/TSButton',
    				placeAt : 'div3',
    				param : {
    					buttonName : '删除',
    					click : function () {
    						console.log(this.buttonName);
    					}
    				}
    			}
    		}
    	})
    	TSWidget.call(this);
    }
    
    ExtendClass(PanelTest,TSWidget);
    
    SetProperties(TSWidget.prototype, DONT_ENUM, [
		"template", [
			'<div style="height: 300px">',
				'<ul style="list-style: none">',
					'<li data-role="div1" style="width: 50px; float: left; "></li>',
					'<li data-role="div2" style="width: 50px; float: left; "></li>',
					'<li data-role="div3" style="width: 50px; float: left; "></li>',
				'</ul>',
			'</div>'
		].join('')
	]);
    
    return PanelTest;
});
