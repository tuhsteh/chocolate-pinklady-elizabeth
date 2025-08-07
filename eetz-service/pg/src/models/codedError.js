class CodedError extends Error {
  constructor(message, { code, reason }) {
    super(reason);
    this.name = 'CodedError';
    this.code = code;
    this.reason = reason;
  }
}

module.exports = { CodedError };
