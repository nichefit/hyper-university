export function mapAuthErrorMessage(
  message: string,
  code?: string,
): string {
  const lower = message.toLowerCase();

  if (
    code === "invalid_credentials" ||
    lower.includes("invalid login credentials")
  ) {
    return "Incorrect email or password.";
  }
  if (lower.includes("email not confirmed")) {
    return "Please verify your email before logging in. Check your inbox or resend the confirmation.";
  }
  if (lower.includes("user not found")) {
    return "No account found with this email.";
  }
  if (lower.includes("already registered")) {
    return "An account with this email already exists. Try logging in.";
  }
  if (lower.includes("password")) {
    return message;
  }

  return message || "Something went wrong. Please try again.";
}
