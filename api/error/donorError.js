class DonorError extends Error {
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'donor/' + code;
  }
}

export default DonorError;
