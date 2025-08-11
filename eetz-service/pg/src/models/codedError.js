class CodedError extends Error {
  constructor(message) {
    super(message.reason);
    this.name = 'CodedError';
    this.code = message.code || 500;
    this.reason = message.reason || message;
  }
}

module.exports = { CodedError };
