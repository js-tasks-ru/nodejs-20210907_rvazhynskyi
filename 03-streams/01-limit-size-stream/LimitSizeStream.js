const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.transmissionLimit = options.limit;
    this.bytesTransmitted = 0;
  }

  _transform(chunk, encoding, callback) {
    this.checkTransmissionLimit(chunk.length);
    callback(null, chunk);
  }

  checkTransmissionLimit(length) {
    this.bytesTransmitted += length;
    if (this.bytesTransmitted > this.transmissionLimit) {
      this.emit('error', new LimitExceededError());
      throw new LimitExceededError();
    }
  }
}

module.exports = LimitSizeStream;
