import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createConcessionProduct,
  deleteConcessionProduct,
  getConcessionProducts,
  updateConcessionProduct,
} from '@/features/admin/concessions/services/concessionService';

const EMPTY_FORM = {
  name: '',
  price: '',
  stockQuantity: '',
};

function getRequestMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error?.message ||
    error?.message ||
    fallback
  );
}

function normalizeProducts(payload) {
  return Array.isArray(payload?.data) ? payload.data : [];
}

function useConcessionManagement(tx) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', tone: 'info' });

  const showToast = useCallback((message, tone = 'info') => {
    setToast({ visible: true, message, tone });
    window.setTimeout(() => {
      setToast({ visible: false, message: '', tone: 'info' });
    }, 2500);
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setFetchError('');

    try {
      const response = await getConcessionProducts({ page: 1, pageSize: 100 });
      setProducts(normalizeProducts(response));
    } catch (error) {
      setFetchError(getRequestMessage(error, tx('Unable to load concessions.', 'Không thể tải bắp nước.')));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [tx]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openCreateForm = () => {
    setFormMode('create');
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setIsFormOpen(true);
  };

  const openEditForm = (product) => {
    setFormMode('edit');
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      price: String(product.price ?? ''),
      stockQuantity: String(product.stockQuantity ?? 0),
    });
    setFormError('');
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setIsFormOpen(false);
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleFormChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const buildPayload = () => {
    const name = form.name.trim();
    const price = Number(form.price);
    const stockQuantity = Number(form.stockQuantity);

    if (!name) {
      throw new Error(tx('Product name is required.', 'Vui lòng nhập tên sản phẩm.'));
    }

    if (!Number.isFinite(price) || price <= 0) {
      throw new Error(tx('Price must be greater than 0.', 'Giá phải lớn hơn 0.'));
    }

    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      throw new Error(tx('Stock must be a non-negative integer.', 'Tồn kho phải là số nguyên không âm.'));
    }

    return { name, price, stockQuantity };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError('');

    try {
      const payload = buildPayload();

      if (formMode === 'edit' && editingProduct) {
        await updateConcessionProduct(editingProduct.id, payload);
        showToast(tx('Concession updated.', 'Đã cập nhật bắp nước.'), 'success');
      } else {
        await createConcessionProduct(payload);
        showToast(tx('Concession created.', 'Đã thêm bắp nước.'), 'success');
      }

      setIsFormOpen(false);
      setEditingProduct(null);
      setForm(EMPTY_FORM);
      setFormError('');
      await loadProducts();
    } catch (error) {
      setFormError(getRequestMessage(error, error.message || tx('Unable to save product.', 'Không thể lưu sản phẩm.')));
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (product) => {
    setDeleteTarget(product);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteConcessionProduct(deleteTarget.id);
      showToast(tx('Concession deleted.', 'Đã xóa bắp nước.'), 'success');
      setDeleteTarget(null);
      await loadProducts();
    } catch (error) {
      showToast(getRequestMessage(error, tx('Unable to delete product.', 'Không thể xóa sản phẩm.')), 'error');
    }
  };

  const summary = useMemo(() => {
    const outOfStock = products.filter((product) => Number(product.stockQuantity) === 0).length;
    const lowStock = products.filter((product) => {
      const stock = Number(product.stockQuantity);
      return stock > 0 && stock <= 5;
    }).length;

    return {
      total: products.length,
      lowStock,
      outOfStock,
    };
  }, [products]);

  return {
    products,
    loading,
    fetchError,
    isFormOpen,
    formMode,
    form,
    formError,
    saving,
    deleteTarget,
    toast,
    summary,
    openCreateForm,
    openEditForm,
    closeForm,
    handleFormChange,
    handleSubmit,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}

export default useConcessionManagement;
