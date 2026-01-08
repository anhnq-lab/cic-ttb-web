import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    // For article/news pages
    articleData?: {
        author?: string;
        publishedTime?: string;
        modifiedTime?: string;
        section?: string;
    };
}

const SITE_URL = 'https://cic-bim-hub.vn';
const SITE_NAME = 'BIM & Digital Twin Hub Vietnam';
const DEFAULT_DESCRIPTION = 'Trung tâm Kiến thức và Dịch vụ BIM & Digital Twin hàng đầu tại Việt Nam. Cung cấp giải pháp, đào tạo và tư vấn chuyển đổi số ngành xây dựng.';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070';

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    articleData,
}) => {
    const metaTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const metaDescription = description || DEFAULT_DESCRIPTION;
    const metaKeywords = keywords || 'BIM, Digital Twin, Construction, Vietnam, Digital Transformation, Consulting, Training, chuyển đổi số xây dựng, tư vấn BIM';
    const metaImage = image || DEFAULT_IMAGE;
    const metaUrl = url || (typeof window !== 'undefined' ? window.location.href : SITE_URL);

    // Organization Schema - thông tin công ty
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        alternateName: 'CIC BIM Hub',
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        description: DEFAULT_DESCRIPTION,
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            availableLanguage: ['Vietnamese', 'English'],
        },
        sameAs: [
            'https://www.facebook.com/bimhubvietnam',
            'https://www.linkedin.com/company/bimhubvietnam',
        ],
    };

    // WebSite Schema - search action cho Google
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };

    // Article Schema - cho bài viết tin tức
    const articleSchema = articleData ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: metaDescription,
        image: metaImage,
        author: {
            '@type': 'Organization',
            name: articleData.author || SITE_NAME,
        },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/logo.png`,
            },
        },
        datePublished: articleData.publishedTime,
        dateModified: articleData.modifiedTime || articleData.publishedTime,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': metaUrl,
        },
    } : null;

    // BreadcrumbList Schema
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Trang chủ',
                item: SITE_URL,
            },
            ...(title ? [{
                '@type': 'ListItem',
                position: 2,
                name: title,
                item: metaUrl,
            }] : []),
        ],
    };

    return (
        <Helmet>
            {/* Standard Metadata */}
            <html lang="vi" />
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <link rel="canonical" href={metaUrl} />

            {/* Additional SEO Meta */}
            <meta name="robots" content="index, follow" />
            <meta name="author" content={SITE_NAME} />
            <meta name="geo.region" content="VN" />
            <meta name="geo.placename" content="Vietnam" />

            {/* Open Graph Metadata (Facebook, LinkedIn) */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content="vi_VN" />

            {/* Twitter Card Metadata */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Article specific OG tags */}
            {articleData && (
                <>
                    <meta property="article:published_time" content={articleData.publishedTime} />
                    <meta property="article:modified_time" content={articleData.modifiedTime} />
                    <meta property="article:section" content={articleData.section || 'BIM News'} />
                </>
            )}

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(websiteSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(breadcrumbSchema)}
            </script>
            {articleSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(articleSchema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
