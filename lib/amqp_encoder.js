/**
 * Simple encode logic for translating JS into AMQP object model.
 *
 * The encoding is as follows:
 *
 * Primitives
 * ==========
 *
 * * null: AMQP null value
 * * boolean: AMQP boolean
 * * string: AMQP string
 * * Buffer: AMQP binary
 * * ['u?(byte|short|int|long)', number]: AMQP numeric of appropriate size/signedness.
 * * ['(float|double)', number]: AMQP single/double-precision number.
 * * ['symbol', string]: AMQP Symbol value
 *
 * Composites
 * ==========
 *
 * * ['array', 'type', value1, value2, ...]: AMQP homogeneous array value
 *   Example: ['array', 'ulong', 1, 2, 3, 4]
 * * ['list', primitives...]: AMQP heterogeneous list value
 *   Example: ['list', 'value 1', ['symbol', 'value 2'], ['uint', 3]]
 * * ['map', primitives...]: AMQP heterogeneous map value
 *   Example: ['map', 'key1', ['uint', 1], ['symbol', 'key2'], 'value2']
 */
function AMQPEncoder() {
}

module.exports = AMQPEncoder;

AMQPEncoder.prototype.symbol = function(value) {
    return ['symbol', value];
};

AMQPEncoder.prototype.describedType = function(descriptor, value) {
    return ['described', descriptor, value];
};

AMQPEncoder.prototype.array = function(type, values) {
    return ['array', type].concat(values);
};

AMQPEncoder.prototype.list = function(values) {
    return ['list'].concat(values);
};

AMQPEncoder.prototype.map = function(values) {
    return ['map'].concat(values);
};