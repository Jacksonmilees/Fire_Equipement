import Page from "../models/PageModel.js";

const getPages = async (req, res) => {
  try {
    const pages = await Page.find();
    res.json(pages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const createPage = async (req, res) => {
  try {
    const page = new Page(req.body);
    await page.save();
    res.status(201).json(page);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updatePage = async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(page);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deletePage = async (req, res) => {
  try {
    await Page.findByIdAndDelete(req.params.id);
    res.json({ message: "Page deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export { getPages, createPage, updatePage, deletePage };
