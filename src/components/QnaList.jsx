import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QnaList = () => {
  const navigate = useNavigate();
  const [qnaList, setQnaList] = useState([]); // QnA 목록
  const [keyword, setKeyword] = useState(""); // 검색어
  const [answerStatus, setAnswerStatus] = useState(""); // 답변 상태
  const [paging, setPaging] = useState({
    page: 1,
    startPage: 1,
    endPage: 1,
    realEnd: 1,
    prev: false,
    next: false,
  }); // 페이징 정보

  const recordSize = 5; // 페이지당 출력할 레코드 수

  // QnA 목록 조회 API 호출
  const callAPI = async () => {
    try {
      const response = await axios.get("/api/qna", {
        params: {
          keyword: keyword,
          answerStatus: answerStatus, // 답변 상태 검색 조건 추가
          page: paging.page,
          recordSize: recordSize,
        },
      });

      setQnaList(response.data.qnaList); // QnA 목록
      setPaging(response.data.paging); // 페이징 정보
    } catch (error) {
      console.error("QnA 목록 조회 중 오류 발생:", error);
    }
  };

  // 페이지나 검색 조건이 변경될 때마다 재호출
  useEffect(() => {
    callAPI();
  }, [paging.page, keyword, answerStatus]);

  // 검색어 입력 핸들러
  const handleSearchChange = (event) => {
    setKeyword(event.target.value);
  };

  // 답변 상태 선택 핸들러
  const handleAnswerStatusChange = (event) => {
    setAnswerStatus(event.target.value);
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
    navigate(`/qna/${postNo}`); // 단건 조회 페이지로 이동
  };

  return (
    <div className="container mt-4">
      <h2>QnA 목록</h2>

      {/* 검색 입력 필드 */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control"
          value={keyword}
          onChange={handleSearchChange}
          placeholder="검색어 입력 (제목/내용)"
        />
        {/* 답변 상태 선택 */}
        <select
          className="form-select ms-2"
          value={answerStatus}
          onChange={handleAnswerStatusChange}
        >
          <option value="">전체</option>
          <option value="대기">답변 대기</option>
          <option value="완료">답변 완료</option>
        </select>
      </div>

      {/* QnA 목록 테이블 */}
      <table className="table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>답변 상태</th>
          </tr>
        </thead>
        <tbody>
          {qnaList.map((qna) => (
            <tr
              key={qna.postNo}
              onClick={() => goDetail(qna.postNo)}
              style={{ cursor: "pointer" }}
            >
              <td>{qna.postNo}</td>
              <td>{qna.title}</td>
              <td>{qna.writer}</td>
              <td>{new Date(qna.regDate).toLocaleDateString()}</td>
              <td>{qna.answerStatus}</td>
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

          {/* 페이지 번호 */}
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

export default QnaList;
