class ResponseError extends Error {
  constructor(status, message) {
      super();
      this.status = status;
      this.message = message;
  }

  static badRequest(message) {
      return new ResponseError(404, message);
  }

  static internal(message) {
      return new ResponseError(500, message);
  }

  static forbidden(message) {
      return new ResponseError(403, message);
  }

}

module.exports = ResponseError;