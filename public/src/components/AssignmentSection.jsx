import { useState } from 'react';
import styled from 'styled-components';

// Sample assignments data (replace with your actual data)
const initialAssignments = [
  {
    id: 1,
    course: 'Math 101',
    task: 'Homework 1',
    details: 'Complete exercises 1-10 from Chapter 3. Submit by Friday, 5 PM.',
  },
  {
    id: 2,
    course: 'Physics 201',
    task: 'Lab Report',
    details: 'Write a report on the pendulum experiment. Include graphs and analysis.',
  },
];

function AssignmentSection() {
  // State to track which assignment is expanded (null if none)
  const [expandedId, setExpandedId] = useState(null);
  const assignments = initialAssignments;

  // Toggle expansion for an assignment
  const handleItemClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    
    <AssignmentSectionStyled>
    <div className="assignments-section">
      <h2>待办任务 / Upcoming Assignments</h2>
      <div className="assignment-list">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className={`assignment-item ${expandedId === assignment.id ? 'expanded' : ''}`}
            onClick={() => handleItemClick(assignment.id)}
          >
            <div className="assignment-header">
              <span className="pin-icon">📌</span>
              <span>
                {assignment.course} - {assignment.task}
              </span>
            </div>
            <div className="assignment-details">
              <p>{assignment.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    </AssignmentSectionStyled>
  );
}


const AssignmentSectionStyled = styled.div`
  padding: 1rem 0;
  
.assignments-section {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

.assignments-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.assignment-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.assignment-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.assignment-item:hover {
  background-color: #f0f0f0;
}

.assignment-item.expanded {
  background-color: #e6f0ff;
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

.assignment-details {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.3s ease;
  opacity: 0;
  margin-top: 0;
}

.assignment-item.expanded .assignment-details {
  max-height: 200px; /* Adjust based on content */
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .assignments-section {
    padding: 1rem;
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