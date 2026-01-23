
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { NewsItem } from '../types';
import SEO from './SEO';
import SocialShare from './SocialShare';
import { formatArticleContent, calculateReadingTime } from '../services/contentFormatter';
import { LazyImage } from './shared/LazyImage';
import './ArticleContent.css';

const NewsDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [news, setNews] = useState<NewsItem | null>(null);
    const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        window.scrollTo(0, 0);

        Promise.all([
            api.getNewsDetail(id),
            api.getRelatedNews(id)
        ])
            .then(([data, related]) => {
                setNews(data as NewsItem);
                setRelatedNews(related as NewsItem[]);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Không thể tải bài viết.');
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
        </div>
    );

    if (error) return <div className="min-h-screen flex justify-center items-center text-red-500">{error}</div>;

    if (!news) return <div className="min-h-screen flex justify-center items-center">Không tìm thấy bài viết.</div>;

    const renderVideo = (url: string) => {
        const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
        return (
            <div className="my-8 rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-black aspect-video relative group">
                {isYouTube ? (
                    <iframe
                        width="100%"
                        height="100%"
                        src={url}
                        title="Video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                    ></iframe>
                ) : (
                    <video controls className="w-full h-full">
                        <source src={url} type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ thẻ video.
                    </video>
                )}
            </div>
        );
    };

    const renderAudio = (url: string) => {
        return (
            <div className="my-8 bg-gray-100 p-6 rounded-xl border border-gray-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-orange text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-sm mb-2">Nghe nội dung bài viết (Podcast)</h4>
                    <audio controls className="w-full h-10">
                        <source src={url} type="audio/mpeg" />
                        Trình duyệt của bạn không hỗ trợ thẻ audio.
                    </audio>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {news && (
                <SEO
                    title={news.title}
                    description={news.excerpt}
                    image={news.imageUrl}
                    url={window.location.href}
                    type="article"
                />
            )}

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex items-center text-sm">
                        <Link to="/" className="text-gray-500 hover:text-brand-blue">Trang chủ</Link>
                        <svg className="w-4 h-4 mx-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        <span className="text-brand-blue font-bold truncate max-w-xs">{news.title}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
                <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-12 pb-0">
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="bg-blue-100 text-brand-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {news.category}
                            </span>
                            {news.audioUrl && (
                                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" /></svg>
                                    Audio
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                            {news.title}
                        </h1>

                        <div className="flex items-center border-b border-gray-100 pb-8 mb-8">
                            <div className="flex items-center mr-6">
                                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                                    <img src={`https://ui-avatars.com/api/?name=${news.author || 'Admin'}&background=random`} alt="Author" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{news.author || 'Ban Biên Tập'}</p>
                                    <p className="text-xs text-gray-500">Tác giả</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-gray-200 mr-6"></div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{news.date}</p>
                                <p className="text-xs text-gray-500">Ngày đăng</p>
                            </div>
                            <div className="h-8 w-px bg-gray-200 mx-6"></div>
                            <div className="flex items-center text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm">{calculateReadingTime(news.content || news.excerpt)} phút đọc</span>
                            </div>
                        </div>
                    </div>

                    {news.imageUrl && (
                        <div className="w-full h-[400px] md:h-[500px] relative">
                            <LazyImage
                                src={news.imageUrl}
                                alt={news.altText || news.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-8 md:p-12 pt-10">
                        {news.audioUrl && renderAudio(news.audioUrl)}
                        {news.videoUrl && renderVideo(news.videoUrl)}
                        <div
                            className="article-content text-gray-700 leading-relaxed text-lg"
                            dangerouslySetInnerHTML={{
                                __html: formatArticleContent(news.content || news.excerpt)
                            }}
                        />
                        <SocialShare url={window.location.href} title={news.title} />
                    </div>
                </article>

                {relatedNews.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-black uppercase tracking-widest text-sm">Bài viết liên quan</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedNews.map((item) => (
                                <Link to={`/news/${item.id}`} key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1">
                                    <div className="h-48 overflow-hidden relative">
                                        <LazyImage
                                            src={item.imageUrl}
                                            alt={item.altText || item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-2 left-2 bg-brand-darkBlue/80 backdrop-blur text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">
                                            {item.category}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-blue transition-colors text-sm">
                                            {item.title}
                                        </h3>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.date}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsDetail;
