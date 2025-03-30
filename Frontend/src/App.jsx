import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/useAuth.jsx';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx'
import Login from './routes/login';
import Register from './routes/register';

import PrivateRoute from './components/private_route.jsx';

import ChatRoom from './components/chatgroup.jsx';
import ChatRoomPrivate from './components/chatPrivate.jsx';
import UserProfile from './routes/userProfile.jsx';
import Home from './routes/home.jsx';
import CreatePost from './routes/create_post.jsx';
import Search from './routes/search.jsx';
import EditProfile from './routes/editProfile.jsx';
import Groups from './routes/groups.jsx';
import GroupInfo from './components/group_info.jsx';
import ForgotPassword from './routes/forgot_password.jsx';
import ResetPassword from './routes/reset_password.jsx';
import PostDetails from './routes/post.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
        <Route element={
              <PrivateRoute>
                <GroupInfo />
              </PrivateRoute>
            }
            path="/chatroom/:roomname/info"
          />
          <Route element={
              <PrivateRoute>
                <ChatRoom />
              </PrivateRoute>
            }
            path="/chatroom/:roomname"
          />
          <Route element={
              <PrivateRoute>
                <Groups />
              </PrivateRoute>
            }
            path="/chat/"
          />
          <Route element={
              <PrivateRoute>
                <ChatRoomPrivate />
              </PrivateRoute>
            }
            path="/chat/:username"
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
          <Route element={
              <PrivateRoute>
                <PostDetails />
              </PrivateRoute>
            }
            path="/post/:id"
          />
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
          <Route element={<ForgotPassword />} path="/forgotPassword" />
          <Route element={<ResetPassword />} path="/resetPassword/:username/:token" />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
