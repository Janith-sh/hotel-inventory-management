// App.js  
import React from 'react';  
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './components';  
import AppRoutes from './routes.js';

function App() {  
  return ( 
    <BrowserRouter> 
     <Layout>  
       <AppRoutes />  
     </Layout>  
    </BrowserRouter>
  );  
}  

export default App;