import { MapPin, Phone, Mail, Navigation, MonitorPlay, CheckCircle2, AlertCircle } from '@/components/shared/Icons';

import useCinemas from '@/features/cinemas/hooks/useCinemas';
import useLanguage from '@/features/i18n/hooks/useLanguage';

const RoomTypeIcon = ({ type }) => {
  switch (type) {
    case 'IMAX':
      return <MonitorPlay className="w-5 h-5 text-blue-500" />;
    case 'VIP':
      return <MonitorPlay className="w-5 h-5 text-amber-500" />;
    case 'COUPLE':
      return <MonitorPlay className="w-5 h-5 text-pink-500" />;
    default:
      return <MonitorPlay className="w-5 h-5 text-gray-500" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'ACTIVE': return 'bg-emerald-100 text-emerald-700';
    case 'MAINTENANCE': return 'bg-amber-100 text-amber-700';
    case 'INACTIVE': return 'bg-rose-100 text-rose-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getStatusText = (status, tx) => {
  switch (status) {
    case 'ACTIVE': return tx('Active', 'Hoạt động');
    case 'MAINTENANCE': return tx('Maintenance', 'Bảo trì');
    case 'INACTIVE': return tx('Inactive', 'Ngừng hoạt động');
    default: return status;
  }
};

export default function CinemasPage() {
  const { cinemas, selectedCinema, setSelectedCinema, rooms, loadingCinemas, loadingRooms, error } = useCinemas();
  const { tx } = useLanguage();

  if (loadingCinemas) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error && !cinemas.length) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{tx('Error', 'Lỗi')}</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-ink">
          {tx('Cinemas System', 'Hệ thống rạp')}
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Cinema List */}
        <div className="w-full lg:w-1/4 xl:w-1/5 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">
                  {tx('Select Cinema', 'Chọn rạp')} ({cinemas.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {cinemas.map((cinema) => (
                  <button
                    key={cinema.id}
                    onClick={() => setSelectedCinema(cinema)}
                    className={`w-full text-left px-4 py-3 transition-all duration-200 hover:bg-orange-50 group ${
                      selectedCinema?.id === cinema.id 
                        ? 'bg-orange-50 border-l-[3px] border-[#f26b38]' 
                        : 'border-l-[3px] border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-0.5">
                      <h3 className={`font-bold text-sm transition-colors ${
                        selectedCinema?.id === cinema.id ? 'text-[#f26b38]' : 'text-gray-900 group-hover:text-[#f26b38]'
                      }`}>
                        {cinema.name}
                      </h3>
                      {selectedCinema?.id === cinema.id && (
                        <CheckCircle2 className="w-4 h-4 text-[#f26b38] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {cinema.address}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Cinema Details & Rooms */}
          <div className="flex-1">
            {selectedCinema ? (
              <div className="space-y-6">
                {/* Cinema Info Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedCinema.name}</h2>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(selectedCinema.status)}`}>
                        {getStatusText(selectedCinema.status, tx)}
                      </span>
                    </div>
                    
                    <button className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-[#f26b38] text-white rounded-full font-semibold transition-colors duration-300 w-full md:w-auto">
                      <Navigation className="w-4 h-4" />
                      {tx('Get Directions', 'Chỉ đường')}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{tx('Address', 'Địa chỉ')}</p>
                        <p className="text-gray-900 font-medium leading-relaxed">{selectedCinema.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{tx('Hotline', 'Hotline')}</p>
                        <p className="text-gray-900 font-medium">{selectedCinema.phone || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                        <p className="text-gray-900 font-medium">{selectedCinema.email || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rooms List */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 uppercase">
                      {tx('Showrooms', 'Phòng chiếu')} ({rooms.length})
                    </h3>
                  </div>

                  {loadingRooms ? (
                    <div className="py-12 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-3 border-orange-500 border-t-transparent"></div>
                    </div>
                  ) : rooms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {rooms.map((room) => (
                        <div key={room.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <RoomTypeIcon type={room.roomType} />
                              </div>
                              <div>
                                <h4 className="font-bold text-lg text-gray-900">{room.name}</h4>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{room.roomType}</p>
                              </div>
                            </div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(room.status)}`}>
                              {getStatusText(room.status, tx)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                            <span className="text-sm text-gray-500">{tx('Capacity', 'Sức chứa')}</span>
                            <span className="font-bold text-gray-900">{room.totalSeats} {tx('seats', 'ghế')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                      <MonitorPlay className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-1">{tx('No rooms found', 'Chưa có phòng chiếu')}</h4>
                      <p className="text-gray-500">{tx('This cinema does not have any rooms registered yet.', 'Rạp này chưa được cập nhật phòng chiếu nào.')}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center h-full flex flex-col items-center justify-center">
                <MapPin className="w-16 h-16 text-gray-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tx('Select a cinema', 'Chọn một rạp')}</h3>
                <p className="text-gray-500 max-w-sm">
                  {tx('Please select a cinema from the list on the left to view its details and showrooms.', 'Vui lòng chọn một rạp từ danh sách bên trái để xem thông tin chi tiết và các phòng chiếu.')}
                </p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
