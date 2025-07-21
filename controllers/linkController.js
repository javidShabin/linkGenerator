// ******************* Link generating controllers ********************

// Create whatsapp link
export const createLink = async (req, res, next) => {
  try {
    res.send("Hello!");
  } catch (error) {
    next(error);
  }
};
