import { axiosInstance } from "./index.js";

// Get all blogs (Public)
export const GetAllBlogs = async () => {
  try {
    const response = await axiosInstance.get("http://localhost:8080/api/blogs/all-blogs");
    return response.data;
  } catch (error) {
    console.error("Error fetching all blogs:", error);
  }
};

// Get a single blog by ID (Public)
export const GetBlogById = async (id) => {
  try {
    const response = await axiosInstance.get(`http://localhost:8080/api/blogs/blog/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
  }
};

// Create a new blog (Private)
export const CreateBlog = async (blogData) => {
  try {
    const response = await axiosInstance.post("http://localhost:8080/api/blogs/create", blogData);
    console.log("Blog created successfully");
    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
  }
};

// Update a blog by ID (Private)
export const UpdateBlog = async (id, blogData) => {
  try {
    const response = await axiosInstance.put(`http://localhost:8080/api/blogs/edit/${id}`, blogData);
    console.log("Blog updated successfully");
    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error);
  }
};

// Delete a blog by ID (Private)
export const DeleteBlogById = async (id) => {
  try {
    const response = await axiosInstance.delete(`http://localhost:8080/api/blogs/delete/${id}`);
    console.log("Blog deleted successfully");
    return response.data;
  } catch (error) {
    console.error("Error deleting blog:", error);
  }
};
