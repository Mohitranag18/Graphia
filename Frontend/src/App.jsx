import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/useAuth.jsx';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx'
import Login from './routes/login';
import Register from './routes/register';

import PrivateRoute from './components/private_route.jsx';

import ChatRoom from './components/chat.jsx';
import UserProfile from './routes/userProfile.jsx';
import Home from './routes/home.jsx';
import CreatePost from './routes/create_post.jsx';
import Search from './routes/search.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route element={
              <PrivateRoute>
                <ChatRoom />
              </PrivateRoute>
            }
            path="/chat"
          />
          <Route element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
            path="/user/:username"
          />
          <Route element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
            path="/"
          />
          <Route element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
            path="/create/post"
          />
          <Route element={
              <PrivateRoute>
                <Search />
              </PrivateRoute>
            }
            path="/search"
          />
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
