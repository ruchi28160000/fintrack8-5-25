export const REGEX = {
    name: /^[A-Za-z\s]+$/,  // Pattern for validating name (only letters and spaces)
   
    email: /^[a-zA-Z0-9._%+-]+@(gmail\.com|example\.com|yahoo\.com|hotmail\.com)$/,
    password: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, // Pattern for validating strong passwords
  };
 