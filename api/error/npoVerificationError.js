class NPOVerificationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'npo-verification/' + code;
  }
}

export default NPOVerificationError;
