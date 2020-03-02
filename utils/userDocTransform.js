module.exports = (doc, ret) => {
  delete ret.password;
  delete ret.__v;
  delete ret._id;
  delete ret.updatedAt;
  return ret;
};
