import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Container, Spinner } from "react-bootstrap";

const NoticeInsert = () => {
  const { postNo } = useParams();
  const isEditMode = Boolean(postNo); // postNo가 있으면 수정 모드
  const [title, setTitle] = useState(""); // 제목
  const [content, setContent] = useState(""); // 내용
  const [modWriter, setModWriter] = useState(""); // 작성자
  const [files, setFiles] = useState(null); // 첨부 파일 리스트
  const [prevFiles, setPrevFiles] = useState([]); // 기존 파일 리스트
  const [isLoading, setIsLoading] = useState(true); // 로딩 스피너
  const navigate = useNavigate();

  // 파일이 선택데이터 추가
  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  // 기존 파일 삭제 핸들러
  const handleFileDelete = async (fileId) => {
    try {
      await axios.delete(`/api/admin/file/${fileId}`);
      // 파일 삭제 후 공지사항 다시 호출
      const response = await axios.get(`/api/admin/notice/${postNo}`);
      setPrevFiles(response.data.noticeFiles);
    } catch (error) {
      console.error("파일 삭제 중 오류 발생:", error);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("modWriter", modWriter);

    // 선택된 파일이 있을 때만 FormData에 추가
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    try {
      if (isEditMode) {
        // 수정
        const result = await axios.put(
          `/api/admin/notice/${postNo}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("공지사항이 수정되었습니다.");
        navigate(`/notice/${postNo}`);
      } else {
        // 등록
        const result = await axios.post("/api/admin/notice", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const newPostNo = result.data.postNo;
        alert("공지사항이 등록되었습니다.");
        navigate(`/notice/${newPostNo}`);
      }
    } catch (error) {
      console.error("공지사항 처리 중 오류 발생:", error);
      alert("공지사항 처리 중 오류가 발생했습니다.");
    }
  };
  const callAPI = async () => {
    try {
      const response = await axios.get(`/api/admin/notice/${postNo}`);
      const { title, content, modWriter, noticeFiles } = response.data;
      setTitle(title);
      setContent(content);
      setModWriter(modWriter);
      setPrevFiles(noticeFiles);
      setIsLoading(false);
    } catch (error) {
      console.error("공지사항 불러오기 중 오류 발생:", error);
    }
  };
  // 수정 모드일 때 기존 데이터를 불러옴
  useEffect(() => {
    if (isEditMode) {
      callAPI();
    }
  }, []);

  // 로딩 스피너
  if (isLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <Container className="mt-5">
      <h1>{isEditMode ? "공지사항 수정" : "공지사항 등록"}</h1>
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
        <Form.Group controlId="modWriter" className="mb-3">
          <Form.Label>작성자</Form.Label>
          <Form.Control
            type="text"
            placeholder="작성자 이름을 입력하세요"
            value={modWriter}
            onChange={(e) => setModWriter(e.target.value)}
            required
          />
        </Form.Group>

        {/* 기존 파일 (수정 모드일 때만) */}
        {isEditMode && prevFiles.length > 0 && (
          <div className="mb-3">
            <Form.Label>기존 첨부 파일:</Form.Label>
            <ul>
              {prevFiles.map((file) => (
                <li key={file.fileId} className="d-flex align-items-center">
                  <img
                    src={`http://localhost:8099/images/${file.filePath}`}
                    width={"100px"}
                  />
                  {file.fileName}
                  <Button
                    variant="danger"
                    onClick={() => handleFileDelete(file.fileId)}
                  >
                    삭제
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 파일 첨부 */}
        <Form.Group controlId="file" className="mb-3">
          <Form.Label>파일 첨부</Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={handleFileChange}
            accept=".jpg, .jpeg, .png"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {isEditMode ? "수정하기" : "등록하기"}
        </Button>
      </Form>
    </Container>
  );
};

export default NoticeInsert;
