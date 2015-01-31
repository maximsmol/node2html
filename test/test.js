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
			var page = {};
			assert.equal(node2html.sync(page), '<!DOCTYPE html><html></html>');
		});
	});

	describe('Not omiting tag', function notOmiting()
	{
		it('Should output tag', function test()
		{
			var page = {html: {}};
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
			var page = {html: {}};
			assert.equal(node2html.sync(page), '<!DOCTYPE html><html></html>');
		});
	});

	describe('Not omiting DOCTYPE', function notOmiting()
	{
		it('Should output DOCTYPE', function test()
		{
			var page = {html: { $DOCTYPE: 'xhtml' }};
			assert.equal(node2html.sync(page), '<!DOCTYPE xhtml><html></html>');
		});
	});
});

describe('Testing element being text', function eltext()
{
	it('Should output text as element contents', function test()
	{
		var page = {html: 'test'};
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
				var page = {html: {$: 'test'}};
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
				var page = {html: {$: {$hello: 'world'}}};
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
				var page = {html: {$: {$hello: true}}};
				assert.equal(
					node2html.sync(page),
					'<!DOCTYPE html><html hello></html>'
				);
			});
		});

		describe('Setting text through $.text', function attrText()
		{
			it('Should append text', function test()
			{
				var page = {html: {$: {text: 'test'}}};
				assert.equal(
					node2html.sync(page),
					'<!DOCTYPE html><html>test</html>'
				);
			});
		});
	});

	describe('Not inserting attributes', function noInsertAttr()
	{
		it('Should not output attributes', function test()
		{
			var page = {html: {}};
			assert.equal(
				node2html.sync(page),
				'<!DOCTYPE html><html></html>'
			);
		});
	});
});
