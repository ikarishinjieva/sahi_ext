(function(definition) {
	definition(window.__sahi_ext = {});
})(function(exports) {
	var err = function(msg) {
		if (_sahi && _sahi._log) {
			_sahi._log(msg, 'failure');
		} else {
			console.err(msg);
		}
	}
	var warning = function(msg) {
		if (_sahi && _sahi._log) {
			_sahi._log(msg, 'warning');
		} else {
			console.warn(msg);
		}
	}
	var get_match_component_fn = function(type, expected, expectedCls) {
		var matchFn;
		switch(type) {
			case 'title': 
				matchFn = function(component) {
					return component.title === expected;
				};
				break;
			
			case 'parent title': 
				matchFn = function(component) {
					var self = component;
					while(self.ownerCt && self.ownerCt.title !== expected) {
						self = self.ownerCt;
					}
					return self.ownerCt;
				};
				break;
				
			case 'visible & parent title': 
				matchFn = function(component) {
					var self = component;
					while(self.ownerCt && self.ownerCt.title !== expected) {
						self = self.ownerCt;
					}
					return component.isVisible && component.isVisible() && self.ownerCt;
				};
				break;
			default: err('Unexpected component match function : ' + type);
		}
		return function(comp) {
			var fn = matchFn;
			return (comp instanceof eval(expectedCls)) && fn(comp);
		};
	}

	var get_component_by_locator = function(locator, expectedCls) {
		var match = locator.match(/(visible & parent title|parent title|title)=(.*)/);
		if (!match) {
			err('Locator is not correct : ' + locator);
		}
		var matchFn = get_match_component_fn(match[1], match[2], expectedCls);
		
		var components = [];
		for (var i = 0 ; i < Ext.ComponentMgr.all.length ; i++) {
			var comp = Ext.ComponentMgr.all.get(i);
			if (matchFn(comp, expectedCls)) {
				components.push(comp);
			}
		}
		if (1 === components.length) {
			return components[0];
		}
		if (0 === components.length) {
			err('Components not found : ' + locator);
		} else {
			err('More than 1 component found : ' + locator);
		}
	}
	
	var get_data_index_by_column_title = function(grid, colHeader) {
		var cols = grid.colModel.config;
		var ret = [];
		for (var i = 0 ; i < cols.length ; i++) {
			if (colHeader === cols[i].header) {
				ret.push({
					index : i,
					dataIndex : cols[i].dataIndex,
					getEditor : (function() {
						var col = cols[i];
						return function() {
							//editor may change.
							return col.editor;
						}
					})(),
					colIndex : i
				});
			}
		}
		if (1 === ret.length) {
			return ret[0];
		}
		if (0 === ret.length) {
			err('Column not found : ' + colHeader);
		} else {
			err('More than 1 column found : ' + colHeader);
		}
	}
	
	var get_row_by_index = function(grid, index) {
		if (!(grid.store.getCount() - 1 >= index)) {
			err('row not found : ' + index);
		}
		var row = grid.store.getAt(index);
		return row;
	}
	
	var find_editor_key_by_display = function(editor, display) {
		if (!editor || !editor.store) {
			return display;
		}
		var i = editor.store.find(editor.displayField, display);
		if (-1 === i) {
			warning("Store record not found : " + display + ', try use raw value');
			return display;
		}
		var rec = editor.store.getAt(i);
		return rec.get(editor.valueField);
	}
	
	var get_grid_row_size = function(locator) {
		var grid = get_component_by_locator(locator, 'Ext.grid.GridPanel');
		return grid.store.getCount();
	}
	exports.__get_grid_row_size = get_grid_row_size;
	
	var get_grid_value = function(locator, rowIndex, colHeader) {
		var grid = get_component_by_locator(locator, 'Ext.grid.GridPanel');
		var columnInfo = get_data_index_by_column_title(grid, colHeader);
		var row = get_row_by_index(grid, rowIndex);
		var originalValue = row.data[columnInfo.dataIndex];
		return (null == originalValue ? "" : originalValue).toString();
	}
	exports.__get_grid_value = get_grid_value;

	var set_grid_value = function(locator, rowIndex, colHeader, value) {
		var grid = get_component_by_locator(locator, 'Ext.grid.EditorGridPanel');
		var columnInfo = get_data_index_by_column_title(grid, colHeader);
		var row = get_row_by_index(grid, rowIndex);
		var originalValue = row.data[columnInfo.dataIndex];
		
		grid.fireEvent('beforeedit', {
			grid: grid,
			record: row,
			field: columnInfo.dataIndex,
			value: originalValue,
			row: rowIndex,
			column: columnInfo.colIndex
		});
		var value = find_editor_key_by_display(columnInfo.getEditor(), value);
		row.beginEdit();
		row.set(columnInfo.dataIndex, value);
		row.endEdit();
		grid.fireEvent('afteredit', {
			grid: grid,
			record: row,
			field: columnInfo.dataIndex,
			value: value,
			originalValue: originalValue,
			row: rowIndex,
			column: columnInfo.colIndex
		});
	}
	exports.__set_grid_value = set_grid_value;
});