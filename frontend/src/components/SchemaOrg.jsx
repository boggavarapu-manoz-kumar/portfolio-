import { Helmet } from 'react-helmet-async';

const SchemaOrg = ({ profile, projects, blogs }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profile.name,
    "jobTitle": profile.title,
    "url": "https://www.manozz.site",
    "description": profile.bio,
    "sameAs": [
      profile.linkedinLink,
      profile.githubLink
    ].filter(Boolean),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.manozz.site"
    }
  };

  if (projects && projects.length > 0) {
    schema.hasPart = projects.map(p => ({
      "@type": "CreativeWork",
      "name": p.title,
      "description": p.description,
      "url": p.liveLink
    }));
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default SchemaOrg;
