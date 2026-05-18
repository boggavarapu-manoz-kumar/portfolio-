import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url, type = 'website' }) => {
  const siteTitle = "MANOJ KUMAR | JAVA FULL STACK DEVELOPER";
  const fullTitle = title ? title : siteTitle;
  const siteDescription = description || "Portfolio of Manoj Kumar Boggavarapu - Java Full Stack Developer specializing in Spring Boot, React, and scalable web applications.";
  const siteUrl = "https://manozz.site/";
  const fullUrl = url ? `${siteUrl}${url.startsWith('/') ? url.slice(1) : url}` : siteUrl;
  const siteImage = image || `${siteUrl}og-image.png`;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={siteDescription} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={siteDescription} />
      <meta property="twitter:image" content={siteImage} />
    </Helmet>
  );
};

export default SEO;
