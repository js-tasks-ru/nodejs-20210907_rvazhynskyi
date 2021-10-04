const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const parts = chunk.toString().split(os.EOL);

    if (this.lastPart) {
      this.push(this.lastPart + parts.shift());
      this.lastPart = '';
    }

    if (!this._endsWithEOL(chunk.toString())) {
      this.lastPart = parts.pop();
    }

    parts.forEach((part) => {
      this.push(part);
    });

    callback();
  }

  _flush(callback) {
    if (this.lastPart) {
      this.push(this.lastPart);
    }
    callback();
  }

  _endsWithEOL(chunk) {
    return chunk.length === (chunk.lastIndexOf(os.EOL) + 1);
  }
}

module.exports = LineSplitStream;
