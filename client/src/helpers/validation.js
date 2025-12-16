const nameValidator = (value) => {
  if (value.length < 3) return "Name must be at least 3 characters long";
  if (value.length > 20) return "Name must be less than 20 characters long";
  if (!/^[a-zA-Z ]+$/.test(value))
    return "Name must contain only letters and spaces";
  return false;
};

const passwordValidator = (value) => {
  if (!value) return 'Password is required';
  if (value.length < 6) return 'Password must be at least 6 characters';
  if (value.length > 100) return 'Password too long';

  const hasUppercase = /[A-Z]/.test(value);
  const hasLowercase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);

  // if (!hasUppercase) return 'Password must contain at least one uppercase letter';
  // if (!hasLowercase) return 'Password must contain at least one lowercase letter';
  if (!hasNumber) return 'Password must contain at least one number';

  return false; // valid
};

const emailValidator = (value) => {
  if (!/^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/.test(value))
    return "Invalid email address";
  return false;
};

export {
    emailValidator,
    nameValidator,
    passwordValidator
}