/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
//     Underscore.js 1.7.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){var n=this,t=n._,r=Array.prototype,e=Object.prototype,u=Function.prototype,i=r.push,a=r.slice,o=r.concat,l=e.toString,c=e.hasOwnProperty,f=Array.isArray,s=Object.keys,p=u.bind,h=function(n){return n instanceof h?n:this instanceof h?void(this._wrapped=n):new h(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=h),exports._=h):n._=h,h.VERSION="1.7.0";var g=function(n,t,r){if(t===void 0)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 2:return function(r,e){return n.call(t,r,e)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,i){return n.call(t,r,e,u,i)}}return function(){return n.apply(t,arguments)}};h.iteratee=function(n,t,r){return null==n?h.identity:h.isFunction(n)?g(n,t,r):h.isObject(n)?h.matches(n):h.property(n)},h.each=h.forEach=function(n,t,r){if(null==n)return n;t=g(t,r);var e,u=n.length;if(u===+u)for(e=0;u>e;e++)t(n[e],e,n);else{var i=h.keys(n);for(e=0,u=i.length;u>e;e++)t(n[i[e]],i[e],n)}return n},h.map=h.collect=function(n,t,r){if(null==n)return[];t=h.iteratee(t,r);for(var e,u=n.length!==+n.length&&h.keys(n),i=(u||n).length,a=Array(i),o=0;i>o;o++)e=u?u[o]:o,a[o]=t(n[e],e,n);return a};var v="Reduce of empty array with no initial value";h.reduce=h.foldl=h.inject=function(n,t,r,e){null==n&&(n=[]),t=g(t,e,4);var u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length,o=0;if(arguments.length<3){if(!a)throw new TypeError(v);r=n[i?i[o++]:o++]}for(;a>o;o++)u=i?i[o]:o,r=t(r,n[u],u,n);return r},h.reduceRight=h.foldr=function(n,t,r,e){null==n&&(n=[]),t=g(t,e,4);var u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length;if(arguments.length<3){if(!a)throw new TypeError(v);r=n[i?i[--a]:--a]}for(;a--;)u=i?i[a]:a,r=t(r,n[u],u,n);return r},h.find=h.detect=function(n,t,r){var e;return t=h.iteratee(t,r),h.some(n,function(n,r,u){return t(n,r,u)?(e=n,!0):void 0}),e},h.filter=h.select=function(n,t,r){var e=[];return null==n?e:(t=h.iteratee(t,r),h.each(n,function(n,r,u){t(n,r,u)&&e.push(n)}),e)},h.reject=function(n,t,r){return h.filter(n,h.negate(h.iteratee(t)),r)},h.every=h.all=function(n,t,r){if(null==n)return!0;t=h.iteratee(t,r);var e,u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length;for(e=0;a>e;e++)if(u=i?i[e]:e,!t(n[u],u,n))return!1;return!0},h.some=h.any=function(n,t,r){if(null==n)return!1;t=h.iteratee(t,r);var e,u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length;for(e=0;a>e;e++)if(u=i?i[e]:e,t(n[u],u,n))return!0;return!1},h.contains=h.include=function(n,t){return null==n?!1:(n.length!==+n.length&&(n=h.values(n)),h.indexOf(n,t)>=0)},h.invoke=function(n,t){var r=a.call(arguments,2),e=h.isFunction(t);return h.map(n,function(n){return(e?t:n[t]).apply(n,r)})},h.pluck=function(n,t){return h.map(n,h.property(t))},h.where=function(n,t){return h.filter(n,h.matches(t))},h.findWhere=function(n,t){return h.find(n,h.matches(t))},h.max=function(n,t,r){var e,u,i=-1/0,a=-1/0;if(null==t&&null!=n){n=n.length===+n.length?n:h.values(n);for(var o=0,l=n.length;l>o;o++)e=n[o],e>i&&(i=e)}else t=h.iteratee(t,r),h.each(n,function(n,r,e){u=t(n,r,e),(u>a||u===-1/0&&i===-1/0)&&(i=n,a=u)});return i},h.min=function(n,t,r){var e,u,i=1/0,a=1/0;if(null==t&&null!=n){n=n.length===+n.length?n:h.values(n);for(var o=0,l=n.length;l>o;o++)e=n[o],i>e&&(i=e)}else t=h.iteratee(t,r),h.each(n,function(n,r,e){u=t(n,r,e),(a>u||1/0===u&&1/0===i)&&(i=n,a=u)});return i},h.shuffle=function(n){for(var t,r=n&&n.length===+n.length?n:h.values(n),e=r.length,u=Array(e),i=0;e>i;i++)t=h.random(0,i),t!==i&&(u[i]=u[t]),u[t]=r[i];return u},h.sample=function(n,t,r){return null==t||r?(n.length!==+n.length&&(n=h.values(n)),n[h.random(n.length-1)]):h.shuffle(n).slice(0,Math.max(0,t))},h.sortBy=function(n,t,r){return t=h.iteratee(t,r),h.pluck(h.map(n,function(n,r,e){return{value:n,index:r,criteria:t(n,r,e)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var m=function(n){return function(t,r,e){var u={};return r=h.iteratee(r,e),h.each(t,function(e,i){var a=r(e,i,t);n(u,e,a)}),u}};h.groupBy=m(function(n,t,r){h.has(n,r)?n[r].push(t):n[r]=[t]}),h.indexBy=m(function(n,t,r){n[r]=t}),h.countBy=m(function(n,t,r){h.has(n,r)?n[r]++:n[r]=1}),h.sortedIndex=function(n,t,r,e){r=h.iteratee(r,e,1);for(var u=r(t),i=0,a=n.length;a>i;){var o=i+a>>>1;r(n[o])<u?i=o+1:a=o}return i},h.toArray=function(n){return n?h.isArray(n)?a.call(n):n.length===+n.length?h.map(n,h.identity):h.values(n):[]},h.size=function(n){return null==n?0:n.length===+n.length?n.length:h.keys(n).length},h.partition=function(n,t,r){t=h.iteratee(t,r);var e=[],u=[];return h.each(n,function(n,r,i){(t(n,r,i)?e:u).push(n)}),[e,u]},h.first=h.head=h.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:0>t?[]:a.call(n,0,t)},h.initial=function(n,t,r){return a.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},h.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:a.call(n,Math.max(n.length-t,0))},h.rest=h.tail=h.drop=function(n,t,r){return a.call(n,null==t||r?1:t)},h.compact=function(n){return h.filter(n,h.identity)};var y=function(n,t,r,e){if(t&&h.every(n,h.isArray))return o.apply(e,n);for(var u=0,a=n.length;a>u;u++){var l=n[u];h.isArray(l)||h.isArguments(l)?t?i.apply(e,l):y(l,t,r,e):r||e.push(l)}return e};h.flatten=function(n,t){return y(n,t,!1,[])},h.without=function(n){return h.difference(n,a.call(arguments,1))},h.uniq=h.unique=function(n,t,r,e){if(null==n)return[];h.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=h.iteratee(r,e));for(var u=[],i=[],a=0,o=n.length;o>a;a++){var l=n[a];if(t)a&&i===l||u.push(l),i=l;else if(r){var c=r(l,a,n);h.indexOf(i,c)<0&&(i.push(c),u.push(l))}else h.indexOf(u,l)<0&&u.push(l)}return u},h.union=function(){return h.uniq(y(arguments,!0,!0,[]))},h.intersection=function(n){if(null==n)return[];for(var t=[],r=arguments.length,e=0,u=n.length;u>e;e++){var i=n[e];if(!h.contains(t,i)){for(var a=1;r>a&&h.contains(arguments[a],i);a++);a===r&&t.push(i)}}return t},h.difference=function(n){var t=y(a.call(arguments,1),!0,!0,[]);return h.filter(n,function(n){return!h.contains(t,n)})},h.zip=function(n){if(null==n)return[];for(var t=h.max(arguments,"length").length,r=Array(t),e=0;t>e;e++)r[e]=h.pluck(arguments,e);return r},h.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},h.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=h.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}for(;u>e;e++)if(n[e]===t)return e;return-1},h.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=n.length;for("number"==typeof r&&(e=0>r?e+r+1:Math.min(e,r+1));--e>=0;)if(n[e]===t)return e;return-1},h.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;e>i;i++,n+=r)u[i]=n;return u};var d=function(){};h.bind=function(n,t){var r,e;if(p&&n.bind===p)return p.apply(n,a.call(arguments,1));if(!h.isFunction(n))throw new TypeError("Bind must be called on a function");return r=a.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(a.call(arguments)));d.prototype=n.prototype;var u=new d;d.prototype=null;var i=n.apply(u,r.concat(a.call(arguments)));return h.isObject(i)?i:u}},h.partial=function(n){var t=a.call(arguments,1);return function(){for(var r=0,e=t.slice(),u=0,i=e.length;i>u;u++)e[u]===h&&(e[u]=arguments[r++]);for(;r<arguments.length;)e.push(arguments[r++]);return n.apply(this,e)}},h.bindAll=function(n){var t,r,e=arguments.length;if(1>=e)throw new Error("bindAll must be passed function names");for(t=1;e>t;t++)r=arguments[t],n[r]=h.bind(n[r],n);return n},h.memoize=function(n,t){var r=function(e){var u=r.cache,i=t?t.apply(this,arguments):e;return h.has(u,i)||(u[i]=n.apply(this,arguments)),u[i]};return r.cache={},r},h.delay=function(n,t){var r=a.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},h.defer=function(n){return h.delay.apply(h,[n,1].concat(a.call(arguments,1)))},h.throttle=function(n,t,r){var e,u,i,a=null,o=0;r||(r={});var l=function(){o=r.leading===!1?0:h.now(),a=null,i=n.apply(e,u),a||(e=u=null)};return function(){var c=h.now();o||r.leading!==!1||(o=c);var f=t-(c-o);return e=this,u=arguments,0>=f||f>t?(clearTimeout(a),a=null,o=c,i=n.apply(e,u),a||(e=u=null)):a||r.trailing===!1||(a=setTimeout(l,f)),i}},h.debounce=function(n,t,r){var e,u,i,a,o,l=function(){var c=h.now()-a;t>c&&c>0?e=setTimeout(l,t-c):(e=null,r||(o=n.apply(i,u),e||(i=u=null)))};return function(){i=this,u=arguments,a=h.now();var c=r&&!e;return e||(e=setTimeout(l,t)),c&&(o=n.apply(i,u),i=u=null),o}},h.wrap=function(n,t){return h.partial(t,n)},h.negate=function(n){return function(){return!n.apply(this,arguments)}},h.compose=function(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}},h.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},h.before=function(n,t){var r;return function(){return--n>0?r=t.apply(this,arguments):t=null,r}},h.once=h.partial(h.before,2),h.keys=function(n){if(!h.isObject(n))return[];if(s)return s(n);var t=[];for(var r in n)h.has(n,r)&&t.push(r);return t},h.values=function(n){for(var t=h.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},h.pairs=function(n){for(var t=h.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},h.invert=function(n){for(var t={},r=h.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},h.functions=h.methods=function(n){var t=[];for(var r in n)h.isFunction(n[r])&&t.push(r);return t.sort()},h.extend=function(n){if(!h.isObject(n))return n;for(var t,r,e=1,u=arguments.length;u>e;e++){t=arguments[e];for(r in t)c.call(t,r)&&(n[r]=t[r])}return n},h.pick=function(n,t,r){var e,u={};if(null==n)return u;if(h.isFunction(t)){t=g(t,r);for(e in n){var i=n[e];t(i,e,n)&&(u[e]=i)}}else{var l=o.apply([],a.call(arguments,1));n=new Object(n);for(var c=0,f=l.length;f>c;c++)e=l[c],e in n&&(u[e]=n[e])}return u},h.omit=function(n,t,r){if(h.isFunction(t))t=h.negate(t);else{var e=h.map(o.apply([],a.call(arguments,1)),String);t=function(n,t){return!h.contains(e,t)}}return h.pick(n,t,r)},h.defaults=function(n){if(!h.isObject(n))return n;for(var t=1,r=arguments.length;r>t;t++){var e=arguments[t];for(var u in e)n[u]===void 0&&(n[u]=e[u])}return n},h.clone=function(n){return h.isObject(n)?h.isArray(n)?n.slice():h.extend({},n):n},h.tap=function(n,t){return t(n),n};var b=function(n,t,r,e){if(n===t)return 0!==n||1/n===1/t;if(null==n||null==t)return n===t;n instanceof h&&(n=n._wrapped),t instanceof h&&(t=t._wrapped);var u=l.call(n);if(u!==l.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!==+n?+t!==+t:0===+n?1/+n===1/t:+n===+t;case"[object Date]":case"[object Boolean]":return+n===+t}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]===n)return e[i]===t;var a=n.constructor,o=t.constructor;if(a!==o&&"constructor"in n&&"constructor"in t&&!(h.isFunction(a)&&a instanceof a&&h.isFunction(o)&&o instanceof o))return!1;r.push(n),e.push(t);var c,f;if("[object Array]"===u){if(c=n.length,f=c===t.length)for(;c--&&(f=b(n[c],t[c],r,e)););}else{var s,p=h.keys(n);if(c=p.length,f=h.keys(t).length===c)for(;c--&&(s=p[c],f=h.has(t,s)&&b(n[s],t[s],r,e)););}return r.pop(),e.pop(),f};h.isEqual=function(n,t){return b(n,t,[],[])},h.isEmpty=function(n){if(null==n)return!0;if(h.isArray(n)||h.isString(n)||h.isArguments(n))return 0===n.length;for(var t in n)if(h.has(n,t))return!1;return!0},h.isElement=function(n){return!(!n||1!==n.nodeType)},h.isArray=f||function(n){return"[object Array]"===l.call(n)},h.isObject=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},h.each(["Arguments","Function","String","Number","Date","RegExp"],function(n){h["is"+n]=function(t){return l.call(t)==="[object "+n+"]"}}),h.isArguments(arguments)||(h.isArguments=function(n){return h.has(n,"callee")}),"function"!=typeof/./&&(h.isFunction=function(n){return"function"==typeof n||!1}),h.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},h.isNaN=function(n){return h.isNumber(n)&&n!==+n},h.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"===l.call(n)},h.isNull=function(n){return null===n},h.isUndefined=function(n){return n===void 0},h.has=function(n,t){return null!=n&&c.call(n,t)},h.noConflict=function(){return n._=t,this},h.identity=function(n){return n},h.constant=function(n){return function(){return n}},h.noop=function(){},h.property=function(n){return function(t){return t[n]}},h.matches=function(n){var t=h.pairs(n),r=t.length;return function(n){if(null==n)return!r;n=new Object(n);for(var e=0;r>e;e++){var u=t[e],i=u[0];if(u[1]!==n[i]||!(i in n))return!1}return!0}},h.times=function(n,t,r){var e=Array(Math.max(0,n));t=g(t,r,1);for(var u=0;n>u;u++)e[u]=t(u);return e},h.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},h.now=Date.now||function(){return(new Date).getTime()};var _={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},w=h.invert(_),j=function(n){var t=function(t){return n[t]},r="(?:"+h.keys(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}};h.escape=j(_),h.unescape=j(w),h.result=function(n,t){if(null==n)return void 0;var r=n[t];return h.isFunction(r)?n[t]():r};var x=0;h.uniqueId=function(n){var t=++x+"";return n?n+t:t},h.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var A=/(.)^/,k={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},O=/\\|'|\r|\n|\u2028|\u2029/g,F=function(n){return"\\"+k[n]};h.template=function(n,t,r){!t&&r&&(t=r),t=h.defaults({},t,h.templateSettings);var e=RegExp([(t.escape||A).source,(t.interpolate||A).source,(t.evaluate||A).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,a,o){return i+=n.slice(u,o).replace(O,F),u=o+t.length,r?i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?i+="'+\n((__t=("+e+"))==null?'':__t)+\n'":a&&(i+="';\n"+a+"\n__p+='"),t}),i+="';\n",t.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var a=new Function(t.variable||"obj","_",i)}catch(o){throw o.source=i,o}var l=function(n){return a.call(this,n,h)},c=t.variable||"obj";return l.source="function("+c+"){\n"+i+"}",l},h.chain=function(n){var t=h(n);return t._chain=!0,t};var E=function(n){return this._chain?h(n).chain():n};h.mixin=function(n){h.each(h.functions(n),function(t){var r=h[t]=n[t];h.prototype[t]=function(){var n=[this._wrapped];return i.apply(n,arguments),E.call(this,r.apply(h,n))}})},h.mixin(h),h.each(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=r[n];h.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0],E.call(this,r)}}),h.each(["concat","join","slice"],function(n){var t=r[n];h.prototype[n]=function(){return E.call(this,t.apply(this._wrapped,arguments))}}),h.prototype.value=function(){return this._wrapped},"function"==typeof define&&define.amd&&define("underscore",[],function(){return h})}).call(this);
//# sourceMappingURL=underscore-min.map;
(function(t,e){if(typeof define==="function"&&define.amd){define('backbone',["underscore","jquery","exports"],function(i,r,s){t.Backbone=e(t,s,i,r)})}else if(typeof exports!=="undefined"){var i=require("underscore");e(t,exports,i)}else{t.Backbone=e(t,{},t._,t.jQuery||t.Zepto||t.ender||t.$)}})(this,function(t,e,i,r){var s=t.Backbone;var n=[];var a=n.push;var o=n.slice;var h=n.splice;e.VERSION="1.1.2";e.$=r;e.noConflict=function(){t.Backbone=s;return this};e.emulateHTTP=false;e.emulateJSON=false;var u=e.Events={on:function(t,e,i){if(!c(this,"on",t,[e,i])||!e)return this;this._events||(this._events={});var r=this._events[t]||(this._events[t]=[]);r.push({callback:e,context:i,ctx:i||this});return this},once:function(t,e,r){if(!c(this,"once",t,[e,r])||!e)return this;var s=this;var n=i.once(function(){s.off(t,n);e.apply(this,arguments)});n._callback=e;return this.on(t,n,r)},off:function(t,e,r){var s,n,a,o,h,u,l,f;if(!this._events||!c(this,"off",t,[e,r]))return this;if(!t&&!e&&!r){this._events=void 0;return this}o=t?[t]:i.keys(this._events);for(h=0,u=o.length;h<u;h++){t=o[h];if(a=this._events[t]){this._events[t]=s=[];if(e||r){for(l=0,f=a.length;l<f;l++){n=a[l];if(e&&e!==n.callback&&e!==n.callback._callback||r&&r!==n.context){s.push(n)}}}if(!s.length)delete this._events[t]}}return this},trigger:function(t){if(!this._events)return this;var e=o.call(arguments,1);if(!c(this,"trigger",t,e))return this;var i=this._events[t];var r=this._events.all;if(i)f(i,e);if(r)f(r,arguments);return this},stopListening:function(t,e,r){var s=this._listeningTo;if(!s)return this;var n=!e&&!r;if(!r&&typeof e==="object")r=this;if(t)(s={})[t._listenId]=t;for(var a in s){t=s[a];t.off(e,r,this);if(n||i.isEmpty(t._events))delete this._listeningTo[a]}return this}};var l=/\s+/;var c=function(t,e,i,r){if(!i)return true;if(typeof i==="object"){for(var s in i){t[e].apply(t,[s,i[s]].concat(r))}return false}if(l.test(i)){var n=i.split(l);for(var a=0,o=n.length;a<o;a++){t[e].apply(t,[n[a]].concat(r))}return false}return true};var f=function(t,e){var i,r=-1,s=t.length,n=e[0],a=e[1],o=e[2];switch(e.length){case 0:while(++r<s)(i=t[r]).callback.call(i.ctx);return;case 1:while(++r<s)(i=t[r]).callback.call(i.ctx,n);return;case 2:while(++r<s)(i=t[r]).callback.call(i.ctx,n,a);return;case 3:while(++r<s)(i=t[r]).callback.call(i.ctx,n,a,o);return;default:while(++r<s)(i=t[r]).callback.apply(i.ctx,e);return}};var d={listenTo:"on",listenToOnce:"once"};i.each(d,function(t,e){u[e]=function(e,r,s){var n=this._listeningTo||(this._listeningTo={});var a=e._listenId||(e._listenId=i.uniqueId("l"));n[a]=e;if(!s&&typeof r==="object")s=this;e[t](r,s,this);return this}});u.bind=u.on;u.unbind=u.off;i.extend(e,u);var p=e.Model=function(t,e){var r=t||{};e||(e={});this.cid=i.uniqueId("c");this.attributes={};if(e.collection)this.collection=e.collection;if(e.parse)r=this.parse(r,e)||{};r=i.defaults({},r,i.result(this,"defaults"));this.set(r,e);this.changed={};this.initialize.apply(this,arguments)};i.extend(p.prototype,u,{changed:null,validationError:null,idAttribute:"id",initialize:function(){},toJSON:function(t){return i.clone(this.attributes)},sync:function(){return e.sync.apply(this,arguments)},get:function(t){return this.attributes[t]},escape:function(t){return i.escape(this.get(t))},has:function(t){return this.get(t)!=null},set:function(t,e,r){var s,n,a,o,h,u,l,c;if(t==null)return this;if(typeof t==="object"){n=t;r=e}else{(n={})[t]=e}r||(r={});if(!this._validate(n,r))return false;a=r.unset;h=r.silent;o=[];u=this._changing;this._changing=true;if(!u){this._previousAttributes=i.clone(this.attributes);this.changed={}}c=this.attributes,l=this._previousAttributes;if(this.idAttribute in n)this.id=n[this.idAttribute];for(s in n){e=n[s];if(!i.isEqual(c[s],e))o.push(s);if(!i.isEqual(l[s],e)){this.changed[s]=e}else{delete this.changed[s]}a?delete c[s]:c[s]=e}if(!h){if(o.length)this._pending=r;for(var f=0,d=o.length;f<d;f++){this.trigger("change:"+o[f],this,c[o[f]],r)}}if(u)return this;if(!h){while(this._pending){r=this._pending;this._pending=false;this.trigger("change",this,r)}}this._pending=false;this._changing=false;return this},unset:function(t,e){return this.set(t,void 0,i.extend({},e,{unset:true}))},clear:function(t){var e={};for(var r in this.attributes)e[r]=void 0;return this.set(e,i.extend({},t,{unset:true}))},hasChanged:function(t){if(t==null)return!i.isEmpty(this.changed);return i.has(this.changed,t)},changedAttributes:function(t){if(!t)return this.hasChanged()?i.clone(this.changed):false;var e,r=false;var s=this._changing?this._previousAttributes:this.attributes;for(var n in t){if(i.isEqual(s[n],e=t[n]))continue;(r||(r={}))[n]=e}return r},previous:function(t){if(t==null||!this._previousAttributes)return null;return this._previousAttributes[t]},previousAttributes:function(){return i.clone(this._previousAttributes)},fetch:function(t){t=t?i.clone(t):{};if(t.parse===void 0)t.parse=true;var e=this;var r=t.success;t.success=function(i){if(!e.set(e.parse(i,t),t))return false;if(r)r(e,i,t);e.trigger("sync",e,i,t)};q(this,t);return this.sync("read",this,t)},save:function(t,e,r){var s,n,a,o=this.attributes;if(t==null||typeof t==="object"){s=t;r=e}else{(s={})[t]=e}r=i.extend({validate:true},r);if(s&&!r.wait){if(!this.set(s,r))return false}else{if(!this._validate(s,r))return false}if(s&&r.wait){this.attributes=i.extend({},o,s)}if(r.parse===void 0)r.parse=true;var h=this;var u=r.success;r.success=function(t){h.attributes=o;var e=h.parse(t,r);if(r.wait)e=i.extend(s||{},e);if(i.isObject(e)&&!h.set(e,r)){return false}if(u)u(h,t,r);h.trigger("sync",h,t,r)};q(this,r);n=this.isNew()?"create":r.patch?"patch":"update";if(n==="patch")r.attrs=s;a=this.sync(n,this,r);if(s&&r.wait)this.attributes=o;return a},destroy:function(t){t=t?i.clone(t):{};var e=this;var r=t.success;var s=function(){e.trigger("destroy",e,e.collection,t)};t.success=function(i){if(t.wait||e.isNew())s();if(r)r(e,i,t);if(!e.isNew())e.trigger("sync",e,i,t)};if(this.isNew()){t.success();return false}q(this,t);var n=this.sync("delete",this,t);if(!t.wait)s();return n},url:function(){var t=i.result(this,"urlRoot")||i.result(this.collection,"url")||M();if(this.isNew())return t;return t.replace(/([^\/])$/,"$1/")+encodeURIComponent(this.id)},parse:function(t,e){return t},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return!this.has(this.idAttribute)},isValid:function(t){return this._validate({},i.extend(t||{},{validate:true}))},_validate:function(t,e){if(!e.validate||!this.validate)return true;t=i.extend({},this.attributes,t);var r=this.validationError=this.validate(t,e)||null;if(!r)return true;this.trigger("invalid",this,r,i.extend(e,{validationError:r}));return false}});var v=["keys","values","pairs","invert","pick","omit"];i.each(v,function(t){p.prototype[t]=function(){var e=o.call(arguments);e.unshift(this.attributes);return i[t].apply(i,e)}});var g=e.Collection=function(t,e){e||(e={});if(e.model)this.model=e.model;if(e.comparator!==void 0)this.comparator=e.comparator;this._reset();this.initialize.apply(this,arguments);if(t)this.reset(t,i.extend({silent:true},e))};var m={add:true,remove:true,merge:true};var y={add:true,remove:false};i.extend(g.prototype,u,{model:p,initialize:function(){},toJSON:function(t){return this.map(function(e){return e.toJSON(t)})},sync:function(){return e.sync.apply(this,arguments)},add:function(t,e){return this.set(t,i.extend({merge:false},e,y))},remove:function(t,e){var r=!i.isArray(t);t=r?[t]:i.clone(t);e||(e={});var s,n,a,o;for(s=0,n=t.length;s<n;s++){o=t[s]=this.get(t[s]);if(!o)continue;delete this._byId[o.id];delete this._byId[o.cid];a=this.indexOf(o);this.models.splice(a,1);this.length--;if(!e.silent){e.index=a;o.trigger("remove",o,this,e)}this._removeReference(o,e)}return r?t[0]:t},set:function(t,e){e=i.defaults({},e,m);if(e.parse)t=this.parse(t,e);var r=!i.isArray(t);t=r?t?[t]:[]:i.clone(t);var s,n,a,o,h,u,l;var c=e.at;var f=this.model;var d=this.comparator&&c==null&&e.sort!==false;var v=i.isString(this.comparator)?this.comparator:null;var g=[],y=[],_={};var b=e.add,w=e.merge,x=e.remove;var E=!d&&b&&x?[]:false;for(s=0,n=t.length;s<n;s++){h=t[s]||{};if(h instanceof p){a=o=h}else{a=h[f.prototype.idAttribute||"id"]}if(u=this.get(a)){if(x)_[u.cid]=true;if(w){h=h===o?o.attributes:h;if(e.parse)h=u.parse(h,e);u.set(h,e);if(d&&!l&&u.hasChanged(v))l=true}t[s]=u}else if(b){o=t[s]=this._prepareModel(h,e);if(!o)continue;g.push(o);this._addReference(o,e)}o=u||o;if(E&&(o.isNew()||!_[o.id]))E.push(o);_[o.id]=true}if(x){for(s=0,n=this.length;s<n;++s){if(!_[(o=this.models[s]).cid])y.push(o)}if(y.length)this.remove(y,e)}if(g.length||E&&E.length){if(d)l=true;this.length+=g.length;if(c!=null){for(s=0,n=g.length;s<n;s++){this.models.splice(c+s,0,g[s])}}else{if(E)this.models.length=0;var k=E||g;for(s=0,n=k.length;s<n;s++){this.models.push(k[s])}}}if(l)this.sort({silent:true});if(!e.silent){for(s=0,n=g.length;s<n;s++){(o=g[s]).trigger("add",o,this,e)}if(l||E&&E.length)this.trigger("sort",this,e)}return r?t[0]:t},reset:function(t,e){e||(e={});for(var r=0,s=this.models.length;r<s;r++){this._removeReference(this.models[r],e)}e.previousModels=this.models;this._reset();t=this.add(t,i.extend({silent:true},e));if(!e.silent)this.trigger("reset",this,e);return t},push:function(t,e){return this.add(t,i.extend({at:this.length},e))},pop:function(t){var e=this.at(this.length-1);this.remove(e,t);return e},unshift:function(t,e){return this.add(t,i.extend({at:0},e))},shift:function(t){var e=this.at(0);this.remove(e,t);return e},slice:function(){return o.apply(this.models,arguments)},get:function(t){if(t==null)return void 0;return this._byId[t]||this._byId[t.id]||this._byId[t.cid]},at:function(t){return this.models[t]},where:function(t,e){if(i.isEmpty(t))return e?void 0:[];return this[e?"find":"filter"](function(e){for(var i in t){if(t[i]!==e.get(i))return false}return true})},findWhere:function(t){return this.where(t,true)},sort:function(t){if(!this.comparator)throw new Error("Cannot sort a set without a comparator");t||(t={});if(i.isString(this.comparator)||this.comparator.length===1){this.models=this.sortBy(this.comparator,this)}else{this.models.sort(i.bind(this.comparator,this))}if(!t.silent)this.trigger("sort",this,t);return this},pluck:function(t){return i.invoke(this.models,"get",t)},fetch:function(t){t=t?i.clone(t):{};if(t.parse===void 0)t.parse=true;var e=t.success;var r=this;t.success=function(i){var s=t.reset?"reset":"set";r[s](i,t);if(e)e(r,i,t);r.trigger("sync",r,i,t)};q(this,t);return this.sync("read",this,t)},create:function(t,e){e=e?i.clone(e):{};if(!(t=this._prepareModel(t,e)))return false;if(!e.wait)this.add(t,e);var r=this;var s=e.success;e.success=function(t,i){if(e.wait)r.add(t,e);if(s)s(t,i,e)};t.save(null,e);return t},parse:function(t,e){return t},clone:function(){return new this.constructor(this.models)},_reset:function(){this.length=0;this.models=[];this._byId={}},_prepareModel:function(t,e){if(t instanceof p)return t;e=e?i.clone(e):{};e.collection=this;var r=new this.model(t,e);if(!r.validationError)return r;this.trigger("invalid",this,r.validationError,e);return false},_addReference:function(t,e){this._byId[t.cid]=t;if(t.id!=null)this._byId[t.id]=t;if(!t.collection)t.collection=this;t.on("all",this._onModelEvent,this)},_removeReference:function(t,e){if(this===t.collection)delete t.collection;t.off("all",this._onModelEvent,this)},_onModelEvent:function(t,e,i,r){if((t==="add"||t==="remove")&&i!==this)return;if(t==="destroy")this.remove(e,r);if(e&&t==="change:"+e.idAttribute){delete this._byId[e.previous(e.idAttribute)];if(e.id!=null)this._byId[e.id]=e}this.trigger.apply(this,arguments)}});var _=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","difference","indexOf","shuffle","lastIndexOf","isEmpty","chain","sample"];i.each(_,function(t){g.prototype[t]=function(){var e=o.call(arguments);e.unshift(this.models);return i[t].apply(i,e)}});var b=["groupBy","countBy","sortBy","indexBy"];i.each(b,function(t){g.prototype[t]=function(e,r){var s=i.isFunction(e)?e:function(t){return t.get(e)};return i[t](this.models,s,r)}});var w=e.View=function(t){this.cid=i.uniqueId("view");t||(t={});i.extend(this,i.pick(t,E));this._ensureElement();this.initialize.apply(this,arguments);this.delegateEvents()};var x=/^(\S+)\s*(.*)$/;var E=["model","collection","el","id","attributes","className","tagName","events"];i.extend(w.prototype,u,{tagName:"div",$:function(t){return this.$el.find(t)},initialize:function(){},render:function(){return this},remove:function(){this.$el.remove();this.stopListening();return this},setElement:function(t,i){if(this.$el)this.undelegateEvents();this.$el=t instanceof e.$?t:e.$(t);this.el=this.$el[0];if(i!==false)this.delegateEvents();return this},delegateEvents:function(t){if(!(t||(t=i.result(this,"events"))))return this;this.undelegateEvents();for(var e in t){var r=t[e];if(!i.isFunction(r))r=this[t[e]];if(!r)continue;var s=e.match(x);var n=s[1],a=s[2];r=i.bind(r,this);n+=".delegateEvents"+this.cid;if(a===""){this.$el.on(n,r)}else{this.$el.on(n,a,r)}}return this},undelegateEvents:function(){this.$el.off(".delegateEvents"+this.cid);return this},_ensureElement:function(){if(!this.el){var t=i.extend({},i.result(this,"attributes"));if(this.id)t.id=i.result(this,"id");if(this.className)t["class"]=i.result(this,"className");var r=e.$("<"+i.result(this,"tagName")+">").attr(t);this.setElement(r,false)}else{this.setElement(i.result(this,"el"),false)}}});e.sync=function(t,r,s){var n=T[t];i.defaults(s||(s={}),{emulateHTTP:e.emulateHTTP,emulateJSON:e.emulateJSON});var a={type:n,dataType:"json"};if(!s.url){a.url=i.result(r,"url")||M()}if(s.data==null&&r&&(t==="create"||t==="update"||t==="patch")){a.contentType="application/json";a.data=JSON.stringify(s.attrs||r.toJSON(s))}if(s.emulateJSON){a.contentType="application/x-www-form-urlencoded";a.data=a.data?{model:a.data}:{}}if(s.emulateHTTP&&(n==="PUT"||n==="DELETE"||n==="PATCH")){a.type="POST";if(s.emulateJSON)a.data._method=n;var o=s.beforeSend;s.beforeSend=function(t){t.setRequestHeader("X-HTTP-Method-Override",n);if(o)return o.apply(this,arguments)}}if(a.type!=="GET"&&!s.emulateJSON){a.processData=false}if(a.type==="PATCH"&&k){a.xhr=function(){return new ActiveXObject("Microsoft.XMLHTTP")}}var h=s.xhr=e.ajax(i.extend(a,s));r.trigger("request",r,h,s);return h};var k=typeof window!=="undefined"&&!!window.ActiveXObject&&!(window.XMLHttpRequest&&(new XMLHttpRequest).dispatchEvent);var T={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};e.ajax=function(){return e.$.ajax.apply(e.$,arguments)};var $=e.Router=function(t){t||(t={});if(t.routes)this.routes=t.routes;this._bindRoutes();this.initialize.apply(this,arguments)};var S=/\((.*?)\)/g;var H=/(\(\?)?:\w+/g;var A=/\*\w+/g;var I=/[\-{}\[\]+?.,\\\^$|#\s]/g;i.extend($.prototype,u,{initialize:function(){},route:function(t,r,s){if(!i.isRegExp(t))t=this._routeToRegExp(t);if(i.isFunction(r)){s=r;r=""}if(!s)s=this[r];var n=this;e.history.route(t,function(i){var a=n._extractParameters(t,i);n.execute(s,a);n.trigger.apply(n,["route:"+r].concat(a));n.trigger("route",r,a);e.history.trigger("route",n,r,a)});return this},execute:function(t,e){if(t)t.apply(this,e)},navigate:function(t,i){e.history.navigate(t,i);return this},_bindRoutes:function(){if(!this.routes)return;this.routes=i.result(this,"routes");var t,e=i.keys(this.routes);while((t=e.pop())!=null){this.route(t,this.routes[t])}},_routeToRegExp:function(t){t=t.replace(I,"\\$&").replace(S,"(?:$1)?").replace(H,function(t,e){return e?t:"([^/?]+)"}).replace(A,"([^?]*?)");return new RegExp("^"+t+"(?:\\?([\\s\\S]*))?$")},_extractParameters:function(t,e){var r=t.exec(e).slice(1);return i.map(r,function(t,e){if(e===r.length-1)return t||null;return t?decodeURIComponent(t):null})}});var N=e.History=function(){this.handlers=[];i.bindAll(this,"checkUrl");if(typeof window!=="undefined"){this.location=window.location;this.history=window.history}};var R=/^[#\/]|\s+$/g;var O=/^\/+|\/+$/g;var P=/msie [\w.]+/;var C=/\/$/;var j=/#.*$/;N.started=false;i.extend(N.prototype,u,{interval:50,atRoot:function(){return this.location.pathname.replace(/[^\/]$/,"$&/")===this.root},getHash:function(t){var e=(t||this).location.href.match(/#(.*)$/);return e?e[1]:""},getFragment:function(t,e){if(t==null){if(this._hasPushState||!this._wantsHashChange||e){t=decodeURI(this.location.pathname+this.location.search);var i=this.root.replace(C,"");if(!t.indexOf(i))t=t.slice(i.length)}else{t=this.getHash()}}return t.replace(R,"")},start:function(t){if(N.started)throw new Error("Backbone.history has already been started");N.started=true;this.options=i.extend({root:"/"},this.options,t);this.root=this.options.root;this._wantsHashChange=this.options.hashChange!==false;this._wantsPushState=!!this.options.pushState;this._hasPushState=!!(this.options.pushState&&this.history&&this.history.pushState);var r=this.getFragment();var s=document.documentMode;var n=P.exec(navigator.userAgent.toLowerCase())&&(!s||s<=7);this.root=("/"+this.root+"/").replace(O,"/");if(n&&this._wantsHashChange){var a=e.$('<iframe src="javascript:0" tabindex="-1">');this.iframe=a.hide().appendTo("body")[0].contentWindow;this.navigate(r)}if(this._hasPushState){e.$(window).on("popstate",this.checkUrl)}else if(this._wantsHashChange&&"onhashchange"in window&&!n){e.$(window).on("hashchange",this.checkUrl)}else if(this._wantsHashChange){this._checkUrlInterval=setInterval(this.checkUrl,this.interval)}this.fragment=r;var o=this.location;if(this._wantsHashChange&&this._wantsPushState){if(!this._hasPushState&&!this.atRoot()){this.fragment=this.getFragment(null,true);this.location.replace(this.root+"#"+this.fragment);return true}else if(this._hasPushState&&this.atRoot()&&o.hash){this.fragment=this.getHash().replace(R,"");this.history.replaceState({},document.title,this.root+this.fragment)}}if(!this.options.silent)return this.loadUrl()},stop:function(){e.$(window).off("popstate",this.checkUrl).off("hashchange",this.checkUrl);if(this._checkUrlInterval)clearInterval(this._checkUrlInterval);N.started=false},route:function(t,e){this.handlers.unshift({route:t,callback:e})},checkUrl:function(t){var e=this.getFragment();if(e===this.fragment&&this.iframe){e=this.getFragment(this.getHash(this.iframe))}if(e===this.fragment)return false;if(this.iframe)this.navigate(e);this.loadUrl()},loadUrl:function(t){t=this.fragment=this.getFragment(t);return i.any(this.handlers,function(e){if(e.route.test(t)){e.callback(t);return true}})},navigate:function(t,e){if(!N.started)return false;if(!e||e===true)e={trigger:!!e};var i=this.root+(t=this.getFragment(t||""));t=t.replace(j,"");if(this.fragment===t)return;this.fragment=t;if(t===""&&i!=="/")i=i.slice(0,-1);if(this._hasPushState){this.history[e.replace?"replaceState":"pushState"]({},document.title,i)}else if(this._wantsHashChange){this._updateHash(this.location,t,e.replace);if(this.iframe&&t!==this.getFragment(this.getHash(this.iframe))){if(!e.replace)this.iframe.document.open().close();this._updateHash(this.iframe.location,t,e.replace)}}else{return this.location.assign(i)}if(e.trigger)return this.loadUrl(t)},_updateHash:function(t,e,i){if(i){var r=t.href.replace(/(javascript:|#).*$/,"");t.replace(r+"#"+e)}else{t.hash="#"+e}}});e.history=new N;var U=function(t,e){var r=this;var s;if(t&&i.has(t,"constructor")){s=t.constructor}else{s=function(){return r.apply(this,arguments)}}i.extend(s,r,e);var n=function(){this.constructor=s};n.prototype=r.prototype;s.prototype=new n;if(t)i.extend(s.prototype,t);s.__super__=r.prototype;return s};p.extend=g.extend=$.extend=w.extend=N.extend=U;var M=function(){throw new Error('A "url" property or function must be specified')};var q=function(t,e){var i=e.error;e.error=function(r){if(i)i(t,r,e);t.trigger("error",t,r,e)}};return e});
//# sourceMappingURL=backbone-min.map;
define('tmpl/main',[],function () { return function (__fest_context){var __fest_self=this,__fest_buf="",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html="",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file="",__fest_debug_line="",__fest_debug_block="",__fest_htmlchars=/[&<>"]/g,__fest_htmlchars_test=/[&<>"]/,__fest_short_tags = {"area":true,"base":true,"br":true,"col":true,"command":true,"embed":true,"hr":true,"img":true,"input":true,"keygen":true,"link":true,"meta":true,"param":true,"source":true,"wbr":true},__fest_element_stack = [],__fest_htmlhash={"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"},__fest_jschars=/[\\'"\/\n\r\t\b\f<>]/g,__fest_jschars_test=/[\\'"\/\n\r\t\b\f<>]/,__fest_jshash={"\"":"\\\"","\\":"\\\\","/":"\\/","\n":"\\n","\r":"\\r","\t":"\\t","\b":"\\b","\f":"\\f","'":"\\'","<":"\\u003C",">":"\\u003E"},___fest_log_error;if(typeof __fest_error === "undefined"){___fest_log_error = (typeof console !== "undefined" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+"\nin block \""+__fest_debug_block+"\" at line: "+__fest_debug_line+"\nfile: "+__fest_debug_file)}function __fest_replaceHTML(chr){return __fest_htmlhash[chr]}function __fest_replaceJS(chr){return __fest_jshash[chr]}function __fest_extend(dest, src){for(var i in src)if(src.hasOwnProperty(i))dest[i]=src[i];}function __fest_param(fn){fn.param=true;return fn}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]=="function"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}function __fest_escapeJS(s){if (typeof s==="string") {if (__fest_jschars_test.test(s))return s.replace(__fest_jschars,__fest_replaceJS);} else if (typeof s==="undefined")return "";return s;}function __fest_escapeHTML(s){if (typeof s==="string") {if (__fest_htmlchars_test.test(s))return s.replace(__fest_htmlchars,__fest_replaceHTML);} else if (typeof s==="undefined")return "";return s;}__fest_buf+=("<div class=\"wrap\"><div class=\"title\">SPACE RANGERS</div><a href=\"#game\" class=\"button_play\">Играть</a></div>");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk==="string") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}} ; });
define('api',[
    'jquery'
],function ($) {

    var ApiDfd,
        requestTimeout,
        sendUrl,
        sendMethod;

    var API = function (baseUrl) {
        this.baseUrl = baseUrl || '';
    }

    var _send = function (method, params) {
        params = params || {};
        $.ajax({
            type: method,
            url: sendUrl,
            data: params,
            dataType: 'json'
        }).done(function (data) {
            if (data.status === 100) {
                sendMethod = method;
            }
            else if (data.status === 200) {
                clearTimeout(requestTimeout);
                ApiDfd.resolve(data);
            }
            else {
                clearTimeout(requestTimeout);
                ApiDfd.reject(data);
            }
        }).fail(function () {
            clearTimeout(requestTimeout);
            ApiDfd.reject();
        });
    }

    API.prototype.send = function (method, url, params) {
        sendUrl = this.baseUrl + url;
        ApiDfd = new $.Deferred();
        _send(method, params);
        requestTimeout = setTimeout(_send, 2000);
        return ApiDfd.promise();
    }

    return API;
});
define('userSync',[
    'jquery',
	'backbone',
    'api'
], function($, Backbone, API) {

    var api = new API('/api/v1/auth/');

	return function(method, model, options) {

        if ((method === 'create') && !((model.has('email')) && (model.has('password')))) {
            method = 'update'
        }

        var methodMap = {
            'create': {
                send: function () {
                    return api.send('POST', 'signup', model.toJSON()).done(this.success).fail(this.error);
                },
                success: function (resp) {
                    if (resp.status == 200) {
                        model.clear();
                        model.trigger('signup:ok');
                    }
                    else if (resp.status == 500) {
                        model.trigger('signup:bad', resp.message);
                    }
                },
                error: function () {
                    model.trigger('signup:error');
                }
            },
            'read': {
                send: function () {
                    api.send('POST', 'signin', model.toJSON()).done(this.success).fail(this.error);
                },
                success: function (resp) {
                    alert(resp.status);
                    if (resp.status === 200) {
                        alert("entered")
                        model.set(resp);
                        model.trigger('login:ok');
                    }
                }
            },
            'update': {
                send: function () {
                    if (model.has('password')) {
                        api.send('POST', 'signin', model.toJSON()).done(this.success).fail(this.error);
                    }
                    else {
                        api.send('POST', 'logout', model.toJSON()).done(this.success).fail(this.error);
                    }
                },
                success: function (resp) {
                    if (model.has('password')) {
                        if (resp.status === 200) {
                            resp.isLogined = true;
                            model.set(resp);
                            model.unset('password');
                            model.trigger('login:ok');
                        }
                        else if (resp.status === 500) {
                            model.trigger('login:bad', resp.message);
                        }
                    }
                    else {
                        model.clear();
                        model.trigger('logout');
                    }
                },
                error: function () {
                    if (model.has('password')) {
                        model.trigger('login:error');
                        model.unset('password')
                    }
                    else {
                        model.trigger('logout:error');
                    }
                }
            }
        };
        return methodMap[method].send();
	};
});
define('models/user',[
    'jquery',
    'backbone',
    'userSync'
], function($, Backbone, userSync) {
  var UserModel = Backbone.Model.extend({
    initialize: function() {
      this.fetch();
    },
    sync: userSync,
    isLogined: function() {
      return (this.has('isLogined'));
    },
    logout: function() {
        this.save();
    },
    login: function (data) {
      console.log(data)
      this.set(data);
      this.save();
    },
    signup: function(data) {
        this.set(data);
        this.save();
    }
  });
  
  return new UserModel();

});































// define([
//   'jquery',
//   'backbone'
// ], function($, Backbone) {
//   var UserModel = Backbone.Model.extend({
//     url: '/api/v1/auth/signin',
//     initialize: function() {
//       this.fetch();
//     },
//     isLogined: function() {
//       return (this.get('login') !== undefined);
//     },
//     logout: function() {
//       var that = this;
//       $.ajax({
//         type: 'POST',
//         url: '/api/v1/auth/logout'
//       }).done(function() {
//         that.clear();
//         that.trigger('logout');
//       });
//     },
//     login: function (data) {
//       var that = this;
//       $.ajax({
//         url: this.url,
//         type: 'POST',
//         data: data,
//         dataType: 'json',
//         success: function(resp) {
//           if (resp.status === 200) {
//             console.log('resp', resp)
//             that.set(resp);
//             // that.fetch();
//             that.trigger('login:ok');
//           }
//           else if (resp.status === 403) {
//             that.trigger('login:bad');
//           }
//         },
//         error: function() {
//           that.trigger('login:error');
//         }
//       });
//     },
//     signup: function(data) {
//       var that = this;
//       $.ajax({
//         url: '/api/v1/auth/signup',
//         type: 'POST',
//         data: data,
//         dataType: 'json',
//         success: function(resp) {
//           if (resp.status == 200) {
//             that.set(resp);
//             that.trigger('signup:ok');
//           }
//           else if (resp.status == 404) {
//             that.trigger('signup:bad');
//           }
//         },
//         error: function() {
//           that.trigger('signup:error');
//         }
//       });
//     }
//   });

//   return new UserModel();

// });
define('views/home',[
  'jquery',
  'backbone',
  'tmpl/main',
  'models/user'
], function($, Backbone, tmpl, userModel) {

  var homeView = Backbone.View.extend({
    className: 'main-page',
    initialize: function() {
      this.render();
    },
    template: tmpl,
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    show: function() {
      this.trigger('show', this);
    }
  });

  return new homeView();

});

define('tmpl/game',[],function () { return function (__fest_context){var __fest_self=this,__fest_buf="",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html="",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file="",__fest_debug_line="",__fest_debug_block="",__fest_htmlchars=/[&<>"]/g,__fest_htmlchars_test=/[&<>"]/,__fest_short_tags = {"area":true,"base":true,"br":true,"col":true,"command":true,"embed":true,"hr":true,"img":true,"input":true,"keygen":true,"link":true,"meta":true,"param":true,"source":true,"wbr":true},__fest_element_stack = [],__fest_htmlhash={"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"},__fest_jschars=/[\\'"\/\n\r\t\b\f<>]/g,__fest_jschars_test=/[\\'"\/\n\r\t\b\f<>]/,__fest_jshash={"\"":"\\\"","\\":"\\\\","/":"\\/","\n":"\\n","\r":"\\r","\t":"\\t","\b":"\\b","\f":"\\f","'":"\\'","<":"\\u003C",">":"\\u003E"},___fest_log_error;if(typeof __fest_error === "undefined"){___fest_log_error = (typeof console !== "undefined" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+"\nin block \""+__fest_debug_block+"\" at line: "+__fest_debug_line+"\nfile: "+__fest_debug_file)}function __fest_replaceHTML(chr){return __fest_htmlhash[chr]}function __fest_replaceJS(chr){return __fest_jshash[chr]}function __fest_extend(dest, src){for(var i in src)if(src.hasOwnProperty(i))dest[i]=src[i];}function __fest_param(fn){fn.param=true;return fn}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]=="function"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}function __fest_escapeJS(s){if (typeof s==="string") {if (__fest_jschars_test.test(s))return s.replace(__fest_jschars,__fest_replaceJS);} else if (typeof s==="undefined")return "";return s;}function __fest_escapeHTML(s){if (typeof s==="string") {if (__fest_htmlchars_test.test(s))return s.replace(__fest_htmlchars,__fest_replaceHTML);} else if (typeof s==="undefined")return "";return s;}__fest_buf+=("<div id=\"cursor\" style=\"visibility:hidden;\"></div>");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk==="string") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}} ; });
define('models/sun',[
  'backbone',
  'models/ship'
], function (Backbone, shipModel) {

  var SunModel = Backbone.Model.extend({
    initialize: function () {
      // this.listenTo(shipModel, 'move:start', this.startMove);
    },
    startMove: function (coords) {
      this.set(coords);
    },
    setCenter: function (coords) {
      this.center = coords;
      this.position = coords;
    },
    getPosition: function () {
      return this.position;
    },
    changeX: function (newX) {
      this.position.x += newX;
    },
    changeY: function (newY) {
      this.position.y += newY;
    }
  });

  return new SunModel();
});
define('models/ship',[
    'backbone',
    'models/user',
    'models/sun'
], function (Backbone, userModel, SunModel) {
    var ShipModel = Backbone.Model.extend({
        initialize: function () {
            this.on('change', this.sendData, this);
            this.coords = new Object();
        },
        sendData: function () {
            var coords = this.get('coords'); //
            var sunCoords = SunModel.getPosition();
            
            if (coords && sunCoords) {
                var xDistance = coords.x - sunCoords.x;
                var yDistance = coords.y - sunCoords.y;
                var curCoordsX = xDistance + this.get('x');
                var curCoordsY = yDistance + this.get('y');
                // console.log('sendData coords', coords.x, coords.y, ' -- ', sunCoords.x, sunCoords.y, ' -- ', xDistance, yDistance, ' -- ', this.get('x'), this.get('y'), ' -- ', curCoordsX, curCoordsY);
                // TODO: Передавать текущие координаты, а не только то, куда полететь хочет
                if (coords.x != undefined && coords.y != undefined) {
                    var request = {
                        type: 'updateCoords',
                        x: xDistance,
                        y: yDistance,
                        curX: curCoordsX,
                        curY: curCoordsY,
                        sessionId: userModel.get("sessionId")
                    }
                    try {
                    this.get('connection').send(JSON.stringify(request));
                } catch(e) {}
                }
            }
        },
        setCenter: function (coords) {
            this.center = coords;
        },
        getCenter: function () {
            return this.center;
        },
        setClickCoords: function (coords) {
            var dx = this.center.x - coords.x,
                dy = this.center.y - coords.y;

            if(this._previousAttributes.x == dx && this._previousAttributes.x != null) {
                dx += 1;
            } else if(this._previousAttributes.y == dy && this._previousAttributes.y != null) {
                dy += 1;
            }

            this.set({type: 'move', x: dx, y: dy, coords: coords});
            SunModel.startMove({x: dx, y: dy});
            this.trigger('move:start', {x: dx, y: dy}); 
            this._previousAttributes.y = dy;
            this._previousAttributes.x = dx;

            
        },
        setSunPos: function (centerPos) {
            this.sunPos.x = centerPos.x + 55; // TODO: допилить на рандом
            this.sunPos.y = centerPos.y + 55;
        },
        getSunPos: function () {
            return this.sunPos;
        }
    });

    return new ShipModel();
});
define('models/base',[
  'backbone',
  'models/ship'
], function (Backbone, shipModel) {

  var BaseModel = Backbone.Model.extend({
    initialize: function () {
      this.listenTo(shipModel, 'move:start', this.startMove);
    },
    startMove: function (coords) {
      console.log('startMove Base', coords)
      this.set(coords);
    },
    setCenter: function (coords) {
      this.center = coords;
      this.position = coords;
    },
    getPosition: function () {
      return this.position;
    },
    changeX: function (newX) {
      this.position.x += newX;
    },
    changeY: function (newY) {
      this.position.y += newY;
    }
  });

  return new BaseModel();
});
define('models/enemy',[
	'backbone',
	'models/ship',
	'models/sun'
], function(Backbone, shipModel, SunModel) {
	var EnemyModel = Backbone.Model.extend({
		defaults: {
			inGame: false
		},
		initialize: function() {
			this.login = '';
			this.health = 100; //�������� �� ���������
			this.x = 0; //�� ����� ���������� ������������
			this.y = 0;
			this.position = new Object(); //������� ������� ������������ ������, �� ��� � �������� �������
			this.position.x = 0;
			this.position.y = 0;
			this.listenTo(shipModel, 'move:start', this.palyerMoved);
			// this.listenTo(EnemyView, 'move:start', this.palyerMoved);
			// this.listenTo(EnemyView, 'move:done', this.palyerMoved);
			this.inGame = false;
			this.palyerIsMoved = false;
			this.setNewPosition = false;
			this.ownDeltha = new Object(); //����������, �� ������� ���� ������������� ����� �� ����������� ������������ (������ � �������)
			this.ownDeltha.x = 0;
			this.ownDeltha.y = 0;

			this.palyerDeltha = new Object(); //����������, �� ������� ���������� ����������� �������, �������������� �������������
			this.palyerDeltha.x = 0;
			this.palyerDeltha.y = 0;

			this.marked = false;
		},
		palyerMoved: function(coords) {
			//coords - �� ������� ����������� �������
			// this.set(coords);
			console.log('palyerMoved')
			this.palyerDeltha.x = coords.x;
			this.palyerDeltha.y = coords.y;
			this.trigger('enemyMove:start');
		},
		getPosition: function() {
			return this.position;
		},
		setPosition: function (coords) {
			this.position.x = coords.x;
			this.position.y = coords.y;
		},
		initCoords: function(coords) {
			// this.set(coords);
			var newPositions = new Object();
			newPositions.x = coords.x - this.position.x - this.x;
			newPositions.y = coords.y - this.position.y - this.y;
			newPositions.inGame = true;
			this.set(newPositions);
			this.trigger('updateView');
		},
		attacked: function(data){
			this.health = data.newHealth;
			if (this.health == 0){
				this.inGame = false;
			}
			this.trigger('updateView');
		},
		setCoords: function(coords) {
			// this.position = coords;
			this.setNewPosition = true;
			var newPositions = new Object();
			newPositions.x = coords.x - this.position.x;
			newPositions.y = coords.y - this.position.y;
			var delthaMovedX = coords.x - coords.prevX;
			var delthaMovedY = coords.y - coords.prevY;
			var sunCoords = SunModel.getPosition();
			newPositions.x = delthaMovedX;
			newPositions.y = delthaMovedY;
			if (!this.inGame) {
				newPositions.inGame = true;
				this.inGame = true;
			}
			this.ownDeltha.x = newPositions.x;
			this.ownDeltha.y = newPositions.y;
			// this.set(newPositions);
			this.trigger('enemyMove:start');
			//��� ��������� ������� �� model change � ������� ���� ���������� ����� ���������
			this.setNewPosition = false;
		},
		changeX: function(newX) {
			if (Math.abs(this.ownDeltha.x) > 2)
				this.ownDeltha.x -= newX;
			if (Math.abs(this.palyerDeltha.x) > 2)
				this.palyerDeltha.x -= newX;
			this.position.x += newX;
		},
		changeY: function(newY) {
			if (Math.abs(this.ownDeltha.y) > 2)
				this.ownDeltha.y -= newY;
			if (Math.abs(this.palyerDeltha.y) > 2)
				this.palyerDeltha.y -= newY;
			this.position.y += newY;
		},
		markThisShip: function() {
			this.marked = true;
			this.trigger('updateView');
		},
	});

	return EnemyModel;
});
define('resources',[], function () {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }

    function _load(url) {
        if(resourceCache[url]) {
            return resourceCache[url];
        }
        else {
            var img = new Image();
            img.onload = function() {
                resourceCache[url] = img;

                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };
            resourceCache[url] = false;
            img.src = url;
        }
    }

    function get(url) {
        return resourceCache[url];
    }

    function isReady() {
        var ready = true;
        for (var k in resourceCache) {
        // for (var k = 0; k < resourceCache.length; k++) {
            if(resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    function onReady(func) {
        readyCallbacks.push(func);
    }

    return { 
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
});
define('collections/otherShips',[
  'jquery',
  'backbone',
  'models/enemy'
], function($, Backbone, EnemyModel){
//FUCK!!! I dont know what to do with this stupid collections(((((
  var OtherShipsCollection = Backbone.Collection.extend({
    model: EnemyModel,
    url: '/api/v1/score',

    sync: function(method, model, options){
    	console.log('collection sync', method, model, options);
    	options.success(model);
    }
  });

  return new OtherShipsCollection();
});

define('views/ship',[
    'jquery',
    'backbone',
    'resources',
    'models/user',
    'models/ship',
    'models/sun',
    'collections/otherShips',
], function($, Backbone, resources, userModel, shipModel, SunModel, OtherShipsCollection) {
    var ShipView = Backbone.View.extend({
        tagName: 'canvas',
        id: 'ship',
        className: 'ship',
        model: shipModel,
        initialize: function() {

            $(document).bind('keyup', _.bind(this.keyUp, this));
            $(document).bind('keydown', _.bind(this.keyDown, this));
            $(document).bind('keypress', _.bind(this.keyPress, this));

            $(window).bind("keydown", function(e) {
                if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                    e.preventDefault();
                }
            });

            this.ctx = this.el.getContext('2d');
            resources.load(['/images/ship.gif']);
            this.el.width = $('body').width();
            this.el.height = $('body').height();
            this.model.setCenter({
                x: this.el.width / 2,
                y: this.el.height / 2
            });
            this.shipPos = {
                x: this.el.width / 2 - 35,
                y: this.el.height / 2 - 35
            };
            this.angle = 0; //����, �� ������� ��������
            this.inMove = false;
            this.loaded = false;

            this.movements = {
                top: false,
                left: false,
                right: false,
                bottom: false
            }
            this.disKoef = 100;

            this.selectedEnemyLogin = false;
            this.shot = {
                x: 0, //������� ����������
                y: 0,
                targetX: 0, //�������� ����������
                targetY: 0,
                xSpeed: 0, //��������
                ySpeed: 0,
                gunRadius: 0, //������ �������� ������. ���� ���� ����� ������, �� �� ��������� ��
                interval: null, //��������� ��� ��������
                init: function(targetX, targetY, gunRadius) {
                    clearInterval(this.interval);
                    var shipHalthSize = 100 / 2; //�������� �������
                    this.x = 0;
                    this.y = 0;
                    this.targetX = targetX + shipHalthSize;
this.targetY = targetY + shipHalthSize;
                    this.xSpeed = this.targetX / 3;
                    this.ySpeed = this.targetY / 3;
                    this.gunRadius = gunRadius;
                }
            }
        },
        events: {
            'click': 'clickHandler',
            'mousemove': 'mousemove',
            'mouseup' : 'mouseUpHandler'
        },
        render: function() {
            var that = this;
            this.ctx = this.el.getContext('2d');
            this.ctx.clearRect(-that.el.width, -that.el.height, this.el.width * 2, this.el.height * 2);
            resources.onReady(function() {
                if (!that.loaded) {
                    that.image = resources.get('/images/ship.gif');
                    that.ctx.translate(that.el.width / 2, that.el.height / 2);
                    that.ctx.drawImage(that.image, -35, -35, 70, 70);
                    that.loaded = true;
                }
            });
            this.ctx.save();
            this.ctx.rotate(this.angle);
            if (that.loaded) {
                this.ctx.drawImage(that.image, -35, -35, 70, 70);
            }
            console.log('render this.selectedEnemyLogin', this.selectedEnemyLogin)
            if (this.selectedEnemyLogin != false) {
                var centerX = 0;
                var centerY = 0;
                for (var i = 1; i <= 5; i++) {
                    var weapon = userModel.get('w' + i);
                    if (weapon.id != 0) {
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = "#00ff00";
                        this.ctx.arc(centerX, centerY, weapon.radius, 0, 2 * Math.PI, false);
                        this.ctx.stroke();
                    }
                }
            }
            this.ctx.restore();
            return this;
        },
        mouseUpHandler: function() {
            setTimeout(function() { 
                $('#cursor').css('visibility','hidden');
            }, 400);
        },
        clickHandler: function(event) {

            // $('.app').append('<div id="cursor"></div>');
            $('#cursor').css({'position':'absolute','visibility':'visible', 'z-index':'10000','width':'40px','height':'40px','background':'transparent url(/images/cursors/move_space_click.gif) 0 0 no-repeat'});
            var cursorOffset = {
                left : 22, 
                top  : 22
            }
            $('.app').on("click", function (e) {
                $('#cursor').offset({ 
                    left: (e.pageX - cursorOffset.left),
                    top : (e.pageY - cursorOffset.top)
                })

            });

            //�������� �� ������� ������� ��� ������
            var modelCenter = this.model.getCenter();
            var isMoveEvent = true;
            var that = this;
            OtherShipsCollection.each(function(enemy) {
                var enemyPosition = enemy.getPosition();
                var dxClick = enemyPosition.x - (event.pageX - modelCenter.x) + 25;
                var dyClick = enemyPosition.y - (event.pageY - modelCenter.y) + 25;
                // var dx = enemyPosition.x - modelCenter.x - event.pageX;

                if (Math.abs(dxClick) < 25 && Math.abs(dyClick) < 25) {
                    enemy.markThisShip();
                    that.selectedEnemyLogin = enemy.get('login');
                    isMoveEvent = false;
                    that.render();
                }
            });

            if (isMoveEvent) {
                this.move(event);
            }
        },
        move: function(event) {
            this.model.setClickCoords({
                x: event.pageX,
                y: event.pageY
            });

            this.rotate(event);
            this.inMove = true;
        },
        moveDone: function() {
            this.inMove = false;
        },
        mousemove: function(event) {
            return;
            // if (!(this.inMove) && this.loaded) {
            //     var ctx = this.ctx;
            //     ctx.clearRect(-35, -35, 70, 70);
            //     ctx.save();
            //     this.angle = Math.atan2(event.pageY - this.el.height / 2, event.pageX - this.el.width / 2) + Math.PI / 2;
            //     ctx.rotate(this.angle);
            //     ctx.drawImage(this.image, -35, -35, 70, 70);
            //     ctx.restore();
            // }
        },
        rotate: function(event) {
            this.ctx.clearRect(-35, -35, 70, 70);
            this.ctx.save();
            var newAngle = Math.atan2(event.pageY - this.el.height / 2, event.pageX - this.el.width / 2) + Math.PI / 2;
            this.ctx.rotate(newAngle);
            this.angle = 0;
            // this.ctx.drawImage(this.image, -35, -35, 70, 70);
            this.render();
            this.angle = newAngle;
            this.ctx.restore();
        },
        keyUp: function(event) {
            if (event.keyCode == 87 || event.keyCode == 38) {
                this.movements.top = false;
            } else if (event.keyCode == 83 || event.keyCode == 40) {
                this.movements.bottom = false;
            } else if (event.keyCode == 68 || event.keyCode == 39) {
                this.movements.left = false;
            } else if (event.keyCode == 65 || event.keyCode == 37) {
                this.movements.right = false;
            }
        },
        keyDown: function(event) {

            var pageX = 1,
                pageY = 1;
            var handleEvent = false; //������������� ������ ��� ���? ��� ����� ������� ����� � �������
            if (event.keyCode == 87 || event.keyCode == 38) {
                this.movements.top = true;
                pageY = this.model.center.y - this.disKoef;
                pageX = this.model.center.x - pageX;
                handleEvent = true;
            } else if (event.keyCode == 83 || event.keyCode == 40) {
                this.movements.bottom = true;
                pageY = shipModel.center.y + this.disKoef;
                pageX = shipModel.center.x - pageX;
                handleEvent = true;
            } else if (event.keyCode == 68 || event.keyCode == 39) {
                this.movements.left = true;
                pageY = shipModel.center.y + pageY;
                pageX = shipModel.center.x + this.disKoef;
                handleEvent = true;
            } else if (event.keyCode == 65 || event.keyCode == 37) {
                this.movements.right = true;
                pageY = shipModel.center.y + pageY;
                pageX = shipModel.center.x - this.disKoef;
                handleEvent = true;
            }
            if (handleEvent) {
                var ev = new Object();
                ev.pageY = pageY;
                ev.pageX = pageX;
                this.move(ev);
                this.inMove = false;
            }
        },
        keyPress: function(event) {
            //��������
            if ([49, 50, 51, 52, 53].indexOf(event.keyCode) > -1) {
                if (this.selectedEnemyLogin != '') {
                    var gunId = event.keyCode - 48;
                    this.doFire(gunId);
                }

            }
        },
        doFire: function(gunId) { //������� �������, id - ����� �����
            var weapon = userModel.get('w' + gunId);
            var that = this;
            if (weapon.id != 0) {
                var curEnemy = OtherShipsCollection.where({
                    login: this.selectedEnemyLogin
                })
                enemy = curEnemy[0];
                var enemyPosition = enemy.getPosition();

                var distance = Math.sqrt(Math.pow(enemyPosition.x, 2) + Math.pow(enemyPosition.y, 2));
                if (distance < weapon.radius) {
                    //������ ����
                    this.shot.init(enemyPosition.x, enemyPosition.y, weapon.radius);
                    this.shot.interval = setInterval(function() {
                        that.animateShot();
                    }, 5);
                    //�������� ������ � ��������
                    var connection = this.model.get('connection');
                    connection.send(JSON.stringify({
                        type: "fireToEnemy",
                        victimLogin: this.selectedEnemyLogin,
                        gunId: gunId,
                        sessionId: userModel.get("sessionId")
                    }));
                }
            }
        },
        enemyDied: function() {
            this.selectedEnemyLogin = false;
            this.render();
        },
        animateShot: function() {
            this.render();
            this.ctx.beginPath();
            this.ctx.arc(this.shot.x, this.shot.y, 3, 0, 2 * Math.PI, false);
            this.ctx.fillStyle = 'red';
            this.ctx.fill();
            //
            if (Math.abs(this.shot.xSpeed) >= Math.abs(this.shot.ySpeed)) {
                this.shot.targetX -= this.shot.xSpeed / Math.abs(this.shot.xSpeed) * 7;
                this.shot.targetY -= this.shot.ySpeed / Math.abs(this.shot.ySpeed) * Math.abs(this.shot.ySpeed / this.shot.xSpeed) * 7;
                this.shot.x += this.shot.xSpeed / Math.abs(this.shot.xSpeed) * 7;
                this.shot.y += this.shot.ySpeed / Math.abs(this.shot.ySpeed) * Math.abs(this.shot.ySpeed / this.shot.xSpeed) * 7;
            } else {
                this.shot.y += this.shot.ySpeed / Math.abs(this.shot.ySpeed) * 7;
                this.shot.targetY -= this.shot.ySpeed / Math.abs(this.shot.ySpeed) * 7;
                this.shot.x += this.shot.xSpeed / Math.abs(this.shot.xSpeed) * Math.abs(this.shot.xSpeed / this.shot.ySpeed) * 7;
                this.shot.targetX -= this.shot.xSpeed / Math.abs(this.shot.xSpeed) * Math.abs(this.shot.xSpeed / this.shot.ySpeed) * 7;
            }
            //
            var absX = Math.abs(this.shot.targetX);
            var absY = Math.abs(this.shot.targetY);
            // console.log('absX, absY', absX, absY, this.shot.x, this.shot.gunRadius)
            if ((absX < 2 || absX > this.shot.gunRadius) && (absY < 2 || absY > this.shot.gunRadius)) {
                clearInterval(this.shot.interval);
                this.render();
            }
        }
    });

    return new ShipView();

});





// define([
//     'jquery',
//     'backbone',
//     'resources',
//     'models/user',
//     'models/ship',
//     'models/sun',
//     'collections/otherShips',
// ], function($, Backbone, resources, userModel, shipModel, SunModel, OtherShipsCollection) {
//     var ShipView = Backbone.View.extend({
//         tagName: 'canvas',
//         id: 'ship',
//         className: 'ship',
//         model: shipModel,
//         initialize: function() {
//             _.bindAll(this, 'mouseDownHandler', 'mouseUpHandler')

//             $(document).bind('keyup', _.bind(this.keyUp, this));
//             $(document).bind('keydown', _.bind(this.keyDown, this));
//             $(document).bind('keypress', _.bind(this.keyPress, this));

//             $(window).bind("keydown", function(e) {
//                 if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
//                     e.preventDefault();
//                 }
//             });

//             this.ctx = this.el.getContext('2d');
//             resources.load(['/images/ship.gif']);
//             this.el.width = $('body').width();
//             this.el.height = $('body').height();
//             this.model.setCenter({
//                 x: this.el.width / 2,
//                 y: this.el.height / 2
//             });
//             this.shipPos = {
//                 x: this.el.width / 2 - 35,
//                 y: this.el.height / 2 - 35
//             };
//             this.angle = 0; //����, �� ������� ��������
//             this.inMove = false;
//             this.loaded = false;

//             this.movements = {
//                 top: false,
//                 left: false,
//                 right: false,
//                 bottom: false
//             }
//             this.disKoef = 100;

//             this.selectedEnemyLogin = false;
//             this.shot = {
//                 x: 0, //������� ����������
//                 y: 0,
//                 targetX: 0, //�������� ����������
//                 targetY: 0,
//                 xSpeed: 0, //��������
//                 ySpeed: 0,
//                 gunRadius: 0, //������ �������� ������. ���� ���� ����� ������, �� �� ��������� ��
//                 interval: null, //��������� ��� ��������
//                 init: function(targetX, targetY, gunRadius) {
//                     clearInterval(this.interval);
//                     var shipHalthSize = 100 / 2; //�������� �������
//                     this.x = 0;
//                     this.y = 0;
//                     this.targetX = targetX + shipHalthSize;
//                     this.targetY = targetY + shipHalthSize;
//                     this.xSpeed = this.targetX / 3;
//                     this.ySpeed = this.targetY / 3;
//                     this.gunRadius = gunRadius;
//                 }
//             }
//         },
//         events: {
//             'click': 'clickHandler',
//             'mousemove': 'mousemove',
//             'mousedown' : 'mouseDownHandler',
//             'mouseup' : 'mouseUpHandler'
//         },
//         render: function() {
//             var that = this;
//             this.ctx = this.el.getContext('2d');
//             this.ctx.clearRect(-that.el.width, -that.el.height, this.el.width * 2, this.el.height * 2);
//             resources.onReady(function() {
//                 if (!that.loaded) {
//                     that.image = resources.get('/images/ship.gif');
//                     that.ctx.translate(that.el.width / 2, that.el.height / 2);
//                     that.ctx.drawImage(that.image, -35, -35, 70, 70);
//                     that.loaded = true;
//                 }
//             });
//             this.ctx.save();
//             this.ctx.rotate(this.angle);
//             if (that.loaded) {
//                 this.ctx.drawImage(that.image, -35, -35, 70, 70);
//             }

//             if (this.selectedEnemyLogin != false) {
//                 var centerX = 0;
//                 var centerY = 0;
//                 for (var i = 1; i <= 5; i++) {
//                     var weapon = userModel.get('w' + i);
//                     if (weapon.id != 0) {
//                         this.ctx.beginPath();
//                         this.ctx.strokeStyle = "#00ff00";
//                         this.ctx.arc(centerX, centerY, weapon.radius, 0, 2 * Math.PI, false);
//                         this.ctx.stroke();
//                     }
//                 }
//             }
//             this.ctx.restore();

//             this.$comeCursor = $('<div />');
//             this.$comeCursor.css({
//                 'position':'absolute', 
//                 'zIndex':'10000',
//                 'width':'40px',
//                 'height':'40px',
//                 'background':'transparent url(/images/cursors/move_space_click.gif) 0 0 no-repeat',
//                 visibility: 'hidden'
//             });

//             $('#game').append(this.$comeCursor);
//             console.log(this.$comeCursor);

//             return this;
//         },
//         mouseDownHandler: function(e) {

//                 var cursorOffset = {
//                    left : 22, 
//                    top  : 22
//                 }
//                 this.$comeCursor.css({ 
//                     left: (e.pageX - cursorOffset.left) + 'px',
//                     top : (e.pageY - cursorOffset.top) + 'px',
//                     visibility: 'visible'
//                 });
            
//         },
//         mouseUpHandler: function() {
//             var _that = this;
//             setTimeout(function() { 
//                 _that.$comeCursor.css({ 
//                     visibility: 'hidden'
//                 });
//             }, 1000);
//         },
//         clickHandler: function(event) {
//             //�������� �� ������� ������� ��� ������
//             var modelCenter = this.model.getCenter();
//             var isMoveEvent = true;
//             var that = this;
//             OtherShipsCollection.each(function(enemy) {
//                 var enemyPosition = enemy.getPosition();
//                 var dxClick = enemyPosition.x - (event.pageX - modelCenter.x) + 25;
//                 var dyClick = enemyPosition.y - (event.pageY - modelCenter.y) + 25;
//                 // var dx = enemyPosition.x - modelCenter.x - event.pageX;

//                 if (Math.abs(dxClick) < 25 && Math.abs(dyClick) < 25) {
//                     enemy.markThisShip();
//                     that.selectedEnemyLogin = enemy.get('login');
//                     isMoveEvent = false;
//                     that.render();
//                 }
//             });

//             if (isMoveEvent) {
//                 this.move(event);
//             }
//         },
//         move: function(event) {
//             this.model.setClickCoords({
//                 x: event.pageX,
//                 y: event.pageY
//             });

//             this.rotate(event);
//             this.inMove = true;
//         },
//         moveDone: function() {
//             this.inMove = false;
//         },
//         mousemove: function(event) {
//             return;
//             // if (!(this.inMove) && this.loaded) {
//             //     var ctx = this.ctx;
//             //     ctx.clearRect(-35, -35, 70, 70);
//             //     ctx.save();
//             //     this.angle = Math.atan2(event.pageY - this.el.height / 2, event.pageX - this.el.width / 2) + Math.PI / 2;
//             //     ctx.rotate(this.angle);
//             //     ctx.drawImage(this.image, -35, -35, 70, 70);
//             //     ctx.restore();
//             // }
//         },
//         rotate: function(event) {
//             this.ctx.clearRect(-35, -35, 70, 70);
//             this.ctx.save();
//             var newAngle = Math.atan2(event.pageY - this.el.height / 2, event.pageX - this.el.width / 2) + Math.PI / 2;
//             this.ctx.rotate(newAngle);
//             this.angle = 0;
//             // this.ctx.drawImage(this.image, -35, -35, 70, 70);
//             this.render();
//             this.angle = newAngle;
//             this.ctx.restore();
//         },
//         keyUp: function(event) {
//             if (event.keyCode == 87 || event.keyCode == 38) {
//                 this.movements.top = false;
//             } else if (event.keyCode == 83 || event.keyCode == 40) {
//                 this.movements.bottom = false;
//             } else if (event.keyCode == 68 || event.keyCode == 39) {
//                 this.movements.left = false;
//             } else if (event.keyCode == 65 || event.keyCode == 37) {
//                 this.movements.right = false;
//             }
//         },
//         keyDown: function(event) {

//             var pageX = 1,
//                 pageY = 1;
//             var handleEvent = false; //������������� ������ ��� ���? ��� ����� ������� ����� � �������
//             if (event.keyCode == 87 || event.keyCode == 38) {
//                 this.movements.top = true;
//                 pageY = this.model.center.y - this.disKoef;
//                 pageX = this.model.center.x - pageX;
//                 handleEvent = true;
//             } else if (event.keyCode == 83 || event.keyCode == 40) {
//                 this.movements.bottom = true;
//                 pageY = shipModel.center.y + this.disKoef;
//                 pageX = shipModel.center.x - pageX;
//                 handleEvent = true;
//             } else if (event.keyCode == 68 || event.keyCode == 39) {
//                 this.movements.left = true;
//                 pageY = shipModel.center.y + pageY;
//                 pageX = shipModel.center.x + this.disKoef;
//                 handleEvent = true;
//             } else if (event.keyCode == 65 || event.keyCode == 37) {
//                 this.movements.right = true;
//                 pageY = shipModel.center.y + pageY;
//                 pageX = shipModel.center.x - this.disKoef;
//                 handleEvent = true;
//             }
//             if (handleEvent) {
//                 var ev = new Object();
//                 ev.pageY = pageY;
//                 ev.pageX = pageX;
//                 this.move(ev);
//                 this.inMove = false;
//             }
//         },
//         keyPress: function(event) {
//             //��������

//             if ([49, 50, 51, 52, 53].indexOf(event.keyCode) > -1) {
//                 if (this.selectedEnemyLogin != '') {
//                     var gunId = event.keyCode - 48;
//                     this.doFire(gunId);
//                 }

//             }
//         },
//         doFire: function(gunId) { //������� �������, id - ����� �����
//             var weapon = userModel.get('w' + gunId);
//             var that = this;
//             if (weapon.id != 0) {
//                 var curEnemy = OtherShipsCollection.where({
//                     login: this.selectedEnemyLogin
//                 })
//                 enemy = curEnemy[0];
//                 var enemyPosition = enemy.getPosition();

//                 var distance = Math.sqrt(Math.pow(enemyPosition.x, 2) + Math.pow(enemyPosition.y, 2));
//                 if (distance < weapon.radius) {
//                     //������ ����
//                     this.shot.init(enemyPosition.x, enemyPosition.y, weapon.radius);
//                     this.shot.interval = setInterval(function() {
//                         that.animateShot();
//                     }, 5);
//                     //�������� ������ � ��������
//                     var connection = this.model.get('connection');
//                     connection.send(JSON.stringify({
//                         type: "fireToEnemy",
//                         victimLogin: this.selectedEnemyLogin,
//                         gunId: gunId,
//                         sessionId: userModel.get("sessionId")
//                     }));
//                 }
//             }
//         },
//         enemyDied: function() {
//             this.selectedEnemyLogin = false;
//             this.render();
//         },
//         animateShot: function() {
//             this.render();
//             this.ctx.beginPath();
//             this.ctx.arc(this.shot.x, this.shot.y, 3, 0, 2 * Math.PI, false);
//             this.ctx.fillStyle = 'red';
//             this.ctx.fill();
//             //
//             if (Math.abs(this.shot.xSpeed) >= Math.abs(this.shot.ySpeed)) {
//                 this.shot.targetX -= this.shot.xSpeed / Math.abs(this.shot.xSpeed) * 7;
//                 this.shot.targetY -= this.shot.ySpeed / Math.abs(this.shot.ySpeed) * Math.abs(this.shot.ySpeed / this.shot.xSpeed) * 7;
//                 this.shot.x += this.shot.xSpeed / Math.abs(this.shot.xSpeed) * 7;
//                 this.shot.y += this.shot.ySpeed / Math.abs(this.shot.ySpeed) * Math.abs(this.shot.ySpeed / this.shot.xSpeed) * 7;
//             } else {
//                 this.shot.y += this.shot.ySpeed / Math.abs(this.shot.ySpeed) * 7;
//                 this.shot.targetY -= this.shot.ySpeed / Math.abs(this.shot.ySpeed) * 7;
//                 this.shot.x += this.shot.xSpeed / Math.abs(this.shot.xSpeed) * Math.abs(this.shot.xSpeed / this.shot.ySpeed) * 7;
//                 this.shot.targetX -= this.shot.xSpeed / Math.abs(this.shot.xSpeed) * Math.abs(this.shot.xSpeed / this.shot.ySpeed) * 7;
//             }
//             //
//             var absX = Math.abs(this.shot.targetX);
//             var absY = Math.abs(this.shot.targetY);
//             // console.log('absX, absY', absX, absY, this.shot.x, this.shot.gunRadius)
//             if ((absX < 2 || absX > this.shot.gunRadius) && (absY < 2 || absY > this.shot.gunRadius)) {
//                 clearInterval(this.shot.interval);
//                 this.render();
//             }
//         }
//     });

//     return new ShipView();

// });

define('models/stage',[
  'backbone',
  'models/ship'
], function (Backbone, shipModel) {

  var StageModel = Backbone.Model.extend({
    initialize: function () {
      this.listenTo(shipModel, 'move:start', this.move);
    },
    move: function (coords) {
      this.set(coords);
    },
    calculatePosition: function () {
      var x = this.get('x'),
          y = this.get('y');
      if (Math.abs(x) >= Math.abs(y)) {
          this.xpos -= x / Math.abs(x);
          this.ypos -= y / Math.abs(y) * Math.abs(y/x);
      }
      else {
          this.ypos -= y / Math.abs(y);
          this.xpos -= x / Math.abs(x) * Math.abs(x/y);
      }
    }
  });

  return new StageModel();

});
define('views/stage',[
    'jquery',
    'backbone',
    'resources',
    'views/ship',
    'models/ship',
    'models/stage'
], function ($, Backbone, resources, shipView, shipModel, stageModel) {
    var StageView = Backbone.View.extend({
        tagName: 'canvas',
        id: 'stage',
        className: 'stage',
        model: stageModel,
        initialize: function () {
            this.listenTo(stageModel, 'change', this.move);
            this.ctx = this.el.getContext('2d');
            resources.load(['/images/space1.jpg']);
        },
        render: function() {
            this.el.width = $('body').width();
            this.el.height = $('body').height();
            this.model.xpos = 1500 - (this.el.width / 2);
            this.model.ypos = 1500 - (this.el.height / 2);
            var that = this;
            resources.onReady(function () {
                try {
                    that.ctx.drawImage(resources.get('/images/space1.jpg'), that.model.xpos, that.model.ypos, that.el.width, that.el.height, 0, 0, that.el.width, that.el.height);
                } catch (e) {}
                
            });
            this.ctx.stroke();
            return this;
        },
        move: function (model) {
            this.trigger('move:start', {context: this, callback: this.motion, time: 40, name: 'move'});
        },
        motion: function () {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.drawImage(resources.get('/images/space1.jpg'), this.model.xpos, this.model.ypos, this.el.width, this.el.height, 0, 0, this.el.width, this.el.height);
            this.ctx.restore();
            this.model.calculatePosition();
        }
    });
    return new StageView();
});
define('views/enemy',[
    'backbone',
    'resources',
    'models/enemy'
], function(Backbone, resources, EnemyModel) {

    var EnemyView = Backbone.View.extend({
        tagName: 'canvas',
        className: 'enemy',
        id: 'ship',
        // model: EnemyModel,
        initialize: function() {
            this.inited = false;
            // this.listenTo(this.model, 'change', this.move);
            this.listenTo(this.model, 'enemyMove:start', this.move);
            this.listenTo(this.model, 'updateView', this.render);


            this.ctx = this.el.getContext('2d');
            // resources.load(['/images/ship2.png']);
            resources.load(['/images/ship2.png']);
            this.el.width = $('body').width();
            this.el.height = $('body').height();
            this.inMove = false;
            this.loaded = false;
            var that = this;
            resources.onReady(function() {
                that.loaded = true;
                that.image = resources.get('/images/ship2.png');
            })
        },
        render: function() {
            var that = this;
            this.ctx.strokeRect(10, 10, 70, 70);
            this.ctx.clearRect(-that.el.width / 2, -that.el.height / 2, this.el.width, this.el.height);
            if (!this.model.inGame && this.inited) {
                this.trigger('move:done', ['moveEnemy-' + this.model.get('login'), 'move']);
                return this;
            }

            if (this.inited) {
                if (this.haveOwnDelta) {
                    var newAngle = Math.atan2(this.targetX, this.targetY) + Math.PI / 4;
                    var tang = Math.tan(newAngle);
                    this.ctx.drawImage(this.image, this.model.getPosition().x, this.model.getPosition().y, 70, 70);
                } else {
                    this.ctx.drawImage(this.image, this.model.getPosition().x, this.model.getPosition().y, 70, 70);
                }
                if (this.model.marked) {
                    this.ctx.strokeRect(this.model.getPosition().x, this.model.getPosition().y, 70, 70);
                }
            } else {
                if (this.loaded) {
                    this.ctx.translate(this.el.width / 2, this.el.height / 2);
                    this.ctx.drawImage(this.image, this.model.getPosition().x, this.model.getPosition().y, 70, 70);
                    this.model.inGame = true;
                    this.inited = true;
                } else {
                    this.image = resources.get('/images/ship2.png');
                    if (this.image) {
                        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                        this.image = resources.get('/images/ship2.png');
                        this.ctx.translate(this.el.width / 2, this.el.height / 2);
                        this.ctx.drawImage(this.image, this.model.getPosition().x, this.model.getPosition().y, 70, 70);
                        this.model.inGame = true;
                        this.inited = true;
                    } else {
                        resources.onReady(function() {
                            if (!that.inited) {
                                that.ctx.clearRect(0, 0, that.ctx.canvas.width, that.ctx.canvas.height);
                                that.image = resources.get('/images/ship2.png');
                                that.ctx.translate(that.el.width / 2, that.el.height / 2);
                                that.ctx.drawImage(that.image, that.model.getPosition().x, that.model.getPosition().y, 70, 70);
                                that.inited = true;
                                that.model.inGame = true;
                                that.loaded = true;
                            }
                            
                        });
                    }

                }
            }
            return this;
        },

        move: function() {
            //������� �������� ������
            //��� ��� this.model.get('x') ��������������� � ������ �����������, �� �� �������� ��� ����, ����� ������� ���������� �����
            //palyerDeltha
            this.targetX = this.model.palyerDeltha.x
            this.targetY = this.model.palyerDeltha.y;
            this.haveOwnDelta = false;
            if (Math.abs(this.model.ownDeltha.x) > 2) {
                this.targetX += this.model.ownDeltha.x;
                this.haveOwnDelta = true;
            }
            if (Math.abs(this.model.ownDeltha.y) > 2) {
                this.targetY += this.model.ownDeltha.y;
                this.haveOwnDelta = true;
            }

            this.xSpeed = this.targetX;
            this.ySpeed = this.targetY;
            if (this.model.inGame) {
                this.trigger('move:start', {
                    context: this,
                    callback: this.motion,
                    time: 10,
                    name: 'moveEnemy-' + this.model.get('login')
                });
            }
        },
        rotate: function() {
            var ctx = this.ctx;
            // ctx.clearRect(-35, -35, 70, 70);
            ctx.save();
            var newAngle = Math.atan2(this.targetX, this.targetY) + Math.PI / 2;
            // this.angle -= 2;
            ctx.rotate(newAngle);
            // ctx.rotate(Math.PI / 4);
            // ctx.drawImage(this.image, -35, -35, 70, 70);
            // this.render();
            // ctx.restore();
        },
        motion: function() {
            if (!this.targetX || !this.targetY) {
                this.targetX = 0;
                this.targetY = 0;
                this.trigger('move:done', ['moveEnemy-' + this.model.get('login'), 'move']);
                return;
            }



            // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            // this.ctx.drawImage(this.image, this.model.getPosition().x, this.model.getPosition().y, 70, 70);
            // this.ctx.restore();
            if (Math.abs(this.xSpeed) >= Math.abs(this.ySpeed)) {
                this.targetX -= this.xSpeed / Math.abs(this.xSpeed) * 2;
                this.targetY -= this.ySpeed / Math.abs(this.ySpeed) * Math.abs(this.ySpeed / this.xSpeed) * 2;
                this.model.changeX(this.xSpeed / Math.abs(this.xSpeed) * 2);
                this.model.changeY(this.ySpeed / Math.abs(this.ySpeed) * Math.abs(this.ySpeed / this.xSpeed) * 2);
            } else {
                this.model.changeY(this.ySpeed / Math.abs(this.ySpeed) * 2);
                this.targetY -= this.ySpeed / Math.abs(this.ySpeed) * 2;
                this.model.changeX(this.xSpeed / Math.abs(this.xSpeed) * Math.abs(this.xSpeed / this.ySpeed) * 2);
                this.targetX -= this.xSpeed / Math.abs(this.xSpeed) * Math.abs(this.xSpeed / this.ySpeed) * 2;
            }
            if ((Math.abs(this.targetX) < 2) && (Math.abs(this.targetY) < 2)) {
                this.model.palyerDeltha.x = 0;
                this.model.palyerDeltha.y = 0;
                this.model.ownDeltha.x = 0;
                this.model.ownDeltha.y = 0;
                this.targetX = 0;
                this.targetY = 0;
                this.trigger('move:done', ['moveEnemy-' + this.model.get('login'), 'move']);
                // this.model.set({"inMove": false})
            }
                        this.render();
        }
    });

    return EnemyView;

});
define('views/sun',[
    'jquery',
    'backbone',
    'resources',
    'views/ship',
    'models/sun'
], function ($, Backbone, resources, shipView, sunModel) {
    var SunView = Backbone.View.extend({
        tagName: 'canvas',
        id: 'sun',
        className: 'sun',
        model: sunModel,
        initialize: function () {
            this.listenTo(this.model, 'change', this.move);
            this.ctx = this.el.getContext('2d');
            resources.load(['/images/sun.png']);
            this.el.width = $('body').width();
            this.el.height = $('body').height();
            this.model.setCenter({
                x: this.el.width / 2,
                y: this.el.height / 2
            });
            this.inMove = false;
            this.loaded = false;
        },
        render: function () {
            this.el.width = $('body').width();
            this.el.height = $('body').height();
            var that = this;
            resources.onReady(function () {
                that.ctx.drawImage(resources.get('/images/sun.png'), that.model.getPosition().x, that.model.getPosition().y, 320, 320);
            });
            this.ctx.stroke();
            return this;
        },
        move: function (model) {
            this.targetX = model.get('x');
            this.targetY = model.get('y');
            this.xSpeed = this.targetX;
            this.ySpeed = this.targetY;
            this.trigger('move:start', {context: this, callback: this.motion, time: 10, name: 'moveSun'});
        },
        motion: function () {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.drawImage(resources.get('/images/sun.png'), this.model.getPosition().x, this.model.getPosition().y, 320, 320);
            this.ctx.restore();
            if(this.ySpeed != 0 && this.xSpeed != 0){
                if (Math.abs(this.xSpeed) >= Math.abs(this.ySpeed)) {
                    this.targetX -= this.xSpeed / Math.abs(this.xSpeed) *2;
                    this.targetY -= this.ySpeed / Math.abs(this.ySpeed) * Math.abs(this.ySpeed/this.xSpeed)*2;
                    this.model.changeX(this.xSpeed / Math.abs(this.xSpeed) *2);
                    this.model.changeY(this.ySpeed / Math.abs(this.ySpeed) * Math.abs(this.ySpeed/this.xSpeed)*2);
                } else {
                    this.model.changeY(this.ySpeed / Math.abs(this.ySpeed)*2);
                    this.targetY -= this.ySpeed / Math.abs(this.ySpeed)*2;
                    this.model.changeX(this.xSpeed / Math.abs(this.xSpeed) * Math.abs(this.xSpeed/this.ySpeed)*2);
                    this.targetX -= this.xSpeed / Math.abs(this.xSpeed) * Math.abs(this.xSpeed/this.ySpeed)*2;
                }
            }
            if ((Math.abs(this.targetX) < 2) && (Math.abs(this.targetY) < 2)) {
                this.trigger('move:done', ['moveSun', 'move']);
            }
        }
    });

    return new SunView();
});

define('views/base',[
    'jquery',
    'backbone',
    'resources',
    'views/ship',
    'models/sun'
], function ($, Backbone, resources, shipView, sunModel) {
    var BaseView = Backbone.View.extend({
        tagName: 'canvas',
        id: 'sun',
        className: 'sun',
        model: sunModel,
        initialize: function () {
            this.listenTo(this.model, 'change', this.move);
            this.ctx = this.el.getContext('2d');
            resources.load(['/images/bases/RC.png']);
            this.el.width = $('body').width();
            this.el.height = $('body').height();
            this.model.setCenter({
                x: this.el.width / 2 + 100,
                y: this.el.height / 2 + 100
            });
            this.inMove = false;
            this.loaded = false;
        },
        render: function () {
            this.el.width = $('body').width();
            this.el.height = $('body').height();
            var that = this;
            resources.onReady(function () {
                that.ctx.drawImage(resources.get('/images/bases/RC.png'), that.model.getPosition().x, that.model.getPosition().y, 120, 120);
            });
            this.ctx.stroke();
            return this;
        },
        move: function (model) {
            console.log('base move')
            this.targetX = model.get('x');
            this.targetY = model.get('y');
            this.xSpeed = this.targetX;
            this.ySpeed = this.targetY;
            this.trigger('move:start', {context: this, callback: this.motion, time: 10, name: 'moveBase'});
        },
        motion: function () {
            console.log('base motion')
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.drawImage(resources.get('/images/bases/RC.png'), this.model.getPosition().x, this.model.getPosition().y, 120, 120);
            this.ctx.restore();
            if(this.ySpeed != 0 && this.xSpeed != 0){
                if (Math.abs(this.xSpeed) >= Math.abs(this.ySpeed)) {
                    this.targetX -= this.xSpeed / Math.abs(this.xSpeed) *2;
                    this.targetY -= this.ySpeed / Math.abs(this.ySpeed) * Math.abs(this.ySpeed/this.xSpeed)*2;
                    this.model.changeX(this.xSpeed / Math.abs(this.xSpeed) *2);
                    this.model.changeY(this.ySpeed / Math.abs(this.ySpeed) * Math.abs(this.ySpeed/this.xSpeed)*2);
                } else {
                    this.model.changeY(this.ySpeed / Math.abs(this.ySpeed)*2);
                    this.targetY -= this.ySpeed / Math.abs(this.ySpeed)*2;
                    this.model.changeX(this.xSpeed / Math.abs(this.xSpeed) * Math.abs(this.xSpeed/this.ySpeed)*2);
                    this.targetX -= this.xSpeed / Math.abs(this.xSpeed) * Math.abs(this.xSpeed/this.ySpeed)*2;
                }
            }
            if ((Math.abs(this.targetX) < 2) && (Math.abs(this.targetY) < 2)) {
                this.trigger('move:done', ['moveBase', 'move']);
            }
        }
    });

    return new BaseView();
});

define('socketsHandler',[
    'backbone'
], function(Backbone) {
    var SocketsHandler = Backbone.Model.extend({
        isOpened: false,
        inited: false,
        badRequests: 0,
        create: function() {
            //ws://game.sronline.ru:8000/api/v1/game - для сервака
            //ws://127.0.0.1:8000/api/v1/game - для локалки
            var connection = new WebSocket('ws://127.0.0.1:8000/api/v1/game');
            this.connection = connection;
            var that = this;

            connection.onopen = function() {
                that.opened();
            };

            connection.onclose = function(event) {
                that.closed(event);
            }

            connection.onmessage = function(event) {
                that.newMessageReceived(event);
            }

            connection.onerror = function(error) {
                console.log('connection error', error)
            };

        },
        opened: function() {
            if (!this.inited) {
                this.trigger('connection:opened', this.connection); 
                this.badRequests = 0;
            }
        },
        closed: function(event) {
            if (!event.wasClean) {
                console.log('Closed with errors', event)
            }
            if (this.badRequests < 3) {
                this.create();
            }
            this.badRequests++
        },
        newMessageReceived: function(event) {
            this.trigger('connection:newMessage', event); 
            // GameView.messageReceived(event);
        }

    });

    return new SocketsHandler();
});
define('motion',[
    'underscore',
    'backbone',
    'views/stage',
    'views/sun',
    'views/base',
    'views/enemy',
], function (_, Backbone, stageView, sunView, BaseView, EnemyView) {

    var MotionController = function () {
        this.intervals = {};
    }

    MotionController.prototype.newInterval =  function (params) {
        if (this.intervals[params.name] !== undefined) {
            clearInterval(this.intervals[params.name]);
        }
        this.intervals[params.name] = setInterval(function () {
            params.callback.call(params.context);
        }, params.time);
    };

    MotionController.prototype.delInterval = function (names) {
        if (names instanceof Array) {
            for (i = 0; i < names.length; i++) {
                clearInterval(this.intervals[names[i]]);
            }
        }
        else {
            clearInterval(this.intervals[names]);
        }
    }

    var motionController = new MotionController();

    _.extend(motionController, Backbone.Events);
    motionController.listenTo(stageView, 'move:done', motionController.delInterval);
    motionController.listenTo(stageView, 'move:start', motionController.newInterval);
    motionController.listenTo(sunView, 'move:done', motionController.delInterval);
    motionController.listenTo(sunView, 'move:start', motionController.newInterval);
    // motionController.listenTo(BaseView, 'move:done', motionController.delInterval);
    // motionController.listenTo(BaseView, 'move:start', motionController.newInterval);

    motionController.addViewListener = function(curView) {
        this.listenTo(curView, 'move:done', this.delInterval);
        this.listenTo(curView, 'move:start', this.newInterval);
    }

    return motionController;
});

define('views/game',[
  'backbone',
  'tmpl/game',
  'models/user',
  'models/ship',
  'models/sun',
  'models/base',
  'models/enemy',
  'views/stage',
  'views/ship',
  'views/enemy',
  'views/sun',
  'views/base',
  'collections/otherShips',
  'socketsHandler',
  'motion'
], function(Backbone, tmpl, userModel, ShipModel, SunModel, BaseModel, EnemyModel, stageView, shipView, EnemyView, sunView, BaseView, OtherShipsCollection, SocketsHandler, motionController) {
  var GameView = Backbone.View.extend({
    className: 'game',
    id: 'game',
    model: userModel,
    events: {
      'click': 'moveShip'
    },
    initialize: function() {
      this.render();
      // var that = this;
      // OtherShipsCollection.fetch();
      this.listenTo(SocketsHandler, 'connection:opened', this.connectionOpened);
      this.listenTo(SocketsHandler, 'connection:newMessage', this.messageReceived);

    },
    template: function() {
      return tmpl();
    },
    render: function() {
      this.$el.html(this.template());
      this.$el.append(stageView.render().$el);
      this.$el.append(sunView.render().$el);
      // this.$el.append(BaseView.render().$el);
      
      this.$el.append(shipView.render().$el);
      // this.$el.append(EnemyView.render().$el);
      return this;
    },
    show: function() {
      if (userModel.isLogined()) {
        this.createSocket();
        this.trigger('show', this);
        this.model.set('inGame', true);
      } else {
        userModel.trigger('login:bad');
      }
    },
    createSocket: function() {
      SocketsHandler.create();
    },
    connectionOpened: function(connection) {
      ShipModel.set({
        'connection': connection
      });
      // EnemyModel.set({
      //   'connection': connection
      // });
      connection.send(JSON.stringify({
        type: "giveOtherShipsCoords",
        sessionId: userModel.get("sessionId")
      }));
    },
    messageReceived: function(event) {
      var response = JSON.parse(event.data);
      console.log('response', response)
      switch (response.type) {
        case "otherShips":
          for (var k = 0; k < response.ships.length; k++) {
            var curShipData = response.ships[k];
            console.log('curShipData', curShipData)
            
            var existedModels = OtherShipsCollection.where({
              login: curShipData.login
            })
            var tmpModel;
            var exist = false;
            if (existedModels.length != 0) {
              tmpModel = existedModels[0];
              exist = true;
            } else {
              tmpModel = new EnemyModel({
                login: curShipData.login,
                health: curShipData.health
              });
            }

            console.log('exist', exist)
            var recountedCoords;
            if (!exist) {
              recountedCoords = this.calculateAbsoluteCoords({prevX: curShipData.x, prevY: curShipData.y});
            } else {
              recountedCoords = this.calculateAbsoluteCoords(curShipData);
            }
            
            tmpModel.setPosition(recountedCoords);
            tmpModel.initCoords({
              'x': (curShipData.prevX - 35),
              'y': (curShipData.prevY - 35)
            });

            if (!exist) {
              OtherShipsCollection.add(tmpModel);
              var tmpView = new EnemyView({
                model: tmpModel
              });
              this.$el.append(tmpView.render().$el);
              motionController.addViewListener(tmpView);
            }

          }

          break;
        case "coordsNotification":
          var existedModels = OtherShipsCollection.where({
            login: response.login
          })
          if (existedModels.length != 0) {
            var curModel = existedModels[0];
            var recountedCoords = this.calculateAbsoluteCoords(response);
            curModel.setPosition(recountedCoords);
            curModel.setCoords(response);
          }
          break;

        case "fireToEnemy":
          if (response.victim == userModel.get("login")) {
            if (response.newHealth == 0)
              alert("I have died")
          } else {
            var existedModels = OtherShipsCollection.where({
              login: response.victim
            })
            if (existedModels.length > 0)
              existedModels[0].attacked(response);
            if (response.newHealth == 0)
              shipView.enemyDied();
          }
      }
    },
    calculateAbsoluteCoords: function(coords) {
      //prevX � prevY - ������������ ������
      //enemy.position - ������������ ������ ������ (������� ������)
      var shipCoords = new Object();
      shipCoords.x = $('body').width() / 2;
      shipCoords.y = $('body').height() / 2;
      var sunCoords = SunModel.getPosition();
      var sunToCenterCoords = new Object();
      if (shipCoords && sunCoords) {
        sunToCenterCoords.x = (shipCoords.x - sunCoords.x);
        sunToCenterCoords.y = (shipCoords.y - sunCoords.y);
      } else {
        sunToCenterCoords.x = 0;
        sunToCenterCoords.y = 0;
      }
      var recountedCoords = new Object();
      recountedCoords.x = (coords.prevX - sunToCenterCoords.x - 35);
      recountedCoords.y = (coords.prevY - sunToCenterCoords.y - 35);
      return recountedCoords;
    }
  });

  return new GameView();
});
define('tmpl/login',[],function () { return function (__fest_context){var __fest_self=this,__fest_buf="",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html="",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file="",__fest_debug_line="",__fest_debug_block="",__fest_htmlchars=/[&<>"]/g,__fest_htmlchars_test=/[&<>"]/,__fest_short_tags = {"area":true,"base":true,"br":true,"col":true,"command":true,"embed":true,"hr":true,"img":true,"input":true,"keygen":true,"link":true,"meta":true,"param":true,"source":true,"wbr":true},__fest_element_stack = [],__fest_htmlhash={"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"},__fest_jschars=/[\\'"\/\n\r\t\b\f<>]/g,__fest_jschars_test=/[\\'"\/\n\r\t\b\f<>]/,__fest_jshash={"\"":"\\\"","\\":"\\\\","/":"\\/","\n":"\\n","\r":"\\r","\t":"\\t","\b":"\\b","\f":"\\f","'":"\\'","<":"\\u003C",">":"\\u003E"},___fest_log_error;if(typeof __fest_error === "undefined"){___fest_log_error = (typeof console !== "undefined" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+"\nin block \""+__fest_debug_block+"\" at line: "+__fest_debug_line+"\nfile: "+__fest_debug_file)}function __fest_replaceHTML(chr){return __fest_htmlhash[chr]}function __fest_replaceJS(chr){return __fest_jshash[chr]}function __fest_extend(dest, src){for(var i in src)if(src.hasOwnProperty(i))dest[i]=src[i];}function __fest_param(fn){fn.param=true;return fn}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]=="function"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}function __fest_escapeJS(s){if (typeof s==="string") {if (__fest_jschars_test.test(s))return s.replace(__fest_jschars,__fest_replaceJS);} else if (typeof s==="undefined")return "";return s;}function __fest_escapeHTML(s){if (typeof s==="string") {if (__fest_htmlchars_test.test(s))return s.replace(__fest_htmlchars,__fest_replaceHTML);} else if (typeof s==="undefined")return "";return s;}__fest_buf+=("<div class=\"wrap\"><div class=\"login__error\"><h3 id=\"error\"></h3></div><div class=\"form login-form\"><form action=\"\/api\/v1\/auth\/signin\" method=\"POST\" id=\"login-form\"><div><input type=\"text\" name=\"login\" class=\"form__input\" placeholder=\"Логин...\" required=\"\"/></div><div><input type=\"password\" name=\"password\" class=\"form__input\" placeholder=\"Пароль...\" required=\"\"/></div><button type=\"submit\" class=\"form__button\">Войти</button></form></div></div>");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk==="string") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}} ; });
define('views/login',[
  'jquery',
  'backbone',
  'tmpl/login',
  'models/user'
], function ($, Backbone, tmpl, userModel) {
  var LoginView = Backbone.View.extend({
    model: userModel,
    initialize: function() {
      this.listenTo(this.model, 'login:error', this.renderServerError);
      this.listenTo(this.model, 'login:bad', this.renderLoginError);
      this.render();
    },
    events: {
      'submit #login-form': 'login'
    },
    template: tmpl,
    render: function() {
      this.$el.html(this.template());
      this.$error = this.$el.find('#error');
      return this;
    },
    login: function(event) {
      event.preventDefault();
      var form = this.$el.find('#login-form');
      this.model.login({
        login: form.find('input[name=login]').val(),
        password: form.find('input[name=password]').val()
      });
    },
    renderServerError: function() {
      this.$error.text('Ошибка соединения с сервером');
    },
    renderLoginError: function() {
      this.$error.text('Неверный логин и/или пароль');
    },
    show: function () {
      this.trigger('show', this);
    }
  });

  return new LoginView();
});

define('tmpl/signup',[],function () { return function (__fest_context){var __fest_self=this,__fest_buf="",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html="",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file="",__fest_debug_line="",__fest_debug_block="",__fest_htmlchars=/[&<>"]/g,__fest_htmlchars_test=/[&<>"]/,__fest_short_tags = {"area":true,"base":true,"br":true,"col":true,"command":true,"embed":true,"hr":true,"img":true,"input":true,"keygen":true,"link":true,"meta":true,"param":true,"source":true,"wbr":true},__fest_element_stack = [],__fest_htmlhash={"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"},__fest_jschars=/[\\'"\/\n\r\t\b\f<>]/g,__fest_jschars_test=/[\\'"\/\n\r\t\b\f<>]/,__fest_jshash={"\"":"\\\"","\\":"\\\\","/":"\\/","\n":"\\n","\r":"\\r","\t":"\\t","\b":"\\b","\f":"\\f","'":"\\'","<":"\\u003C",">":"\\u003E"},___fest_log_error;if(typeof __fest_error === "undefined"){___fest_log_error = (typeof console !== "undefined" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+"\nin block \""+__fest_debug_block+"\" at line: "+__fest_debug_line+"\nfile: "+__fest_debug_file)}function __fest_replaceHTML(chr){return __fest_htmlhash[chr]}function __fest_replaceJS(chr){return __fest_jshash[chr]}function __fest_extend(dest, src){for(var i in src)if(src.hasOwnProperty(i))dest[i]=src[i];}function __fest_param(fn){fn.param=true;return fn}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]=="function"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}function __fest_escapeJS(s){if (typeof s==="string") {if (__fest_jschars_test.test(s))return s.replace(__fest_jschars,__fest_replaceJS);} else if (typeof s==="undefined")return "";return s;}function __fest_escapeHTML(s){if (typeof s==="string") {if (__fest_htmlchars_test.test(s))return s.replace(__fest_htmlchars,__fest_replaceHTML);} else if (typeof s==="undefined")return "";return s;}__fest_buf+=("<div class=\"wrap\"><div class=\"login__error\"><h3 id=\"error\"></h3></div><div class=\"form signup-form\"><form action=\"\/api\/v1\/auth\/signup\" method=\"POST\" id=\"signup-form\"><div><input type=\"text\" name=\"login\" class=\"form__input\" placeholder=\"Логин...\" required=\"\"/></div><div><input type=\"email\" name=\"email\" class=\"form__input\" placeholder=\"e-mail...\" required=\"\"/></div><div><input type=\"password\" name=\"password\" class=\"form__input\" placeholder=\"Пароль...\" required=\"\"/></div><button type=\"submit\" class=\"form__button\">Регистрация</button></form></div></div>");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk==="string") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}} ; });
define('views/signup',[
  'jquery',
  'backbone',
  'tmpl/signup',
  'models/user'
], function ($, Backbone, tmpl, userModel) {
  var SignupView = Backbone.View.extend({
    model: userModel,
    initialize: function() {
      this.listenTo(this.model, 'signup:bad', this.renderRegError);
      this.listenTo(this.model, 'signup:error', this.renderServerError);
      this.render();
    },
    events: {
      'submit #signup-form': 'signup'
    },
    template: tmpl,
    render: function() {
      this.$el.html(this.template());
      this.$error = this.$el.find('#error');
      return this;
    },
    signup: function (event) {
      event.preventDefault();
      var form = $('#signup-form');
      this.model.signup({
        login: form.find('input[name=login]').val(),
        email: form.find('input[name=email]').val(),
        password: form.find('input[name=password]').val(),
      });
    },
    renderError: function(msg) {
      this.$error.text(msg);
    },
    show: function () {
      this.trigger('show', this);
    },
    renderRegError: function () {
      this.$error.text('Пользователь с таким именем уже существует');
    },
    renderServerError: function () {
      this.$error.text('Ошибка соединения с сервером');
    }
  });

  return new SignupView();
});

define('models/score',[
  'jquery',
  'backbone'
], function($, Backbone) {

  var ScoreModel = Backbone.Model.extend({
    defaults: {
      login: 'Sample User',
      value: '100500'
    }
  });

  return ScoreModel;

});

define('collections/score',[
  'jquery',
  'backbone',
  'models/score'
], function($, Backbone, ScoreModel){

  var ScoreCollection = Backbone.Collection.extend({
    model: ScoreModel,
    url: '/api/v1/score'
  });

  return new ScoreCollection();
});

define('tmpl/scoreboard',[],function () { return function (__fest_context){var __fest_self=this,__fest_buf="",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html="",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file="",__fest_debug_line="",__fest_debug_block="",__fest_htmlchars=/[&<>"]/g,__fest_htmlchars_test=/[&<>"]/,__fest_short_tags = {"area":true,"base":true,"br":true,"col":true,"command":true,"embed":true,"hr":true,"img":true,"input":true,"keygen":true,"link":true,"meta":true,"param":true,"source":true,"wbr":true},__fest_element_stack = [],__fest_htmlhash={"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"},__fest_jschars=/[\\'"\/\n\r\t\b\f<>]/g,__fest_jschars_test=/[\\'"\/\n\r\t\b\f<>]/,__fest_jshash={"\"":"\\\"","\\":"\\\\","/":"\\/","\n":"\\n","\r":"\\r","\t":"\\t","\b":"\\b","\f":"\\f","'":"\\'","<":"\\u003C",">":"\\u003E"},___fest_log_error;if(typeof __fest_error === "undefined"){___fest_log_error = (typeof console !== "undefined" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+"\nin block \""+__fest_debug_block+"\" at line: "+__fest_debug_line+"\nfile: "+__fest_debug_file)}function __fest_replaceHTML(chr){return __fest_htmlhash[chr]}function __fest_replaceJS(chr){return __fest_jshash[chr]}function __fest_extend(dest, src){for(var i in src)if(src.hasOwnProperty(i))dest[i]=src[i];}function __fest_param(fn){fn.param=true;return fn}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]=="function"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}function __fest_escapeJS(s){if (typeof s==="string") {if (__fest_jschars_test.test(s))return s.replace(__fest_jschars,__fest_replaceJS);} else if (typeof s==="undefined")return "";return s;}function __fest_escapeHTML(s){if (typeof s==="string") {if (__fest_htmlchars_test.test(s))return s.replace(__fest_htmlchars,__fest_replaceHTML);} else if (typeof s==="undefined")return "";return s;}var scores=__fest_context;__fest_buf+=("<div class=\"wrap\"><div class=\"page__title\">Рейтинг юзеров</div>");var i,score,__fest_iterator0;try{__fest_iterator0=scores || {};}catch(e){__fest_iterator={};__fest_log_error(e.message);}for(i in __fest_iterator0){score=__fest_iterator0[i];__fest_buf+=("<div class=\"score\"><div class=\"score__login\">");try{__fest_buf+=(__fest_escapeHTML(score.login))}catch(e){__fest_log_error(e.message + "5");}__fest_buf+=("</div><div class=\"score__value\">");try{__fest_buf+=(__fest_escapeHTML(score.value))}catch(e){__fest_log_error(e.message + "6");}__fest_buf+=("</div></div>");}__fest_buf+=("</div>");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk==="string") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}} ; });
define('views/scoreboard',[
  'jquery',
  'backbone',
  'collections/score',
  'tmpl/scoreboard'
], function($, Backbone, scoreCollection, tmpl) {

  var ScoreboardView = Backbone.View.extend({
    tagName: 'div',
    collection: scoreCollection,
    initialize: function () {
      this.listenTo(this.collection, 'reset', this.insertInfo)
    },
    template: tmpl,
    render: function() {
      this.collection.fetch({reset: true});
      return this;
    },
    show: function () {
      this.trigger('show', this);
    },
    insertInfo: function () {
      this.$el.html(this.template(this.collection.toJSON()));
    }
  });

  return new ScoreboardView();
});

define('tmpl/createProfile',[],function () { return function (__fest_context){var __fest_self=this,__fest_buf="",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html="",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file="",__fest_debug_line="",__fest_debug_block="",__fest_htmlchars=/[&<>"]/g,__fest_htmlchars_test=/[&<>"]/,__fest_short_tags = {"area":true,"base":true,"br":true,"col":true,"command":true,"embed":true,"hr":true,"img":true,"input":true,"keygen":true,"link":true,"meta":true,"param":true,"source":true,"wbr":true},__fest_element_stack = [],__fest_htmlhash={"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"},__fest_jschars=/[\\'"\/\n\r\t\b\f<>]/g,__fest_jschars_test=/[\\'"\/\n\r\t\b\f<>]/,__fest_jshash={"\"":"\\\"","\\":"\\\\","/":"\\/","\n":"\\n","\r":"\\r","\t":"\\t","\b":"\\b","\f":"\\f","'":"\\'","<":"\\u003C",">":"\\u003E"},___fest_log_error;if(typeof __fest_error === "undefined"){___fest_log_error = (typeof console !== "undefined" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+"\nin block \""+__fest_debug_block+"\" at line: "+__fest_debug_line+"\nfile: "+__fest_debug_file)}function __fest_replaceHTML(chr){return __fest_htmlhash[chr]}function __fest_replaceJS(chr){return __fest_jshash[chr]}function __fest_extend(dest, src){for(var i in src)if(src.hasOwnProperty(i))dest[i]=src[i];}function __fest_param(fn){fn.param=true;return fn}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]=="function"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}function __fest_escapeJS(s){if (typeof s==="string") {if (__fest_jschars_test.test(s))return s.replace(__fest_jschars,__fest_replaceJS);} else if (typeof s==="undefined")return "";return s;}function __fest_escapeHTML(s){if (typeof s==="string") {if (__fest_htmlchars_test.test(s))return s.replace(__fest_htmlchars,__fest_replaceHTML);} else if (typeof s==="undefined")return "";return s;}var createProfile=__fest_context;__fest_buf+=("<div id=\"windowCreateProfile\" class=\"windowCreateProfile\"><div id=\"typeChooseRaceAndClass_race\" class=\"typeChooseRaceAndClass\">Раса</div><div id=\"typeChooseRaceAndClass_class\" class=\"typeChooseRaceAndClass\">Характер</div><div id=\"race_malok\" class=\"button_choose_race choose_race\"><div id=\"race_malok_icon\" class=\"stop_click\"></div></div><div id=\"race_peleng\" class=\"button_choose_race\"><div id=\"race_peleng_icon\" class=\"stop_click\"></div></div><div id=\"race_human\" class=\"button_choose_race\"><div id=\"race_human_icon\" class=\"stop_click\"></div></div><div id=\"race_fainin\" class=\"button_choose_race\"><div id=\"race_fainin_icon\" class=\"stop_click\"></div></div><div id=\"race_galec\" class=\"button_choose_race\"><div id=\"race_galec_icon\" class=\"stop_click\"></div></div><div id=\"class_war\" class=\"button_choose_class choose_class\"><div id=\"class_war_icon\" class=\"stop_click\"></div></div><div id=\"class_mercenary\" class=\"button_choose_class\"><div id=\"class_mercenary_icon\" class=\"stop_click\"></div></div><div id=\"class_trade\" class=\"button_choose_class\"><div id=\"class_trade_icon\" class=\"stop_click\"></div></div><div id=\"class_corsar\" class=\"button_choose_class\"><div id=\"class_corsar_icon\" class=\"stop_click\"></div></div><div id=\"class_pirate\" class=\"button_choose_class\"><div id=\"class_pirate_icon\" class=\"stop_click\"></div></div><div id=\"left_button_img_profile\" class=\"button_img_profile\"></div><div id=\"right_button_img_profile\" class=\"button_img_profile\"></div><div class=\"img_choose_peson\"></div><div class=\"wrap_apply_name_person\"><span class=\"new_name_peson\">Имя:</span><div id=\"apply_name_person\" class=\"apply\"></div><input id=\"input_new_name_peson\" type=\"text\" class=\"input_new_name_peson\"/></div><div id=\"info_about_person\" class=\"info_about_person\">dsajdkasj lkjdklsaj kdjakl sjdlk;saj dk;lasajd  kasj lkjdklsaj kdja  kl sjdlk;s\n                  aj dk;la dsajd kasj lkjdklsaj kdjakl sjdlk;saj dk;la dsajdkasj lkj\n                  dklsaj kdjakl sjdlk;saj dk;la</div></div>");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk==="string") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}} ; });
define('models/createProfile',[
  'jquery',
  'backbone'
], function($, Backbone) {
var positionCreateProfile = Backbone.Model.extend({
  initialize: function() {
     this.windowResize();
     result = {
        name : "",
        race : "race_malok",
        class : "class_war"
     }
  },
  sizeWindow :function() {
      var sizeWindow = {
          width : $('body').css('width'),
          height : $('body').css('height')
      }
      return sizeWindow;
  },
  position: function(sizeWindow) {
      var positionWindowCreate = {
          left : (parseInt(sizeWindow.width) - 481)/2, //481px without zoom
          top : (parseInt(sizeWindow.height) - 665)/2  //665px without zoom
      }
      return positionWindowCreate;
  },
  changePosition: function(positionWindowCreate){
    this.set({marginleft : positionWindowCreate.left, margintop: positionWindowCreate.top})
    return this;
  },
  windowResize: function(){
     var that = this;
     $(window).resize(function() {
        that.trigger('window:resize');
     });
  },
  changeModelPerson: function(type,count) {
    if (type == 'name'){
        result.name = count
    }
    if (type == 'race'){
        result.race = count
    }
    if (type == 'class'){
        result.class = count
    }
    return result;
  }

});
    return new positionCreateProfile();
});
define('views/createProfile',[
  'backbone',
  'tmpl/createProfile',
  'models/createProfile'
], function (Backbone, tmpl, positionCreateProfile) {
  var createProfileView = Backbone.View.extend({
    initialize: function() {
      last_choose_race = 'race_malok';
      last_choose_class = 'class_war';
      this.render();
      this.setCenter();
      this.listenTo(positionCreateProfile, 'window:resize', this.setCenter);
      this.listenTo(positionCreateProfile, 'race:malok', this.chooseRace);
    },
    tagName : 'div',
    className : 'createProfile',
    model : positionCreateProfile,
    template: tmpl,
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    events: {
      "click #race_malok,#race_peleng,#race_human,#race_fainin,#race_galec": "chooseRace",
      "click #class_war,#class_mercenary,#class_trade,#class_corsar,#class_pirate": "chooseClass",
      "click #apply_name_person" : "chooseResult"
    },
    show: function () {
      //console.log('showfunction',this);
      this.trigger('show', this);
    },
    setCenter: function () {
      var windows = this.model.sizeWindow();
      var windowPosition = this.model.position(windows);
      var marginCount = this.model.changePosition(windowPosition);
      marginCount = marginCount.toJSON();
      //console.log(marginCount);
      //console.log(this.$('#windowCreateProfile'));
      this.$('#windowCreateProfile').css({'left':marginCount.marginleft,'top':marginCount.margintop});
    },
    chooseRace: function(e){
      $('#'+last_choose_race).removeClass('choose_race');
      this.model.changeModelPerson('race',$(event.target).attr('id'))
      $('#'+$(event.target).attr('id')).addClass('choose_race');
      last_choose_race = $(event.target).attr('id');
      this.infoAboutRaceAndClass('race',last_choose_race);
    },
    chooseClass: function(e){
//      console.log($(event.target).attr('id'))
      $('#'+last_choose_class).removeClass('choose_class');
      this.model.changeModelPerson('class',$(event.target).attr('id'))
      $('#'+$(event.target).attr('id')).addClass('choose_class');
      last_choose_class = $(event.target).attr('id');
      this.infoAboutRaceAndClass('class',last_choose_class);
    },
    chooseResult: function(){
      this.model.changeModelPerson('name',$('#input_new_name_peson').val())
      if (result.name != ''){
        console.log('отправить на сервер=',result)
      }
      else{
        alert('введите имя')
      }
    },
    infoAboutRaceAndClass: function(type,currentChoose){
       if (type == 'race'){
        if(currentChoose == 'race_malok'){
          $('#info_about_person').html('race_malok')
        }
        if(currentChoose == 'race_peleng'){
          $('#info_about_person').html('race_peleng')
        }
        if(currentChoose == 'race_human'){
          $('#info_about_person').html('race_human')
        }
        if(currentChoose == 'race_fainin'){
          $('#info_about_person').html('race_fainin')
        }
        if(currentChoose == 'race_galec'){
           $('#info_about_person').html('race_galec')
        }
       }
       else{
        if(currentChoose == 'class_war'){
          $('#info_about_person').html('class_war')
        }
        if(currentChoose == 'class_mercenary'){
          $('#info_about_person').html('class_mercenary')
        }
        if(currentChoose == 'class_trade'){
          $('#info_about_person').html('class_trade')
        }
        if(currentChoose == 'class_corsar'){
          $('#info_about_person').html('class_corsar')
        }
        if(currentChoose == 'class_pirate'){
           $('#info_about_person').html('class_pirate')
        }
       }
    }
  });
  return new createProfileView();
});

define('tmpl/rating',[],function () { return function (__fest_context){var __fest_self=this,__fest_buf="",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html="",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file="",__fest_debug_line="",__fest_debug_block="",__fest_htmlchars=/[&<>"]/g,__fest_htmlchars_test=/[&<>"]/,__fest_short_tags = {"area":true,"base":true,"br":true,"col":true,"command":true,"embed":true,"hr":true,"img":true,"input":true,"keygen":true,"link":true,"meta":true,"param":true,"source":true,"wbr":true},__fest_element_stack = [],__fest_htmlhash={"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"},__fest_jschars=/[\\'"\/\n\r\t\b\f<>]/g,__fest_jschars_test=/[\\'"\/\n\r\t\b\f<>]/,__fest_jshash={"\"":"\\\"","\\":"\\\\","/":"\\/","\n":"\\n","\r":"\\r","\t":"\\t","\b":"\\b","\f":"\\f","'":"\\'","<":"\\u003C",">":"\\u003E"},___fest_log_error;if(typeof __fest_error === "undefined"){___fest_log_error = (typeof console !== "undefined" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+"\nin block \""+__fest_debug_block+"\" at line: "+__fest_debug_line+"\nfile: "+__fest_debug_file)}function __fest_replaceHTML(chr){return __fest_htmlhash[chr]}function __fest_replaceJS(chr){return __fest_jshash[chr]}function __fest_extend(dest, src){for(var i in src)if(src.hasOwnProperty(i))dest[i]=src[i];}function __fest_param(fn){fn.param=true;return fn}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]=="function"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}function __fest_escapeJS(s){if (typeof s==="string") {if (__fest_jschars_test.test(s))return s.replace(__fest_jschars,__fest_replaceJS);} else if (typeof s==="undefined")return "";return s;}function __fest_escapeHTML(s){if (typeof s==="string") {if (__fest_htmlchars_test.test(s))return s.replace(__fest_htmlchars,__fest_replaceHTML);} else if (typeof s==="undefined")return "";return s;}var rating=__fest_context;__fest_buf+=("<div class=\"background_rating\"><div class=\"ava_best_player best_warrior\">1</div><div class=\"ava_best_player best_trade\">1</div><div class=\"ava_best_player best_corsar\">1</div><div class=\"position_table\"><div class=\"table_rating\"><div class=\"rating_mini_block rating_table_count\"><span>1</span></div><div class=\"rating_mini_block rating_table_name\"><span>Имя</span></div><div class=\"rating_mini_block rating_table_character\"><span>Герой</span></div><div class=\"rating_mini_block rating_table_race\"><img src=\"images\/rating\/race_peleng.png\"/></div><div class=\"rating_mini_block rating_table_rank\"><div class=\"rank_rating rank_rating_1\"></div></div><div class=\"rating_mini_block rating_table_exp\"><span>317289</span></div></div><div class=\"table_rating_info rating_open_human\"><div class=\"rating_info_ava\"></div><div class=\"rating_count_kill\"><div class=\"name_table_rating_kill\">Убил:</div><table class=\"table_rating_count_kill\"><tr><td class=\"rating_td rating_kill_first\">dsdasd</td><td class=\"rating_td rating_kill_second\">dsadas</td><td class=\"rating_td rating_kill_third\">dasdsda</td><td class=\"rating_td rating_kill_fourth\">dsadasda</td></tr><tr><td class=\"rating_td rating_kill_first\">1</td><td class=\"rating_td rating_kill_second\">22</td><td class=\"rating_td rating_kill_third\">321</td><td class=\"rating_td rating_kill_fourth\">31231</td></tr></table></div></div><div class=\"table_rating\"><div class=\"rating_mini_block rating_table_count\"><span>1</span></div><div class=\"rating_mini_block rating_table_name\"><span>Имя</span></div><div class=\"rating_mini_block rating_table_character\"><span>Герой</span></div><div class=\"rating_mini_block rating_table_race\"><img src=\"images\/rating\/race_peleng.png\"/></div><div class=\"rating_mini_block rating_table_rank\"><span>dsadads</span></div><div class=\"rating_mini_block rating_table_exp\"><span>317289</span></div></div><div class=\"table_rating\"><div class=\"rating_mini_block rating_table_count\"><span>1</span></div><div class=\"rating_mini_block rating_table_name\"><span>Имя</span></div><div class=\"rating_mini_block rating_table_character\"><span>Герой</span></div><div class=\"rating_mini_block rating_table_race\"><img src=\"images\/rating\/race_peleng.png\"/></div><div class=\"rating_mini_block rating_table_rank\"><span>dsadads</span></div><div class=\"rating_mini_block rating_table_exp\"><span>317289</span></div></div><div class=\"table_rating\"><div class=\"rating_mini_block rating_table_count\"><span>1</span></div><div class=\"rating_mini_block rating_table_name\"><span>Имя</span></div><div class=\"rating_mini_block rating_table_character\"><span>Герой</span></div><div class=\"rating_mini_block rating_table_race\"><img src=\"images\/rating\/race_peleng.png\"/></div><div class=\"rating_mini_block rating_table_rank\"><span>dsadads</span></div><div class=\"rating_mini_block rating_table_exp\"><span>317289</span></div></div><div class=\"table_rating\"><div class=\"rating_mini_block rating_table_count\"><span>1</span></div><div class=\"rating_mini_block rating_table_name\"><span>Имя</span></div><div class=\"rating_mini_block rating_table_character\"><span>Герой</span></div><div class=\"rating_mini_block rating_table_race\"><img src=\"images\/rating\/race_peleng.png\"/></div><div class=\"rating_mini_block rating_table_rank\"><span>dsadads</span></div><div class=\"rating_mini_block rating_table_exp\"><span>317289</span></div></div></div><div class=\"close_rating\"></div></div>");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk==="string") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}} ; });
define('models/rating',[
  'jquery',
  'backbone'
], function($, Backbone) {
var ratingModel = Backbone.Model.extend({
    initialize: function(){
        console.log('ratingModel')
    }
});
    return new ratingModel();
});
define('views/rating',[
        'backbone',
        'tmpl/rating',
        'models/rating',
        ], function (Backbone, tmpl, ratingModel) {
        var ratingView = Backbone.View.extend({
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.render();
        },
        tagName : 'div',
        className : 'rating',
        model : ratingModel,
        template: tmpl,
        render: function() {
           this.$el.html(this.template());
           return this;
        },
        show: function () {
           this.trigger('show', this);
        }
});

return new ratingView();
});
define('tmpl/app',[],function () { return function (__fest_context){var __fest_self=this,__fest_buf="",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html="",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file="",__fest_debug_line="",__fest_debug_block="",__fest_htmlchars=/[&<>"]/g,__fest_htmlchars_test=/[&<>"]/,__fest_short_tags = {"area":true,"base":true,"br":true,"col":true,"command":true,"embed":true,"hr":true,"img":true,"input":true,"keygen":true,"link":true,"meta":true,"param":true,"source":true,"wbr":true},__fest_element_stack = [],__fest_htmlhash={"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"},__fest_jschars=/[\\'"\/\n\r\t\b\f<>]/g,__fest_jschars_test=/[\\'"\/\n\r\t\b\f<>]/,__fest_jshash={"\"":"\\\"","\\":"\\\\","/":"\\/","\n":"\\n","\r":"\\r","\t":"\\t","\b":"\\b","\f":"\\f","'":"\\'","<":"\\u003C",">":"\\u003E"},___fest_log_error;if(typeof __fest_error === "undefined"){___fest_log_error = (typeof console !== "undefined" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+"\nin block \""+__fest_debug_block+"\" at line: "+__fest_debug_line+"\nfile: "+__fest_debug_file)}function __fest_replaceHTML(chr){return __fest_htmlhash[chr]}function __fest_replaceJS(chr){return __fest_jshash[chr]}function __fest_extend(dest, src){for(var i in src)if(src.hasOwnProperty(i))dest[i]=src[i];}function __fest_param(fn){fn.param=true;return fn}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]=="function"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}function __fest_escapeJS(s){if (typeof s==="string") {if (__fest_jschars_test.test(s))return s.replace(__fest_jschars,__fest_replaceJS);} else if (typeof s==="undefined")return "";return s;}function __fest_escapeHTML(s){if (typeof s==="string") {if (__fest_htmlchars_test.test(s))return s.replace(__fest_htmlchars,__fest_replaceHTML);} else if (typeof s==="undefined")return "";return s;}__fest_buf+=("<div id=\"page\" class=\"page\"></div><div id=\"toolbar\"></div><div class=\"left-panel\"><div class=\"left-panel__name\">root</div></div>");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk==="string") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}} ; });
define('tmpl/toolbar',[],function () { return function (__fest_context){var __fest_self=this,__fest_buf="",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html="",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file="",__fest_debug_line="",__fest_debug_block="",__fest_htmlchars=/[&<>"]/g,__fest_htmlchars_test=/[&<>"]/,__fest_short_tags = {"area":true,"base":true,"br":true,"col":true,"command":true,"embed":true,"hr":true,"img":true,"input":true,"keygen":true,"link":true,"meta":true,"param":true,"source":true,"wbr":true},__fest_element_stack = [],__fest_htmlhash={"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"},__fest_jschars=/[\\'"\/\n\r\t\b\f<>]/g,__fest_jschars_test=/[\\'"\/\n\r\t\b\f<>]/,__fest_jshash={"\"":"\\\"","\\":"\\\\","/":"\\/","\n":"\\n","\r":"\\r","\t":"\\t","\b":"\\b","\f":"\\f","'":"\\'","<":"\\u003C",">":"\\u003E"},___fest_log_error;if(typeof __fest_error === "undefined"){___fest_log_error = (typeof console !== "undefined" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+"\nin block \""+__fest_debug_block+"\" at line: "+__fest_debug_line+"\nfile: "+__fest_debug_file)}function __fest_replaceHTML(chr){return __fest_htmlhash[chr]}function __fest_replaceJS(chr){return __fest_jshash[chr]}function __fest_extend(dest, src){for(var i in src)if(src.hasOwnProperty(i))dest[i]=src[i];}function __fest_param(fn){fn.param=true;return fn}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]=="function"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}function __fest_escapeJS(s){if (typeof s==="string") {if (__fest_jschars_test.test(s))return s.replace(__fest_jschars,__fest_replaceJS);} else if (typeof s==="undefined")return "";return s;}function __fest_escapeHTML(s){if (typeof s==="string") {if (__fest_htmlchars_test.test(s))return s.replace(__fest_htmlchars,__fest_replaceHTML);} else if (typeof s==="undefined")return "";return s;}var toolbar=__fest_context;__fest_buf+=("<div class=\"weapon_toolbar\"></div><div class=\"toolbar_menu\"></div><div class=\"money\"><span>");try{__fest_buf+=(__fest_escapeHTML(toolbar.get('cr')))}catch(e){__fest_log_error(e.message + "5");}__fest_buf+=("</span></div><div class=\"moneyGold\"><span>");try{__fest_buf+=(__fest_escapeHTML(toolbar.get('kr')))}catch(e){__fest_log_error(e.message + "10");}__fest_buf+=("</span></div><div class=\"right_part_toolbar\"><div class=\"toolbar_left_button toolbar_ship\"></div><div class=\"toolbar_left_button toolbar_raiting\"></div><div class=\"toolbar_left_button toolbar_map\"></div></div>");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk==="string") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}} ; });
(function(e){var t,n=function(){return t||window.event},r=function(e){t=e};if(navigator.userAgent.toLowerCase().indexOf("firefox")>=0){window.addEventListener("mousedown",r,true)}e.fn.extend({detectDrag:function(){var t=false,r=null,i=null,s=null,o={set:function(e){o=e}},u=null,a=function(e){e.preventDefault();return false},f=function(e){return Math.abs(r.x-e.clientX)>5||Math.abs(r.y-e.clientY)>5},l=function(n){t=true;i=s.clone().css({position:"absolute",translateX:n.clientX+5,translateY:n.clientY+5}).appendTo("body");e("input, textarea").blur();s.trigger("dragstart",[o,i,s])},c=function(t){var n=e(t.target),r=n[0]!==(u?u[0]:null);if(n.attr("dropable")&&r){u=n;n.trigger("dragenter",[i,s])}else if(u&&r){u.trigger("dragleave",[i,s]);u=null}i.css({left:t.clientX+5,top:t.clientY+5})},h=function(e){if(t){c(e)}else if(f(e)){l(e)}},p=function(n){var r=e(n.target),u=e(window);if(t){i.remove();if(r.attr("dropable")){r.trigger("drop",[o,i,s])}else{s.trigger("dragend",[i,s])}}t=false;s.off("selectstart",a);e("body").css("user-select","auto");u.off("mousemove",h).off("mouseup",p)};r={x:n().clientX,y:n().clientY};s=e(this);s.on("selectstart",a);e("body").css("user-select","none");e(window).on("mousemove",h).on("mouseup",p)}})})(jQuery)
;
define("dragLib", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.dragLib;
    };
}(this)));

define('tmpl/profile',[],function () { return function (__fest_context){var __fest_self=this,__fest_buf="",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html="",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file="",__fest_debug_line="",__fest_debug_block="",__fest_htmlchars=/[&<>"]/g,__fest_htmlchars_test=/[&<>"]/,__fest_short_tags = {"area":true,"base":true,"br":true,"col":true,"command":true,"embed":true,"hr":true,"img":true,"input":true,"keygen":true,"link":true,"meta":true,"param":true,"source":true,"wbr":true},__fest_element_stack = [],__fest_htmlhash={"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"},__fest_jschars=/[\\'"\/\n\r\t\b\f<>]/g,__fest_jschars_test=/[\\'"\/\n\r\t\b\f<>]/,__fest_jshash={"\"":"\\\"","\\":"\\\\","/":"\\/","\n":"\\n","\r":"\\r","\t":"\\t","\b":"\\b","\f":"\\f","'":"\\'","<":"\\u003C",">":"\\u003E"},___fest_log_error;if(typeof __fest_error === "undefined"){___fest_log_error = (typeof console !== "undefined" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+"\nin block \""+__fest_debug_block+"\" at line: "+__fest_debug_line+"\nfile: "+__fest_debug_file)}function __fest_replaceHTML(chr){return __fest_htmlhash[chr]}function __fest_replaceJS(chr){return __fest_jshash[chr]}function __fest_extend(dest, src){for(var i in src)if(src.hasOwnProperty(i))dest[i]=src[i];}function __fest_param(fn){fn.param=true;return fn}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]=="function"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}function __fest_escapeJS(s){if (typeof s==="string") {if (__fest_jschars_test.test(s))return s.replace(__fest_jschars,__fest_replaceJS);} else if (typeof s==="undefined")return "";return s;}function __fest_escapeHTML(s){if (typeof s==="string") {if (__fest_htmlchars_test.test(s))return s.replace(__fest_htmlchars,__fest_replaceHTML);} else if (typeof s==="undefined")return "";return s;}var profile=__fest_context;__fest_buf+=("<div class=\"background_profile\"><div id=\"speed_static\" class=\"name_static\">Скорость</div><div id=\"speed_static_count\" class=\"name_static_count\">");try{__fest_buf+=(__fest_escapeHTML(profile.get('engine')['speed']))}catch(e){__fest_log_error(e.message + "4");}__fest_buf+=("</div><div id=\"defence_static\" class=\"name_static\">Защита</div><div id=\"defence_static_count\" class=\"name_static_count\">");try{__fest_buf+=(__fest_escapeHTML(profile.get('ship')['block']))}catch(e){__fest_log_error(e.message + "8");}__fest_buf+=("+");try{__fest_if=profile.get('generator')['id'] != 0}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){try{__fest_buf+=(__fest_escapeHTML(profile.get('generator')['block']))}catch(e){__fest_log_error(e.message + "12");}}else{__fest_buf+=("0");}__fest_buf+=("%</div><div class=\"ship_view\">");try{__fest_element="img";if(typeof __fest_element !== "string"){__fest_log_error("Element name must be a string");__fest_element="div"}}catch(e){__fest_element="div";__fest_log_error(e.message);}__fest_element_stack.push(__fest_element);__fest_buf+=("<" + __fest_element);__fest_buf+=(" src=\"");try{__fest_if=profile.get('ship')['id']}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf+=("\/images\/profile\/res\/");try{__fest_buf+=(__fest_escapeHTML(profile.get('ship')['id']))}catch(e){__fest_log_error(e.message + "28");}__fest_buf+=(".png");}__fest_buf+=("\"");__fest_element=__fest_element_stack[__fest_element_stack.length-1];__fest_buf+=(__fest_element in __fest_short_tags?"/>":">");__fest_element = __fest_element_stack[__fest_element_stack.length - 1];if(!(__fest_element in __fest_short_tags)){__fest_buf+=("</" + __fest_element + ">")}__fest_element_stack.pop();__fest_buf+=("</div>");__fest_blocks.cellElement=function(params){var __fest_buf="";try{var obj = profile.get(params.type)}catch(e){__fest_log_error(e.message);}try{__fest_element="div";if(typeof __fest_element !== "string"){__fest_log_error("Element name must be a string");__fest_element="div"}}catch(e){__fest_element="div";__fest_log_error(e.message);}__fest_element_stack.push(__fest_element);__fest_buf+=("<" + __fest_element);__fest_buf+=(" id=\"");try{__fest_buf+=(__fest_escapeHTML(params.id))}catch(e){__fest_log_error(e.message + "41");}__fest_buf+=("\" class=\"cell ");try{__fest_buf+=(__fest_escapeHTML(params.class))}catch(e){__fest_log_error(e.message + "46");}__fest_buf+=(" ");try{__fest_if=obj['id'] != 0}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){try{var on = "use"}catch(e){__fest_log_error(e.message);}}else{try{var on = ""}catch(e){__fest_log_error(e.message);}}try{__fest_buf+=(__fest_escapeHTML(on))}catch(e){__fest_log_error(e.message + "56");}__fest_buf+=("\"");try{__fest_if=params.type == 'engine'}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf+=(" speed=\"");try{__fest_buf+=(__fest_escapeHTML(obj['speed']))}catch(e){__fest_log_error(e.message + "60");}__fest_buf+=("\"");}__fest_element=__fest_element_stack[__fest_element_stack.length-1];__fest_buf+=(__fest_element in __fest_short_tags?"/>":">");try{__fest_if=obj['id'] != 0}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){try{__fest_element="img";if(typeof __fest_element !== "string"){__fest_log_error("Element name must be a string");__fest_element="div"}}catch(e){__fest_element="div";__fest_log_error(e.message);}__fest_element_stack.push(__fest_element);__fest_buf+=("<" + __fest_element);__fest_buf+=(" class=\"");try{__fest_buf+=(__fest_escapeHTML(params.class2))}catch(e){__fest_log_error(e.message + "68");}__fest_buf+=(" draggable\"");try{var obj = profile.get(params.type)}catch(e){__fest_log_error(e.message);}__fest_buf+=(" src=\"\/images\/profile\/res\/");try{__fest_buf+=(__fest_escapeHTML(obj['id']))}catch(e){__fest_log_error(e.message + "75");}__fest_buf+=(".png\"");__fest_element=__fest_element_stack[__fest_element_stack.length-1];__fest_buf+=(__fest_element in __fest_short_tags?"/>":">");__fest_element = __fest_element_stack[__fest_element_stack.length - 1];if(!(__fest_element in __fest_short_tags)){__fest_buf+=("</" + __fest_element + ">")}__fest_element_stack.pop();}__fest_element = __fest_element_stack[__fest_element_stack.length - 1];if(!(__fest_element in __fest_short_tags)){__fest_buf+=("</" + __fest_element + ">")}__fest_element_stack.pop();return __fest_buf;};__fest_select="cellElement";__fest_params={};__fest_params.type=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("w1");return __fest_buf;});__fest_params.id=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_weapon_1_1");return __fest_buf;});__fest_params.class=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_right_bottom");return __fest_buf;});__fest_params["class2"]=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_cell");return __fest_buf;});__fest_chunks.push(__fest_buf,{name:__fest_select,params:__fest_params,cp:true});__fest_buf="";__fest_select="cellElement";__fest_params={};__fest_params.id=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_weapon_1_2");return __fest_buf;});__fest_params.class=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_middle_bottom");return __fest_buf;});__fest_params["class2"]=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_cell");return __fest_buf;});__fest_params.type=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("w2");return __fest_buf;});__fest_chunks.push(__fest_buf,{name:__fest_select,params:__fest_params,cp:true});__fest_buf="";__fest_select="cellElement";__fest_params={};__fest_params.id=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_weapon_2_1");return __fest_buf;});__fest_params.class=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_weapon_2_1");return __fest_buf;});__fest_params["class2"]=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_cell");return __fest_buf;});__fest_params.type=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("w3");return __fest_buf;});__fest_chunks.push(__fest_buf,{name:__fest_select,params:__fest_params,cp:true});__fest_buf="";__fest_select="cellElement";__fest_params={};__fest_params.id=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_weapon_2_2");return __fest_buf;});__fest_params.class=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_weapon_2_2");return __fest_buf;});__fest_params["class2"]=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_cell");return __fest_buf;});__fest_params.type=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("w4");return __fest_buf;});__fest_chunks.push(__fest_buf,{name:__fest_select,params:__fest_params,cp:true});__fest_buf="";__fest_select="cellElement";__fest_params={};__fest_params.id=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_weapon_2_3");return __fest_buf;});__fest_params.class=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_weapon_2_3");return __fest_buf;});__fest_params["class2"]=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_cell");return __fest_buf;});__fest_params.type=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("w5");return __fest_buf;});__fest_chunks.push(__fest_buf,{name:__fest_select,params:__fest_params,cp:true});__fest_buf="";__fest_select="cellElement";__fest_params={};__fest_params.id=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_engine");return __fest_buf;});__fest_params.class=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_middle_right");return __fest_buf;});__fest_params["class2"]=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_cell");return __fest_buf;});__fest_params.type=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("engine");return __fest_buf;});__fest_chunks.push(__fest_buf,{name:__fest_select,params:__fest_params,cp:true});__fest_buf="";__fest_select="cellElement";__fest_params={};__fest_params.id=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_radar");return __fest_buf;});__fest_params.class=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_middle_right");return __fest_buf;});__fest_params["class2"]=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_cell");return __fest_buf;});__fest_params.type=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("radar");return __fest_buf;});__fest_chunks.push(__fest_buf,{name:__fest_select,params:__fest_params,cp:true});__fest_buf="";__fest_select="cellElement";__fest_params={};__fest_params.id=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_scanner");return __fest_buf;});__fest_params.class=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_middle_left");return __fest_buf;});__fest_params["class2"]=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_cell");return __fest_buf;});__fest_params.type=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("scanner");return __fest_buf;});__fest_chunks.push(__fest_buf,{name:__fest_select,params:__fest_params,cp:true});__fest_buf="";__fest_select="cellElement";__fest_params={};__fest_params.id=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_fuel");return __fest_buf;});__fest_params.class=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_middle_left");return __fest_buf;});__fest_params["class2"]=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_cell");return __fest_buf;});__fest_params.type=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("fuel");return __fest_buf;});__fest_chunks.push(__fest_buf,{name:__fest_select,params:__fest_params,cp:true});__fest_buf="";__fest_select="cellElement";__fest_params={};__fest_params.id=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_generator");return __fest_buf;});__fest_params.class=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_left_bottom_width");return __fest_buf;});__fest_params["class2"]=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_cell");return __fest_buf;});__fest_params.type=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("generator");return __fest_buf;});__fest_chunks.push(__fest_buf,{name:__fest_select,params:__fest_params,cp:true});__fest_buf="";__fest_select="cellElement";__fest_params={};__fest_params.id=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_hook");return __fest_buf;});__fest_params.class=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_middle_bottom");return __fest_buf;});__fest_params["class2"]=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_cell");return __fest_buf;});__fest_params.type=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("hook");return __fest_buf;});__fest_chunks.push(__fest_buf,{name:__fest_select,params:__fest_params,cp:true});__fest_buf="";__fest_select="cellElement";__fest_params={};__fest_params.id=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_droid");return __fest_buf;});__fest_params.class=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("cell_right_bottom");return __fest_buf;});__fest_params["class2"]=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_cell");return __fest_buf;});__fest_params.type=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("droid");return __fest_buf;});__fest_chunks.push(__fest_buf,{name:__fest_select,params:__fest_params,cp:true});__fest_buf="";__fest_blocks.inventoryElement=function(params){var __fest_buf="";try{var obj = profile.get(params.type)}catch(e){__fest_log_error(e.message);}try{__fest_element="div";if(typeof __fest_element !== "string"){__fest_log_error("Element name must be a string");__fest_element="div"}}catch(e){__fest_element="div";__fest_log_error(e.message);}__fest_element_stack.push(__fest_element);__fest_buf+=("<" + __fest_element);__fest_buf+=(" id=\"");try{__fest_buf+=(__fest_escapeHTML(params.id))}catch(e){__fest_log_error(e.message + "177");}__fest_buf+=("\" class=\"");try{__fest_buf+=(__fest_escapeHTML(params.class))}catch(e){__fest_log_error(e.message + "180");}__fest_buf+=("\" inv_got_type=\"");try{__fest_buf+=(__fest_escapeHTML(obj['type']))}catch(e){__fest_log_error(e.message + "183");}__fest_buf+=("\" inv_got_id=\"");try{__fest_buf+=(__fest_escapeHTML(obj['id']))}catch(e){__fest_log_error(e.message + "186");}__fest_buf+=("\" inv_hold_num=\"");try{__fest_buf+=(__fest_escapeHTML(params.type))}catch(e){__fest_log_error(e.message + "189");}__fest_buf+=("\"");try{__fest_if=obj['type'] == 'engine'}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf+=(" speed=\"");try{__fest_buf+=(__fest_escapeHTML(obj['speed']))}catch(e){__fest_log_error(e.message + "193");}__fest_buf+=("\"");}__fest_element=__fest_element_stack[__fest_element_stack.length-1];__fest_buf+=(__fest_element in __fest_short_tags?"/>":">");try{__fest_if=obj['id'] != 0}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){try{__fest_element="img";if(typeof __fest_element !== "string"){__fest_log_error("Element name must be a string");__fest_element="div"}}catch(e){__fest_element="div";__fest_log_error(e.message);}__fest_element_stack.push(__fest_element);__fest_buf+=("<" + __fest_element);__fest_buf+=(" class=\"");try{__fest_buf+=(__fest_escapeHTML(params.class2))}catch(e){__fest_log_error(e.message + "201");}__fest_buf+=(" draggable\" src=\"\/images\/profile\/res\/");try{__fest_buf+=(__fest_escapeHTML(obj['id']))}catch(e){__fest_log_error(e.message + "207");}__fest_buf+=(".png\"");__fest_element=__fest_element_stack[__fest_element_stack.length-1];__fest_buf+=(__fest_element in __fest_short_tags?"/>":">");__fest_element = __fest_element_stack[__fest_element_stack.length - 1];if(!(__fest_element in __fest_short_tags)){__fest_buf+=("</" + __fest_element + ">")}__fest_element_stack.pop();}__fest_element = __fest_element_stack[__fest_element_stack.length - 1];if(!(__fest_element in __fest_short_tags)){__fest_buf+=("</" + __fest_element + ">")}__fest_element_stack.pop();return __fest_buf;};__fest_buf+=("<div class=\"wrapGate\"><div class=\"gateLeft\"></div><div class=\"gateRight\"></div></div><div id=\"holdLeft\" class=\"holdLeft\"></div><div id=\"holdRight\" class=\"holdRight\"></div><div class=\"inventory_profile\">");__fest_select="inventoryElement";__fest_params={};__fest_params.id=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_inventory_1");return __fest_buf;});__fest_params.class=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("place_in_inventory");return __fest_buf;});__fest_params["class2"]=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_inventory");return __fest_buf;});__fest_params.type=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("hold0");return __fest_buf;});__fest_chunks.push(__fest_buf,{name:__fest_select,params:__fest_params,cp:true});__fest_buf="";__fest_select="inventoryElement";__fest_params={};__fest_params.id=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_inventory_2");return __fest_buf;});__fest_params.class=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("place_in_inventory");return __fest_buf;});__fest_params["class2"]=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_inventory");return __fest_buf;});__fest_params.type=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("hold1");return __fest_buf;});__fest_chunks.push(__fest_buf,{name:__fest_select,params:__fest_params,cp:true});__fest_buf="";__fest_select="inventoryElement";__fest_params={};__fest_params.id=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_inventory_3");return __fest_buf;});__fest_params.class=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("place_in_inventory");return __fest_buf;});__fest_params["class2"]=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_inventory");return __fest_buf;});__fest_params.type=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("hold2");return __fest_buf;});__fest_chunks.push(__fest_buf,{name:__fest_select,params:__fest_params,cp:true});__fest_buf="";__fest_select="inventoryElement";__fest_params={};__fest_params.id=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_inventory_4");return __fest_buf;});__fest_params.class=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("place_in_inventory");return __fest_buf;});__fest_params["class2"]=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_inventory");return __fest_buf;});__fest_params.type=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("hold3");return __fest_buf;});__fest_chunks.push(__fest_buf,{name:__fest_select,params:__fest_params,cp:true});__fest_buf="";__fest_select="inventoryElement";__fest_params={};__fest_params.id=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_inventory_5");return __fest_buf;});__fest_params.class=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("place_in_inventory");return __fest_buf;});__fest_params["class2"]=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_inventory");return __fest_buf;});__fest_params.type=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("hold4");return __fest_buf;});__fest_chunks.push(__fest_buf,{name:__fest_select,params:__fest_params,cp:true});__fest_buf="";__fest_select="inventoryElement";__fest_params={};__fest_params.id=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_inventory_6");return __fest_buf;});__fest_params.class=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("place_in_inventory");return __fest_buf;});__fest_params["class2"]=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("object_in_inventory");return __fest_buf;});__fest_params.type=__fest_param(function(){var __fest_buf="",__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn, __fest_params;__fest_buf+=("hold5");return __fest_buf;});__fest_chunks.push(__fest_buf,{name:__fest_select,params:__fest_params,cp:true});__fest_buf="";__fest_buf+=("</div><form action=\"\/azaza\" enctype=\"multipart\/form-data\"><div class=\"profile__email\">");try{__fest_buf+=(__fest_escapeHTML(profile.email))}catch(e){__fest_log_error(e.message + "269");}__fest_buf+=("</div><div class=\"profile__image\">");try{__fest_attrs[0]=__fest_escapeHTML(profile.avatar)}catch(e){__fest_attrs[0]=""; __fest_log_error(e.message);}__fest_buf+=("<img src=\"" + __fest_attrs[0] + "\"/></div></form></div><div class=\"rightBlock\"><div class=\"close_profile\"></div><div class=\"ava_profile\">");try{__fest_element="img";if(typeof __fest_element !== "string"){__fest_log_error("Element name must be a string");__fest_element="div"}}catch(e){__fest_element="div";__fest_log_error(e.message);}__fest_element_stack.push(__fest_element);__fest_buf+=("<" + __fest_element);__fest_buf+=(" src=\"\/images\/profile\/races\/");try{__fest_buf+=(__fest_escapeHTML(profile.get('race')))}catch(e){__fest_log_error(e.message + "283");}__fest_buf+=("\/");try{__fest_buf+=(__fest_escapeHTML(profile.get('avatar')))}catch(e){__fest_log_error(e.message + "285");}__fest_buf+=(".jpg\"");__fest_element=__fest_element_stack[__fest_element_stack.length-1];__fest_buf+=(__fest_element in __fest_short_tags?"/>":">");__fest_element = __fest_element_stack[__fest_element_stack.length - 1];if(!(__fest_element in __fest_short_tags)){__fest_buf+=("</" + __fest_element + ">")}__fest_element_stack.pop();__fest_buf+=("</div><div class=\"rank\">");try{__fest_element="img";if(typeof __fest_element !== "string"){__fest_log_error("Element name must be a string");__fest_element="div"}}catch(e){__fest_element="div";__fest_log_error(e.message);}__fest_element_stack.push(__fest_element);__fest_buf+=("<" + __fest_element);__fest_buf+=(" src=\"\/images\/profile\/rank\/");try{__fest_buf+=(__fest_escapeHTML(profile.get('rank')))}catch(e){__fest_log_error(e.message + "296");}__fest_buf+=(".png\"");__fest_element=__fest_element_stack[__fest_element_stack.length-1];__fest_buf+=(__fest_element in __fest_short_tags?"/>":">");__fest_element = __fest_element_stack[__fest_element_stack.length - 1];if(!(__fest_element in __fest_short_tags)){__fest_buf+=("</" + __fest_element + ">")}__fest_element_stack.pop();__fest_buf+=("</div><div class=\"name_profile\">");try{__fest_buf+=(__fest_escapeHTML(profile.get('login')))}catch(e){__fest_log_error(e.message + "302");}__fest_buf+=("</div><div class=\"wrap_ability\"><div id=\"accuracy_skill\" class=\"block_ability\"><div class=\"ability\"></div><div class=\"ability_icon\"></div><div class=\"button_plus_ability\"></div><div class=\"ability_line\"></div></div><div id=\"maneuverability_skill\" class=\"block_ability\"><div class=\"ability\"></div><div class=\"ability_icon\"></div><div class=\"button_plus_ability\"></div><div class=\"ability_line\"></div></div><div id=\"technology_skill\" class=\"block_ability\"><div class=\"ability\"></div><div class=\"ability_icon\"></div><div class=\"button_plus_ability\"></div><div class=\"ability_line\"></div></div><div id=\"trade_skill\" class=\"block_ability\"><div class=\"ability\"></div><div class=\"ability_icon\"></div><div class=\"button_plus_ability\"></div><div class=\"ability_line\"></div></div><div id=\"charm_skill\" class=\"block_ability\"><div class=\"ability\"></div><div class=\"ability_icon\"></div><div class=\"button_plus_ability\"></div><div class=\"ability_line\"></div></div><div id=\"leadership_skill\" class=\"block_ability\"><div class=\"ability\"></div><div class=\"ability_icon\"></div><div class=\"button_plus_ability\"></div><div class=\"ability_line\"></div></div></div></div>");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk==="string") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}} ; });
define('views/profile',[
  'dragLib',
  'backbone',
  'tmpl/profile',
  'models/user'
], function (dragLib, Backbone, tmpl, userModel) {
  var weaponFromHoldToInv = false;
  var weaponOnWeaponInv = false;
  var swapWeapon = false;
  var anotherElement = false;
  var setId = '';
  var cellClicked = false;
  var invClick = false;

  var weaponClicked = false;
  var otherClicked = false;

  var ProfileView = Backbone.View.extend({
    url: '/api/v1/profile',
    tagName: 'div',
    className: 'wrap_profile',
    model: userModel,
    events: {
      'click .object_in_inventory': 'inventoryClick',
      'click .object_in_cell': 'cellClick',
      'click .close_profile': 'closeProfile',

      'mousedown .draggable': 'detectDrag',
      'dragstart .draggable': 'dragstart',
      'dragend .draggable': 'dragend',

      'dragenter .dropable': 'dragenter',
      'dragleave .dropable': 'dragleave',
      'drop .dropable': 'drop'
    },
    detectDrag: function (event) {
      $(event.currentTarget).detectDrag();
    },
    dragstart: function (event, data, clone, element) {
      data.someProperty = 'someValue';
      data.set('someValue');
    },
    dragenter: function (event, clone, element) {
      var dropContainer = $(event.currentTarget);
      dropContainer.animate({opacity: 1}, 'fast');
    },
    dragleave: function (event, clone, element) {
      var dropContainer = $(event.currentTarget);
      dropContainer.animate({opacity: 0.5}, 'fast');
    },
    drop: function (event, data, clone, element) {
      console.log(data.someProperty);
      console.log(data);
    },
    dragend: function (event, clone, element) {

    },
    stopDrag: function (event) { 
      var $target = $(event.target),
      $window = $(window); 

      if (isDragging) { 
        $clone.remove(); 
        if ($target.attr('dropable')) { 
          $target.trigger('drop', [data, $clone, $el]); 
        } else { 
          $el.trigger('dragend', [$clone, $el]); 
        } 
      } 

      isDragging = false; 
      $el.off('selectstart', preventSelection); 
      $('body').css('user-select', 'auto');
      $window.off('mousemove', handleDrag).off('mouseup', stopDrag); 
    },
    template: function () {
      return tmpl(this.model);
    },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.render();
    },
    inventoryClick: function(event) {
      var elem =  $(event.target),
          path = '/images/profile/res/',
          format = '.png',
          id = "",
          that = this,
          itemIsWeapon = false;
      invClick = true;

      $('.background_profile').find('.active').addClass('use').removeClass('active');
      var invType = elem.parent().attr('inv_got_type');
      var invHoldNum = elem.parent().attr('inv_hold_num');
      var elemId = '#' + elem.parent().attr('id');
      setId = elemId;

      if (['w1','w2','w3','w4','w5','gun'].indexOf(invType) > -1) {
        id = "cell_weapon_1_1, #cell_weapon_1_2, #cell_weapon_2_1, #cell_weapon_2_2, #cell_weapon_2_3";
        itemIsWeapon = true;
      } else {
        switch(invType) {
          case 'engine':
            id = "cell_engine"
            break;
          case 'radar':
            id = "cell_radar";
            break;
          case 'scanner':
            id = "cell_scanner";
            break;
          case 'fuel':
            id = "cell_fuel";
            break;
          case 'generator':
            id = "cell_generator";
            break;
          case 'hook':
            id = "cell_hook";
            break;
          case 'droid':
            id = "cell_droid";
            break;
        }
      }

      var element = $('#' + id);
      var newImage = path + elem.attr('src').match(/\d+/) + format;

      if(!swapWeapon) {
        element.addClass('active').removeClass('use');
        $('.app').css('cursor','url(' + newImage + '), auto');
        elem.remove();
      }

      element.bind("click", function() { 

        if(itemIsWeapon) {
          invType = that.compare('#' + $(this).attr('id'));
        }

        if( $(this).children().attr('src') == null ) {
          var img = $('<img class="object_in_cell">');
          img.attr('src', newImage);

          img.appendTo(this);
          element.removeClass('active');
          elem.parent().attr('inv_got_type', '');
          elem.parent().attr('inv_got_id', 0);
          element.unbind();

          that.sendChangedInfo({
            'action' : 'swap',
            'setItem' : invType,
            'unSetItem' : invHoldNum
          });

        } else {

          weaponFromHoldToInv = true;
          var oldSrc = $(this).children().attr('src');
          $(this).children().attr('src', newImage);
          element.removeClass('active');
          element.unbind();
          var img = $('<img class="object_in_inventory">');
          img.attr('src', oldSrc);
          img.appendTo(elemId);

          that.sendChangedInfo({
            'action' : 'swap',
            'setItem' : invHoldNum,
            'unSetItem' : invType
          });

        }

        if($(elemId).attr('speed') != null) {
          $('#speed_static_count').text($(elemId).attr('speed'));
        }

        element.each(function() {
          if ($(this).children().attr('src') != null) {
            $(this).addClass('use');
          }
        });

        $('.app').css('cursor','default');

      });

    },
    cellClick: function(event) {
      console.log('***************** cellClick ************')
      var elem =  $(event.target),
          path = '/images/profile/res/',
          format = '.png',
          that = this;
      cellClicked = true;

      var weaponsArray = ['#cell_weapon_1_1', '#cell_weapon_1_2', '#cell_weapon_2_1', '#cell_weapon_2_2', '#cell_weapon_2_3'];
      var tmpArr = new Array();

      var id = '#' + elem.parent().attr('id');
      setId = id;
      var choosedItem = elem.attr('src');

      var holdsArray = new Array();
      for(var i = 1; i < 7; i++) {
        holdsArray.push('#object_in_inventory_' + i);
      }

      var holdStr = holdsArray.join(', ');
      var setWeapon = 0;
      setWeapon = that.compare(id);
      var speed = '';
      if(id == '#cell_engine') {
        speed = $(id).attr('speed');
      }

      //--------------------------------------------оружие-----------------------------------------------
      if (weaponsArray.indexOf(id) > -1) {
        
        var weaponsId = weaponsArray.join(',');

          // console.log(weaponOnWeaponInv)
          if(!otherClicked) { //----если замена оружия, то не забираем его, а свопаем
            weaponClicked = true;
            $('.app').css('cursor','url(' + choosedItem + '), auto');
            elem.remove();
            $(weaponsId).addClass('active').removeClass('use');
          } 
          //   weaponFromHoldToInv = false;
            // weaponOnWeaponInv = false;
          // }
        
          //---------------------меняем одетые оружия местами
          $(weaponsId).bind("click", function() {
            // if(!weaponOnWeaponInv) {
              if(!otherClicked) {
              var oldSrc = $(this).children().attr('src');
              var element = $(weaponsId);

              if(oldSrc == null) {
                var img = $('<img class="object_in_cell">');
                img.attr('src', choosedItem);
                img.appendTo(this);
              } else {
                $(this).children().attr('src', choosedItem);
                var img = $('<img class="object_in_cell">');
                img.attr('src', oldSrc);
                img.appendTo(id);
                // weaponOnWeaponInv = true;
                // console.log(weaponOnWeaponInv)
              }

              element.removeClass('active');

              element.each(function() {
                if ($(this).children().attr('src') != null) {
                  $(this).addClass('use');
                }
              });
              
              element.unbind();
              $(holdStr).unbind();

              unSetWeapon = that.compare('#' + this.id);

              that.sendChangedInfo({
                'action' : 'swap',
                'setItem' : setWeapon,
                'unSetItem' : unSetWeapon
              });
              id = 0;
              $('.app').css('cursor','default');
              weaponClicked = false;
            // } else {
              // weaponOnWeaponInv = false;
              // console.log(weaponOnWeaponInv)
            }
          });

          //---------------------ставим оружие в трюм
          $(holdStr).on('click', function() {
            if(!otherClicked) {
              var oldInvSrc = $(this).children().attr('src');
              var invType = $(this).attr('inv_got_type');
              var index = choosedItem.match(/\d+/);

              if(oldInvSrc == null) {
                var img = $('<img class="object_in_inventory">');
                img.attr('src', choosedItem);
                img.appendTo(this);
                $(this).attr('inv_got_type', setWeapon);
                $(this).attr('inv_got_id', index);

                that.sendChangedInfo({
                  'action' : 'swap',
                  'setItem' : setWeapon,
                  'unSetItem' : $(this).attr('inv_hold_num')
                });

                $(id).children().remove();
                $(weaponsId).removeClass('active');
                $(weaponsId).each(function() {
                  if ($(this).children().attr('src') != null) {
                    $(this).addClass('use');
                  }
                });

              } else {

                if (['w1','w2','w3','w4','w5','gun'].indexOf(invType) > -1) {
                  swapWeapon = true;
                  $(this).children().attr('src', choosedItem);
                  $(this).attr('inv_got_id', index);
                  var img = $('<img class="object_in_cell">');
                  img.attr('src', oldInvSrc);
                  img.appendTo(id);

                  $(weaponsId).removeClass('active');
                  $(weaponsId).each(function() {
                    if ($(this).children().attr('src') != null) {
                      $(this).addClass('use');
                    }
                  });

                  that.sendChangedInfo({
                    'action' : 'swap',
                    'setItem' : setWeapon,
                    'unSetItem' : $(this).attr('inv_hold_num')
                  });
                }

              }

              $(weaponsId).unbind();
              $(holdStr).unbind();
              id = 0;
              $('.app').css('cursor','default');
              weaponClicked = false;
            }
          });

      } else {

        //--------------------------------------------остальное-----------------------------------------------

          if(!anotherElement && !weaponClicked) {
            otherClicked = true;
            $(id).addClass('active').removeClass('use').addClass('clicked');

            $('.app').css('cursor','url(' + choosedItem + '), auto');
            $(id).children().remove();
            if(id == '#cell_engine') {
              $('#speed_static_count').text('0');
            }
          } 


          //---------------------клики по клеткам
          $('.cell').bind("click", function() {

            if(!weaponClicked) {
              if(id == '#' + $(this).attr('id')) {
                if(id == '#cell_engine') {
                  console.log(speed)
                  $('#speed_static_count').text(speed);
                }
                var oldSrc = $(this).children().attr('src');
                var element = $('.cell');

                var img = $('<img class="object_in_cell">');
                img.attr('src', choosedItem);
                img.appendTo(this);

                element.removeClass('active');
                element.each(function() {
                  if ($(this).children().attr('src') != null) {
                    $(this).addClass('use');
                  }
                });
                
                element.unbind();
                $(holdStr).unbind();
                id = 0;
                $('.app').css('cursor','default');
                otherClicked = false;
                anotherElement = false;
              } else {
                anotherElement = true;
              }
            }
          });

          //----------------------------------ставим в трюм
          $(holdStr).bind('click', function() {
            if(!weaponClicked) {
              var oldInvSrc = $(this).children().attr('src');
              var index = choosedItem.match(/\d+/);
              var invType = $(this).attr('inv_got_type');

              if(oldInvSrc == null) {
                var img = $('<img class="object_in_inventory">');
                img.attr('src', choosedItem);
                img.appendTo(this);
                var itemType = id.replace('#cell_', '');
                $(this).attr('inv_got_type', itemType);
                $(this).attr('inv_got_id', index);

                that.sendChangedInfo({
                  'action' : 'swap',
                  'setItem' : id.replace('#cell_',''),
                  'unSetItem' : $(this).attr('inv_hold_num')
                });

                $(id).removeClass('active');

              } else {

                if(invType == id.replace('#cell_','')) {
                  $(this).children().attr('src', choosedItem);
                  $(this).attr('inv_got_id', index);
                  elem.attr('src', oldInvSrc);

                  that.sendChangedInfo({
                    'action' : 'swap',
                    'putItem' : id.replace('#cell_',''),
                    'setItem' : invType
                  });
                }

              }
              anotherElement = false;
              $('.cell').unbind();
              $(holdStr).unbind();
              $(id).removeClass('active').removeClass('clicked');
              id = 0;
              $('.app').css('cursor','default');
              otherClicked = false;
            }
          });
      }

      that.deleteItem(id, setWeapon);

    },
    deleteItem: function(id, setWeapon) {
      var that = this;
        $('.wrapGate').bind('click', function() {
          console.log(id)
          if(id != 0) {
            $(id).removeClass('active').removeClass('use');
            $(id).children().remove('img');
            
            $(this).unbind();

            if(setWeapon == 0) {
              var deletedItem = id.replace('#cell_', '');
            } else {
              var deletedItem = setWeapon;
            }

            // that.sendChangedInfo({
            //   'action' : 'delete',
            //   'deletedItem' : deletedItem
            // });
          }
        });
    },
    sendChangedInfo: function(data) {
      $.ajax({
        url: this.url,
        type: 'POST',
        data: data,
        success: function(resp) {
          if (resp.status === 200) {
            console.log('resp', resp)
            console.log("200");
          } else if (resp.status === 403) {
            console.log("403");
          }
          console.log("success")
        },
        error: function() {
          console.log("sending data error");
        }
      });
    },
    compare: function(dataId) {
      var returnedWeapon = '';
      switch(dataId) {
        case '#cell_weapon_1_1':
          returnedWeapon = 'w1';
          break;
        case '#cell_weapon_1_2':
          returnedWeapon = 'w2';
          break;
        case '#cell_weapon_2_1':
          returnedWeapon = 'w3';
          break;
        case '#cell_weapon_2_2':
          returnedWeapon = 'w4';
          break;
        case '#cell_weapon_2_3':
          returnedWeapon = 'w5';
          break;
      }
      return returnedWeapon;
    },
    render: function() {
      if(this.model.attributes.length > 1) {
        this.$el.html(this.template());
        return this;
      }
    },
    show: function () {
      this.trigger('show', this);
    },
    closeProfile: function() {
      var cursorType = $('.app').css('cursor');
      if(cursorType.indexOf("url") > -1) {

        cursorType = cursorType.replace('8000', '');
        var elementId = cursorType.match(/\d+/);

        if(cellClicked) {
          var img = $('<img class="object_in_cell">');
          cellClicked = false;
        } else if(invClick) {
          var img = $('<img class="object_in_inventory">');
          invClick = false;
        }
        img.attr('src', '/images/profile/res/' + elementId + '.png');
        img.appendTo(setId);
        var cell = $('.cell');
        cell.removeClass('active');
        cell.each(function() {
          if ($(this).children().attr('src') != null) {
            $(this).addClass('use');
          }
        });
        $('.app').css('cursor', 'default');
      }

      this.$el.hide();
    }
  });

  return new ProfileView();
});

define('views/toolbar',[
  'jquery',
  'backbone',
  'tmpl/toolbar',
  'models/user',
  'views/profile',
  'views/game'
], function ($, Backbone, tmpl, userModel, profileView, gameView) {

  var HeaderView = Backbone.View.extend({
    model: userModel,
    template : tmpl, 
    className: 'toolbar',
    profile: profileView,
    showed: false,
    events: {
      'click .toolbar_ship': 'openProfile'
    },
    initialize: function () {
      this.$container = $('#toolbar');
      this.listenTo(this.model, 'change', this.render);
      this.render();
    },
    render: function () {
      this.$el.html(this.template(this.model));
      return this;
    },
    openProfile: function() {
      if (this.showed) {
        profileView.$el.show();
      } else {
        gameView.$el.append(profileView.render().$el);
        this.showed = true;
      }
    }
  });

  return new HeaderView();

});

define('tmpl/panel',[],function () { return function (__fest_context){var __fest_self=this,__fest_buf="",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html="",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file="",__fest_debug_line="",__fest_debug_block="",__fest_htmlchars=/[&<>"]/g,__fest_htmlchars_test=/[&<>"]/,__fest_short_tags = {"area":true,"base":true,"br":true,"col":true,"command":true,"embed":true,"hr":true,"img":true,"input":true,"keygen":true,"link":true,"meta":true,"param":true,"source":true,"wbr":true},__fest_element_stack = [],__fest_htmlhash={"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"},__fest_jschars=/[\\'"\/\n\r\t\b\f<>]/g,__fest_jschars_test=/[\\'"\/\n\r\t\b\f<>]/,__fest_jshash={"\"":"\\\"","\\":"\\\\","/":"\\/","\n":"\\n","\r":"\\r","\t":"\\t","\b":"\\b","\f":"\\f","'":"\\'","<":"\\u003C",">":"\\u003E"},___fest_log_error;if(typeof __fest_error === "undefined"){___fest_log_error = (typeof console !== "undefined" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+"\nin block \""+__fest_debug_block+"\" at line: "+__fest_debug_line+"\nfile: "+__fest_debug_file)}function __fest_replaceHTML(chr){return __fest_htmlhash[chr]}function __fest_replaceJS(chr){return __fest_jshash[chr]}function __fest_extend(dest, src){for(var i in src)if(src.hasOwnProperty(i))dest[i]=src[i];}function __fest_param(fn){fn.param=true;return fn}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]=="function"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}function __fest_escapeJS(s){if (typeof s==="string") {if (__fest_jschars_test.test(s))return s.replace(__fest_jschars,__fest_replaceJS);} else if (typeof s==="undefined")return "";return s;}function __fest_escapeHTML(s){if (typeof s==="string") {if (__fest_htmlchars_test.test(s))return s.replace(__fest_htmlchars,__fest_replaceHTML);} else if (typeof s==="undefined")return "";return s;}var user=__fest_context;try{__fest_if=user.isLogined()}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf+=("<div id=\"panel_logined\" class=\"panel_logined\"><button class=\"panel__button panel__button_logout js-logout\">Выход</button><div class=\"player_name\">Михаил</div><div class=\"player_level\">11</div><div class=\"player_race\"><img src=\"\/images\/createprofile\/race_human.png\"/></div><div class=\"player_ava\"><img src=\"\/images\/createprofile\/race_human.png\"/></div><div class=\"player_exp\"><div class=\"exp\"></div></div><div class=\"player_hp\"><div class=\"hp_count\">75\/100</div><div class=\"hp\"></div></div><div class=\"player_mp\"><div class=\"mp_count\">34\/50</div><div class=\"mp\"></div></div></div><div class=\"panel_enemy\"><div class=\"enemy_name\">Михаил</div><div class=\"enemy_hp\"><div class=\"hp_count\">75\/100</div><div class=\"hp\"></div></div><div class=\"enemy_mp\"><div class=\"mp_count\">34\/50</div><div class=\"mp\"></div></div><div class=\"enemy_ava\"><img src=\"\/images\/createprofile\/race_human.png\"/></div></div>");}else{__fest_buf+=("<a href=\"#createProfile\" class=\"panel__button panel__button_createprofile\">Создать профиль</a><a href=\"#login\" class=\"panel__button panel__button_login\">Вход</a><a href=\"#signup\" class=\"panel__button panel__button_signup\">Регистрация</a>");}__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk==="string") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}} ; });
define('views/panel',[
  'jquery',
  'backbone',
  'models/user',
  'tmpl/panel'
], function ($, Backbone, userModel, tmpl) {
  var PanelView = Backbone.View.extend({
    tagName: 'div',
    className: 'panel_block',
    model: userModel,
    events: {
      'click .js-logout': 'logout'
    },
    template: function () {
      return tmpl(this.model);
    },
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.render();
    },
    render: function () {
        this.$el.html(this.template());
        if (this.model.isLogined()) {
          console.log('trueLog')
          this.$el.find('#panel_logined').addClass('panel_logined');
          this.$el.find('#panel_logined').removeClass('panel_unlogined');
        }
        else{
        console.log('falseLog')
            this.$el.find("#panel_logined").addClass('panel_unlogined');
          this.$el.find("#panel_logined").removeClass('panel_logined');
        }
        return this;
    },
    logout: function () {
      userModel.logout();
    }
  });
  
  return new PanelView();
});
define('views/app',[
  'jquery',
  'backbone',
  'tmpl/app',
  'views/toolbar',
  'views/panel',
  'models/user',
  'views/game'
], function ($, Backbone, tmpl, toolbarView, panelView, userModel, gameView) {

  var AppView = Backbone.View.extend({
      tagName: 'div',
      className: 'app',
      model: userModel,
      initialize: function() {
        this.$container = $('body');
        this.render();
        window.onresize = gameView.render.bind(gameView);
      },
      template: tmpl,
      render: function () {
        this.$el.html(this.template());
        this.$container.html(this.$el);
        this.$container.append(toolbarView.render().$el);
        this.$container.append(panelView.render().$el);
      },
      subscribe: function (views) {
        for (var i = 0; i < views.length; i++) {
          this.listenTo(views[i], 'show', this.add);
        }
      },
      unsubscribe: function (view) {
        this.stopListening(view);
      },
      add: function (view) {
        console.log('add', view);
        this.$el.find('#page').html(view.$el);
      }
  });

  return new AppView();

});

define('routes',[
  'jquery',
  'backbone',
  'views/home',
  'views/game',
  'views/login',
  'views/signup',
  // 'views/profile',
  'views/scoreboard',
  'views/createProfile',
  'views/rating',
  'views/app',
  'models/user',
  'models/ship'
], function($, Backbone, homeView, gameView, loginView, signupView, scoreboardView,createProfileView ,ratingView ,manager, userModel, ShipModel) {
  
  manager.subscribe([homeView, gameView, loginView, signupView, scoreboardView,createProfileView, ratingView]);
  
  var Router = Backbone.Router.extend({
    initialize: function () {
        this.listenTo(userModel, 'login:ok', this.toGame);
        this.listenTo(userModel, 'signup:ok', this.toLogin);
        this.listenTo(userModel, 'login:bad', this.toLogin);
        this.listenTo(userModel, 'logout', this.toMain);
        this.listenTo(ShipModel, 'login-bad', this.toLogin);
    },
    routes: {
      '': 'index',
      'game': 'game',
      'login': 'login',
      'signup': 'signup',
      // 'profile': 'profile',
      'scoreboard': 'scoreboard',
      'createProfile': 'createProfile',
      'rating': 'rating',
      '*other': 'default'
    },
    index: function() {
      homeView.show();
    },
    game: function() {
      gameView.show();
    },
    login: function() {
      loginView.show();
    },
    signup: function() {
      signupView.show();
    },
    // profile: function() {
    //   profileView.show();
    // },
    scoreboard: function() {
      scoreboardView.show();
    },
    rating: function() {
      ratingView.show();
    },
    createProfile: function() {
      console.log('createProfile')
      createProfileView.show();
    },
    default: function () {
      alert('404');
    },
    toGame: function () {
      this.navigate('game', {trigger: true});
    },
    toLogin: function () {
      this.navigate('login', {trigger: true});
    },
    toMain: function () {
      this.navigate('', {trigger: true});
    }
  });

  return new Router();
});

define('baron',['jquery'], function ($) {

(function(window, undefined) {
    

    if (!window) return; // Server side

var
    _baron = baron, // Stored baron value for noConflict usage
    pos = ['left', 'top', 'right', 'bottom', 'width', 'height'],
    origin = {
        v: { // Vertical
            x: 'Y', pos: pos[1], oppos: pos[3], crossPos: pos[0], crossOpPos: pos[2], size: pos[5], crossSize: pos[4],
            client: 'clientHeight', crossClient: 'clientWidth', crossScroll: 'scrollWidth', offset: 'offsetHeight', crossOffset: 'offsetWidth', offsetPos: 'offsetTop',
            scroll: 'scrollTop', scrollSize: 'scrollHeight'
        },
        h: { // Horizontal
            x: 'X', pos: pos[0], oppos: pos[2], crossPos: pos[1], crossOpPos: pos[3], size: pos[4], crossSize: pos[5],
            client: 'clientWidth', crossClient: 'clientHeight', crossScroll: 'scrollHeight', offset: 'offsetWidth', crossOffset: 'offsetHeight', offsetPos: 'offsetLeft',
            scroll: 'scrollLeft', scrollSize: 'scrollWidth'
        }
    },

    each = function(obj, iterator) {
        var i = 0;

        if (obj.length === undefined || obj === window) obj = [obj];

        while (obj[i]) {
            iterator.call(this, obj[i], i);
            i++;
        }
    },

    baron = function(params) {
        var jQueryMode,
            roots,
            $;

        params = params || {};
        $ = params.$ || window.jQuery;
        jQueryMode = this instanceof $;  // this - window or jQuery instance

        if (jQueryMode) {
            params.root = roots = this;
        } else {
            roots = $(params.root || params.scroller);
        }

        return new baron.fn.constructor(roots, params, $);
    };

    baron.fn = {
        constructor: function(roots, input, $) {
            var params = validate(input);

            params.$ = $;
            each.call(this, roots, function(root, i) {
                var localParams = clone(params);

                if (params.root && params.scroller) {
                    localParams.scroller = params.$(params.scroller, root);
                    if (!localParams.scroller.length) {
                        localParams.scroller = root;
                    }
                } else {
                    localParams.scroller = root;
                }

                localParams.root = root;
                this[i] = init(localParams);
                this.length = i + 1;
            });

            this.params = params;
        },

        dispose: function() {
            var params = this.params;

            if (this[0]) { /* Если есть хотя бы 1 рабочий инстанс */
                each(this, function(item) {
                    item.dispose(params);
                });
            }
            this.params = null;
        },

        update: function() {
            var i = 0;

            while (this[i]) {
                this[i].update.apply(this[i], arguments);
                i++;
            }
        },

        baron: function(params) {
            params.root = [];
            params.scroller = this.params.scroller;

            each.call(this, this, function(elem) {
                params.root.push(elem.root);
            });
            params.direction = (this.params.direction == 'v') ? 'h' : 'v';
            params._chain = true;

            return baron(params);
        }
    };

    function manageEvents(item, eventManager, mode) {
        item._eventHandlers = item._eventHandlers || [ // Creating new functions for one baron item only one time
            {
                // onScroll:
                element: item.scroller,

                handler: function(e) {
                    item.scroll(e);
                },

                type: 'scroll'
            }, {
                // onKeyup (textarea):
                element: item.scroller,

                handler: function() {
                    item.update();
                },

                type: 'keyup'
            }, {
                // onMouseDown:
                element: item.bar,

                handler: function(e) {
                    e.preventDefault(); // Text selection disabling in Opera... and all other browsers?
                    item.selection(); // Disable text selection in ie8
                    item.drag.now = 1; // Save private byte
                },

                type: 'touchstart mousedown'
            }, {
                // onMouseUp:
                element: document,

                handler: function() {
                    item.selection(1); // Enable text selection
                    item.drag.now = 0;
                },

                type: 'mouseup blur touchend'
            }, {
                // onCoordinateReset:
                element: document,

                handler: function(e) {
                    if (e.button != 2) { // Not RM
                        item._pos0(e);
                    }
                },

                type: 'touchstart mousedown'
            }, {
                // onMouseMove:
                element: document,

                handler: function(e) {
                    if (item.drag.now) {
                        item.drag(e);
                    }
                },

                type: 'mousemove touchmove'
            }, {
                // onResize:
                element: window,

                handler: function() {
                    item.update();
                },

                type: 'resize'
            }, {
                // sizeChange:
                element: item.root,

                handler: function() {
                    item.update();
                },

                type: 'sizeChange'
            }
        ];

        each(item._eventHandlers, function(event) {
            if (event.element) {
                eventManager(event.element, event.type, event.handler, mode);
            }
        });

        // if (item.scroller) {
        //     event(item.scroller, 'scroll', item._eventHandlers.onScroll, mode);
        // }
        // if (item.bar) {
        //     event(item.bar, 'touchstart mousedown', item._eventHandlers.onMouseDown, mode);
        // }
        // event(document, 'mouseup blur touchend', item._eventHandlers.onMouseUp, mode);
        // event(document, 'touchstart mousedown', item._eventHandlers.onCoordinateReset, mode);
        // event(document, 'mousemove touchmove', item._eventHandlers.onMouseMove, mode);
        // event(window, 'resize', item._eventHandlers.onResize, mode);
        // if (item.root) {
        //     event(item.root, 'sizeChange', item._eventHandlers.onResize, mode); // Custon event for alternate baron update mechanism
        // }
    }

    function manageAttr(node, direction, mode) {
        var attrName = 'data-baron-' + direction;

        if (mode == 'on') {
            node.setAttribute(attrName, 'inited');
        } else if (mode == 'off') {
            node.removeAttribute(attrName);
        } else {
            return node.getAttribute(attrName);
        }
    }

    function init(params) {
        if (manageAttr(params.root, params.direction)) throw new Error('Second baron initialization');

        var out = new item.prototype.constructor(params); // __proto__ of returning object is baron.prototype

        manageEvents(out, params.event, 'on');

        manageAttr(out.root, params.direction, 'on');

        out.update({
            initMode: true
        });

        return out;
    }

    function clone(input) {
        var output = {};

        input = input || {};

        for (var key in input) {
            if (input.hasOwnProperty(key)) {
                output[key] = input[key];
            }
        }

        return output;
    }

    function validate(input) {
        var output = clone(input);

        output.direction = output.direction || 'v';

        var event = input.event || function(elem, event, func, mode) {
            output.$(elem)[mode || 'on'](event, func);
        };

        output.event = function(elems, e, func, mode) {
            each(elems, function(elem) {
                event(elem, e, func, mode);
            });
        };

        return output;
    }

    function fire(eventName) {
        /* jshint validthis:true */
        if (this.events && this.events[eventName]) {
            for (var i = 0 ; i < this.events[eventName].length ; i++) {
                var args = Array.prototype.slice.call( arguments, 1 );

                this.events[eventName][i].apply(this, args);
            }
        }
    }

    var item = {};

    item.prototype = {
        constructor: function(params) {
            var $,
                barPos,
                scrollerPos0,
                track,
                resizePauseTimer,
                scrollPauseTimer,
                scrollingTimer,
                pause,
                scrollLastFire,
                resizeLastFire,
                oldBarSize;

            resizeLastFire = scrollLastFire = new Date().getTime();

            $ = this.$ = params.$;
            this.event = params.event;
            this.events = {};

            function getNode(sel, context) {
                return $(sel, context)[0]; // Can be undefined
            }

            // DOM elements
            this.root = params.root; // Always html node, not just selector
            this.scroller = getNode(params.scroller); // (params.scroller) ? getNode(params.scroller, this.root) : this.root;
            this.bar = getNode(params.bar, this.root);
            track = this.track = getNode(params.track, this.root);
            if (!this.track && this.bar) {
                track = this.bar.parentNode;
            }
            this.clipper = this.scroller.parentNode;

            // Parameters
            this.direction = params.direction;
            this.origin = origin[this.direction];
            this.barOnCls = params.barOnCls;
            this.scrollingCls = params.scrollingCls;
            this.barTopLimit = 0;
            pause = params.pause * 1000 || 0;

            // Updating height or width of bar
            function setBarSize(size) {
                /* jshint validthis:true */
                var barMinSize = this.barMinSize || 20;

                if (size > 0 && size < barMinSize) {
                    size = barMinSize;
                }

                if (this.bar) {
                    $(this.bar).css(this.origin.size, parseInt(size, 10) + 'px');
                }
            }

            // Updating top or left bar position
            function posBar(pos) {
                /* jshint validthis:true */
                if (this.bar) {
                    $(this.bar).css(this.origin.pos, +pos + 'px');
                }
            }

            // Free path for bar
            function k() {
                /* jshint validthis:true */
                return track[this.origin.client] - this.barTopLimit - this.bar[this.origin.offset];
            }

            // Relative content top position to bar top position
            function relToPos(r) {
                /* jshint validthis:true */
                return r * k.call(this) + this.barTopLimit;
            }

            // Bar position to relative content position
            function posToRel(t) {
                /* jshint validthis:true */
                return (t - this.barTopLimit) / k.call(this);
            }

            // Cursor position in main direction in px // Now with iOs support
            this.cursor = function(e) {
                return e['client' + this.origin.x] || (((e.originalEvent || e).touches || {})[0] || {})['page' + this.origin.x];
            };

            // Text selection pos preventing
            function dontPosSelect() {
                return false;
            }

            this.pos = function(x) { // Absolute scroller position in px
                var ie = 'page' + this.origin.x + 'Offset',
                    key = (this.scroller[ie]) ? ie : this.origin.scroll;

                if (x !== undefined) this.scroller[key] = x;

                return this.scroller[key];
            };

            this.rpos = function(r) { // Relative scroller position (0..1)
                var free = this.scroller[this.origin.scrollSize] - this.scroller[this.origin.client],
                    x;

                if (r) {
                    x = this.pos(r * free);
                } else {
                    x = this.pos();
                }

                return x / (free || 1);
            };

            // Switch on the bar by adding user-defined CSS classname to scroller
            this.barOn = function(dispose) {
                if (this.barOnCls) {
                    if (dispose || this.scroller[this.origin.client] >= this.scroller[this.origin.scrollSize]) {
                        $(this.root).removeClass(this.barOnCls);
                    } else {
                        $(this.root).addClass(this.barOnCls);
                    }
                }
            };

            this._pos0 = function(e) {
                scrollerPos0 = this.cursor(e) - barPos;
            };

            this.drag = function(e) {
                this.scroller[this.origin.scroll] = posToRel.call(this, this.cursor(e) - scrollerPos0) * (this.scroller[this.origin.scrollSize] - this.scroller[this.origin.client]);
            };

            // Text selection preventing on drag
            this.selection = function(enable) {
                this.event(document, 'selectpos selectstart', dontPosSelect, enable ? 'off' : 'on');
            };

            // onResize & DOM modified handler
            this.resize = function() {
                var self = this,
                    delay = 0;

                if (new Date().getTime() - resizeLastFire < pause) {
                    clearTimeout(resizePauseTimer);
                    delay = pause;
                }

                function upd() {
                    var delta,
                        client;

                    self.barOn();

                    client = self.scroller[self.origin.crossClient];

                    delta = self.scroller[self.origin.crossOffset] - client;

                    if (params.freeze && !self.clipper.style[self.origin.crossSize]) { // Sould fire only once
                        $(self.clipper).css(self.origin.crossSize, self.clipper[self.origin.crossClient] - delta + 'px');
                    }

                    $(self.scroller).css(self.origin.crossSize, self.clipper[self.origin.crossClient] + delta + 'px');

                    Array.prototype.unshift.call(arguments, 'resize');
                    fire.apply(self, arguments);

                    resizeLastFire = new Date().getTime();
                }

                if (delay) {
                    resizePauseTimer = setTimeout(upd, delay);
                } else {
                    upd();
                }
            };

            this.updatePositions = function() {
                var newBarSize,
                    self = this;

                if (self.bar) {
                    newBarSize = (track[self.origin.client] - self.barTopLimit) * self.scroller[self.origin.client] / self.scroller[self.origin.scrollSize];

                    // Positioning bar
                    if (parseInt(oldBarSize, 10) != parseInt(newBarSize, 10)) {
                        setBarSize.call(self, newBarSize);
                        oldBarSize = newBarSize;
                    }

                    barPos = relToPos.call(self, self.rpos());

                    posBar.call(self, barPos);
                }

                Array.prototype.unshift.call( arguments, 'scroll' );
                fire.apply(self, arguments);

                scrollLastFire = new Date().getTime();
            };

            // onScroll handler
            this.scroll = function() {
                var delay = 0,
                    self = this;

                if (new Date().getTime() - scrollLastFire < pause) {
                    clearTimeout(scrollPauseTimer);
                    delay = pause;
                }

                if (new Date().getTime() - scrollLastFire < pause) {
                    clearTimeout(scrollPauseTimer);
                    delay = pause;
                }

                if (delay) {
                    scrollPauseTimer = setTimeout(function() {
                        self.updatePositions();
                    }, delay);
                } else {
                    self.updatePositions();
                }

                if (self.scrollingCls) {
                    if (!scrollingTimer) {
                        this.$(this.scroller).addClass(this.scrollingCls);
                    }
                    clearTimeout(scrollingTimer);
                    scrollingTimer = setTimeout(function() {
                        self.$(self.scroller).removeClass(self.scrollingCls);
                        scrollingTimer = undefined;
                    }, 300);
                }

            };

            return this;
        },

        update: function(params) {
            fire.call(this, 'upd', params); // Update all plugins' params

            this.resize(1);
            this.updatePositions();

            return this;
        },

        dispose: function(params) {
            manageEvents(this, this.event, 'off');
            manageAttr(this.root, params.direction, 'off');
            $(this.scroller).css(this.origin.crossSize, '');
            this.barOn(true);
            fire.call(this, 'dispose');
        },

        on: function(eventName, func, arg) {
            var names = eventName.split(' ');

            for (var i = 0 ; i < names.length ; i++) {
                if (names[i] == 'init') {
                    func.call(this, arg);
                } else {
                    this.events[names[i]] = this.events[names[i]] || [];

                    this.events[names[i]].push(function(userArg) {
                        func.call(this, userArg || arg);
                    });
                }
            }
        }
    };

    baron.fn.constructor.prototype = baron.fn;
    item.prototype.constructor.prototype = item.prototype;

    // Use when you need "baron" global var for another purposes
    baron.noConflict = function() {
        window.baron = _baron; // Restoring original value of "baron" global var

        return baron;
    };

    baron.version = '0.7.7';

    if ($ && $.fn) { // Adding baron to jQuery as plugin
        $.fn.baron = baron;
    }
    window.baron = baron; // Use noConflict method if you need window.baron var for another purposes
    if (window['module'] && module.exports) {
        module.exports = baron.noConflict();
    }
})(window);

/* Fixable elements plugin for baron 0.6+ */
(function(window, undefined) {
    var fix = function(userParams) {
        var elements, viewPortSize,
            params = { // Default params
                outside: '',
                inside: '',
                before: '',
                after: '',
                past: '',
                future: '',
                radius: 0,
                minView: 0
            },
            topFixHeights = [], // inline style for element
            topRealHeights = [], // ? something related to negative margins for fixable elements
            headerTops = [], // offset positions when not fixed
            scroller = this.scroller,
            eventManager = this.event,
            $ = this.$,
            self = this;

        // i - number of fixing element, pos - fix-position in px, flag - 1: top, 2: bottom
        // Invocation only in case when fix-state changed
        function fixElement(i, pos, flag) {
            var ori = flag == 1 ? 'pos' : 'oppos';

            if (viewPortSize < (params.minView || 0)) { // No headers fixing when no enought space for viewport
                pos = undefined;
            }

            // Removing all fixing stuff - we can do this because fixElement triggers only when fixState really changed
            this.$(elements[i]).css(this.origin.pos, '').css(this.origin.oppos, '').removeClass(params.outside);

            // Fixing if needed
            if (pos !== undefined) {
                pos += 'px';
                this.$(elements[i]).css(this.origin[ori], pos).addClass(params.outside);
            }
        }

        function bubbleWheel(e) {
            try {
                i = document.createEvent('WheelEvent'); // i - for extra byte
                // evt.initWebKitWheelEvent(deltaX, deltaY, window, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey);
                i.initWebKitWheelEvent(e.originalEvent.wheelDeltaX, e.originalEvent.wheelDeltaY);
                scroller.dispatchEvent(i);
                e.preventDefault();
            } catch (e) {}
        }

        function init(_params) {
            var pos;

            for (var key in _params) {
                params[key] = _params[key];
            }

            elements = this.$(params.elements, this.scroller);

            if (elements) {
                viewPortSize = this.scroller[this.origin.client];
                for (var i = 0 ; i < elements.length ; i++) {
                    // Variable header heights
                    pos = {};
                    pos[this.origin.size] = elements[i][this.origin.offset];
                    if (elements[i].parentNode !== this.scroller) {
                        this.$(elements[i].parentNode).css(pos);
                    }
                    pos = {};
                    pos[this.origin.crossSize] = elements[i].parentNode[this.origin.crossClient];
                    this.$(elements[i]).css(pos);

                    // Between fixed headers
                    viewPortSize -= elements[i][this.origin.offset];

                    headerTops[i] = elements[i].parentNode[this.origin.offsetPos]; // No paddings for parentNode

                    // Summary elements height above current
                    topFixHeights[i] = (topFixHeights[i - 1] || 0); // Not zero because of negative margins
                    topRealHeights[i] = (topRealHeights[i - 1] || Math.min(headerTops[i], 0));

                    if (elements[i - 1]) {
                        topFixHeights[i] += elements[i - 1][this.origin.offset];
                        topRealHeights[i] += elements[i - 1][this.origin.offset];
                    }

                    if ( !(i == 0 && headerTops[i] == 0)/* && force */) {
                        this.event(elements[i], 'mousewheel', bubbleWheel, 'off');
                        this.event(elements[i], 'mousewheel', bubbleWheel);
                    }
                }

                if (params.limiter && elements[0]) { // Bottom edge of first header as top limit for track
                    if (this.track && this.track != this.scroller) {
                        pos = {};
                        pos[this.origin.pos] = elements[0].parentNode[this.origin.offset];
                        this.$(this.track).css(pos);
                    } else {
                        this.barTopLimit = elements[0].parentNode[this.origin.offset];
                    }
                    // this.barTopLimit = elements[0].parentNode[this.origin.offset];
                    this.scroll();
                }

                if (params.limiter === false) { // undefined (in second fix instance) should have no influence on bar limit
                    this.barTopLimit = 0;
                }
            }

            var event = {
                element: elements,

                handler: function() {
                    var parent = $(this)[0].parentNode,
                        top = parent.offsetTop,
                        num;

                    // finding num -> elements[num] === this
                    for (var i = 0 ; i < elements.length ; i++ ) {
                        if (elements[i] === this) num = i;
                    }

                    var pos = top - topFixHeights[num];

                    if (params.scroll) { // User defined callback
                        params.scroll({
                            x1: self.scroller.scrollTop,
                            x2: pos
                        });
                    } else {
                        self.scroller.scrollTop = pos;
                    }
                },

                type: 'click'
            };

            if (params.clickable) {
                this._eventHandlers.push(event); // For auto-dispose
                // eventManager(event.element, event.type, event.handler, 'off');
                eventManager(event.element, event.type, event.handler, 'on');
            }
        }

        this.on('init', init, userParams);

        var fixFlag = [], // 1 - past, 2 - future, 3 - current (not fixed)
            gradFlag = [];
        this.on('init scroll', function() {
            var fixState, hTop, gradState;

            if (elements) {
                var change;

                // fixFlag update
                for (var i = 0 ; i < elements.length ; i++) {
                    fixState = 0;
                    if (headerTops[i] - this.pos() < topRealHeights[i] + params.radius) {
                        // Header trying to go up
                        fixState = 1;
                        hTop = topFixHeights[i];
                    } else if (headerTops[i] - this.pos() > topRealHeights[i] + viewPortSize - params.radius) {
                        // Header trying to go down
                        fixState = 2;
                        // console.log('topFixHeights[i] + viewPortSize + topRealHeights[i]', topFixHeights[i], this.scroller[this.origin.client], topRealHeights[i]);
                        hTop = this.scroller[this.origin.client] - elements[i][this.origin.offset] - topFixHeights[i] - viewPortSize;
                        // console.log('hTop', hTop, viewPortSize, elements[this.origin.offset], topFixHeights[i]);
                        //(topFixHeights[i] + viewPortSize + elements[this.origin.offset]) - this.scroller[this.origin.client];
                    } else {
                        // Header in viewport
                        fixState = 3;
                        hTop = undefined;
                    }

                    gradState = false;
                    if (headerTops[i] - this.pos() < topRealHeights[i] || headerTops[i] - this.pos() > topRealHeights[i] + viewPortSize) {
                        gradState = true;
                    }

                    if (fixState != fixFlag[i] || gradState != gradFlag[i]) {
                        fixElement.call(this, i, hTop, fixState);
                        fixFlag[i] = fixState;
                        gradFlag[i] = gradState;
                        change = true;
                    }
                }

                // Adding positioning classes (on last top and first bottom header)
                if (change) { // At leats one change in elements flag structure occured
                    for (i = 0 ; i < elements.length ; i++) {
                        if (fixFlag[i] == 1 && params.past) {
                            this.$(elements[i]).addClass(params.past).removeClass(params.future);
                        }

                        if (fixFlag[i] == 2 && params.future) {
                            this.$(elements[i]).addClass(params.future).removeClass(params.past);
                        }

                        if (fixFlag[i] == 3) {
                            if (params.future || params.past) this.$(elements[i]).removeClass(params.past).removeClass(params.future);
                            if (params.inside) this.$(elements[i]).addClass(params.inside);
                        } else if (params.inside) {
                            this.$(elements[i]).removeClass(params.inside);
                        }

                        if (fixFlag[i] != fixFlag[i + 1] && fixFlag[i] == 1 && params.before) {
                            this.$(elements[i]).addClass(params.before).removeClass(params.after); // Last top fixed header
                        } else if (fixFlag[i] != fixFlag[i - 1] && fixFlag[i] == 2 && params.after) {
                            this.$(elements[i]).addClass(params.after).removeClass(params.before); // First bottom fixed header
                        } else {
                            this.$(elements[i]).removeClass(params.before).removeClass(params.after);
                        }

                        if (params.grad) {
                            if (gradFlag[i]) {
                                this.$(elements[i]).addClass(params.grad);
                            } else {
                                this.$(elements[i]).removeClass(params.grad);
                            }
                        }
                    }
                }
            }
        });

        this.on('resize upd', function(updParams) {
            init.call(this, updParams && updParams.fix);
        });
    };

    baron.fn.fix = function(params) {
        var i = 0;

        while (this[i]) {
            fix.call(this[i], params);
            i++;
        }

        return this;
    };
})(window);
/* Controls plugin for baron 0.6+ */
(function(window, undefined) {
    var controls = function(params) {
        var forward, backward, track, screen,
            self = this, // AAAAAA!!!!!11
            event;

        screen = params.screen || 0.9;

        if (params.forward) {
            forward = this.$(params.forward, this.clipper);

            event = {
                element: forward,

                handler: function() {
                    var y = self.pos() - params.delta || 30;

                    self.pos(y);
                },

                type: 'click'
            };

            this._eventHandlers.push(event); // For auto-dispose
            this.event(event.element, event.type, event.handler, 'on');
        }

        if (params.backward) {
            backward = this.$(params.backward, this.clipper);

            event = {
                element: backward,

                handler: function() {
                    var y = self.pos() + params.delta || 30;

                    self.pos(y);
                },

                type: 'click'
            };

            this._eventHandlers.push(event); // For auto-dispose
            this.event(event.element, event.type, event.handler, 'on');
        }

        if (params.track) {
            if (params.track === true) {
                track = this.track;
            } else {
                track = this.$(params.track, this.clipper)[0];
            }

            if (track) {
                event = {
                    element: track,

                    handler: function(e) {
                        var x = e['offset' + self.origin.x],
                            xBar = self.bar[self.origin.offsetPos],
                            sign = 0;

                        if (x < xBar) {
                            sign = -1;
                        } else if (x > xBar + self.bar[self.origin.offset]) {
                            sign = 1;
                        }

                        var y = self.pos() + sign * screen * self.scroller[self.origin.client];
                        self.pos(y);
                    },

                    type: 'mousedown'
                };

                this._eventHandlers.push(event); // For auto-dispose
                this.event(event.element, event.type, event.handler, 'on');
            }
        }
    };

    baron.fn.controls = function(params) {
        var i = 0;

        while (this[i]) {
            controls.call(this[i], params);
            i++;
        }

        return this;
    };
})(window);
/* Autotests plugin for baron 0.6+ (for developers) */
(function(window, undefined) {
    var test = function(params) {
        var errCount = 0,
            totalCount = 0;

        var log = function(type, msg, obj) {
            var text = type + ': ' + msg;

            switch (type) {
                case 'log': css = 'color: #0b0'; break;
                case 'warn': css = 'color: #fc9'; break;
                case 'error': css = 'color: #f00'; break;
            }
            totalCount++;
            if (type == 'log') {
                errCount++;
            }

            console.log('%c ' + totalCount + '. ' + text, css);
            if (obj !== undefined) {
                console.log(obj);
            }
        };

        if (this.scroller && this.scroller.nodeType === 1) {
            log('log', 'Scroller defined and has proper nodeType value', this.scroller);
        } else {
            log('error', 'Scroller not defined or has wrong type (should be html node).', this.scroller);
        }

        if (this.$ && typeof this.$ == 'function') {
            log('log', 'Local $ defined and it is a function');
        } else {
            log('error', 'Local $ has wrong value or is not defined, or custom params.dom and params.selector not defined', params.$);
        }

        if (this.scroller.getAttribute('data-baron-v')) {
            log('log', 'Baron initialized in vertical direction', this.scroller.getAttribute('data-baron-v'));
            if (this.scroller.clientHeight < this.scroller.scrollHeight && this.scroller.getAttribute('data-baron-v')) {
                log('log', 'There are enought space for scrolling in vertical direction right now', this.scroller.scrollHeight - this.scroller.clientHeight + 'px');
            } else {
                log('log', 'There are not enought space for scrolling in vertical direction right now');
            }
        }
        if (this.scroller.getAttribute('data-baron-h')) {
            log('log', 'Baron initialized in horizontal direction', this.scroller.getAttribute('data-baron-h'));
            if (this.scroller.clientWidth < this.scroller.scrollWidth) {
                log('log', 'There are enought space for scrolling in horizontal direction right now', this.scroller.scrollWidth - this.scroller.clientWidth + 'px');
            } else {
                log('log', 'There are not enought space for scrolling in horizontal direction right now');
            }
        }

        if (this.bar && this.bar.nodeType === 1) {
            log('log', 'Bar defined and has proper nodeType value', this.bar);
        } else {
            log('warn', 'Bar not defined or has wrong type (should be html node).', this.bar);
        }

        if (this.barOnCls) {
            log('log', 'CSS classname barOnCls defined', this.barOnCls);
        } else {
            log('warn', 'barOnCls not defined - bar will be visible or not visible all the time', this.barOnCls);
        }

        // Preformance test
        var t1 = new Date().getTime(),
            x;
        for (var i = 0 ; i < 1000 ; i += 10) {
            x = i % (this.scroller[this.origin.scrollSize] - this.scroller[this.origin.client]);
            this.pos(x);
            this.event(this.scroller, 'scroll', undefined, 'trigger');
        }
        var t2 = new Date().getTime();
        log('log', 'Preformance test: ' + (t2 - t1) / 1000 + ' milliseconds per scroll event');

        log('log', 'Result is ' + errCount + ' / ' + totalCount + '\n');
    };

    baron.fn.test = function(params) {
        var i = 0;

        while (this[i]) {
            test.call(this[i], params);
            i++;
        }

        return this;
    };
})(window);
/* Pull to load plugin for baron 0.6+ */
(function(window, undefined) {
    var pull = function(params) {
        var block = this.$(params.block),
            size = params.size || this.origin.size,
            limit = params.limit || 80,
            onExpand = params.onExpand,
            elements = params.elements || [],
            inProgress = params.inProgress || '',
            self = this,
            _insistence = 0,
            _zeroXCount = 0,
            _interval,
            _timer,
            _x = 0,
            _onExpandCalled,
            _waiting = params.waiting || 500,
            _on;

        function getSize() {
            return self.scroller[self.origin.scroll] + self.scroller[self.origin.offset];
        }

        // Scroller content height
        function getContentSize() {
            return self.scroller[self.origin.scrollSize];
        }

        // Scroller height
        function getScrollerSize() {
            return self.scroller[self.origin.client];
        }

        function step(x, force) {
            var k = x * 0.0005;

            return Math.floor(force - k * (x + 550));
        }

        function toggle(on) {
            _on = on;

            if (on) {
                update(); // First time with no delay
                _interval = setInterval(update, 200);
            } else {
                clearInterval(_interval);
            }
        }

        function update() {
            var pos = {},
                height = getSize(),
                scrollHeight = getContentSize(),
                dx,
                op4,
                scrollInProgress = _insistence == 1;

            op4 = 0; // Возвращающая сила
            if (_insistence > 0) {
                op4 = 40;
            }
            //if (_insistence > -1) {
                dx = step(_x, op4);
                if (height >= scrollHeight - _x && _insistence > -1) {
                    if (scrollInProgress) {
                        _x += dx;
                    }
                } else {
                    _x = 0;
                }

                if (_x < 0) _x = 0;

                pos[size] = _x + 'px';
                if (getScrollerSize() <= getContentSize()) {
                    self.$(block).css(pos);
                    for (var i = 0 ; i < elements.length ; i++) {
                        self.$(elements[i].self).css(elements[i].property, Math.min(_x / limit * 100, 100) + '%');
                    }
                }

                if (inProgress && _x) {
                    self.$(self.root).addClass(inProgress);
                }

                if (_x == 0) {
                    if (params.onCollapse) {
                        params.onCollapse();
                    }
                }

                _insistence = 0;
                _timer = setTimeout(function() {
                    _insistence = -1;
                }, _waiting);
            //}

            if (onExpand && _x > limit && !_onExpandCalled) {
                onExpand();
                _onExpandCalled = true;
            }

            if (_x == 0) {
                _zeroXCount++;
            } else {
                _zeroXCount = 0;
            }
            if (_zeroXCount > 1) {
                toggle(false);
                _onExpandCalled = false;
                if (inProgress) {
                    self.$(self.root).removeClass(inProgress);
                }
            }
        }

        this.on('init', function() {
            toggle(true);
        });

        this.on('dispose', function() {
            toggle(false);
        });

        this.event(this.scroller, 'mousewheel DOMMouseScroll', function(e) {
            var down = e.wheelDelta < 0 || (e.originalEvent && e.originalEvent.wheelDelta < 0) || e.detail > 0;

            if (down) {
                _insistence = 1;
                clearTimeout(_timer);
                if (!_on && getSize() >= getContentSize()) {
                    toggle(true);
                }
            }
            //  else {
            //     toggle(false);
            // }
        });
    };

    baron.fn.pull = function(params) {
        var i = 0;

        while (this[i]) {
            pull.call(this[i], params);
            i++;
        }

        return this;
    };
})(window);
/* Autoupdate plugin for baron 0.6+ */
(function(window, undefined) {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null;

    var autoUpdate = function() {
        var self = this;

        this._observer = new MutationObserver(function() {
            self.update();
        });

        this.on('init', function() {
            self._observer.observe(self.root, {childList: true, subtree: true, characterData: true});
        });

        this.on('dispose', function() {
            self._observer.disconnect();
            delete self._observer;
        });

    };

    baron.fn.autoUpdate = function(params) {
        if (!MutationObserver) return this;

        var i = 0;

        while (this[i]) {
            autoUpdate.call(this[i], params);
            i++;
        }

        return this;
    };
})(window);
});
require([
  'jquery',
  'backbone',
  'routes',
  'baron'
], function($, Backbone, router,baron) {
    Backbone.history.start();
});
define("main", function(){});

