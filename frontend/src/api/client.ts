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
    const headers: HeadersInit = {};

    if (config.contentType !== undefined) {
      headers['Content-Type'] = config.contentType;
    }

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
      // Log error details to the console
      const errorText = await response.text();
      console.error(`API request failed: ${response.statusText}`, errorText);
      throw new Error(`API request failed: ${response.statusText}`);
    }
    // Only try to parse JSON if there is content and content-type is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    // If no content or not JSON, return null
    return null as unknown as T;
  }

  static async get<T>(endpoint: string, config: ApiClientConfig = {}): Promise<T> {
    const headers = await this.getHeaders(config);
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    return this.handleResponse<T>(response);
  }

  static async post<T>(endpoint: string, data: any, config: ApiClientConfig = {}): Promise<T> {
    const headers = await this.getHeaders(config);
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: config.contentType && config.contentType !== 'application/json' ? data : JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  static async put<T>(endpoint: string, data: any, config: ApiClientConfig = {}): Promise<T> {
    const headers = await this.getHeaders(config);
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: config.contentType && config.contentType !== 'application/json' ? data : JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  static async delete<T>(endpoint: string, config: ApiClientConfig = {}): Promise<T> {
    const headers = await this.getHeaders(config);
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    return this.handleResponse<T>(response);
  }
}

export default ApiClient; 