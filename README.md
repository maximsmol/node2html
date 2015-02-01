[![Coverage Status](https://coveralls.io/repos/maximsmol/node2html/badge.svg?branch=master)](https://coveralls.io/r/maximsmol/node2html?branch=master)[![Build Status](https://travis-ci.org/maximsmol/node2html.svg?branch=master)](https://travis-ci.org/maximsmol/node2html)

# node2htm
A library for generating html from js objects.

## Features:

1. Removes insignificant space characters
	As all formatting is collapsed, but text literals are untouched

1. Works as a template engine
	As you have a full programming language in your disposal

1. Infinite expandability
	As this library knows *nothing* about html (except which tags should never be closed)


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
We use array-based AST nodes:
```js
[
	selector,
	value
]
```


`selector` contains basic info about the tag:
```js
'tagName#tagId.class.class1.class2'
```


`value` contains tag's attributes and content.
It is one of the following:

* A string (if tag only contains text) `['span', 'hello']`
* An array, that contains tag's attributes and content `['span', [...]]`

To set tag's attributes, prefix them with a $:
```js
	[
		'span',
		[
			'$rel', 'label'
		]
	]
```

To set tag's attributes *and* set text content, use the `$` symbol:
```js
	[
		'span',
		[
			'$rel', 'label',
			'span.icon-home', [],
			'$', 'Go home',
			'span.icon-go', []
		]
	]
```
