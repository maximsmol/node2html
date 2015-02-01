'use strict';

//
// Converts `tagName#id.className` selectors into objects
var parseSelector = function parseSelector(key)
{
	var found = null;
	var classes = null;

	found = /(\w+)(?:#(\w+))?((?:\.\w+)*)?/ig.exec(key);
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
var htmlizeTagOpening = function htmlizeTagOpening(selector, el)
{
	var res = '<';
	res += selector.tag;

	if (selector.id != null) res += ' id=\''+selector.id+'\'';
	if (selector.classes != null)
	{
		res += ' class=\''+selector.classes[0];

		for (var i = 1; i < selector.classes.length; i++)
		{
			res += ' '+selector.classes[i];
		}

		res += '\'';
	}

	if (el != null)
	{
		for (var j = 0; j < el.length; j += 2)
		{
			if (el[j].indexOf('$') !== 0) continue;
			if (el[j] === '$DOCTYPE') continue;
			if (el[j] === '$') continue;
			if (el[j] === '$$') continue;

			res += ' ';
			res += el[j].substr(1);

			if (el[j+1] === true) continue;

			res += '=\'';
			res += el[j+1];
			res += '\'';
		}
	}

	res += '>';

	return res;
};

//
// Combines tag information and contents into html
var shouldNotClose =
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

var htmlizeElement = function htmlizeElement(key, el)
{
	var selector = parseSelector(key);
	var res = '';

	var isHtml = key.indexOf('html') === 0;
	if (isHtml)
	{
		var found = false;
		for (var j = 0; j < el.length; j += 2)
		{
			if (el[j] === '$DOCTYPE')
			{
				res += '<!DOCTYPE '+el[j+1]+'>';
				found = true;
				break;
			}
		}
		if (!found) res += '<!DOCTYPE html>';
	}

	res += htmlizeTagOpening(selector, el);
	if (typeof el === 'string')
		res += el;
	else
	{
		for (var i = 0; i < el.length; i += 2)
		{
			if (el[i] === '$')
			{
				res += el[i+1];
				continue;
			}
			if (el[i] === '$$')
			{
				var toUnpack = el[i+1];
				for (var k = 0; k < toUnpack.length; k += 2)
				{
					res += htmlizeElement(toUnpack[k], toUnpack[k+1]);
				}
				continue;
			}

			if (el[i].indexOf('$') === 0) continue;
			if (isHtml && el[i] === '$DOCTYPE') continue;

			res += htmlizeElement(el[i], el[i+1]);
		}
	}

	if (shouldNotClose.indexOf(selector.tag) === -1)
		res += '</'+selector.tag+'>';

	return res;
};

//
// Sycnhronious execution
var sync = function processSync(data)
{
	for (var i = 0; i < data.length; i++)
	{
		if (data[i].indexOf('html') === 0)
		{
			return htmlizeElement(data[i], data[i+1]);
		}
	}

	return htmlizeElement('html', data);
};

module.exports.sync = sync;
