import React, { createContext, useState, useEffect, useContext } from 'react';
import { taskService } from '../services/taskService';
import { useCalendar } from './CalendarContext';

// Create the Task context
const TaskContext = createContext();

// Custom hook to use the Task context
export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

// Task Provider component
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { events, createEvent, updateEvent, deleteEvent } = useCalendar();

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (taskData) => {
    try {
      setLoading(true);
      const newTask = await taskService.createTask(taskData);
      
      // Update the tasks state with the new task
      setTasks(prevTasks => [...prevTasks, newTask]);
      
      // If the task has a due date, create a calendar event for it
      if (taskData.dueDate) {
        const eventData = {
          title: taskData.title,
          description: taskData.description || '',
          startDate: new Date(taskData.dueDate),
          endDate: new Date(new Date(taskData.dueDate).getTime() + 60 * 60 * 1000), // 1 hour duration
          type: 'task',
          color: getPriorityColor(taskData.priority),
          location: '',
          allDay: false,
          taskId: newTask.id
        };
        
        await createEvent(eventData);
      }
      
      // Process recurrence if enabled
      if (taskData.recurrence && taskData.recurrence.enabled) {
        await scheduleRecurringTask(newTask);
      }
      
      setError(null);
      return newTask;
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Schedule the next occurrence of a recurring task
  const scheduleRecurringTask = async (task) => {
    if (!task.recurrence || !task.recurrence.pattern) return;
    
    try {
      const nextTask = await taskService.createRecurringTaskInstance(task);
      if (nextTask) {
        setTasks([...tasks, nextTask]);
      }
    } catch (err) {
      console.error('Failed to schedule recurring task:', err);
    }
  };

  // Update an existing task
  const updateTask = async (taskData) => {
    try {
      setLoading(true);
      const updatedTask = await taskService.updateTask(taskData);
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      
      // Update the corresponding calendar event if there is one
      if (updatedTask.dueDate && updatedTask.calendarEventId) {
        const eventData = {
          id: updatedTask.calendarEventId,
          title: `Task Due: ${updatedTask.title}`,
          date: updatedTask.dueDate,
          endDate: updatedTask.dueDate,
          type: 'task',
          priority: updatedTask.priority,
          matter: updatedTask.caseReference ? updatedTask.caseReference.title : '',
          description: updatedTask.description,
          color: getPriorityColor(updatedTask.priority),
          taskId: updatedTask.id
        };
        await updateEvent(eventData);
      }
      
      return updatedTask;
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      setLoading(true);
      await taskService.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      
      // Delete the corresponding calendar event if there is one
      const taskToDelete = tasks.find(task => task.id === id);
      if (taskToDelete && taskToDelete.calendarEventId) {
        await deleteEvent(taskToDelete.calendarEventId);
      }
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add a subtask to a task
  const addSubtask = async (taskId, subtaskData) => {
    try {
      setLoading(true);
      const updatedTask = await taskService.addSubtask(taskId, subtaskData);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError('Failed to add subtask');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a subtask
  const updateSubtask = async (taskId, subtaskId, subtaskData) => {
    try {
      setLoading(true);
      const updatedTask = await taskService.updateSubtask(taskId, subtaskId, subtaskData);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError('Failed to update subtask');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add a comment to a task
  const addComment = async (taskId, commentData) => {
    try {
      setLoading(true);
      const updatedTask = await taskService.addComment(taskId, commentData);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Log time for a task
  const logTime = async (taskId, timeData) => {
    try {
      setLoading(true);
      const updatedTask = await taskService.logTime(taskId, timeData);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError('Failed to log time');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add an attachment to a task
  const addAttachment = async (taskId, attachmentData) => {
    try {
      setLoading(true);
      const updatedTask = await taskService.addAttachment(taskId, attachmentData);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError('Failed to add attachment');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get tasks by status
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  // Get tasks by priority
  const getTasksByPriority = (priority) => {
    return tasks.filter(task => task.priority === priority);
  };

  // Get tasks by case/client
  const getTasksByCase = (caseId) => {
    return tasks.filter(task => task.caseReference && task.caseReference.id === caseId);
  };

  // Get tasks by assignee
  const getTasksByAssignee = (assigneeId) => {
    return tasks.filter(task => task.assignees && task.assignees.some(assignee => assignee.id === assigneeId));
  };

  // Get tasks by due date range
  const getTasksByDueDateRange = (startDate, endDate) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= startDate && dueDate <= endDate;
    });
  };

  // Get tasks by type
  const getTasksByType = (type) => {
    return tasks.filter(task => task.type === type);
  };

  // Helper function to get color based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#FF5252'; // Red
      case 'medium':
        return '#FFC107'; // Amber
      case 'low':
        return '#4CAF50'; // Green
      default:
        return '#2196F3'; // Blue
    }
  };

  // Assign a team to a task
  const assignTeam = async (taskId, teamId) => {
    try {
      setLoading(true);
      const updatedTask = await taskService.assignTeam(taskId, teamId);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError('Failed to assign team');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Add a backup assignee to a task
  const addBackupAssignee = async (taskId, assigneeData) => {
    try {
      setLoading(true);
      const updatedTask = await taskService.addBackupAssignee(taskId, assigneeData);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError('Failed to add backup assignee');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Add a task dependency
  const addTaskDependency = async (taskId, dependencyData) => {
    try {
      setLoading(true);
      const updatedTask = await taskService.addTaskDependency(taskId, dependencyData);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError('Failed to add task dependency');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Add a comment with attachments
  const addCommentWithAttachments = async (taskId, commentData, attachments = []) => {
    try {
      setLoading(true);
      const updatedTask = await taskService.addCommentWithAttachments(taskId, commentData, attachments);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError('Failed to add comment with attachments');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Add a file attachment with version control
  const addAttachmentWithVersion = async (taskId, attachmentData) => {
    try {
      setLoading(true);
      const updatedTask = await taskService.addAttachmentWithVersion(taskId, attachmentData);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError('Failed to add attachment');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Log time with billable hours tracking
  const logTimeWithBilling = async (taskId, timeData) => {
    try {
      setLoading(true);
      const updatedTask = await taskService.logTimeWithBilling(taskId, timeData);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError('Failed to log time');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate court deadlines based on jurisdiction rules
  const calculateCourtDeadlines = async (taskId, jurisdictionData) => {
    try {
      setLoading(true);
      const updatedTask = await taskService.calculateCourtDeadlines(taskId, jurisdictionData);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError('Failed to calculate court deadlines');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Check if user has permission for an action
  const hasPermission = (userId, taskId, action) => {
    return taskService.hasPermission(userId, taskId, action);
  };

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Value to be provided by the context
  const value = {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    addSubtask,
    updateSubtask,
    addComment,
    logTime,
    addAttachment,
    getTasksByStatus,
    getTasksByPriority,
    getTasksByCase,
    getTasksByAssignee,
    getTasksByDueDateRange,
    getTasksByType,
    getPriorityColor,
    assignTeam,
    addBackupAssignee,
    addTaskDependency,
    addCommentWithAttachments,
    addAttachmentWithVersion,
    logTimeWithBilling,
    calculateCourtDeadlines,
    hasPermission
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      error,
      fetchTasks,
      createTask,
      updateTask,
      deleteTask,
      addSubtask,
      updateSubtask,
      addComment,
      logTime,
      addAttachment,
      getTasksByStatus,
      getTasksByPriority,
      getTasksByCase,
      getTasksByAssignee,
      getTasksByDueDateRange,
      getTasksByType,
      scheduleRecurringTask,
      assignTeam,
      addBackupAssignee,
      addTaskDependency,
      addCommentWithAttachments,
      addAttachmentWithVersion,
      logTimeWithBilling,
      calculateCourtDeadlines,
      hasPermission
    }}>
      {children}
    </TaskContext.Provider>
  );
}; 