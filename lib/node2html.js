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
var htmlizeTagOpening = function htmlizeTagOpening(selector, attr)
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

	if (attr != null)
	{
		var keys = Object.keys(attr);

		for (var j = 0; j < keys.length; j++)
		{
			if (keys[j].indexOf('$') !== 0) continue;

			res += ' ';
			res += keys[j].substr(1);

			if (attr[keys[j]] === true) continue;

			res += '=\'';
			res += attr[keys[j]];
			res += '\'';
		}
	}

	res += '>';

	return res;
};

//
// Combines tag information and contents into html
var htmlizeElement = function htmlizeElement(key, el)
{
	var selector = parseSelector(key);
	var res = '';
	if (key.indexOf('html') === 0)
	{
		if (el.$DOCTYPE)  res += '<!DOCTYPE '+el.$DOCTYPE+'>';
		else res += '<!DOCTYPE html>';
	}

	if (typeof el === 'string')
		res += htmlizeTagOpening(selector, null)+el;
	else
	{
		if (el.$ != null)
		{
			if (typeof el.$ === 'string')
			{
				res += htmlizeTagOpening(selector, null);
				res += el.$;
			}
			else
			{
				res += htmlizeTagOpening(selector, el.$);
				if (el.$.text != null)
					res += el.$.text;
			}
		}
		else
			res += htmlizeTagOpening(selector, null);


		var keys = Object.keys(el);

		for (var i = 0; i < keys.length; i++)
		{
			if (keys[i] === '$') continue;
			if (key.indexOf('html') === 0 && keys[i] === '$DOCTYPE') continue;

			res += htmlizeElement(keys[i], el[keys[i]]);
		}
	}

	res += '</'+selector.tag+'>';

	return res;
};

//
// Sycnhronious execution
var sync = function processSync(data)
{
	var keys = Object.keys(data);
	for (var i = 0; i < keys.length; i++)
	{
		if (keys[i].indexOf('html') === 0)
		{
			return htmlizeElement(keys[i], data[keys[i]]);
		}
	}

	return htmlizeElement('html', data);
};

module.exports.sync = sync;
