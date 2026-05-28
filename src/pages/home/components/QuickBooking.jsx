import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLanguage from '@/features/i18n/hooks/useLanguage';

function QuickBooking({ movies = [] }) {
  const { tx } = useLanguage();
  const navigate = useNavigate();
  const [selectedMovieId, setSelectedMovieId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMovieId) {
      navigate(`/booking/${selectedMovieId}/seats`);
    }
  };

  return (
    <section className="page-container -mt-8 relative z-20">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0 rounded-2xl bg-white p-4 md:p-2 shadow-xl shadow-black/10 border border-gray-100"
      >
        {/* Movie selector */}
        <div className="flex-1 flex items-center gap-3 px-3 md:px-4 py-2 md:border-r border-gray-200">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#034ea2]/10 text-[#034ea2] flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-2.625 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m1.5-2.625c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5m0 0A1.125 1.125 0 0118 14.625v-1.5" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
              {tx('Select Movie', 'Chọn phim')}
            </label>
            <select
              value={selectedMovieId}
              onChange={(e) => setSelectedMovieId(e.target.value)}
              className="w-full appearance-none bg-transparent text-sm font-medium text-ink outline-none cursor-pointer truncate"
            >
              <option value="">{tx('-- Choose a movie --', '-- Chọn phim --')}</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={!selectedMovieId}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f26b38] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#f26b38]/25 transition-all hover:bg-[#fb9440] hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#f26b38] disabled:hover:shadow-lg md:rounded-xl"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          {tx('Book Now', 'Đặt vé ngay')}
        </button>
      </form>
    </section>
  );
}

export default QuickBooking;
