export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({
        code: "VALIDATION",
        details: error.details.map((detail) => ({
          path: detail.path.join("."),
          type: detail.type,
        })),
      });
    }
    req.body = value;
    next();
  };
}
