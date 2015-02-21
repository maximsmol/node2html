'use strict';

var fs = require('fs');
var node2html = require('../lib/node2html');


var createLinks = function cL(name, href)
{
	var res = [];

	res.push('a.red');
	res.push(['$', name, '$href', href]);

	res.push('a.blue');
	res.push(['$', name+' #bluemode', '$href', href]);

	return res;
};

var body =
[
	'h1', 'Hello World',
	'div#a',
	[
		'span.red', 'Welcome to test',
		'$', ' ',
		'a', [ '$', 'Go To Div', '$href', '#a' ]
	],

	'div#gen',
	[
		'$$', createLinks('google', 'http://google.com')
	]
];

var page =
[
	'head',
	[
		'title', 'Hello World',
		'meta', [ '$charset', 'utf-8' ],
		'style', '.red{color:red}.blue{color:blue}'
	],
	'body', body
];

fs.writeFileSync('./example/example.html', node2html.sync(page));
console.log('Generated example.html');
