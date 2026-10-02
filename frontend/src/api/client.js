/**
 * Centralized REST API client for Energy Project Readiness.
 * 
 * Separates API network requests from presentation components.
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.error || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  /**
   * Fetch all projects summary
   */
  async getProjects() {
    return request('/projects');
  },

  /**
   * Fetch complete project details including stages, tasks, readiness, and blockers
   */
  async getProject(id) {
    return request(`/projects/${id}`);
  },

  /**
   * Load or seed the demo project
   */
  async seedDemoProject() {
    return request('/demo/seed', { method: 'POST' });
  },

  /**
   * Update task fields (status, is_blocker, owner, notes, due_date, title, description)
   */
  async updateTask(taskId, updates) {
    return request(`/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Create a new task in a stage
   */
  async createTask(stageId, taskData) {
    return request(`/stages/${stageId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Delete a task by ID
   */
  async deleteTask(taskId) {
    return request(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Trigger AI Risk Analysis for a project
   */
  async analyzeProjectRisks(projectId) {
    return request(`/projects/${projectId}/analyze-risks`, {
      method: 'POST',
    });
  },

  /**
   * Retrieve the latest stored AI risk analysis for a project (returns null if none exists)
   */
  async getLatestAnalysis(projectId) {
    try {
      return await request(`/projects/${projectId}/analysis/latest`);
    } catch (err) {
      // Return null if no analysis exists yet
      return null;
    }
  },
};

export default api;
