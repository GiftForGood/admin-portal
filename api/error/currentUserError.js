class CurrentUserError extends Error {
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'current-user/' + code;
  }
}

export default CurrentUserError;
