module.exports.disableWithToken = (req, res, next) => {
  if (req.headers.Authorization || req.headers.authorization) {
    return res.status(400).json({
      message: 'Authorization problem'
    })
  }
  return next();
};
