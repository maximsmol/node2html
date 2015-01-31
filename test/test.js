'use strict';

//
// Standard libraries
var assert = require('assert');

//
//
var node2html = require('../lib/node2html');

//
// Mocha
var describe = global.describe;
var it = global.it;


//
// Main code
//

//
// Tests
describe('Testing html tag insertion', function htmlInsertion()
{
	describe('Omiting tag', function omiting()
	{
		it('Should output tag', function test()
		{
			var page = [];
			assert.equal(node2html.sync(page), '<!DOCTYPE html><html></html>');
		});
	});

	describe('Not omiting tag', function notOmiting()
	{
		it('Should output tag', function test()
		{
			var page = ['html', []];
			assert.equal(node2html.sync(page), '<!DOCTYPE html><html></html>');
		});
	});
});

describe('Testing DOCTYPE insertion', function doctypeInsertion()
{
	describe('Omiting DOCTYPE', function omiting()
	{
		it('Should output DOCTYPE', function test()
		{
			var page = ['html', []];
			assert.equal(node2html.sync(page), '<!DOCTYPE html><html></html>');
		});
	});

	describe('Not omiting DOCTYPE', function notOmiting()
	{
		it('Should output DOCTYPE', function test()
		{
			var page = ['html', ['$DOCTYPE', 'xhtml' ]];
			assert.equal(node2html.sync(page), '<!DOCTYPE xhtml><html></html>');
		});
	});
});

describe('Testing element being text', function eltext()
{
	it('Should output text as element contents', function test()
	{
		var page = ['html', 'test'];
		assert.equal(node2html.sync(page), '<!DOCTYPE html><html>test</html>');
	});
});

describe('Testing attributes', function attr()
{
	describe('Inserting attributes', function insertAttr()
	{
		describe('Setting text through $', function attrText()
		{
			it('Should append text', function test()
			{
				var page = ['html', ['$', 'test']];
				assert.equal(
					node2html.sync(page),
					'<!DOCTYPE html><html>test</html>'
				);
			});
		});

		describe('Setting attribute values', function attrText()
		{
			it('Should set attributes', function test()
			{
				var page = ['html', ['$hello', 'world']];
				assert.equal(
					node2html.sync(page),
					'<!DOCTYPE html><html hello=\'world\'></html>'
				);
			});
		});

		describe('Setting attribute to true', function attrText()
		{
			it('Should set attributes', function test()
			{
				var page = ['html', ['$hello', true]];
				assert.equal(
					node2html.sync(page),
					'<!DOCTYPE html><html hello></html>'
				);
			});
		});
	});

	describe('Not inserting attributes', function noInsertAttr()
	{
		it('Should not output attributes', function test()
		{
			var page = ['html', []];
			assert.equal(
				node2html.sync(page),
				'<!DOCTYPE html><html></html>'
			);
		});
	});
});

describe('Selector parsing test', function selectors()
{
	describe('Inserting classes', function classes()
	{
		it('Should output classes', function test()
		{
			var page = ['html.test.new', []];
			assert.equal(
				node2html.sync(page),
				'<!DOCTYPE html><html class=\'test new\'></html>'
			);
		});
	});

	describe('Not inserting classes', function classes()
	{
		it('Should not output classes', function test()
		{
			var page = ['html', []];
			assert.equal(
				node2html.sync(page),
				'<!DOCTYPE html><html></html>'
			);
		});
	});

	describe('Inserting id', function classes()
	{
		it('Should output classes', function test()
		{
			var page = ['html#test', []];
			assert.equal(
				node2html.sync(page),
				'<!DOCTYPE html><html id=\'test\'></html>'
			);
		});
	});

	describe('Not inserting id', function classes()
	{
		it('Should not output classes', function test()
		{
			var page = ['html', []];
			assert.equal(
				node2html.sync(page),
				'<!DOCTYPE html><html></html>'
			);
		});
	});
});

describe('Child elements test', function childElements()
{
	it('Should outut children', function test()
	{
		var page = ['html', ['body', []]];
		assert.equal(
			node2html.sync(page),
			'<!DOCTYPE html><html><body></body></html>'
		);
	});
});

describe('Testing forbidden close tags', function closeTags()
{
	it('Should not close tags', function test()
	{
		var page = ['html',
			[
				'img',   [],
				'input', [],
				'br',    [],
				'hr',    [],
				'frame', [],
				'area',  [],
				'base',  [],
				'basefont', [],
				'col',   [],
				'isindex',  [],
				'link',  [],
				'meta',  [],
				'param', []
			]];
		assert.equal(
			node2html.sync(page),
			'<!DOCTYPE html><html><img><input><br><hr><frame><area><base>'+
			'<basefont><col><isindex><link><meta><param></html>'
		);
	});
});
