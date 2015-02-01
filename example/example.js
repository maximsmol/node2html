'use strict';

var node2html = require('../lib/node2html');


var body =
[
	'h1', 'Hello World',
	'div#a',
	[
		'span.red', 'Welcome to test',
		'a', [ '$', 'Go To Div', '$href', '#a' ]
	]
];

var page =
[
	'head',
	[
		'title', 'Hello World',
		'meta', [ '$charset', 'utf-8' ],
		'style', '.red{color:red}'
	],
	'body', body
];

console.log(node2html.sync(page));
