import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner, Card, Button, Container, Row, Col } from "react-bootstrap";

const NoticeDetail = () => {
  const { postNo } = useParams(); // URL에서 postNo 파라미터 가져옴
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 공지사항 단건 조회 API 호출
  const callAPI = async () => {
    try {
      const response = await axios.get(`/api/admin/notice/${postNo}`);
      setNotice(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("공지사항 조회 중 오류 발생:", error);
    }
  };

  // 글번호 변경시 재호출
  useEffect(() => {
    callAPI();
  }, [postNo]);

  if (isLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  // 글 단건삭제 핸들러
  const handleDelete = async () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/admin/notice/${postNo}`);
        alert("공지사항이 삭제되었습니다.");
        navigate("/admin/notices");
      } catch (error) {
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  if (!notice) {
    return (
      <Container className="text-center mt-5">
        <h3>공지사항을 찾을 수 없습니다.</h3>
        <Button variant="primary" onClick={() => navigate("/admin/notices")}>
          목록으로 돌아가기
        </Button>
      </Container>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <h1>공지사항 세부 정보</h1>

      {/* 공지사항 상세 내용 */}
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <p className="m-0 fw-bold fs-4">{notice.title}</p>
        </Card.Header>
        <Card.Body>
          <div className="pb-3 mb-2 text-muted border-bottom">
            작성자: {notice.writer} | 조회수: {notice.views}
          </div>
          <div>
            {notice.noticeFiles.map((file, idx) => {
              return (
                <img
                  key={file.fileId}
                  src={`http://localhost/images/${file.filePath}`}
                  alt="로딩 중"
                  className="img-fluid pe-5 pb-3"
                />
              );
            })}
          </div>
          <pre className="lead">{notice.content}</pre>
          <p className="text-end">수정일: {new Date(notice.modDate).toLocaleDateString()}</p>
          <p className="text-end">작성일: {new Date(notice.regDate).toLocaleDateString()}</p>
        </Card.Body>
      </Card>

      {/* 하단 버튼들 */}
      <Row className="mt-3">
        <Col className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={() => navigate("/admin/notices")}>
            목록으로 돌아가기
          </Button>
          <Button variant="primary" className="me-2" onClick={() => navigate(`/admin/notice/insert/${postNo}`)}>
            수정하기
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            삭제하기
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default NoticeDetail;
