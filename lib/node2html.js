'use strict';

//
// Standard libraries
//

var util   = require('util');
var stream = require('stream');


//
// Parser
//

var Parser = function(add)
{
	this.addToResult = add;
};

//
// Converts `tagName#id.className` selectors into objects
Parser.prototype.parseSelector = function parseSelector(key)
{
	var found = null;
	var classes = null;

	found = /(\w+)(?:#([\w-]+))?((?:\.[\w-]+)*)?/ig.exec(key);
	if (found[3] != null)
		classes = found[3].split('.').slice(1);


	var res =
		{
			tag: found[1],
			id: found[2],
			classes: classes
		};
	return res;
};

//
// Combines tag information into html
Parser.prototype.htmlizeTagOpening = function htmlizeTagOpening(selector, el)
{
	this.addToResult('<');
	this.addToResult(selector.tag);

	var needSpace = true;
	if (selector.id != null)
	{
		this.addToResult(' id=\''+selector.id+'\'');
		needSpace = false;
	}

	if (selector.classes != null)
	{
		if (needSpace)
		{
			this.addToResult(' ');
			needSpace = false;
		}
		this.addToResult('class=\''+selector.classes[0]);

		for (var i = 1; i < selector.classes.length; i++)
		{
			this.addToResult(' '+selector.classes[i]);
		}

		this.addToResult('\'');
	}

	if (el != null)
	{
		for (var j = 0; j < el.length; j += 2)
		{
			if (el[j].indexOf('$') !== 0) continue;
			if (el[j] === '$DOCTYPE') continue;
			if (el[j] === '$') continue;
			if (el[j] === '$$') continue;

			if (needSpace)
			{
				this.addToResult(' ');
				needSpace = false;
			}
			this.addToResult(el[j].substr(1));

			if (el[j+1] === true)
			{
				needSpace = true;
				continue;
			}

			this.addToResult('=\'');
			this.addToResult(el[j+1]);
			this.addToResult('\'');
		}
	}

	this.addToResult('>');
};

//
// Tags, which should never be closed according to
Parser.shouldNotClose =
[
	'img',
	'input',
	'br',
	'hr',
	'frame',
	'area',
	'base',
	'basefont',
	'col',
	'isindex',
	'link',
	'meta',
	'param'
];

//
// Combines tag information and contents into html
Parser.prototype.htmlizeElement = function htmlizeElement(key, el)
{
	var selector = this.parseSelector(key);

	var isHtml = key.indexOf('html') === 0;
	if (isHtml)
	{
		var found = false;
		for (var j = 0; j < el.length; j += 2)
		{
			if (el[j] === '$DOCTYPE')
			{
				this.addToResult('<!DOCTYPE '+el[j+1]+'>');
				found = true;
				break;
			}
		}
		if (!found) this.addToResult('<!DOCTYPE html>');
	}

	this.htmlizeTagOpening(selector, el);
	if (typeof el === 'string')
		this.addToResult(el);
	else
	{
		for (var i = 0; i < el.length; i += 2)
		{
			if (el[i] === '$')
			{
				this.addToResult(el[i+1]);
				continue;
			}
			if (el[i] === '$$')
			{
				var toUnpack = el[i+1];
				for (var k = 0; k < toUnpack.length; k += 2)
				{
					this.htmlizeElement(toUnpack[k], toUnpack[k+1]);
				}
				continue;
			}

			if (el[i].indexOf('$') === 0) continue;
			if (isHtml && el[i] === '$DOCTYPE') continue;

			this.htmlizeElement(el[i], el[i+1]);
		}
	}

	if (Parser.shouldNotClose.indexOf(selector.tag) === -1)
		this.addToResult('</'+selector.tag+'>');
};

//
// General interface
Parser.prototype.work = function processSync(data)
{
	for (var i = 0; i < data.length; i++)
	{
		if (data[i].indexOf('html') === 0)
		{
			this.htmlizeElement(data[i], data[i+1]);
			return;
		}
	}

	this.htmlizeElement('html', data);
};


//
// Interfaces
//

//
// Synchronious
var sync = function(tree)
{
	var res = '';
	var p = new Parser(function addToResult(data)
	{
		res += data;
	});

	p.work(tree);

	return res;
};


//
// Stream
var Node2HtmlStream = function(tree, options)
{
	stream.Readable.call(this, options);

	this._tree = tree;
	this._stoppedAt = 0;
	this._parsed = false;
	this._res = '';
};
util.inherits(Node2HtmlStream, stream.Readable);

Node2HtmlStream.prototype._read = function(size)
{
	if (this._stoppedAt >= this._res.length-1)
	{
		this.push(null);
		return;
	}

	if (!this._parsed)
	{
		var self = this;
		var p = new Parser(function addToResult(data)
		{
			self._res += data;
		});

		p.work(this._tree);
	}

	this.push(this._res.substr(this._stoppedAt, this._stoppedAt+size));
};


//
// module.exports
//

module.exports.sync = sync;
module.exports.Node2HtmlStream = Node2HtmlStream;
