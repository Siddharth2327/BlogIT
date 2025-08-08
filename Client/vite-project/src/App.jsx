import './App.css'
import {Route, Routes, BrowserRouter} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import WrapperProtect from './components/WrapperProtect'
import Navbar from './components/Navbar'
import CreateBlog from './pages/CreateBlog'
import EditBlog from './pages/EditBlog'
import BlogDetail from './pages/BlogDetailed'
import MyBlogs from './pages/MyBlogs'

function App() {

  
  return (
    <>
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path ="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path ="/create" element={<WrapperProtect><CreateBlog/></WrapperProtect>}/>
        <Route path="/edit/:id" element={<WrapperProtect><EditBlog/></WrapperProtect>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/blog/:id" element={<BlogDetail/>} />
        <Route path="/my-blogs" element={<WrapperProtect><MyBlogs/></WrapperProtect>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
