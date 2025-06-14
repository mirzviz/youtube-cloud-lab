import { vi, describe, it, expect, beforeEach } from 'vitest';
import ApiClient from './client';

// Mock global fetch
beforeEach(() => {
  global.fetch = vi.fn();
});

describe('ApiClient', () => {
  it('get: should fetch data from the correct endpoint and return JSON', async () => {
    const mockData = { message: 'success' };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
      headers: { get: () => 'application/json' },
    });

    const result = await ApiClient.get('/test-endpoint');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test-endpoint'),
      expect.objectContaining({ method: 'GET' })
    );
    expect(result).toEqual(mockData);
  });

  it('post: should send data and return JSON', async () => {
    const mockData = { message: 'created' };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
      headers: { get: () => 'application/json' },
    });

    const payload = { foo: 'bar' };
    const result = await ApiClient.post('/test-endpoint', payload, { contentType: 'application/json' });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test-endpoint'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) })
    );
    expect(result).toEqual(mockData);
  });

  it('put: should send data and return JSON', async () => {
    const mockData = { message: 'updated' };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
      headers: { get: () => 'application/json' },
    });

    const payload = { foo: 'baz' };
    const result = await ApiClient.put('/test-endpoint', payload, { contentType: 'application/json' });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test-endpoint'),
      expect.objectContaining({ method: 'PUT', body: JSON.stringify(payload) })
    );
    expect(result).toEqual(mockData);
  });

  it('delete: should call the endpoint and return JSON', async () => {
    const mockData = { message: 'deleted' };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
      headers: { get: () => 'application/json' },
    });

    const result = await ApiClient.delete('/test-endpoint');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test-endpoint'),
      expect.objectContaining({ method: 'DELETE' })
    );
    expect(result).toEqual(mockData);
  });
}); 