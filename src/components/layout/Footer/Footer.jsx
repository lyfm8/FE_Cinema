import useLanguage from '@/features/i18n/hooks/useLanguage';

function Footer() {
  const { tx } = useLanguage();

  return (
    <footer className="mt-auto border-base border-t bg-paper">
      <div className="page-container py-5">
        <div className="flex flex-col gap-2 text-xs text-stone md:flex-row md:items-center md:justify-between">
          <p className="movie-title text-sm tracking-[0.12em]">CINEPLEX</p>
          <p>{tx('Modern minimal cinema booking experience', 'Trải nghiệm đặt vé rạp phim tối giản hiện đại')}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

