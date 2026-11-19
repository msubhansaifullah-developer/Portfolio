const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact({ name = "", email = "", subject = "", message = "" }) {
  const errors = {};
  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanSubject = subject.trim();
  const cleanMessage = message.trim();

  if (cleanName.length < 2) errors.name = "Enter your name.";
  else if (cleanName.length > 100) errors.name = "Name must be 100 characters or fewer.";

  if (!emailPattern.test(cleanEmail)) errors.email = "Enter a valid email address.";
  else if (cleanEmail.length > 200) errors.email = "Email must be 200 characters or fewer.";

  if (cleanSubject.length < 2) errors.subject = "Enter a subject.";
  else if (cleanSubject.length > 150) errors.subject = "Subject must be 150 characters or fewer.";

  if (cleanMessage.length < 10) errors.message = "Enter a message of at least 10 characters.";
  else if (cleanMessage.length > 5000) errors.message = "Message must be 5,000 characters or fewer.";

  return errors;
}

export function isHoneypotTripped(value) {
  return Boolean(value && String(value).trim());
}
