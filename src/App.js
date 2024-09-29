import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import QnaList from "./components/QnaList";
import Notices from "./components/NoticeList";
import MemberList from "./components/Account";
import "bootstrap/dist/css/bootstrap.css";
import Login from "./components/Login";
import axios from "axios";
import NoticeInsert from "./components/NoticeInsert";
import NoticeDetail from "./components/NoticeDetail";
import QnaDetail from "./components/QnaDetail";

function App() {
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `${token}`;
  }

  return (
    <Router>
      <div className="app">
        {token ? (
          <>
            <Header />
            <div className="body row">
              <Sidebar />
              <main className="main-content col">
                <Routes>
                  <Route path="/account" element={<MemberList />} />
                  <Route path="/notice/:postNo" element={<NoticeDetail />} />
                  <Route
                    path="/notice/insert/:postNo?"
                    element={<NoticeInsert />}
                  />
                  {/* <Route path="/notice/insert" element={<NoticeInsert />} /> */}
                  <Route path="/notices" element={<Notices />} />
                  <Route path="/qna" element={<QnaList />} />
                  <Route path="/qna/:postNo" element={<QnaDetail />} />
                  <Route path="*" element={<Navigate to="/account" />} />
                </Routes>
              </main>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
