class NPOOrganizationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'npo-organization/' + code;
  }
}

export default NPOOrganizationError;
