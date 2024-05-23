/*
This code defines a React context and a provider component for managing and sharing the application's state related to blog posts.

The DataProvider component uses context to manage and share state across the application.
It includes state management for posts, search terms, form inputs, and event handlers for creating, editing, and deleting posts.
It uses custom hooks for fetching data and tracking window size.
The context values are made available to any component wrapped within the DataProvider.
*/


import { createContext, useState, useEffect } from "react"; //createContext: A function from React used to create a context. useState, useEffect: React hooks for managing state and side effects.
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns'; //format: A function from date-fns for formatting dates.
import api from '../api/posts'; //api: An Axios instance configured for API requests.
import useWindowSize from '../hooks/useWindowSize';
import useAxiosFetch from '../hooks/useAxiosFetch';

const DataContext = createContext({}); //DataContext: A context object created with createContext. It will be used to provide and consume state across the component tree.

export const DataProvider = ({ children }) => { //DataProvider: A functional component that wraps its children with the context provider.
//Below Various pieces of state are managed using the useState hook.
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editBody, setEditBody] = useState('');
    const navigate = useNavigate();
    const {width} = useWindowSize();
    const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/posts')

    useEffect(() => {
        setPosts(data);
    }, [data])

    useEffect(() => {
        const filteredResults = posts.filter(post =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase())
        );

        setSearchResults(filteredResults.reverse());
    }, [posts, search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const newPost = { id, title: postTitle, datetime, body: postBody };
        try {
        const response = await api.post('/posts', newPost);
        const allPosts = [...posts, response.data];
        setPosts(allPosts);
        setPostTitle('');
        setPostBody('');
        navigate('/');
        } catch (err) {
        console.log(`Error: ${err.message}`);
        }
    };

    const handleEdit = async (id) => {
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const updatedPost = { id, title: editTitle, datetime, body: editBody };
        try {
        const response = await api.put(`/posts/${id}`, updatedPost);
        setPosts(posts.map(post => (post.id === id ? { ...response.data } : post)));
        setEditTitle('');
        setEditBody('');
        navigate('/');
        } catch (err) {
        console.log(`Error: ${err.message}`);
        }
    };

    const handleDelete = async (id) => {
        try {
        await api.delete(`/posts/${id}`);
        const postsList = posts.filter(post => post.id !== id);
        setPosts(postsList);
        navigate('/');
        } catch (err) {
        console.log(`Error: ${err.message}`);
        }
  };
    return (
        <DataContext.Provider value = {{ //Provides the context values to all children components wrapped by DataProvider. This includes the state variables, event handlers, and data fetched from the API.
            width, search, setSearch,
            searchResults, fetchError, isLoading,
            handleSubmit, postTitle, setPostTitle, postBody, setPostBody,
            posts, handleEdit, editBody, setEditBody, editTitle, setEditTitle,
            handleDelete
        }}>
            {children}
        </DataContext.Provider>
    )
} 

export default DataContext; //Exports the DataContext for use in other components. Components can consume the context to access and manipulate the provided state and functions.

//How DataContext works with other Components

/*
The DataContext code defines a React context and a provider component that manage and share state across various components in your application. #
Here's how the relationship between DataContext and other components works:

1) Defining the Context and Provider

In the provided code, DataContext is created using createContext, and DataProvider is the component that wraps its children with the DataContext.Provider.

2)Wrapping the Application or Component Tree

To use the DataContext in other components, you need to wrap your component tree with the DataProvider. This is done in a top-level component like App (see DataProvider wrap under return statement in App.js).
By wrapping App with DataProvider, all components within App can access the context.

3)Consuming the Context in Components

Components that need to access the shared state and functions provided by DataContext use the useContext hook. E.g., const { posts, handleDelete } = useContext(DataContext);

4) Context Values

The values provided by the DataContext in the DataProvider are identified in this file where it states <DataContext.Provider value = {{...
These values are shared across all components wrapped by the DataProvider, allowing for centralized state management and function handling.
*/