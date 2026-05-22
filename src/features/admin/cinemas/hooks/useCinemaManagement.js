import { useCallback, useEffect, useMemo, useState } from 'react';
import { mockCinemaBranches } from '@/utils/mockData';
import {
  createCinema,
  deleteCinema,
  getCinemas,
  updateCinema,
} from '@/features/admin/services/cinemaService';
import {
  extractList,
  extractPagination,
  getErrorMessage,
  normalizeCinema,
} from '@/features/admin/cinemas/utils/cinemaAdapter';

function useCinemaManagement(tx) {
  const useMock = true;
  const [cinemaStore, setCinemaStore] = useState(() =>
    mockCinemaBranches.map(normalizeCinema).filter((cinema) => cinema && !Number.isNaN(cinema.id)),
  );
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(!useMock);
  const [fetchError, setFetchError] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [serverPagination, setServerPagination] = useState({
    page: 1,
    pageSize: 6,
    totalItems: 0,
    totalPages: 1,
  });

  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  const handleSearchNameChange = useCallback((value) => {
    setPage(1);
    setSearchName(value);
  }, []);

  const handleSearchAddressChange = useCallback((value) => {
    setPage(1);
    setSearchAddress(value);
  }, []);

  const handleSearchPhoneChange = useCallback((value) => {
    setPage(1);
    setSearchPhone(value);
  }, []);

  const handleSearchEmailChange = useCallback((value) => {
    setPage(1);
    setSearchEmail(value);
  }, []);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editingCinema, setEditingCinema] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [toast, setToast] = useState({ visible: false, message: '', tone: 'info' });

  const showToast = useCallback((message, tone = 'info') => {
    setToast({ visible: true, message, tone });
  }, []);

  useEffect(() => {
    if (!toast.visible) return undefined;
    const timeoutId = window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, 2500);
    return () => window.clearTimeout(timeoutId);
  }, [toast.visible]);

  const query = useMemo(
    () => ({
      page,
      pageSize,
      name: searchName || undefined,
      address: searchAddress || undefined,
      phone: searchPhone || undefined,
      email: searchEmail || undefined,
    }),
    [page, pageSize, searchName, searchAddress, searchPhone, searchEmail],
  );

  const filteredMock = useMemo(() => {
    if (!useMock) return [];
    return cinemaStore.filter((cinema) => {
      const nameMatch = searchName
        ? cinema.name.toLowerCase().includes(searchName.toLowerCase())
        : true;
      const addressMatch = searchAddress
        ? cinema.address.toLowerCase().includes(searchAddress.toLowerCase())
        : true;
      const phoneMatch = searchPhone ? cinema.phone.includes(searchPhone) : true;
      const emailMatch = searchEmail
        ? cinema.email.toLowerCase().includes(searchEmail.toLowerCase())
        : true;
      return nameMatch && addressMatch && phoneMatch && emailMatch;
    });
  }, [cinemaStore, searchName, searchAddress, searchPhone, searchEmail, useMock]);

  const mockPagination = useMemo(() => {
    if (!useMock) return { data: [], pagination: serverPagination };
    const totalItems = filteredMock.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const data = filteredMock.slice(startIndex, startIndex + pageSize);
    return {
      data,
      pagination: {
        page: safePage,
        pageSize,
        totalItems,
        totalPages,
      },
    };
  }, [filteredMock, page, pageSize, serverPagination, useMock]);

  const loadCinemas = useCallback(async () => {
    if (useMock) return;
    setLoading(true);
    setFetchError('');
    try {
      const result = await getCinemas(query);
      const list = extractList(result)
        .map(normalizeCinema)
        .filter((cinema) => cinema && !Number.isNaN(cinema.id));
      const pagination = extractPagination(result);
      setCinemas(list);
      setServerPagination(
        pagination
          ? {
              page: pagination.page,
              pageSize: pagination.pageSize,
              totalItems: pagination.totalItems,
              totalPages: pagination.totalPages,
            }
          : {
              page: query.page,
              pageSize: query.pageSize,
              totalItems: list.length,
              totalPages: 1,
            },
      );
    } catch (error) {
      setCinemas([]);
      setFetchError(getErrorMessage(error, 'Unable to load cinema list.'));
    } finally {
      setLoading(false);
    }
  }, [query, useMock]);

  useEffect(() => {
    if (useMock) return undefined;
    const timeoutId = window.setTimeout(() => {
      loadCinemas();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadCinemas, useMock]);

  const displayCinemas = useMemo(
    () => (useMock ? mockPagination.data : cinemas),
    [cinemas, mockPagination.data, useMock],
  );

  const pagination = useMemo(
    () => (useMock ? mockPagination.pagination : serverPagination),
    [mockPagination.pagination, serverPagination, useMock],
  );

  const handleOpenCreateForm = () => {
    setFormMode('create');
    setEditingCinema(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (cinema) => {
    setFormMode('edit');
    setEditingCinema(cinema);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCinema(null);
  };

  const handleSubmitCinema = async (values) => {
    try {
      if (useMock) {
        if (formMode === 'edit' && editingCinema) {
          setCinemaStore((current) =>
            current.map((cinema) => (cinema.id === editingCinema.id ? { ...cinema, ...values } : cinema)),
          );
          showToast(tx('Cinema updated successfully.', 'Cập nhật rạp thành công.'), 'success');
        } else {
          const nextId = Math.max(0, ...cinemaStore.map((cinema) => cinema.id)) + 1;
          setCinemaStore((current) => [{ id: nextId, ...values }, ...current]);
          showToast(tx('Cinema created successfully.', 'Tạo rạp thành công.'), 'success');
        }
        return { ok: true };
      }

      if (formMode === 'edit' && editingCinema) {
        await updateCinema(editingCinema.id, values);
        showToast(tx('Cinema updated successfully.', 'Cập nhật rạp thành công.'), 'success');
      } else {
        await createCinema(values);
        showToast(tx('Cinema created successfully.', 'Tạo rạp thành công.'), 'success');
      }

      await loadCinemas();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: getErrorMessage(error, 'Failed to save cinema.'),
      };
    }
  };

  const handleRequestDelete = (cinema) => {
    setDeleteTarget(cinema);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      if (useMock) {
        setCinemaStore((current) => current.filter((cinema) => cinema.id !== deleteTarget.id));
        showToast(tx('Cinema deleted successfully.', 'Xóa rạp thành công.'), 'success');
      } else {
        await deleteCinema(deleteTarget.id);
        showToast(tx('Cinema deleted successfully.', 'Xóa rạp thành công.'), 'success');
        await loadCinemas();
      }
    } catch (error) {
      showToast(getErrorMessage(error, 'Failed to delete cinema.'), 'error');
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  const summary = useMemo(() => {
    const totalBranches = useMock ? cinemaStore.length : pagination.totalItems;
    const phoneCount = displayCinemas.filter((cinema) => cinema.phone).length;
    const emailCount = displayCinemas.filter((cinema) => cinema.email).length;
    return {
      totalBranches,
      phoneCount,
      emailCount,
    };
  }, [cinemaStore.length, displayCinemas, pagination.totalItems, useMock]);

  return {
    useMock,
    cinemas: displayCinemas,
    existingCinemas: useMock ? cinemaStore : cinemas,
    loading,
    fetchError,
    page: pagination.page,
    totalPages: pagination.totalPages,
    pageSize: pagination.pageSize,
    totalItems: pagination.totalItems,
    searchName,
    searchAddress,
    searchPhone,
    searchEmail,
    isFormOpen,
    formMode,
    editingCinema,
    deleteTarget,
    deletingId,
    toast,
    summary,
    handleSearchNameChange,
    handleSearchAddressChange,
    handleSearchPhoneChange,
    handleSearchEmailChange,
    handleOpenCreateForm,
    handleOpenEditForm,
    handleCloseForm,
    handleSubmitCinema,
    handleRequestDelete,
    handleCancelDelete,
    handleConfirmDelete,
    handlePrevPage: () => setPage((current) => Math.max(1, current - 1)),
    handleNextPage: () => setPage((current) => Math.min(pagination.totalPages, current + 1)),
  };
}

export default useCinemaManagement;
