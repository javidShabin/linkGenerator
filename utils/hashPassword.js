import bcrypt from "bcryptjs";

export const hashPassword = async (userPassword) => {
  const saltRounds = 10;
  return await bcrypt.hash(userPassword, saltRounds);
};

export const comparePassword = async (userPassword, hashedPassword) => {
  return await bcrypt.compare(userPassword, hashedPassword);
};
