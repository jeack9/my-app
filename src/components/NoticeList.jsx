import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NoticeList = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]); // 공지사항 목록
  const [keyword, setKeyword] = useState(""); // 검색어
  const [paging, setPaging] = useState({
    page: 1,
    startPage: 1,
    endPage: 1,
    realEnd: 1,
    prev: false,
    next: false,
  }); // 페이징 정보

  const recordSize = 5; // 페이지당 출력할 레코드 수

  // 공지사항 목록 조회
  const callAPI = async () => {
    try {
      const response = await axios.get("/api/admin/notice", {
        params: {
          keyword: keyword,
          page: paging.page,
          recordSize: recordSize,
        },
      });

      setNotices(response.data.notices); // 공지사항 목록
      setPaging(response.data.paging); // 페이징 정보
    } catch (error) {
      console.error("공지사항 목록 조회 중 오류 발생:", error);
    }
  };

  // 페이지나 검색어가 변경될 때마다 재호출
  useEffect(() => {
    callAPI();
  }, [paging.page, keyword]);

  // 검색어 입력 핸들러
  const handleSearchChange = (event) => {
    setKeyword(event.target.value);
  };

  // 페이지 변경 핸들러
  const changePage = (newPage) => {
    if (newPage < 1 || newPage > paging.realEnd) return;
    setPaging((prevState) => ({
      ...prevState,
      page: newPage,
    }));
  };

  // 글 단건조회 핸들러
  const goDetail = (postNo) => {
    navigate(`/notice/${postNo}`); // 단건 조회 페이지로 이동
  };

  return (
    <div className="container mt-4">
      <h1>공지사항 목록</h1>
      {/* 검색 입력 필드 */}
      <input
        type="text"
        value={keyword}
        onChange={handleSearchChange}
        placeholder="검색어 입력 (제목/내용)"
      />
      {/* 글등록 버튼 */}
      <div className="mb-3">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/notice/insert")}
        >
          글등록
        </button>
      </div>

      {/* 공지사항 목록 테이블 */}
      <table className="table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>조회수</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((notice) => (
            <tr
              key={notice.postNo}
              onClick={() => goDetail(notice.postNo)}
              style={{ cursor: "pointer" }}
            >
              <td>{notice.postNo}</td>
              <td>{notice.title}</td>
              <td>{notice.writer}</td>
              <td>{notice.views}</td>
              <td>{new Date(notice.regDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center mt-3">
          {/* 이전 페이지 */}
          <li className={`page-item ${paging.prev ? "" : "disabled"}`}>
            <button
              className="page-link"
              onClick={() => changePage(paging.startPage - paging.viewPage)}
              aria-label="Previous"
              disabled={!paging.prev}
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>

          {/* 페이지 번호 매기기 */}
          {Array.from(
            { length: paging.endPage - paging.startPage + 1 },
            (_, i) => (
              <li
                key={i + paging.startPage}
                className={`page-item ${
                  paging.page === i + paging.startPage ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => changePage(i + paging.startPage)}
                >
                  {i + paging.startPage}
                </button>
              </li>
            )
          )}

          {/* 다음 페이지 */}
          <li className={`page-item ${paging.next ? "" : "disabled"}`}>
            <button
              className="page-link"
              onClick={() => changePage(paging.endPage + 1)}
              aria-label="Next"
              disabled={!paging.next}
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NoticeList;
