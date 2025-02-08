import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/useAuth.jsx';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx'
import Login from './routes/login';
import Register from './routes/register';

import PrivateRoute from './components/private_route.jsx';

import ChatRoom from './components/chat.jsx';
import ChatRoomPrivate from './components/chatPrivate.jsx';
import UserProfile from './routes/userProfile.jsx';
import Home from './routes/home.jsx';
import CreatePost from './routes/create_post.jsx';
import Search from './routes/search.jsx';
import EditProfile from './routes/editProfile.jsx';
import Groups from './routes/groups.jsx';

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
            path="/chat/:roomname"
          />
          <Route element={
              <PrivateRoute>
                <Groups />
              </PrivateRoute>
            }
            path="/groups/"
          />
          <Route element={
              <PrivateRoute>
                <ChatRoomPrivate />
              </PrivateRoute>
            }
            path="/chatPrivate/:username"
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
          <Route element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
            path="/edit/profile"
          />
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
