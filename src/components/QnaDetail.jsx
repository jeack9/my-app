import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const QnaDetail = () => {
  const { postNo } = useParams();
  const [qna, setQna] = useState({}); // qna 단건
  const [paging, setPaging] = useState({ page: 1 }); // 페이징 정보
  const [comments, setComments] = useState([]); // 전체댓글 목록
  const [newComment, setNewComment] = useState(""); // 부모댓글 내용
  const [childComment, setChildComment] = useState({}); // 대댓글을 위한 상태
  const [loading, setLoading] = useState(true); // 단건조회 중 로딩바

  // 대댓글 입력폼의 표시 여부를 관리하는 상태
  const [replyForms, setReplyForms] = useState({});

  // 대댓글 폼 토글 함수
  const toggleReplyForm = (commentId) => {
    setReplyForms((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], // 클릭한 댓글 ID의 상태를 반전
    }));
  };

  // 댓글 단건조회 API
  const callAPI = async () => {
    try {
      const response = await axios.get(`/api/admin/qna/${postNo}`, {
        params: { page: paging.page },
      });
      setQna(response.data.qna);
      setComments(response.data.qna.qnaCmts);
      setPaging(response.data.paging);
    } catch (error) {
      console.error("QnA 정보 가져오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };
  // hook
  useEffect(() => {
    callAPI();
  }, [postNo]);

  // 부모댓글 등록핸들러
  const handleCommentSubmit = async () => {
    if (!newComment) {
      alert("댓글을 입력하세요.");
      return;
    }
    // 댓글등록
    await axios.post(`/api/admin/qna/${postNo}/pComments`, {
      content: newComment,
    });
    callAPI(); // qna 재로딩
    setNewComment(""); // 입력 후 초기화
  };

  // 자식댓글 등록핸들러
  const handleChildComment = async () => {
    if (!childComment.content) {
      alert("댓글을 입력하세요.");
      return;
    }
    // 자식댓글 등록
    await axios.post(`/api/admin/qna/${postNo}/cComments`, childComment);
    callAPI(); // 재로딩
    setChildComment({ content: "" });
  };

  // 댓글삭제 핸들러
  const handleDeleteComment = async (cmtNo) => {
    try {
      await axios.delete(`/api/admin/qnaCmt/${cmtNo}`);
      callAPI();
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    }
  };

  // 댓글 페이지 핸들러
  const handlePageChange = async (page) => {
    const response = await axios.get(`/api/admin/qna/${postNo}?page=${page}`);
    setComments(response.data.qna.qnaCmts);
    setPaging(response.data.paging);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="container mt-4 mb-5">
      <h1>QnA 세부사항</h1>
      <div className="card">
        <div className="d-flex justify-content-between align-items-center card-header">
          <p className="m-0 fw-bold fs-4">{qna.title}</p>
        </div>
        <div className="card-body">
          <div className="pb-3 mb-2 d-flex justify-content-between align-items-center border-bottom">
            <p className="align-middle text-muted m-0">
              작성자: {qna.writer} | 작성일: {new Date(qna.regDate).toLocaleDateString()}
            </p>
            {qna.answerState == 0 ? (
              <p className="m-0 bg-warning text-dark rounded-pill p-2">답변대기</p>
            ) : (
              <p className="m-0 bg-success text-light rounded-pill p-2">답변완료</p>
            )}
          </div>
          {qna.qnaFiles.map((file) => (
            <img
              key={file.fileId}
              src={`http://localhost:80/images/${file.filePath}`}
              alt="로딩 중"
              className="img-fluid pe-5 pb-3"
            />
          ))}
          <pre className="lead">{qna.content}</pre>
          <p className="text-end">수정일: {new Date(qna.modDate).toLocaleDateString()}</p>
          <p className="text-end">작성일: {new Date(qna.regDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="mt-4 border p-3">
        <p>댓글 목록</p>
        {comments.map((comment) => (
          <div key={comment.cmtNo} className="list-group">
            <div className="list-group-item parentCmt">
              <div className="cmtBody">
                <div className="d-flex justify-content-between">
                  <h6 className="mb-1 writerBody">{comment.writerId}</h6>
                  <small className="pb-1">{comment.timeAgo}</small>
                </div>
                <p className="contentBody">{comment.content}</p>
                {/* 삭제버튼 */}
                {comment.state !== -1 && (
                  <div className="mb-3">
                    <small
                      className="p-2 bg-danger text-white rounded-3 border border-2 del-pointer btn"
                      onClick={() => {
                        if (window.confirm("정말로 댓글을 삭제하시겠습니까?")) {
                          handleDeleteComment(comment.cmtNo);
                        }
                      }}
                    >
                      삭제
                    </small>
                  </div>
                )}
                {/* 대댓글 버튼 */}
                {comment.state !== -1 && (
                  <button
                    className="btn btn-link"
                    onClick={() => toggleReplyForm(comment.cmtNo)} // 대댓글 폼 토글
                  >
                    {replyForms[comment.cmtNo] ? "대댓글 숨기기" : "대댓글 작성하기"}
                  </button>
                )}
              </div>
              {/* 대댓글 작성 폼 */}
              {replyForms[comment.cmtNo] && ( // 대댓글 폼 표시
                <div className="ms-3 mt-3">
                  <div className="list-group-item bg-light">
                    <div className="mb-3">
                      <p>대댓글 내용</p>
                      <textarea
                        className="form-control"
                        rows="2"
                        required
                        value={childComment.content}
                        onChange={(e) =>
                          setChildComment({
                            cmtGroup: comment.cmtGroup,
                            content: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button
                      className="btn btn-primary childCmtBtn"
                      type="button"
                      onClick={() => {
                        handleChildComment(childComment);
                      }}
                    >
                      댓글 작성
                    </button>
                  </div>
                </div>
              )}
              {/* 대댓글 목록 */}
              {comment.childCmts && (
                <div className="ms-3">
                  {comment.childCmts.map((childComment) => (
                    <div key={childComment.cmtNo} className="list-group-item bg-light cmtBody">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1 writerBody">{childComment.writerId}</h6>
                        <small>{childComment.timeAgo}</small>
                      </div>
                      <p className="mb-2 contentBody">{childComment.content}</p>
                      {childComment.state !== -1 && (
                        <small
                          className="p-2 bg-danger text-white rounded-3 border border-2 del-pointer btn"
                          onClick={() => {
                            if (window.confirm("정말로 댓글을 삭제하시겠습니까")) {
                              handleDeleteComment(childComment.cmtNo);
                            }
                          }}
                        >
                          삭제
                        </small>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      {paging.total > 0 && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center mt-3">
            {/* 이전 페이지 */}
            <li className={`page-item ${paging.prev ? "" : "disabled"}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(paging.startPage - paging.viewPage)}
                disabled={!paging.prev}
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            {/* 페이지 번호 */}
            {Array.from({ length: paging.endPage - paging.startPage + 1 }, (_, index) => {
              const pageNum = paging.startPage + index;
              return (
                <li key={pageNum} className={`page-item ${paging.page == pageNum ? "active" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(pageNum)}>
                    {pageNum}
                  </button>
                </li>
              );
            })}
            {/* 다음 페이지 */}
            <li className={`page-item ${paging.next ? "" : "disabled"}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(paging.startPage + paging.viewPage)}
                disabled={!paging.next}
              >
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* <!-- 댓글 작성 폼 --> */}
      <div className="mt-4">
        <div className="list-group-item bg-light p-3 border">
          <div className="mb-3">
            <label htmlFor="content" className="form-label">
              댓글 내용
            </label>
            <textarea
              className="form-control"
              rows="3"
              id="content"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
          </div>
          <button className="btn btn-primary mt-2" onClick={handleCommentSubmit}>
            댓글 작성
          </button>
        </div>
      </div>
      {/* 댓글작성폼 END */}

      {/* 목록이동 */}
      <div className="mt-3 row">
        <div className="d-flex justify-content-end col">
          <Link to={"/admin/qna"}>
            <button type="button" className="me-2 btn btn-secondary">
              목록으로 돌아가기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QnaDetail;
