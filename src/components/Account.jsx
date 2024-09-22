import { Table } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useTable, useSortBy } from "react-table";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";

const MemberList = () => {
  const [members, setMembers] = useState([]);
  // 멤버 필터 (전체, 임대인, 임차인)
  const [userType, setUserType] = useState("임대인");
  const [selectedMembers, setSelectedMembers] = useState([]); // 선택한 멤버들의 ID 리스트
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 여부
  const callAPI = async () => {
    let url = "/api/memberList/1"; // 기본 URL
    if (userType === "임대인") {
      url = "/api/memberList/1";
    } else if (userType === "임차인") {
      url = "/api/memberList/2";
    }
    const response = await axios.get(url);
    setMembers(response.data);
    setSelectedMembers([]); // 데이터가 변경될 때 선택 초기화
    setSelectAll(false); // 전체 선택 초기화
  };

  // 전체 선택/해제 핸들러
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allMemberIds = members.map((member) => member.loginId);
      setSelectedMembers(allMemberIds); // 전체 선택
    } else {
      setSelectedMembers([]); // 전체 해제
    }
  };

  // 개별 선택 핸들러
  const handleSelect = (loginId) => {
    if (selectedMembers.includes(loginId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== loginId)); // 선택 해제
    } else {
      setSelectedMembers([...selectedMembers, loginId]); // 선택
    }
  };

  // 선택된 멤버 삭제 핸들러
  const handleDeleteSelected = async () => {
    console.log("선택된 멤버 삭제: ", selectedMembers);
    const response = await axios.delete("/api/membersRemove", {
      loginId: selectedMembers,
    });
    console.log(response.data, "data");
    if (response.date == "ok") {
    }
    setSelectedMembers([]); // 삭제 후 선택 초기화
  };

  useEffect(() => {
    callAPI();
  }, [userType]);
  const handleDelete = (loginId) => {
    if (userType == "임대인") {
    } else {
    }
    console.log(`${loginId} 삭제`);
  };
  return (
    <div>
      <h1>계정목록({userType})</h1>
      {/* 필터 버튼 */}
      <div>
        {/* <button onClick={() => setUserType("전체")}>전체</button> */}
        <button onClick={() => setUserType("임대인")}>임대인</button>
        <button onClick={() => setUserType("임차인")}>임차인</button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>아이디</th>
            <th>이름</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => {
            return (
              <tr key={member.loginId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.loginId)}
                    onChange={() => handleSelect(member.loginId)}
                  />
                </td>
                {/* <td>
                  <NavLink to={`/memberInfo/${member.loginId}`}>
                    {member.loginId}
                  </NavLink>
                </td> */}
                <td>{member.loginId}</td>
                <td>
                  {userType === "임대인"
                    ? member.imdaeinName
                    : member.imchainName}
                </td>
                <td>
                  <button onClick={() => handleDelete(member.loginId)}>
                    삭제
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {/* 선택된 멤버 삭제 버튼 */}
      <div>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedMembers.length === 0}
        >
          선택된 멤버 삭제
        </button>
      </div>
    </div>
  );
};

export default MemberList;
