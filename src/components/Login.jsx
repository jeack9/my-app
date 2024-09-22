import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 로그인
const Login = () => {
  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");
  const navigate = useNavigate();

  const handleInputId = (e) => setInputId(e.target.value);
  const handleInputPw = (e) => setInputPw(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8099/api/login", {
        loginId: inputId,
        pw: inputPw,
      });

      const token = response.headers["authorization"];
      if (token) {
        // JWT를 로컬 스토리지에 저장
        localStorage.setItem("token", token);
        console.log("토큰 저장 완료, 페이지 이동 시도");

        // 로그인 성공 시 즉시 페이지 이동
        window.location.href = "/account";
      } else {
        alert("로그인 실패");
      }
    } catch (error) {
      console.error("로그인 중 오류:", error);
      localStorage.removeItem("token");
      alert("로그인 실패. 다시 로그인해주세요.");
    }
  };

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      <div className="container-fluid">
        <div className="row h-100 align-items-center justify-content-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 login-container">
            <h2>관리자 로그인</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="아이디"
                  name="username"
                  value={inputId}
                  onChange={handleInputId}
                  id="id"
                />
                <label htmlFor="id">아이디</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="비밀번호"
                  value={inputPw}
                  name="password"
                  onChange={handleInputPw}
                  id="pw"
                />
                <label htmlFor="pw">비밀번호</label>
              </div>
              <button type="submit" className="btn btn-primary py-3 w-100 mb-4">
                로그인
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
