export function notFound(_req, res) {
  res.status(404).json({ code: "NOT_FOUND" });
}

export function errorHandler(err, _req, res, _next) {
  if (err?.name === "MulterError") {
    return res.status(400).json({ code: "INVALID_FILE" });
  }
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ code: err.code || "SERVER_ERROR" });
}
