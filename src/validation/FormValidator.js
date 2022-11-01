export const isMobileNumber = number => {
  const pattern = /^\d{10}$/;
  return pattern.test(number);
};

export const isEmailAddress = email => {
  const pattern = /(.+)@(.+){2,}\.(.+){2,}/;
  return pattern.test(email);
};
