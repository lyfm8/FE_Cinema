import { apiClient } from '@/core/api/apiClient';

export function getConcessionProducts(params = {}) {
  return apiClient.get('/concessions', { params });
}

export function createConcessionProduct(payload) {
  return apiClient.post('/concessions', payload);
}

export function updateConcessionProduct(id, payload) {
  return apiClient.put(`/concessions/${id}`, payload);
}

export function deleteConcessionProduct(id) {
  return apiClient.delete(`/concessions/${id}`);
}

export default {
  getConcessionProducts,
  createConcessionProduct,
  updateConcessionProduct,
  deleteConcessionProduct,
};
