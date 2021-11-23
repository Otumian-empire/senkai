module.exports = (schema, property = "body") => {
  return (req, res, next) => {
    const options = {
      abortEarly: true, // include all errors
      allowUnknown: true, // ignore unknown props
      convert: true
    };

    const { error } = schema.validate(req[property], options);
    const valid = error == null;

    if (valid) {
      return next();
    } else {
      const message = error.details
        .map(({ message, context }) => `${context.key} ${message}`)
        .join(",");

      return res.status(200).json({ success: false, message: message });
    }
  };
};
