const express = require("express");
const router = express.Router();
const Blog = require("../model/blogModel"); // Assuming you have a Blog model

//  Get all blogs (Public Access)
router.get("/all-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
});

// Get a single blog by ID
router.get("/blog/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id); 
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error });
  }
});

// Create a new blog (Private, Only Authenticated Users)
router.post("/create", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newBlog = new Blog({ title, content, author });
    await newBlog.save();   
    res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error });
  }
});

// Update a blog (Private, Only Blog Author)
router.put("/edit/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const { title, content } = req.body;
    blog.title = title || blog.title;
    blog.content = content || blog.content;

    await blog.save();
    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error });
  }
});

// Delete a blog (Private, Only Blog Author)
router.delete("/delete/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
});

module.exports = router;
