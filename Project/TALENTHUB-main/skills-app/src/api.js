const API_BASE_URL = '/api/v1'; // Replace with your actual API base URL

const api = {
  async get(entityName) {
    const response = await fetch(`${API_BASE_URL}/${entityName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${entityName}`);
    }
    return await response.json();
  },

  async create(entityName, data) {
    const response = await fetch(`${API_BASE_URL}/${entityName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create ${entityName}`);
    }
    return await response.json();
  },

  async update(entityName, id, data) {
    const response = await fetch(`${API_BASE_URL}/${entityName}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update ${entityName}`);
    }
    return await response.json();
  },

  async delete(entityName, id) {
    const response = await fetch(`${API_BASE_URL}/${entityName}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete ${entityName}`);
    }
    return response.status;
  },
};

export default api;
