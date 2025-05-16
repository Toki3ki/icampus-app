import { useState } from 'react';
import styled from 'styled-components';

// 静态数据（仅用于测试，可移除如果完全使用 props）
const initialCourses = [
  { id: '1', name: '现代软件开发方法', nameEn: 'Modern Software Dev', hasUpdate: true, progress: 75 },
  { id: '2', name: '高性能计算编程', nameEn: 'High-Performance Computing', hasUpdate: false, progress: 60 },
  { id: '3', name: '计算机图形学', nameEn: 'Computer Graphics', hasUpdate: false, progress: 45 },
  { id: '4', name: '计算机动画', nameEn: 'Computer Animation', hasUpdate: false, progress: 80 },
  { id: '5', name: 'GPU架构与编程', nameEn: 'GPU', hasUpdate: false, progress: 10 },
  { id: '6', name: '工程伦理', nameEn: 'ProjectTheory', hasUpdate: false, progress: 90 },
  { id: '7', name: '英语A', nameEn: 'English A', hasUpdate: false, progress: 20 },
];

function CourseSection({ courses = initialCourses }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [addedCourses, setAddedCourses] = useState([]);

  // 搜索课程
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 处理搜索输入
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  // 点击搜索框
  const handleSearchClick = () => {
    setShowDropdown(true);
  };

  // 失去焦点时隐藏下拉框
  const handleSearchBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  // 添加或移除课程
  const toggleCourse = (course) => {
    if (addedCourses.some((c) => c.id === course.id)) {
      setAddedCourses(addedCourses.filter((c) => c.id !== course.id));
    } else {
      setAddedCourses([...addedCourses, course]);
    }
  };

  // 排序课程：未添加的在上，已添加的在下
  const sortedCourses = (searchQuery ? filteredCourses : courses).sort((a, b) => {
    const isAAdded = addedCourses.some((c) => c.id === a.id);
    const isBAdded = addedCourses.some((c) => c.id === b.id);
    if (isAAdded && !isBAdded) return 1;
    if (!isAAdded && isBAdded) return -1;
    return 0;
  });

  return (
    <CourseSectionStyled>

{/* 课程列表区域 */}
      <div className="course-section">
        <div className="course-header">
          <h2>课程列表 / Course List</h2>
          <span className="notes-tab">我的笔记 / My Notes</span>
        </div>
      </div>
      {/* 搜索栏 */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="在这里添加你感兴趣的课程！ / Enter the course name you are interested in"
          value={searchQuery}
          onChange={handleSearchChange}
          onClick={handleSearchClick}
          onBlur={handleSearchBlur}
        />
        {/* <button className="search-button" onClick={handleSearchConfirm}>
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
            </svg>
            <span className="search-text">Search</span>
        </button> */}

        {/* 下拉框 */}
        {showDropdown && (
          <div className="dropdown">
            {sortedCourses.map((course) => (
              <div key={course.id} className="dropdown-item">
                <span>
                  {course.name} / {course.nameEn}
                </span>
                <button
                  className={addedCourses.some((c) => c.id === course.id) ? 'added' : 'add'}
                  onClick={() => toggleCourse(course)}
                >
                  {addedCourses.some((c) => c.id === course.id) ? '已添加' : '添加'}
                </button>
              </div>
            ))}
            {(searchQuery ? filteredCourses : courses).length === 0 && (
              <div className="dropdown-item no-results">无匹配课程</div>
            )}
          </div>
        )}
      </div>
      <div className="course-list">
          {addedCourses.map((course) => (
            <div key={course.id} className="course-card">
              {course.hasUpdate && <span className="update-dot" />}
              <h3>
                {course.name} / {course.nameEn}
              </h3>
              <div className="progress-bar">
                <div style={{ width: `${course.progress}%` }} />
              </div>
            </div>
          ))}
          {addedCourses.length === 0 && (
            <p className="no-courses">尚未添加课程</p>
          )}
        </div>
    </CourseSectionStyled>
  );
}




const CourseSectionStyled = styled.div`
  padding: 1rem 0;

  /* 搜索栏 */
  .search-bar {
    position: relative;
    margin-bottom: 1.5rem;
    max-width: 800px;
    width: 100%;
  }

  .search-bar input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }

  /* 下拉框 */
  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
  }

  .dropdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem;
    border-bottom: 1px solid #eee;
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background-color: #f5f5f5;
    }
  }

  .dropdown-item.no-results {
    padding: 0.8rem;
    color: #888;
    text-align: center;
  }

  .dropdown-item button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .dropdown-item button.add {
    background-color: #f28c38; /* 橘色 */
    color: #fff;
    &:hover {
      background-color: #e07b30;
    }
  }

  .dropdown-item button.added {
    background-color: #ccc; /* 灰色 */
    color: #fff;
    cursor: not-allowed;
  }

  /* 课程列表区域 */
  .course-section {
    margin-top: 2rem;
  }

  .course-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .course-header h2 {
    font-size: 1.5rem;
    color: #333;
  }

  .notes-tab {
    font-size: 1rem;
    color: #007bff;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

.course-list {

    display: grid;
    //grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-template-columns: repeat(auto-fit, 200px);
    gap: 1rem;
  }

  .course-card {
    position: relative;
    background-color: #f9f9f9;
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: 0.3s ease-in-out;
    cursor: pointer;
    aspect-ratio: 3 / 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .course-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .course-card .update-dot {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 0.8rem;
    height: 0.8rem;
    background-color: #ff6b6b;
    border-radius: 50%;
  }

  .course-card h3 {
    font-size: 1.1rem;
    color: #333;
    margin: 0 0 0.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .course-card .progress-bar {
    width: 100%;
    height: 0.3rem;
    background-color: #ddd;
    border-radius: 0.2rem;
    overflow: hidden;
    margin-top: auto;
  }

  .course-card .progress-bar div {
    height: 100%;
    background-color: #007bff;
    transition: width 0.3s ease-in-out;
  }

  .no-courses {
    text-align: center;
    color: #888;
    font-size: 1rem;
  }
`;

export default CourseSection;