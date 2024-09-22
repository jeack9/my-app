import React, { useState, useEffect } from "react";
import axios from "axios";

const QnaDetail = ({ postNo }) => {
  const [qna, setQna] = useState(null); // QnA 상세 정보
  const [comments, setComments] = useState([]); // 댓글 목록
  const [newComment, setNewComment] = useState(""); // 새로운 댓글 입력값
  const [loading, setLoading] = useState(true);

  // QnA 상세 정보 가져오기
  useEffect(() => {
    const fetchQna = async () => {
      try {
        const response = await axios.get(`/api/qna/${postNo}`);
        setQna(response.data.qna);
        setComments(response.data.comments);
        setLoading(false);
      } catch (error) {
        console.error("QnA 정보 가져오기 실패:", error);
        setLoading(false);
      }
    };
    fetchQna();
  }, [postNo]);

  // 댓글 작성 핸들러
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert("댓글을 입력하세요.");
      return;
    }
    try {
      const response = await axios.post(`/api/qna/${postNo}/comment`, {
        content: newComment,
      });
      setComments([...comments, response.data]);
      setNewComment(""); // 입력 필드 초기화
    } catch (error) {
      console.error("댓글 등록 실패:", error);
    }
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/qna/${postNo}/comment/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    }
  };

  // if (loading) {
  //   return <div>로딩 중...</div>;
  // }

  return (
    <div className="container mt-4">
      <h2>QnA 상세보기</h2>

      {/* QnA 내용 */}
      <div className="card mb-4">
        <div className="card-header">
          {/* <strong>제목: {qna.title}</strong> */}
        </div>
        <div className="card-body">
          <p>
            {/* 작성자: {qna.writer} | 작성일:{" "} */}
            {/* {new Date(qna.regDate).toLocaleDateString()} */}
          </p>
          {/* <p>{qna.content}</p> */}
        </div>
      </div>

      {/* 댓글 입력 */}
      <div className="mb-3">
        <label htmlFor="commentInput" className="form-label">
          댓글 입력
        </label>
        <input
          type="text"
          className="form-control"
          id="commentInput"
          placeholder="댓글을 입력하세요"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleCommentSubmit}>
          댓글쓰기
        </button>
      </div>

      {/* 댓글 목록 */}
      {comments.length > 0 ? (
        <ul className="list-group">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{comment.writer}</strong>: {comment.content}
              </div>
              <div>
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>등록된 댓글이 없습니다.</p>
      )}
    </div>
  );
};

export default QnaDetail;
