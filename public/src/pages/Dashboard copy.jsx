import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { coursesRoute, assignmentsRoute } from "../utils/APIRoutes";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(undefined);
  const [assignments, setAssignments] = useState([]);
  const [showAssignments, setShowAssignments] = useState(false);

  // 获取当前用户信息
  useEffect(() => {
    (async () => {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      if (!data) {
        navigate("/login");
        return;
      }
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
    })();
  }, [navigate]);

  // // 获取课程列表
  // useEffect(() => {
  //   (async () => {
  //     if (currentUserName) {
  //       try {
  //         const userId = JSON.parse(
  //           localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
  //         )._id;
  //         const response = await axios.get(`${coursesRoute}/${userId}`);
  //         setCourses(response.data);
  //       } catch (error) {
  //         console.error("获取课程失败:", error);
  //       }
  //     }
  //   })();
  // }, [currentUserName]);
// 获取课程列表
useEffect(() => {
  (async () => {
    if (currentUserName) {
      try {
        const userId = JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
        const response = await axios.get(`${coursesRoute}/${userId}`);
        // 如果后端返回空数据，使用模拟数据
        if (response.data.length === 0) {
          setCourses([
            {
              _id: "1",
              name: "Web开发",
              description: "学习React和Node.js",
            },
            {
              _id: "2",
              name: "数据结构",
              description: "算法与数据结构基础",
            },
          ]);
        } else {
          setCourses(response.data);
        }
      } catch (error) {
        console.error("获取课程失败:", error);
        // 如果请求失败，也使用模拟数据
        setCourses([
          {
            _id: "1",
            name: "Web开发",
            description: "学习React和Node.js",
          },
          {
            _id: "2",
            name: "数据结构",
            description: "算法与数据结构基础",
          },
        ]);
      }
    }
  })();
}, [currentUserName]);
  // 获取作业通知
  const handleCourseClick = async (course) => {
    setSelectedCourse(course);
    setShowAssignments(true);
    try {
      const response = await axios.get(`${assignmentsRoute}/${course._id}`);
      setAssignments(response.data);
    } catch (error) {
      console.error("获取作业失败:", error);
      setAssignments([]);
    }
  };

  // 返回课程列表
  const handleBackToCourses = () => {
    setShowAssignments(false);
    setSelectedCourse(undefined);
    setAssignments([]);
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>icamPus</h3>
            <Link to="/" className="back-button">
              返回聊天
            </Link>
          </div>
          <div className="content">
            {showAssignments ? (
              <div className="assignments">
                <div className="assignment-header">
                  <h3>{selectedCourse.name} 的作业</h3>
                  <button onClick={handleBackToCourses}>返回课程</button>
                </div>
                {assignments.length === 0 ? (
                  <p>暂无作业</p>
                ) : (
                  assignments.map((assignment) => (
                    <div key={assignment._id} className="assignment">
                      <div className="icon">📝</div>
                      <div className="assignment-info">
                        <h4>{assignment.title}</h4>
                        <p>{assignment.description}</p>
                        <p className="due-date">
                          截止日期: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="courses">
                {courses.length === 0 ? (
                  <p>暂无课程</p>
                ) : (
                  courses.map((course, index) => (
                    <div
                      key={course._id}
                      className={`course ${
                        selectedCourse?._id === course._id ? "selected" : ""
                      }`}
                      onClick={() => handleCourseClick(course)}
                    >
                      <div className="icon">📚</div>
                      <div className="course-info">
                        <h3>{course.name}</h3>
                        <p>{course.description || "暂无描述"}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="current-user">
            <div className="avatar">
              <Link to="/">
                <img
                  src={`data:image/svg+xml;base64,${currentUserImage}`}
                  alt="avatar"
                />
              </Link>
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container2 = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-rows: 10% 80% 10%;
  overflow: hidden;
  background-color: #080420;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    position: relative;
    img {
      height: 5rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
    .back-button {
      position: absolute;
      right: 5rem;
      color:rgb(66, 51, 133);
      text-decoration: none;
      font-size: 1rem;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    padding: 1rem 2rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .courses {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.8rem;
      p {
        color: white;
        text-align: center;
      }
      .course {
        background-color: #ffffff34;
        min-height: 5rem;
        cursor: pointer;
        width: 90%;
        border-radius: 0.2rem;
        padding: 0.4rem;
        display: flex;
        gap: 1rem;
        align-items: center;
        transition: 0.5s ease-in-out;
        .icon {
          font-size: 2rem;
        }
        .course-info {
          h3 {
            color: white;
            margin: 0;
          }
          p {
            color: #ccc;
            margin: 0;
            font-size: 0.9rem;
          }
        }
      }
      .selected {
        background-color: #9a86f3;
      }
    }
    .assignments {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.8rem;
      .assignment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 90%;
        h3 {
          color: white;
          margin: 0;
        }
        button {
          background-color: #9a86f3;
          color: white;
          border: none;
          padding: 0.3rem 0.6rem;
          border-radius: 0.2rem;
          cursor: pointer;
          &:hover {
            background-color: #7f67d2;
          }
        }
      }
      p {
        color: white;
        text-align: center;
      }
      .assignment {
        background-color: #ffffff34;
        min-height: 5rem;
        width: 90%;
        border-radius: 0.2rem;
        padding: 0.4rem;
        display: flex;
        gap: 1rem;
        align-items: center;
        .icon {
          font-size: 2rem;
        }
        .assignment-info {
          h4 {
            color: white;
            margin: 0;
          }
          p {
            color: #ccc;
            margin: 0.2rem 0;
            font-size: 0.9rem;
          }
          .due-date {
            color: #ff6b6b;
            font-weight: bold;
          }
        }
      }
    }
  }
  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;