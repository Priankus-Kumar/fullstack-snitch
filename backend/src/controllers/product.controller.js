export const createProductController = async (req, res) => {
  console.log(req.body);
  console.log(req.files)
  return res.status(200).json({ message: "done" });
};
