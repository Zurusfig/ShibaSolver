// Thrown by API helpers when the backend answers 401, so callers can tell
// "you're not signed in" apart from a real failure and prompt the user.
export class SignInRequiredError extends Error {
  constructor() {
    super("Sign in required");
    this.name = "SignInRequiredError";
  }
}
