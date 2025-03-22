import { format, parseISO, addDays, addWeeks, addMonths } from 'date-fns';

// This is a mock service that would be replaced with actual API calls in a real application

// Sample tasks data
const mockTasks = [
  {
    id: 1,
    title: 'Prepare Motion for Summary Judgment',
    description: 'Draft and file motion for summary judgment in Johnson case',
    type: 'document',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2023-06-25T17:00:00',
    createdAt: '2023-06-10T09:00:00',
    updatedAt: '2023-06-15T14:30:00',
    caseReference: {
      id: 101,
      title: 'Johnson v. Smith',
      caseNumber: 'CV-2023-1234'
    },
    assignees: [
      {
        id: 201,
        name: 'Sarah Johnson',
        role: 'Attorney',
        avatar: '/avatars/sarah.jpg'
      },
      {
        id: 202,
        name: 'Michael Brown',
        role: 'Paralegal',
        avatar: '/avatars/michael.jpg'
      }
    ],
    backupAssignee: {
      id: 203,
      name: 'Lisa Brown',
      role: 'Associate Attorney',
      avatar: '/avatars/lisa.jpg'
    },
    team: {
      id: 301,
      name: 'Litigation Team'
    },
    subtasks: [
      {
        id: 1001,
        title: 'Research precedent cases',
        status: 'completed',
        assigneeId: 201
      },
      {
        id: 1002,
        title: 'Draft initial arguments',
        status: 'in-progress',
        assigneeId: 201
      },
      {
        id: 1003,
        title: 'Compile exhibits',
        status: 'to-do',
        assigneeId: 202
      }
    ],
    dependencies: [
      {
        id: 3,
        title: 'Review Case Documents',
        type: 'predecessor'
      }
    ],
    timeTracking: {
      estimatedHours: 10,
      loggedHours: 6.5,
      billable: true,
      timeEntries: [
        {
          id: 501,
          userId: 201,
          userName: 'Sarah Johnson',
          hours: 3.5,
          notes: 'Researched precedent cases',
          timestamp: '2023-06-12T15:30:00',
          billable: true,
          invoiceLineItem: {
            id: 601,
            description: 'Research for Motion for Summary Judgment',
            amount: 875.00,
            invoiceId: 701
          }
        },
        {
          id: 502,
          userId: 202,
          userName: 'Michael Brown',
          hours: 3.0,
          notes: 'Compiled exhibits and supporting documents',
          timestamp: '2023-06-13T11:45:00',
          billable: true,
          invoiceLineItem: {
            id: 602,
            description: 'Document preparation for Motion for Summary Judgment',
            amount: 450.00,
            invoiceId: 701
          }
        }
      ],
      budgetAlert: {
        enabled: true,
        threshold: 12,
        notified: false
      }
    },
    attachments: [
      {
        id: 301,
        name: 'Case Research.docx',
        type: 'document',
        size: '2.4 MB',
        uploadedAt: '2023-06-12T10:15:00',
        uploadedBy: {
          id: 201,
          name: 'Sarah Johnson'
        },
        version: 1,
        versionHistory: [
          {
            version: 1,
            uploadedAt: '2023-06-12T10:15:00',
            uploadedBy: {
              id: 201,
              name: 'Sarah Johnson'
            }
          }
        ]
      }
    ],
    comments: [
      {
        id: 401,
        userId: 201,
        userName: 'Sarah Johnson',
        userAvatar: '/avatars/sarah.jpg',
        text: "I've completed the research. Starting on the draft now.",
        timestamp: '2023-06-13T11:20:00',
        attachments: []
      }
    ],
    auditLog: [
      {
        action: 'created',
        userId: 201,
        userName: 'Sarah Johnson',
        timestamp: '2023-06-10T09:00:00'
      },
      {
        action: 'updated',
        userId: 201,
        userName: 'Sarah Johnson',
        timestamp: '2023-06-15T14:30:00',
        changes: ['status', 'subtasks']
      }
    ],
    permissions: {
      view: ['attorney', 'paralegal', 'partner', 'associate'],
      edit: ['attorney', 'partner', 'associate'],
      delete: ['partner'],
      assignTask: ['attorney', 'partner'],
      addComment: ['attorney', 'paralegal', 'partner', 'associate'],
      addAttachment: ['attorney', 'paralegal', 'partner', 'associate'],
      logTime: ['attorney', 'paralegal', 'partner', 'associate']
    },
    courtRules: {
      jurisdiction: 'Federal',
      calculatedDeadlines: [
        {
          id: 801,
          title: 'Response Deadline',
          dueDate: '2023-07-25T17:00:00',
          rule: '30 days after service'
        }
      ]
    },
    versionHistory: [
      {
        version: 1,
        timestamp: '2023-06-10T09:00:00',
        userId: 201,
        userName: 'Sarah Johnson',
        changes: ['created']
      },
      {
        version: 2,
        timestamp: '2023-06-15T14:30:00',
        userId: 201,
        userName: 'Sarah Johnson',
        changes: ['status', 'subtasks']
      }
    ]
  },
  {
    id: 2,
    title: 'Client Meeting - Williams Case',
    description: 'Discuss settlement options with client',
    type: 'meeting',
    status: 'to-do',
    priority: 'medium',
    dueDate: '2023-06-18T14:00:00',
    createdAt: '2023-06-12T11:30:00',
    updatedAt: '2023-06-12T11:30:00',
    caseReference: {
      id: 102,
      title: 'Williams v. Johnson',
      caseNumber: 'CV-2023-5678'
    },
    assignees: [
      {
        id: 201,
        name: 'Sarah Johnson',
        role: 'Attorney',
        avatar: '/avatars/sarah.jpg'
      }
    ],
    location: 'Conference Room A',
    timeTracking: {
      estimatedHours: 2,
      loggedHours: 0,
      billable: true
    },
    auditLog: [
      {
        action: 'created',
        userId: 201,
        userName: 'Sarah Johnson',
        timestamp: '2023-06-12T11:30:00'
      }
    ]
  },
  {
    id: 3,
    title: 'Research Case Law for Davis Appeal',
    description: 'Find relevant precedents for upcoming appeal',
    type: 'research',
    status: 'to-do',
    priority: 'high',
    dueDate: '2023-06-30T17:00:00',
    createdAt: '2023-06-14T09:45:00',
    updatedAt: '2023-06-14T09:45:00',
    caseReference: {
      id: 103,
      title: 'Davis Appeal',
      caseNumber: 'CV-2023-9012'
    },
    assignees: [
      {
        id: 203,
        name: 'Lisa Brown',
        role: 'Associate Attorney',
        avatar: '/avatars/lisa.jpg'
      }
    ],
    timeTracking: {
      estimatedHours: 15,
      loggedHours: 0,
      billable: true
    },
    auditLog: [
      {
        action: 'created',
        userId: 201,
        userName: 'Sarah Johnson',
        timestamp: '2023-06-14T09:45:00'
      }
    ]
  }
];

// Mock teams data
const mockTeams = [
  {
    id: 301,
    name: 'Litigation Team',
    members: [201, 202, 203, 204]
  },
  {
    id: 302,
    name: 'Corporate Team',
    members: [203, 204, 205]
  }
];

// Mock roles and permissions
const mockRoles = [
  {
    id: 101,
    name: 'partner',
    permissions: ['view', 'edit', 'delete', 'assignTask', 'addComment', 'addAttachment', 'logTime']
  },
  {
    id: 102,
    name: 'attorney',
    permissions: ['view', 'edit', 'assignTask', 'addComment', 'addAttachment', 'logTime']
  },
  {
    id: 103,
    name: 'associate',
    permissions: ['view', 'edit', 'addComment', 'addAttachment', 'logTime']
  },
  {
    id: 104,
    name: 'paralegal',
    permissions: ['view', 'addComment', 'addAttachment', 'logTime']
  }
];

// Helper function to generate a new ID
const generateId = () => {
  return Math.floor(Math.random() * 10000) + 1;
};

// Helper function to get current timestamp
const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

// Helper function to create an audit log entry
const createAuditLogEntry = (action, userId, userName, changes = []) => {
  return {
    action,
    userId,
    userName,
    timestamp: getCurrentTimestamp(),
    changes
  };
};

// Helper function to calculate next occurrence date based on recurrence pattern
const calculateNextOccurrence = (currentDate, pattern, interval = 1) => {
  const date = typeof currentDate === 'string' ? parseISO(currentDate) : currentDate;
  
  switch (pattern) {
    case 'daily':
      return addDays(date, interval);
    case 'weekly':
      return addWeeks(date, interval);
    case 'monthly':
      return addMonths(date, interval);
    default:
      return null;
  }
};

// Helper function to check for conflicts
const checkForConflicts = (taskData) => {
  // In a real application, this would query a database of conflicts
  // For this mock service, we'll just return a sample conflict if the case matches
  
  // Sample conflict database
  const conflictDatabase = [
    {
      id: 'conflict1',
      clientName: 'Johnson',
      opposingParty: 'Smith',
      reason: 'Previously represented opposing party'
    },
    {
      id: 'conflict2',
      clientName: 'Williams',
      opposingParty: 'Davis',
      reason: 'Financial interest in outcome'
    }
  ];
  
  if (!taskData.caseReference) return null;
  
  // Check if the case name contains any client names from the conflict database
  const caseName = taskData.caseReference.title.toLowerCase();
  
  for (const conflict of conflictDatabase) {
    if (
      caseName.includes(conflict.clientName.toLowerCase()) ||
      caseName.includes(conflict.opposingParty.toLowerCase())
    ) {
      return {
        ...conflict,
        caseReference: taskData.caseReference
      };
    }
  }
  
  return null;
};

// Get all tasks
const getAllTasks = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTasks);
    }, 500);
  });
};

// Get task by ID
const getTaskById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const task = mockTasks.find(task => task.id === id);
      if (task) {
        resolve(task);
      } else {
        reject(new Error('Task not found'));
      }
    }, 500);
  });
};

// Create a new task
const createTask = (taskData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check for conflicts
      const conflict = checkForConflicts(taskData);
      
      // Ensure dates are properly formatted
      let processedTaskData = { ...taskData };
      
      // Convert Date objects to ISO strings for storage
      if (processedTaskData.dueDate && processedTaskData.dueDate instanceof Date) {
        processedTaskData.dueDate = processedTaskData.dueDate.toISOString();
      }
      
      const newTask = {
        id: generateId(),
        ...processedTaskData,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
        auditLog: [
          createAuditLogEntry('created', 201, 'Sarah Johnson')
        ],
        conflict: conflict
      };
      
      // Add to mock tasks array
      mockTasks.push(newTask);
      
      // Log for debugging
      console.log('Task created:', newTask);
      console.log('All tasks:', mockTasks);
      
      resolve(newTask);
    }, 500);
  });
};

// Create a recurring task instance
const createRecurringTaskInstance = (task) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!task.recurrence || !task.recurrence.pattern) {
        resolve(null);
        return;
      }
      
      const nextDueDate = calculateNextOccurrence(
        task.dueDate,
        task.recurrence.pattern,
        task.recurrence.interval || 1
      );
      
      if (!nextDueDate) {
        resolve(null);
        return;
      }
      
      const newTask = {
        ...task,
        id: generateId(),
        title: `${task.title} (Recurring)`,
        status: 'to-do',
        dueDate: nextDueDate.toISOString(),
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
        parentTaskId: task.id,
        auditLog: [
          createAuditLogEntry('created', 201, 'Sarah Johnson', ['recurring'])
        ]
      };
      
      mockTasks.push(newTask);
      resolve(newTask);
    }, 500);
  });
};

// Update an existing task
const updateTask = (taskData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTasks.findIndex(task => task.id === taskData.id);
      
      if (index === -1) {
        reject(new Error('Task not found'));
        return;
      }
      
      // Ensure dates are properly formatted
      let processedTaskData = { ...taskData };
      
      // Convert Date objects to ISO strings for storage
      if (processedTaskData.dueDate && processedTaskData.dueDate instanceof Date) {
        processedTaskData.dueDate = processedTaskData.dueDate.toISOString();
      }
      
      // Check for conflicts if case reference changed
      let conflict = null;
      if (
        processedTaskData.caseReference && 
        (!mockTasks[index].caseReference || 
         mockTasks[index].caseReference.id !== processedTaskData.caseReference.id)
      ) {
        conflict = checkForConflicts(processedTaskData);
      } else {
        conflict = mockTasks[index].conflict;
      }
      
      // Determine what fields changed
      const oldTask = mockTasks[index];
      const changedFields = Object.keys(processedTaskData).filter(key => {
        if (key === 'auditLog' || key === 'updatedAt') return false;
        if (typeof processedTaskData[key] === 'object' && processedTaskData[key] !== null) {
          return JSON.stringify(processedTaskData[key]) !== JSON.stringify(oldTask[key]);
        }
        return processedTaskData[key] !== oldTask[key];
      });
      
      // Create a new audit log entry
      const auditLogEntry = createAuditLogEntry(
        'updated',
        201,
        'Sarah Johnson',
        changedFields
      );
      
      // Update the task
      const updatedTask = {
        ...oldTask,
        ...processedTaskData,
        updatedAt: getCurrentTimestamp(),
        auditLog: [...(oldTask.auditLog || []), auditLogEntry],
        conflict
      };
      
      mockTasks[index] = updatedTask;
      resolve(updatedTask);
    }, 500);
  });
};

// Delete a task
const deleteTask = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTasks.findIndex(task => task.id === id);
      
      if (index === -1) {
        reject(new Error('Task not found'));
        return;
      }
      
      mockTasks.splice(index, 1);
      resolve({ success: true });
    }, 500);
  });
};

// Get tasks by status
const getTasksByStatus = (status) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredTasks = mockTasks.filter(task => task.status === status);
      resolve(filteredTasks);
    }, 500);
  });
};

// Get tasks by priority
const getTasksByPriority = (priority) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredTasks = mockTasks.filter(task => task.priority === priority);
      resolve(filteredTasks);
    }, 500);
  });
};

// Get tasks by case
const getTasksByCase = (caseId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredTasks = mockTasks.filter(
        task => task.caseReference && task.caseReference.id === caseId
      );
      resolve(filteredTasks);
    }, 500);
  });
};

// Get tasks by assignee
const getTasksByAssignee = (assigneeId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredTasks = mockTasks.filter(
        task => task.assignees && task.assignees.some(assignee => assignee.id === assigneeId)
      );
      resolve(filteredTasks);
    }, 500);
  });
};

// Get tasks by due date range
const getTasksByDueDateRange = (startDate, endDate) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredTasks = mockTasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= startDate && dueDate <= endDate;
      });
      resolve(filteredTasks);
    }, 500);
  });
};

// Add a comment to a task
const addComment = (taskId, commentData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTasks.findIndex(task => task.id === taskId);
      
      if (index === -1) {
        reject(new Error('Task not found'));
        return;
      }
      
      const task = mockTasks[index];
      
      const newComment = {
        id: generateId(),
        ...commentData,
        timestamp: getCurrentTimestamp()
      };
      
      const updatedTask = {
        ...task,
        comments: [...(task.comments || []), newComment],
        updatedAt: getCurrentTimestamp(),
        auditLog: [
          ...(task.auditLog || []),
          createAuditLogEntry('comment_added', commentData.userId, commentData.userName)
        ]
      };
      
      mockTasks[index] = updatedTask;
      resolve(updatedTask);
    }, 500);
  });
};

// Add a subtask to a task
const addSubtask = (taskId, subtaskData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTasks.findIndex(task => task.id === taskId);
      
      if (index === -1) {
        reject(new Error('Task not found'));
        return;
      }
      
      const task = mockTasks[index];
      
      const newSubtask = {
        id: generateId(),
        ...subtaskData,
        status: subtaskData.status || 'to-do'
      };
      
      const updatedTask = {
        ...task,
        subtasks: [...(task.subtasks || []), newSubtask],
        updatedAt: getCurrentTimestamp(),
        auditLog: [
          ...(task.auditLog || []),
          createAuditLogEntry('subtask_added', 201, 'Sarah Johnson', ['subtasks'])
        ]
      };
      
      mockTasks[index] = updatedTask;
      resolve(updatedTask);
    }, 500);
  });
};

// Update a subtask
const updateSubtask = (taskId, subtaskId, subtaskData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const taskIndex = mockTasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) {
        reject(new Error('Task not found'));
        return;
      }
      
      const task = mockTasks[taskIndex];
      
      if (!task.subtasks) {
        reject(new Error('Task has no subtasks'));
        return;
      }
      
      const subtaskIndex = task.subtasks.findIndex(subtask => subtask.id === subtaskId);
      
      if (subtaskIndex === -1) {
        reject(new Error('Subtask not found'));
        return;
      }
      
      const updatedSubtasks = [...task.subtasks];
      updatedSubtasks[subtaskIndex] = {
        ...updatedSubtasks[subtaskIndex],
        ...subtaskData
      };
      
      const updatedTask = {
        ...task,
        subtasks: updatedSubtasks,
        updatedAt: getCurrentTimestamp(),
        auditLog: [
          ...(task.auditLog || []),
          createAuditLogEntry('subtask_updated', 201, 'Sarah Johnson', ['subtasks'])
        ]
      };
      
      mockTasks[taskIndex] = updatedTask;
      resolve(updatedTask);
    }, 500);
  });
};

// Log time for a task
const logTime = (taskId, timeData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTasks.findIndex(task => task.id === taskId);
      
      if (index === -1) {
        reject(new Error('Task not found'));
        return;
      }
      
      const task = mockTasks[index];
      
      const timeEntry = {
        id: generateId(),
        ...timeData,
        timestamp: getCurrentTimestamp()
      };
      
      const currentTimeTracking = task.timeTracking || {
        estimatedHours: 0,
        loggedHours: 0,
        billable: false,
        entries: []
      };
      
      const updatedTimeTracking = {
        ...currentTimeTracking,
        loggedHours: currentTimeTracking.loggedHours + (parseFloat(timeData.hours) || 0),
        entries: [...(currentTimeTracking.entries || []), timeEntry]
      };
      
      const updatedTask = {
        ...task,
        timeTracking: updatedTimeTracking,
        updatedAt: getCurrentTimestamp(),
        auditLog: [
          ...(task.auditLog || []),
          createAuditLogEntry('time_logged', 201, 'Sarah Johnson', ['timeTracking'])
        ]
      };
      
      mockTasks[index] = updatedTask;
      resolve(updatedTask);
    }, 500);
  });
};

// Add an attachment to a task
const addAttachment = (taskId, attachmentData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTasks.findIndex(task => task.id === taskId);
      
      if (index === -1) {
        reject(new Error('Task not found'));
        return;
      }
      
      const task = mockTasks[index];
      
      const newAttachment = {
        id: generateId(),
        ...attachmentData,
        uploadedAt: getCurrentTimestamp()
      };
      
      const updatedTask = {
        ...task,
        attachments: [...(task.attachments || []), newAttachment],
        updatedAt: getCurrentTimestamp(),
        auditLog: [
          ...(task.auditLog || []),
          createAuditLogEntry('attachment_added', 201, 'Sarah Johnson', ['attachments'])
        ]
      };
      
      mockTasks[index] = updatedTask;
      resolve(updatedTask);
    }, 500);
  });
};

// Get tasks by type
const getTasksByType = (type) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredTasks = mockTasks.filter(task => task.type === type);
      resolve(filteredTasks);
    }, 500);
  });
};

// Check if user has permission for an action
const hasPermission = (userId, taskId, action) => {
  const task = getTaskById(taskId);
  if (!task) return false;
  
  // Find the user's role
  const assignee = task.assignees.find(a => a.id === userId);
  if (!assignee) return false;
  
  const userRole = assignee.role.toLowerCase();
  
  // Check if the role has the required permission
  return task.permissions[action].includes(userRole);
};

// Add a team assignment to a task
const assignTeam = (taskId, teamId) => {
  return new Promise((resolve, reject) => {
    try {
      const task = getTaskById(taskId);
      if (!task) {
        reject(new Error('Task not found'));
        return;
      }
      
      const team = mockTeams.find(t => t.id === teamId);
      if (!team) {
        reject(new Error('Team not found'));
        return;
      }
      
      task.team = {
        id: team.id,
        name: team.name
      };
      
      task.updatedAt = getCurrentTimestamp();
      
      // Add audit log entry
      task.auditLog.push(createAuditLogEntry('updated', 201, 'System', ['team']));
      
      // Add version history entry
      task.versionHistory.push({
        version: task.versionHistory.length + 1,
        timestamp: getCurrentTimestamp(),
        userId: 201,
        userName: 'System',
        changes: ['team']
      });
      
      resolve(task);
    } catch (error) {
      reject(error);
    }
  });
};

// Add a backup assignee to a task
const addBackupAssignee = (taskId, assigneeData) => {
  return new Promise((resolve, reject) => {
    try {
      const task = getTaskById(taskId);
      if (!task) {
        reject(new Error('Task not found'));
        return;
      }
      
      task.backupAssignee = assigneeData;
      task.updatedAt = getCurrentTimestamp();
      
      // Add audit log entry
      task.auditLog.push(createAuditLogEntry('updated', 201, 'System', ['backupAssignee']));
      
      // Add version history entry
      task.versionHistory.push({
        version: task.versionHistory.length + 1,
        timestamp: getCurrentTimestamp(),
        userId: 201,
        userName: 'System',
        changes: ['backupAssignee']
      });
      
      resolve(task);
    } catch (error) {
      reject(error);
    }
  });
};

// Add a task dependency
const addTaskDependency = (taskId, dependencyData) => {
  return new Promise((resolve, reject) => {
    try {
      const task = getTaskById(taskId);
      if (!task) {
        reject(new Error('Task not found'));
        return;
      }
      
      if (!task.dependencies) {
        task.dependencies = [];
      }
      
      const dependencyId = dependencyData.id || Math.max(...task.dependencies.map(d => d.id), 0) + 1;
      
      task.dependencies.push({
        ...dependencyData,
        id: dependencyId
      });
      
      task.updatedAt = getCurrentTimestamp();
      
      // Add audit log entry
      task.auditLog.push(createAuditLogEntry('updated', 201, 'System', ['dependencies']));
      
      // Add version history entry
      task.versionHistory.push({
        version: task.versionHistory.length + 1,
        timestamp: getCurrentTimestamp(),
        userId: 201,
        userName: 'System',
        changes: ['dependencies']
      });
      
      resolve(task);
    } catch (error) {
      reject(error);
    }
  });
};

// Add a comment with attachments
const addCommentWithAttachments = (taskId, commentData, attachments = []) => {
  return new Promise((resolve, reject) => {
    try {
      const task = getTaskById(taskId);
      if (!task) {
        reject(new Error('Task not found'));
        return;
      }
      
      const commentId = Math.max(...task.comments.map(c => c.id), 0) + 1;
      
      const newComment = {
        id: commentId,
        ...commentData,
        timestamp: getCurrentTimestamp(),
        attachments: attachments
      };
      
      task.comments.push(newComment);
      task.updatedAt = getCurrentTimestamp();
      
      // Add audit log entry
      task.auditLog.push(createAuditLogEntry('comment_added', commentData.userId, commentData.userName));
      
      resolve(task);
    } catch (error) {
      reject(error);
    }
  });
};

// Add a file attachment with version control
const addAttachmentWithVersion = (taskId, attachmentData) => {
  return new Promise((resolve, reject) => {
    try {
      const task = getTaskById(taskId);
      if (!task) {
        reject(new Error('Task not found'));
        return;
      }
      
      // Check if the file already exists
      const existingAttachmentIndex = task.attachments.findIndex(a => a.name === attachmentData.name);
      
      if (existingAttachmentIndex >= 0) {
        // Update existing attachment with new version
        const existingAttachment = task.attachments[existingAttachmentIndex];
        const newVersion = existingAttachment.versionHistory.length + 1;
        
        existingAttachment.version = newVersion;
        existingAttachment.size = attachmentData.size;
        existingAttachment.uploadedAt = getCurrentTimestamp();
        existingAttachment.uploadedBy = attachmentData.uploadedBy;
        
        existingAttachment.versionHistory.push({
          version: newVersion,
          uploadedAt: getCurrentTimestamp(),
          uploadedBy: attachmentData.uploadedBy
        });
        
        task.attachments[existingAttachmentIndex] = existingAttachment;
      } else {
        // Add new attachment
        const attachmentId = Math.max(...task.attachments.map(a => a.id), 0) + 1;
        
        const newAttachment = {
          id: attachmentId,
          ...attachmentData,
          uploadedAt: getCurrentTimestamp(),
          version: 1,
          versionHistory: [
            {
              version: 1,
              uploadedAt: getCurrentTimestamp(),
              uploadedBy: attachmentData.uploadedBy
            }
          ]
        };
        
        task.attachments.push(newAttachment);
      }
      
      task.updatedAt = getCurrentTimestamp();
      
      // Add audit log entry
      task.auditLog.push(createAuditLogEntry('attachment_added', attachmentData.uploadedBy.id, attachmentData.uploadedBy.name));
      
      // Add version history entry
      task.versionHistory.push({
        version: task.versionHistory.length + 1,
        timestamp: getCurrentTimestamp(),
        userId: attachmentData.uploadedBy.id,
        userName: attachmentData.uploadedBy.name,
        changes: ['attachments']
      });
      
      resolve(task);
    } catch (error) {
      reject(error);
    }
  });
};

// Log time with billable hours tracking
const logTimeWithBilling = (taskId, timeData) => {
  return new Promise((resolve, reject) => {
    try {
      const task = getTaskById(taskId);
      if (!task) {
        reject(new Error('Task not found'));
        return;
      }
      
      const timeEntryId = task.timeTracking.timeEntries ? 
        Math.max(...task.timeTracking.timeEntries.map(t => t.id), 0) + 1 : 501;
      
      const newTimeEntry = {
        id: timeEntryId,
        ...timeData,
        timestamp: getCurrentTimestamp()
      };
      
      // Create invoice line item if billable
      if (timeData.billable) {
        const hourlyRate = timeData.userId === 201 ? 250 : 150; // Mock hourly rates
        newTimeEntry.invoiceLineItem = {
          id: 600 + timeEntryId,
          description: `Work on ${task.title}`,
          amount: hourlyRate * timeData.hours,
          invoiceId: 701 // Mock invoice ID
        };
      }
      
      if (!task.timeTracking.timeEntries) {
        task.timeTracking.timeEntries = [];
      }
      
      task.timeTracking.timeEntries.push(newTimeEntry);
      
      // Update total logged hours
      task.timeTracking.loggedHours = task.timeTracking.timeEntries.reduce(
        (total, entry) => total + entry.hours, 0
      );
      
      // Check budget alert
      if (task.timeTracking.budgetAlert && 
          task.timeTracking.budgetAlert.enabled && 
          !task.timeTracking.budgetAlert.notified &&
          task.timeTracking.loggedHours >= task.timeTracking.budgetAlert.threshold) {
        task.timeTracking.budgetAlert.notified = true;
        // In a real app, this would trigger a notification
      }
      
      task.updatedAt = getCurrentTimestamp();
      
      // Add audit log entry
      task.auditLog.push(createAuditLogEntry('time_logged', timeData.userId, timeData.userName));
      
      resolve(task);
    } catch (error) {
      reject(error);
    }
  });
};

// Calculate court deadlines based on jurisdiction rules
const calculateCourtDeadlines = (taskId, jurisdictionData) => {
  return new Promise((resolve, reject) => {
    try {
      const task = getTaskById(taskId);
      if (!task) {
        reject(new Error('Task not found'));
        return;
      }
      
      // Mock jurisdiction rules
      const jurisdictionRules = {
        'Federal': [
          { title: 'Response Deadline', rule: '30 days after service' },
          { title: 'Reply Deadline', rule: '14 days after response' }
        ],
        'California': [
          { title: 'Response Deadline', rule: '20 days after service' },
          { title: 'Reply Deadline', rule: '10 days after response' }
        ],
        'New York': [
          { title: 'Response Deadline', rule: '21 days after service' },
          { title: 'Reply Deadline', rule: '7 days after response' }
        ]
      };
      
      const rules = jurisdictionRules[jurisdictionData.jurisdiction] || [];
      
      if (!task.courtRules) {
        task.courtRules = {
          jurisdiction: jurisdictionData.jurisdiction,
          calculatedDeadlines: []
        };
      } else {
        task.courtRules.jurisdiction = jurisdictionData.jurisdiction;
        task.courtRules.calculatedDeadlines = [];
      }
      
      // Calculate deadlines based on rules
      let baseDate = parseISO(task.dueDate);
      
      rules.forEach((rule, index) => {
        let deadlineDate;
        
        if (rule.rule.includes('after service')) {
          const days = parseInt(rule.rule.split(' ')[0]);
          deadlineDate = addDays(baseDate, days);
        } else if (rule.rule.includes('after response')) {
          const days = parseInt(rule.rule.split(' ')[0]);
          // Use the previous calculated deadline as the base
          const previousDeadline = task.courtRules.calculatedDeadlines[index - 1];
          if (previousDeadline) {
            deadlineDate = addDays(parseISO(previousDeadline.dueDate), days);
          } else {
            deadlineDate = addDays(baseDate, days);
          }
        }
        
        if (deadlineDate) {
          task.courtRules.calculatedDeadlines.push({
            id: 800 + index + 1,
            title: rule.title,
            dueDate: format(deadlineDate, "yyyy-MM-dd'T'HH:mm:ss"),
            rule: rule.rule
          });
        }
      });
      
      task.updatedAt = getCurrentTimestamp();
      
      // Add audit log entry
      task.auditLog.push(createAuditLogEntry('court_rules_updated', 201, 'System'));
      
      resolve(task);
    } catch (error) {
      reject(error);
    }
  });
};

// Export the service
export const taskService = {
  getAllTasks,
  getTaskById,
  createTask,
  createRecurringTaskInstance,
  updateTask,
  deleteTask,
  getTasksByStatus,
  getTasksByPriority,
  getTasksByCase,
  getTasksByAssignee,
  getTasksByDueDateRange,
  addComment,
  addSubtask,
  updateSubtask,
  logTime,
  addAttachment,
  getTasksByType,
  assignTeam,
  addBackupAssignee,
  addTaskDependency,
  addCommentWithAttachments,
  addAttachmentWithVersion,
  logTimeWithBilling,
  calculateCourtDeadlines,
  hasPermission
}; 