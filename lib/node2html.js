const util = require('util');
const stream = require('stream');

const Parser = add => this.addToResult = add;

// Converts `tagName#id.className` selectors into objects
Parser.prototype.parseSelector = (key) => {
	let classes = null;
	let found = /(\w+)(?:#([\w-]+))?((?:\.[\w-]+)*)?/ig.exec(key);
	if (found[3] != null) {
        classes = found[3].split('.').slice(1);
    }

	return {
        tag: found[1],
        id: found[2],
        classes: classes
    };
};

// Combines tag information into html
Parser.prototype.htmlizeTagOpening = (selector, el) =>{
	this.addToResult('<');
	this.addToResult(selector.tag);

	let needSpace = true;
	if (selector.id != null) {
		this.addToResult(' id=\''+selector.id+'\'');
		needSpace = false;
	}

	if (selector.classes != null) {
		if (needSpace) {
			this.addToResult(' ');
			needSpace = false;
		}
		this.addToResult('class=\''+selector.classes[0]);

		for (let i = 1; i < selector.classes.length; i++) {
			this.addToResult(' ' + selector.classes[i]);
		}

		this.addToResult('\'');
	}

	if (el != null) {
		for (let j = 0; j < el.length; j += 2) {
			 if (
			 	(el[j].indexOf('$') !== 0)
				|| (el[j] === '$DOCTYPE' || el[j] === '$doctype')
				|| (el[j] === '$')
				|| (el[j] === '$$')
			 ) continue;

			if (needSpace) {
				this.addToResult(' ');
				needSpace = false;
			}

			this.addToResult(el[j].substr(1));

			if (el[j + 1] === true) {
				needSpace = true;
				continue;
			}

			this.addToResult('=\'');
			this.addToResult(el[j + 1]);
			this.addToResult('\'');
		}
	}

	this.addToResult('>');
};

// Tags, which should never be closed according to
Parser.shouldNotClose = [
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

// Combines tag information and contents into html
Parser.prototype.htmlizeElement = (key, el) => {
	let selector = this.parseSelector(key);

	let isHtml = key.indexOf('html') === 0;
	if (isHtml) {
		let found = false;
		for (let j = 0; j < el.length; j += 2) {
			if (el[j] === '$DOCTYPE' || el[j] === '$doctype') {
				this.addToResult('<!doctype '+el[j+1]+'>');
				found = true;
				break;
			}
		}

		if (!found) {
			this.addToResult('<!doctype html>');
        }
	}

	this.htmlizeTagOpening(selector, el);
	if (typeof el === 'string') {
        this.addToResult(el);
    } else {
		for (let i = 0; i < el.length; i += 2) {
			if (el[i] === '$') {
				this.addToResult(el[i+1]);
				continue;
			}

			if (el[i] === '$$') {
				let toUnpack = el[i + 1];
				for (let k = 0; k < toUnpack.length; k += 2) {
					this.htmlizeElement(toUnpack[k], toUnpack[k + 1]);
				}

				continue;
			}

			if (el[i].indexOf('$') === 0) {
				continue;
            }

			if (isHtml && (el[i] === '$DOCTYPE' || el[i] === '$doctype')) {
                continue;
            }

			this.htmlizeElement(el[i], el[i+1]);
		}
	}

	if (Parser.shouldNotClose.indexOf(selector.tag) === -1) {
        this.addToResult('</' + selector.tag + '>');
    }
};

Parser.prototype.work = (data) => {
	for (let i = 0; i < data.length; i++) {
		if (data[i].indexOf('html') === 0) {
			this.htmlizeElement(data[i], data[i + 1]);
			return;
		}
	}

	this.htmlizeElement('html', data);
};

const sync = (tree) => {
	let res = '';
	let p = new Parser(data => res += data);

	p.work(tree);

	return res;
};

const Node2HtmlStream = (tree, options) => {
	stream.Readable.call(this, options);

	this._tree = tree;
	this._stoppedAt = 0;
	this._parsed = false;
	this._res = '';
};
util.inherits(Node2HtmlStream, stream.Readable);

Node2HtmlStream.prototype._read = size => {
	if (!this._parsed) {
		let self = this;
		let p = new Parser(data => self._res += data);

		p.work(this._tree);
	}

	this.push(this._res.substr(this._stoppedAt, this._stoppedAt + size));
	this._stoppedAt = this._stoppedAt + size;

	if (this._stoppedAt >= this._res.length - 1) {
		this.push(null);
	}
};

module.exports = {
	sync: sync,
    Node2HtmlStream: Node2HtmlStream
};
