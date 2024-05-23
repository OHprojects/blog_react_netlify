import React from 'react';
import './index.css';
import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import EditPost from './EditPost';
import About from './About';
import Missing from './Missing';
import { Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';

function App() { //Note all contents have been moved to the DataContext file, tidying up the App.js file
  
  return (
    <div className="App">
      <DataProvider> {/* The DataProvider component wraps around the entire app content. This makes the context's value (state and functions) available to all child components within the DataProvider. */}
        <Header title="React JS Blog"/>
        <Nav/>
        <Routes>
          <Route index element={<Home/>} />
          <Route path='/post' element={<NewPost/>} />
          <Route path='/edit/:id' element={<EditPost/>} />
          <Route path='/post/:id' element={<PostPage/>} />
          <Route path='/about' element={<About />} />
          <Route path='*' element={<Missing />} />
        </Routes>
        <Footer />
      </DataProvider>
    </div>
  );
}

export default App;