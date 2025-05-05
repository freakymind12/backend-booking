const logRequest = (req, res, next) => {
  const start = Date.now();

  // Log awal request
  console.log(`[${new Date().toLocaleString()}] [REQ] - ${req.method} ${req.path}`);

  // Hook untuk menangkap respons selesai
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toLocaleString()}] [RES] - ${req.method} ${req.path} - [code]: ${res.statusCode} - [time]: ${duration}ms`
    );
  });

  next();
};


const errorMessage = (err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
};

module.exports = {
  logRequest,
  errorMessage,
};
