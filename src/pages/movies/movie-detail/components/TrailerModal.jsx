import Modal from '@/components/ui/Modal';
import useLanguage from '@/features/i18n/hooks/useLanguage';

/** @param {{ isOpen: boolean, onClose: () => void, title: string, trailerUrl?: string }} props */
function TrailerModal({ isOpen, onClose, title, trailerUrl }) {
  const { tx } = useLanguage();

  const getEmbedUrl = (url) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        const videoId = urlObj.searchParams.get('v');
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      } else if (urlObj.hostname === 'youtu.be') {
        const videoId = urlObj.pathname.slice(1);
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const embedUrl = getEmbedUrl(trailerUrl);
  const isDirectVideo = trailerUrl && !trailerUrl.includes('youtube.com') && !trailerUrl.includes('youtu.be');

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={tx(`${title} trailer`, `Trailer ${title}`)}
      maxWidthClass="max-w-5xl"
    >
      <div className="w-full bg-[#111111] overflow-hidden rounded-md" style={{ aspectRatio: '16/9' }}>
        {trailerUrl ? (
          isDirectVideo ? (
            <video
              src={trailerUrl}
              controls
              autoPlay
              className="w-full h-full object-contain bg-black"
            ></video>
          ) : (
            <iframe
              src={embedUrl}
              title={`${title} Trailer`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center p-10 text-center text-sm text-[#B4B2A9]">
            {tx('Trailer is not available', 'Chưa có trailer cho phim này')}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default TrailerModal;

