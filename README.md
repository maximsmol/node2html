[![Coverage Status](https://coveralls.io/repos/maximsmol/node2html/badge.svg?branch=master)](https://coveralls.io/r/maximsmol/node2html?branch=master) [![Build Status](https://travis-ci.org/maximsmol/node2html.svg?branch=master)](https://travis-ci.org/maximsmol/node2html)

# node2html
A library for generating html from js objects.

## Features:

1. No *insignificant* whitespace characters
	As all formatting is collapsed, but text literals are untouched

1. Works as a template engine
	As you have a full programming language in your disposal

1. Infinite expandability
	As this library knows *nothing* about what it generates


## Example
This javascript object:
```js
[
	'html',
	[
		'$DOCTYPE', 'a-html',
		'head',
		[
			'title', 'HELLO'
		],
		'body',
		[
			'span', 'hello'
		]
	]
]
```

Becomes the following html markup:
```html
<!DOCTYPE a-html>
<html>
	<head>
		<title>HELLO</title>
	</head>
	<body>
		<span>hello</span>
	</body>
</html>
```


### Syntax
node2html uses array-based AST nodes:
```js
[
	selector,
	value,

	...
]
```


#### `selector`
Contains the tagname, id and classname:
```js
'tagName#tagId.class.class1.class2'
```


#### `value`
Contains tag's content and attributes.
It is one of the following:

* A string (if tag only contains text) `['span', 'hello']`
* An array, containing tag's content and attributes`['span', [...]]`

#### Setting attributes
Attributes are set using a `$` prefix:
```js
[
	'span',
	[
		'$rel', 'label'
	]
]
```

#### Text literals
You can add text literals to markup, using `$`:
```js
[
	'span',
	[
		'span.icon-home', [],
		'$', 'Go home',
		'span.icon-go', []
	]
]
```

#### Unpacking
You can "unpack" tags from an array using `$$`:
```js
var getSpanContent = function gsc()
{
	return [
				'span.icon-home', ['$', 'home'],
				'span.icon-go', ['$', 'go']
			];
};

[
	'span',
	[
		'$$', getSpanContent()
	]
]
```
