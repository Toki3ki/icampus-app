import { useState } from 'react';
import styled from 'styled-components';

// 初始待办事项数据
const initialAssignments = [
  {
    id: 1,
    course: 'Math 101',
    task: 'Homework 1',
    details: 'Complete exercises 1-10 from Chapter 3. Submit by Friday, 5 PM.',
    completed: false
  },
  {
    id: 2,
    course: 'Physics 201',
    task: 'Lab Report',
    details: 'Write a report on the pendulum experiment. Include graphs and analysis.',
    completed: false
  },
];

function AssignmentSection() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [expandedId, setExpandedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentAssignment, setCurrentAssignment] = useState({
    course: '',
    task: '',
    details: '',
    completed: false
  });
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    assignmentId: null
  });

  // 切换任务展开状态
  const handleItemClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 显示新建表单
  const showAddForm = () => {
    setCurrentAssignment({
      course: '',
      task: '',
      details: '',
      completed: false
    });
    setEditingId(null);
    setShowForm(true);
  };

  // 显示编辑表单
  const showEditForm = (id) => {
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
      setCurrentAssignment({
        course: assignment.course,
        task: assignment.task,
        details: assignment.details,
        completed: assignment.completed
      });
      setEditingId(id);
      setShowForm(true);
    }
    closeContextMenu();
  };

  // 处理表单输入
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAssignment(prev => ({ ...prev, [name]: value }));
  };

  // 提交表单
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentAssignment.course && currentAssignment.task) {
      if (editingId) {
        // 更新现有任务
        setAssignments(assignments.map(item => 
          item.id === editingId ? { ...item, ...currentAssignment } : item
        ));
      } else {
        // 添加新任务
        const newItem = {
          id: Date.now(),
          ...currentAssignment
        };
        setAssignments([...assignments, newItem]);
      }
      setShowForm(false);
    }
  };

  // 右键点击显示菜单
  const handleContextMenu = (e, assignmentId) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      assignmentId
    });
  };

  // 关闭右键菜单
  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  // 切换任务完成状态
  const toggleCompletion = (id) => {
    setAssignments(assignments.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
    closeContextMenu();
  };

  // 删除任务
  const deleteAssignment = (id) => {
    setAssignments(assignments.filter(item => item.id !== id));
    closeContextMenu();
  };

  return (
    <AssignmentSectionStyled onClick={closeContextMenu}>
      <div className="assignments-section">
        <div className="header">
          <h2>待办任务 / Upcoming Assignments</h2>
          <button className="add-button" onClick={showAddForm}>
            <span>+</span> 新建任务
          </button>
        </div>

        {/* 任务表单（新建/编辑） */}
        {showForm && (
          <div className="assignment-form">
            <form onSubmit={handleSubmit}>
              <h3>{editingId ? '编辑任务' : '新建任务'}</h3>
              <div className="form-group">
                <label>课程名称 / Course:</label>
                <input
                  type="text"
                  name="course"
                  value={currentAssignment.course}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>任务名称 / Task:</label>
                <input
                  type="text"
                  name="task"
                  value={currentAssignment.task}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>详情 / Details:</label>
                <textarea
                  name="details"
                  value={currentAssignment.details}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)}>取消</button>
                <button type="submit">{editingId ? '更新' : '保存'}</button>
              </div>
            </form>
          </div>
        )}

        {/* 待办事项列表 */}
        <div className="assignment-list">
          {assignments.length === 0 && (
            <p className="no-assignments">暂无待办任务</p>
          )}
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className={`assignment-item ${expandedId === assignment.id ? 'expanded' : ''} ${assignment.completed ? 'completed' : ''}`}
              onClick={() => handleItemClick(assignment.id)}
              onContextMenu={(e) => handleContextMenu(e, assignment.id)}
            >
              <div className="assignment-header">
                <span className="pin-icon">{assignment.completed ? '✅' : '📌'}</span>
                <span>
                  {assignment.course} - {assignment.task}
                </span>
                <button 
                  className="edit-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showEditForm(assignment.id);
                  }}
                >
                  编辑
                </button>
              </div>
              <div className="assignment-details">
                <p>{assignment.details}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 右键菜单 */}
        {contextMenu.visible && (
          <div 
            className="context-menu"
            style={{
              left: `${contextMenu.x}px`,
              top: `${contextMenu.y}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="context-menu-item"
              onClick={() => toggleCompletion(contextMenu.assignmentId)}
            >
              {assignments.find(a => a.id === contextMenu.assignmentId)?.completed 
                ? '标记为未完成' 
                : '标记为已完成'}
            </div>
            <div 
              className="context-menu-item"
              onClick={() => showEditForm(contextMenu.assignmentId)}
            >
              编辑任务
            </div>
            <div 
              className="context-menu-item delete"
              onClick={() => deleteAssignment(contextMenu.assignmentId)}
            >
              删除任务
            </div>
          </div>
        )}
      </div>
    </AssignmentSectionStyled>
  );
}

const AssignmentSectionStyled = styled.div`
  padding: 1rem 0;
  overflow-y: auto; // 允许垂直滚动
  
  .assignments-section {
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    position: relative;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .assignments-section h2 {
    font-size: 1.5rem;
    color: #333;
  }

  .add-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.9rem;

    &:hover {
      background-color: #45a049;
    }

    span {
      font-size: 1.2rem;
    }
  }

  .assignment-form {
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;

    h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #333;
    }
  }

  .form-group {
    margin-bottom: 1rem;

    label {
      display: block;
      margin-bottom: 0.3rem;
      font-weight: 500;
    }

    input, textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: #4CAF50;
      }
    }

    textarea {
      min-height: 80px;
      resize: vertical;
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;

    button {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    button[type="button"] {
      background-color: #f5f5f5;
      border: 1px solid #ddd;

      &:hover {
        background-color: #e0e0e0;
      }
    }

    button[type="submit"] {
      background-color: #4CAF50;
      color: white;
      border: none;

      &:hover {
        background-color: #45a049;
      }
    }
  }

  .assignment-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* This line is already suggested to allow more columns */
    gap: 1rem; /* Adjust gap as needed */
    width: 100%; /* Ensure the grid container takes full width */
    justify-content: start; /* This is often the default, but explicitly setting it can help if other styles interfere. */
  }

  .no-assignments {
    text-align: center;
    color: #888;
    padding: 1rem;
  }

  .assignment-item {
    width: 100%;
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      background-color: #f0f0f0;
    }

    &.expanded {
      background-color: #e6f0ff;
    }

    &.completed {
      background-color: #f0f0f0;
      opacity: 0.8; 
      
      .assignment-header {
        text-decoration: line-through;
        color: #888;
      }
    }
  }

  .assignment-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    color: #333;
  }

  .pin-icon {
    font-size: 1.2rem;
  }

  .edit-button {
    margin-left: auto;
    background: none;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
    cursor: pointer;

    &:hover {
      background-color: #e0e0e0;
    }
  }

  .assignment-details {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, opacity 0.3s ease;
    opacity: 0;
    margin-top: 0;
  }

  .assignment-item.expanded .assignment-details {
    max-height: 200px;
    opacity: 1;
    margin-top: 1rem;
    padding-top: 0.5rem;
    border-top: 1px solid #ddd;
  }

  .assignment-details p {
    margin: 0;
    font-size: 0.9rem;
    color: #555;
    line-height: 1.4;
  }

  /* 右键菜单样式 */
  .context-menu {
    position: fixed;
    background: white;
    border: 1px solid #ddd;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 100;
    border-radius: 4px;
    min-width: 150px;
  }

  .context-menu-item {
    padding: 8px 15px;
    cursor: pointer;
    font-size: 0.9rem;

    &:hover {
      background-color: #f5f5f5;
    }

    &.delete {
      color: #ff4d4f;
      border-top: 1px solid #eee;
    }
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .assignments-section {
      padding: 0 1rem;
    }

    .header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .assignment-list {
        grid-template-columns: 1fr;
    }

    .assignment-item {
      padding: 0.8rem;
    }

    .assignment-header {
      font-size: 0.95rem;
    }

    .assignment-details p {
      font-size: 0.85rem;
    }
  }
`;

export default AssignmentSection;