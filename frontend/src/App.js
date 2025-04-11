// App.js  
import React from 'react';  
import { BrowserRouter as Router } from 'react-router-dom';  
import Layout from './components/layout';  
import AppRoutes from './routes'; // Updated import name

function App() {  
  return (  
    <Router>  
      <Layout>  
        <AppRoutes />  
      </Layout>  
    </Router>  
  );  
}  

export default App;