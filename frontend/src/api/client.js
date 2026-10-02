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
};

export default api;
