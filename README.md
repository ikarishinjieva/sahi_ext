sahi-ext
=========

## Intro
We provide some sahi functions to support ExtJs component.

## Demo
Run test/test.html...

## Author
[Tachikoma](https://github.com/ikarishinjieva)
[Yinkan Li](https://github.com/liyinkan)

## Setup
* Include target/sahi-ext.sah in your sahi script

```js
_include('sahi-ext.sah');
```

* Use new wait functions in your sahi script.

## Apis
### __set_grid_value($locator, $rowIndex, $colHeader, $value)
Set a grid cell value.   
The grid is located by $locator.   
The row is located by $rowIndex. (a number, 0...).   
The column is located by $colHeader, which is the grid column header.   
The $locator could be "title:expected title" (the grid title is "expected title") or "parent title:expected title" (any title of grid's parent is "expected title").

### __get_grid_value($locator, $rowIndex, $colHeader)

### __get_grid_row_size($locator)