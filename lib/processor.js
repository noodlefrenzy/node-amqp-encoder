/**
 * Processes encoded AMQP object by calling callbacks from the given map:
 *
 * * number: Invoked on numerics
 * * fixed: Fixed types - boolean, null
 * * variable: Simple variable types - string, symbol, binary
 * * described: Described type
 * * list: List
 * * map: Map
 * * array: Array
 *
 * Basic callbacks are of the signature (type, value) (e.g. ('uint', 123).
 */
module.exports = function(callbacks) {
    var cbMap = callbacks;
    var singleValue = function(encodedVal) {
        var isArray = encodedVal instanceof Array;
        var type = isArray ? encodedVal[0] : encodedVal;
        if (!isArray || encodedVal.length === 1) {
            // Likely a primitive type
            if (type === null) {
                cbMap.fixed('null', null);
                return;
            } else if (typeof type === 'boolean') {
                cbMap.fixed('boolean', type);
                return;
            } else if (type instanceof Buffer) {
                cbMap.variable('binary', type);
                return;
            }
        }
        switch (type) {
            case 'byte':
            case 'short':
            case 'int':
            case 'long':
            case 'ubyte':
            case 'ushort':
            case 'uint':
            case 'ulong':
            case 'float':
            case 'double':
                cbMap.number(type, encodedVal[1]);
                break;

            case 'null':
                cbMap.fixed('null', null);
                break;
            case 'boolean':
                cbMap.fixed('boolean', encodedVal[1]);
                break;

            case 'string':
            case 'symbol':
                cbMap.variable(type, encodedVal[1]);
                break;

            case 'list':
            case 'map':
            case 'array':
            case 'described':
                cbMap[type](type, encodedVal.slice(1));
                break;

            default:
                // If no val, assume it's just a raw string
                if (!isArray || encodedVal.length === 1) {
                    cbMap.variable('string', type);
                } else {
                    throw new Error('Unknown encoding type: ' + type);
                }
        }
    };
    return function(encoded) {
        if (encoded[0] instanceof Array) {
            // A set of encoded values.
            for (var idx = 0; idx < encoded.length; ++idx) {
                singleValue(encoded[idx]);
            }
        } else {
            // Only a single encoded value
            singleValue(encoded);
        }
    };
};