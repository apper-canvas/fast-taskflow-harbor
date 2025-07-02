import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import TaskManager from '@/components/pages/TaskManager';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-white">
        <Layout>
          <Routes>
            <Route path="/" element={<TaskManager />} />
            <Route path="/category/:categoryId" element={<TaskManager />} />
            <Route path="/filter/:filter" element={<TaskManager />} />
          </Routes>
        </Layout>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;