class AdminError extends Error {
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'admin/' + code;
  }
}

export default AdminError;
