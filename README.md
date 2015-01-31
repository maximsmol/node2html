# Aseq

Asynchronous Sequence is a javascript library, which deals with the callback hell.

## Why Aseq

Without aseq:

```js
a('additional argument', function(err, arg)
{
	if (err != null)
	{
		handleErr(err);
		return;
	}

	arg = change(arg);

	b(arg, function(err, arg)
	{
		if (err != null)
		{
			handleErr(err);
			return;
		}

		arg = change(arg);

		c(arg, function(err, arg)
		{
			if (err != null)
			{
				handleErr(err);
				return;
			}

			arg = change(arg);

			d(arg, function(err, arg)
			{
				if (err != null)
				{
					handleErr(err);
					return;
				}

				arg = change(arg);
			});
		});
	});
});
```

With aseq (using aseq as object):

```js
var seq = new aseq();

var handleErrors = aseq.createErrorHandler(errorHandler);

seq.append(a);
seq.append(handleErrors);
seq.append(change);

seq.append(b);
seq.append(handleErrors);
seq.append(change);

seq.append(c);
seq.append(handleErrors);
seq.append(change);

seq.append(d);
seq.append(handleErrors);
seq.append(change);
```

## Basic Usage

### Aseq as Object

```js
var seq = new aseq();

seq.append(a);
seq.append(b);

seq.run('arg');
```

**Api**

`seq.append(<function>[, this [, arg ...]])`

1. `function` - function to be appended
1. `this` - object to bind the function to
1. `arg` - prefix arguments

Appends a function to the sequence

`seq.run([arg ...])`

`arg` - args to pass to the first function in the sequence

Runs the sequence

### Aseq as Function Generator

```js
var seq = seq(a, b, c, d);

seq('arg');
```

## Installation

`npm install aseq`
