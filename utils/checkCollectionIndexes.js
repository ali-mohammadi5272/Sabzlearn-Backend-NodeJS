const checkDBCollectionIndexes = async (model) => {
  try {
    await model.listIndexes();
    return;
  } catch (err) {
    await model.createIndexes();
  }
};

module.exports = { checkDBCollectionIndexes };
