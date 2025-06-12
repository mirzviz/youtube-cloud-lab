import type { AuthContextType } from '../contexts/AuthContext';

const API_BASE_URL = 'https://7ehv3qnn63.execute-api.eu-north-1.amazonaws.com/dev';

interface ApiClientConfig {
  requiresAuth?: boolean;
  contentType?: string;
}

class ApiClient {
  private static authContext: AuthContextType | null = null;

  static setAuthContext(context: AuthContextType) {
    ApiClient.authContext = context;
  }

  private static async getHeaders(config: ApiClientConfig = {}): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': config.contentType || 'application/json',
    };

    if (config.requiresAuth && ApiClient.authContext) {
      const token = await ApiClient.authContext.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return response.json();
  }

  static async get<T>(endpoint: string, config: ApiClientConfig = {}): Promise<T> {
    const headers = await this.getHeaders(config);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    return this.handleResponse<T>(response);
  }

  static async post<T>(endpoint: string, data: any, config: ApiClientConfig = {}): Promise<T> {
    const headers = await this.getHeaders(config);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: config.contentType === 'application/json' ? JSON.stringify(data) : data,
    });
    return this.handleResponse<T>(response);
  }

  static async put<T>(endpoint: string, data: any, config: ApiClientConfig = {}): Promise<T> {
    const headers = await this.getHeaders(config);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: config.contentType === 'application/json' ? JSON.stringify(data) : data,
    });
    return this.handleResponse<T>(response);
  }

  static async delete<T>(endpoint: string, config: ApiClientConfig = {}): Promise<T> {
    const headers = await this.getHeaders(config);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    return this.handleResponse<T>(response);
  }
}

export default ApiClient; 