// Maps for number <-> hex string conversion
var BYTE_TO_HEX = [];
var HEX_TO_BYTE = {};
for (var i = 0; i < 256; i++) {
  BYTE_TO_HEX[i] = (i + 0x100).toString(16).substr(1);
  HEX_TO_BYTE[BYTE_TO_HEX[i]] = i;
}

function parseUuid(s, buf, offset) {
  var i = (buf && offset) || 0, ii = 0;
  buf = buf || [];
  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
    if (ii < 16) { // Don't overflow!
      buf[i + ii++] = HEX_TO_BYTE[oct];
    }
  });

  // Zero out remaining bytes if string was short
  while (ii < 16) {
    buf[i + ii++] = 0;
  }

  return buf;
}

module.exports = {
  parseUuid: parseUuid
};