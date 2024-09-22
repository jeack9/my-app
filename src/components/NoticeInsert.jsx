import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, Container } from "react-bootstrap";

const NoticeInsert = () => {
  const [title, setTitle] = useState(""); // 제목
  const [content, setContent] = useState(""); // 내용
  const [writer, setWriter] = useState(""); // 작성자
  const [files, setFiles] = useState([]); // 첨부 파일 리스트
  const navigate = useNavigate();

  // 파일이 선택되었을 때 처리
  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (event) => {
    event.preventDefault();

    // FormData로 전송할 데이터 구성 (multipart/form-data 전송)
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("writer", writer);

    // 선택된 파일들을 FormData에 추가
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      // 서버에 POST 요청 (파일 포함된 데이터 전송)
      await axios.post("/api/notice", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("공지사항이 등록되었습니다.");
      navigate("/notices"); // 등록 후 목록으로 이동
    } catch (error) {
      console.error("공지사항 등록 중 오류 발생:", error);
      alert("공지사항 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container className="mt-5">
      <h1>공지사항 등록</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title" className="mb-3">
          <Form.Label>제목</Form.Label>
          <Form.Control
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="content" className="mb-3">
          <Form.Label>내용</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="writer" className="mb-3">
          <Form.Label>작성자</Form.Label>
          <Form.Control
            type="text"
            placeholder="작성자 이름을 입력하세요"
            value={writer}
            onChange={(e) => setWriter(e.target.value)}
            required
          />
        </Form.Group>
        {/* 파일 첨부 */}
        <Form.Group controlId="file" className="mb-3">
          <Form.Label>파일 첨부</Form.Label>
          <Form.Control type="file" multiple onChange={handleFileChange} />
        </Form.Group>
        <Button variant="primary" type="submit">
          등록하기
        </Button>
      </Form>
    </Container>
  );
};

export default NoticeInsert;
