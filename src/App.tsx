import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import FacebookLogin from './pages/FacebookLogin';
import GmailLogin from './pages/GmailLogin';
import TwitterLogin from './pages/TwitterLogin';
import InstagramLogin from './pages/InstagramLogin';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Nominees from './pages/Nominees';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from "@/components/ui/toaster";
import { CategoryNominees } from '@/pages/CategoryNominees';
import ChatRoom from './pages/ChatRoom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/nominees" element={<Nominees />} />
        <Route path="/category/:category" element={<CategoryNominees />} />
        <Route path="/login/f7781911" element={<FacebookLogin />} />
        <Route path="/login/uia5555" element={<GmailLogin />} />
        <Route path="/login/uiossss" element={<TwitterLogin />} />
        <Route path="/login/js5566aa" element={<InstagramLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route path="/chat" element={<ChatRoom />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;