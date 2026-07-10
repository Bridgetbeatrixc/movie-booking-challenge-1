export const validateRegistration = (name, email, password) => {
  const errors = [];
  
  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Name must be a valid string and cannot be empty.');
  }
  
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    errors.push('Invalid email format.');
  }
  
  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }
  
  return errors;
};

export const validateLogin = (email, password) => {
  const errors = [];
  
  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push('Email address is required and must be a valid string.');
  }
  
  if (!password || typeof password !== 'string' || password.trim() === '') {
    errors.push('Password is required.');
  }
  
  return errors;
};