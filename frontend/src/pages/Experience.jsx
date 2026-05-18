import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { experienceService } from '../services/apiServices';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { getImgUrl } from '../api/axiosInstance';

// Parse date strings like "Jan 2022", "December 2023", "Present"
const parseDateString = (dateStr) => {
  if (!dateStr || dateStr.toLowerCase().trim() === 'present') {
    return new Date();
  }
  
  const clean = dateStr.trim().toLowerCase();
  
  const months = {
    jan: 0, janurary: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
    may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8, september: 8,
    oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11
  };
  
  const parts = clean.split(/\s+/);
  let year = new Date().getFullYear();
  let monthIndex = 0;
  
  if (parts.length >= 2) {
    const mStr = parts[0].substring(0, 3);
    if (months[mStr] !== undefined) {
      monthIndex = months[mStr];
    }
    const yVal = parseInt(parts[1]);
    if (!isNaN(yVal)) {
      year = yVal;
    }
  } else if (parts.length === 1) {
    const yVal = parseInt(parts[0]);
    if (!isNaN(yVal)) {
      year = yVal;
    }
  }
  
  return new Date(year, monthIndex, 1);
};

// Calculate duration in years and months
const calculateDuration = (startDateStr, endDateStr) => {
  try {
    const start = parseDateString(startDateStr);
    const end = parseDateString(endDateStr);
    
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth() + 1; // inclusive of start month
    
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    
    const yearPart = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '';
    const monthPart = months > 0 ? `${months} mo${months > 1 ? 's' : ''}` : '';
    
    return [yearPart, monthPart].filter(Boolean).join(' ');
  } catch (err) {
    return '';
  }
};

// Calculate overall combined stay duration
const calculateOverallDuration = (roles) => {
  if (!roles || roles.length === 0) return '';
  
  let earliestStart = null;
  let latestEnd = null;
  let earliestStartStr = '';
  let latestEndStr = '';
  
  roles.forEach(role => {
    const start = parseDateString(role.startDate);
    const end = parseDateString(role.endDate);
    
    if (!earliestStart || start < earliestStart) {
      earliestStart = start;
      earliestStartStr = role.startDate;
    }
    if (!latestEnd || end > latestEnd) {
      latestEnd = end;
      latestEndStr = role.endDate;
    }
  });
  
  return calculateDuration(earliestStartStr, latestEndStr);
};

const Experience = () => {
  const { data: experiences, isLoading, isError } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const res = await experienceService.getAll();
      return res.data?.data || res.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Group experiences by company to show promotions/multiple roles at the same company on a single card
  const groupedExperiences = React.useMemo(() => {
    if (!experiences) return [];
    
    const groups = [];
    experiences.forEach(exp => {
      const companyKey = exp.company.trim().toLowerCase();
      const existingGroup = groups.find(g => g.company.trim().toLowerCase() === companyKey);
      
      if (existingGroup) {
        existingGroup.roles.push(exp);
      } else {
        groups.push({
          company: exp.company,
          companyLogo: exp.companyLogo,
          roles: [exp]
        });
      }
    });
    return groups;
  }, [experiences]);

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <div style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#6366f1', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  if (isError || !experiences || experiences.length === 0) return null;

  return (
    <section id="experience" style={{ maxWidth: 1000, margin: '0 auto', padding: '100px 24px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16,
          background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)',
          borderRadius: 99, padding: '6px 16px'
        }}>
          <Briefcase size={14} color="#6366f1" />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#818cf8', textTransform: 'uppercase' }}>
            My Journey
          </span>
        </div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#fff' }}>
          Experience
        </h2>
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 48 }}>
        {/* Timeline line */}
        <div style={{ 
          position: 'absolute', left: 24, top: 8, bottom: 0, width: 2, 
          background: 'linear-gradient(to bottom, rgba(99,102,241,0.5), rgba(99,102,241,0.05))',
          borderRadius: 2
        }} className="timeline-line" />

        {groupedExperiences.map((group, index) => {
          const hasMultipleRoles = group.roles.length > 1;
          const overallStayText = hasMultipleRoles ? calculateOverallDuration(group.roles) : '';

          return (
            <div key={index} style={{ position: 'relative', paddingLeft: 64 }}>
              {/* Timeline main dot */}
              <div style={{ 
                position: 'absolute', left: 18, top: 6, width: 14, height: 14, 
                borderRadius: '50%', background: '#0f0f11', border: '2px solid #6366f1',
                boxShadow: '0 0 10px rgba(99,102,241,0.4)', zIndex: 2
              }} className="timeline-dot" />

              <div style={{ 
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 24, padding: '32px', transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }} 
              className="experience-card"
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                
                {/* Main Card Header */}
                {(() => {
                  const companyNameClean = group.company.toLowerCase().trim();
                  const customMappings = {
                    'sundram fasteners limited': 'sundram.com',
                    'sundram fasteners': 'sundram.com',
                    'tvs sundram': 'sundram.com',
                    'tvs sundram fasteners limited': 'sundram.com',
                    'tvs sundram fasteners': 'sundram.com',
                    'google': 'google.com',
                    'microsoft': 'microsoft.com'
                  };
                  const domain = group.companyLogo || 
                                 customMappings[companyNameClean] || 
                                 companyNameClean
                                   .replace(/\s+(inc|llc|ltd|limited|co|corp|corporation)\b/g, '')
                                   .replace(/[^a-z0-9]/g, '') + '.com';
                  
                  const logoDevToken = import.meta.env.VITE_LOGODEV_TOKEN || 'pk_S_LMVztgS-GD0V6FTqaWFQ';
                  const logoUrl = logoDevToken 
                    ? `https://img.logo.dev/${domain}?token=${logoDevToken}`
                    : `https://logo.clearbit.com/${domain}`;

                  return (
                    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: hasMultipleRoles ? 24 : 0 }} className="exp-header">
                      {/* Company Logo container */}
                      <div style={{ 
                        width: 56, height: 56, borderRadius: 12, background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', overflow: 'hidden', 
                        flexShrink: 0
                      }}>
                        <img 
                          src={logoUrl} 
                          alt={group.company} 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                          onError={e => { 
                            if (e.target.src.includes('logo.dev')) {
                              e.target.src = `https://logo.clearbit.com/${domain}`;
                            } else if (e.target.src.includes('clearbit.com')) {
                              e.target.src = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
                            } else if (e.target.src.includes('duckduckgo.com')) {
                              e.target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
                            } else {
                              e.target.style.display = 'none'; 
                              e.target.nextSibling.style.display = 'flex'; 
                            }
                          }} 
                        />
                        <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontWeight: 700, fontSize: 20 }}>
                          {group.company.charAt(0)}
                        </div>
                      </div>
                      
                      {/* Company info */}
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 4px', lineHeight: 1.2 }}>
                          {group.company}
                        </h3>
                        {hasMultipleRoles && (
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500, display: 'flex', gap: 6, alignItems: 'center' }}>
                            <span>{group.roles.length} roles</span>
                            <span>•</span>
                            <span style={{ color: '#818cf8', fontWeight: 600 }}>{overallStayText}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Roles list */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 32,
                  position: 'relative',
                  paddingLeft: hasMultipleRoles ? 32 : 0,
                  marginTop: hasMultipleRoles ? 16 : 0
                }}>
                  {/* Vertical connector line for multiple roles */}
                  {hasMultipleRoles && (
                    <div style={{ 
                      position: 'absolute', 
                      left: 11, // perfectly aligns with the center of the nested dots
                      top: 12, 
                      bottom: 12, 
                      width: 2, 
                      background: 'rgba(255,255,255,0.15)'
                    }} />
                  )}

                  {group.roles.map((role, rIdx) => {
                    const roleDuration = calculateDuration(role.startDate, role.endDate);
                    
                    return (
                      <div key={role.id || rIdx} style={{ position: 'relative' }}>
                        {/* Nested role dot */}
                        {hasMultipleRoles && (
                          <div style={{ 
                            position: 'absolute', 
                            left: -24, 
                            top: 8, 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            background: '#818cf8', 
                            border: '2px solid #0f0f11',
                            boxShadow: '0 0 0 3px rgba(99,102,241,0.2)',
                            zIndex: 2
                          }} />
                        )}

                        <div>
                          <h4 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
                            {role.title}
                          </h4>
                          
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#a855f7', marginBottom: 12 }}>
                            {role.employmentType ? `${role.employmentType}` : ''}
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500 }}>
                              <Calendar size={14} />
                              <span>
                                {role.startDate} - {role.endDate || 'Present'} {roleDuration && `• ${roleDuration}`}
                              </span>
                            </div>
                            {(role.location || role.locationType) && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500 }}>
                                <MapPin size={14} />
                                <span>{role.location} {role.locationType && `(${role.locationType})`}</span>
                              </div>
                            )}
                          </div>

                          {role.description && (
                            <div style={{ 
                              fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)', 
                              whiteSpace: 'pre-line', borderTop: !hasMultipleRoles ? '1px solid rgba(255,255,255,0.05)' : 'none',
                              paddingTop: !hasMultipleRoles ? 16 : 0,
                              marginTop: 12
                            }}>
                              {role.description}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .timeline-line { left: 16px !important; }
          .timeline-dot { left: 10px !important; }
          .experience-card { padding: 24px 20px !important; }
          div[style*="paddingLeft: 64"] { padding-left: 48px !important; }
        }
      `}</style>
    </section>
  );
};

export default Experience;
