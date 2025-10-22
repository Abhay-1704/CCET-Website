import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import SharedCivilLayout from './SharedCivilLayout';
import styles from './CivilOverview.module.css';

// Remove hardcoded image imports as they will be fetched via API
// import civilDepartmentImage from '../../assets/Civil-Department/Civil-1.jpeg';
// import bridgeCompetitionImage from '../../assets/Civil-Department/Civil-2.jpeg';

// API Configuration
const API_BASE_URL = 'https://ccet.ac.in/api/overview.php';
const DEPARTMENT_CODE = 'CIVIL'; // Change to CIVIL

const CivilOverview = () => {
    const animatedElementsRef = useRef([]);
    const [departmentInfo, setDepartmentInfo] = useState(null);
    const [programOutcomes, setProgramOutcomes] = useState([]);
    const [specificOutcomes, setSpecificOutcomes] = useState([]);
    const [objectives, setObjectives] = useState([]);
    const [events, setEvents] = useState([]);
    const [featuredEvent, setFeaturedEvent] = useState(null);
    const [quickLinks, setQuickLinks] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initial data fetching
    useEffect(() => {
        fetchAllData();
    }, []);

    // Intersection Observer for animations
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(styles.animated);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        animatedElementsRef.current.forEach(element => {
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [loading]); // Run when loading state changes (after data fetch)

    const fetchAllData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [infoRes, outcomesRes, objectivesRes, eventsRes, linksRes, galleryRes] = await Promise.all([
                fetch(`${API_BASE_URL}?entity=info&department_code=${DEPARTMENT_CODE}&is_active=true`),
                fetch(`${API_BASE_URL}?entity=outcomes&department_code=${DEPARTMENT_CODE}&is_active=true`),
                fetch(`${API_BASE_URL}?entity=objectives&department_code=${DEPARTMENT_CODE}&is_active=true`),
                fetch(`${API_BASE_URL}?entity=events&department_code=${DEPARTMENT_CODE}&is_active=true`),
                fetch(`${API_BASE_URL}?entity=links&department_code=${DEPARTMENT_CODE}&is_active=true`),
                fetch(`${API_BASE_URL}?entity=gallery&department_code=${DEPARTMENT_CODE}&is_active=true&gallery_type=tour`)
            ]);

            const [infoData, outcomesData, objectivesData, eventsData, linksData, galleryData] = await Promise.all([
                infoRes.json(),
                outcomesRes.json(),
                objectivesRes.json(),
                eventsRes.json(),
                linksRes.json(),
                galleryRes.json()
            ]);

            // Handle Department Info
            if (Array.isArray(infoData) && infoData.length > 0) {
                setDepartmentInfo(infoData[0]);
            }

            // Handle Outcomes
            if (Array.isArray(outcomesData)) {
                setProgramOutcomes(outcomesData.filter(o => o.outcome_type === 'general'));
                setSpecificOutcomes(outcomesData.filter(o => o.outcome_type === 'specific'));
            }

            // Handle Objectives
            if (Array.isArray(objectivesData)) {
                setObjectives(objectivesData);
            }

            // Handle Events
            if (Array.isArray(eventsData)) {
                const featured = eventsData.find(e => e.is_featured);
                let nonFeatured = eventsData.filter(e => !e.is_featured);

                // Fallback to non-featured if no explicit featured event exists
                if (nonFeatured.length === eventsData.length && eventsData.length > 0) {
                    // Ensure featured is not included in nonFeatured if it was implicitly selected as one of the first 3
                    nonFeatured = eventsData.filter(e => featured ? e.id !== featured.id : true);
                }

                const displayEvents = nonFeatured.slice(0, 3); // Display up to 3 non-featured events

                setFeaturedEvent(featured);
                setEvents(displayEvents);
            }

            // Handle Quick Links
            if (Array.isArray(linksData)) {
                setQuickLinks(linksData);
            }

            // Handle Gallery
            if (Array.isArray(galleryData)) {
                setGallery(galleryData);
            }
        } catch (err) {
            setError("Error loading department information for Civil Engineering.");
            console.error("Civil Department data fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const getFullUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        // Assuming all asset paths are relative to the site root, like in CseOverview.jsx
        return `https://ccet.ac.in/${path.startsWith('/') ? path.slice(1) : path}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading) {
        return (
            <SharedCivilLayout pageTitle="Overview">
                <div className="flex justify-center items-center py-16">
                    <span className="text-gray-500">Loading Civil department information...</span>
                </div>
            </SharedCivilLayout>
        );
    }

    return (
        <SharedCivilLayout pageTitle="Overview">
            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center my-8">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* About Section */}
            {departmentInfo && (
                <section ref={el => animatedElementsRef.current[0] = el} className={`${styles.aboutSection} ${styles.animateOnScroll}`}>
                    <div className={styles.aboutImage}>
                        <img
                            src={getFullUrl(departmentInfo.about_image)}
                            alt={departmentInfo.department_name}
                            onError={(e) => e.target.src = 'https://via.placeholder.com/600x400?text=Department+Image'}
                        />
                    </div>
                    <div className={styles.aboutContent}>
                        <h3>ABOUT OUR DEPARTMENT</h3>
                        <div className={styles.orangeLine}></div>
                        {/* Split about_text by new lines to retain paragraphs */}
                        {departmentInfo.about_text.split('\n').filter(p => p.trim()).map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                        {departmentInfo.nba_accredited && departmentInfo.nba_accreditation_date && (
                            <p className="mt-4 font-semibold">
                                NBA Accreditation Date: {formatDate(departmentInfo.nba_accreditation_date)}
                            </p>
                        )}
                    </div>
                </section>
            )}

            {/* Department Info Section */}
            <section className={styles.deptInfo}>
                <div ref={el => animatedElementsRef.current[1] = el} className={`${styles.deptInfoContainer} ${styles.animateOnScroll}`}>
                    <div className={styles.deptInfoHeader}>
                        <h2 style={{fontSize: '40px'}}>
                            {departmentInfo?.department_name || 'Department of Civil Engineering'}
                        </h2>
                        <p style={{fontSize: '20px'}}>
                            {departmentInfo?.tagline || 'Excellence in education, research, and innovation'}
                        </p>
                    </div>

                    {/* Vision */}
                    {departmentInfo?.vision && (
                        <>
                            <div ref={el => animatedElementsRef.current[2] = el} className={`${styles.sectionHeading} ${styles.animateOnScroll}`}>
                                <div className={styles.yellowLine}></div>
                                <h3>Vision</h3>
                            </div>
                            <div ref={el => animatedElementsRef.current[3] = el} className={`${styles.infoCard} ${styles.animateOnScroll} ${styles.delay1}`}>
                                <p>{departmentInfo.vision}</p>
                            </div>
                        </>
                    )}

                    {/* Mission */}
                    {departmentInfo?.mission && (
                        <>
                            <div ref={el => animatedElementsRef.current[4] = el} className={`${styles.sectionHeading} ${styles.animateOnScroll}`}>
                                <div className={styles.yellowLine}></div>
                                <h3>Mission</h3>
                            </div>
                            <div ref={el => animatedElementsRef.current[5] = el} className={`${styles.infoCard} ${styles.animateOnScroll} ${styles.delay1}`}>
                                <ul>
                                    {/* Mission is expected to be stored with newlines for list items */}
                                    {departmentInfo.mission.split('\n').filter(m => m.trim()).map((mission, index) => (
                                        <li key={index}>{mission}</li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {/* Program Outcomes (General) */}
                    {programOutcomes.length > 0 && (
                        <>
                            <div ref={el => animatedElementsRef.current[6] = el} className={`${styles.sectionHeading} ${styles.animateOnScroll}`}>
                                <div className={styles.yellowLine}></div>
                                <h3>Program Outcomes</h3>
                            </div>
                            <div ref={el => animatedElementsRef.current[7] = el} className={`${styles.infoCard} ${styles.animateOnScroll} ${styles.delay1}`}>
                                <p>Graduates of the Civil Engineering program will demonstrate:</p>
                                <ul>
                                    {programOutcomes.map((outcome) => (
                                        <li key={outcome.id}>{outcome.outcome_text}</li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {/* Program Educational Objectives */}
                    {objectives.length > 0 && (
                        <>
                            <div ref={el => animatedElementsRef.current[8] = el} className={`${styles.sectionHeading} ${styles.animateOnScroll}`}>
                                <div className={styles.yellowLine}></div>
                                <h3>Program Educational Objectives</h3>
                            </div>
                            <div ref={el => animatedElementsRef.current[9] = el} className={`${styles.infoCard} ${styles.animateOnScroll} ${styles.delay1}`}>
                                {/* The content here might need context text if it's not just a list, otherwise just the list */}
                                {/* The original CivilOverview.jsx had a paragraph of text before the list, consider adding that to the database too if needed */}
                                <ul>
                                    {objectives.map((objective) => (
                                        <li key={objective.id}>{objective.objective_text}</li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {/* Program Specific Outcomes (Specific) */}
                    {specificOutcomes.length > 0 && (
                        <>
                            <div ref={el => animatedElementsRef.current[10] = el} className={`${styles.sectionHeading} ${styles.animateOnScroll}`}>
                                <div className={styles.yellowLine}></div>
                                <h3>Program Specific Outcomes</h3>
                            </div>
                            <div ref={el => animatedElementsRef.current[11] = el} className={`${styles.infoCard} ${styles.animateOnScroll} ${styles.delay1}`}>
                                <p>Graduates will be able to:</p>
                                <ul>
                                    {specificOutcomes.map((outcome) => (
                                        <li key={outcome.id}>{outcome.outcome_text}</li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Quick Links Section */}
            {quickLinks.length > 0 && (
                <section className={styles.quickLinks}>
                    <h2 ref={el => animatedElementsRef.current[12] = el} className={`${styles.sectionTitle} ${styles.animateOnScroll}`}>Quick Links</h2>
                    <div className={styles.sectionUnderline} style={{filter: 'none'}}></div>

                    <div className={styles.linksGrid}>
                        {quickLinks.map((link, index) => (
                            <Link
                                key={link.id}
                                to={link.link_url}
                                ref={el => animatedElementsRef.current[13 + index] = el} // Adjust index if needed based on total animated elements before this
                                className={`${styles.linkCard} ${styles.animateOnScroll} ${index % 3 === 1 ? styles.delay1 : index % 3 === 2 ? styles.delay2 : ''}`}
                            >
                                <div className={styles.linkIcon}>
                                    {/* Render icon_svg if available, otherwise fallback to a default star SVG */}
                                    {link.icon_svg ? (
                                        <div dangerouslySetInnerHTML={{ __html: link.icon_svg }} />
                                    ) : (
                                        <svg viewBox="0 0 24 24">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                        </svg>
                                    )}
                                </div>
                                <h4>{link.link_title}</h4>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Events Section */}
            {(featuredEvent || events.length > 0) && (
                <section className={styles.eventsSection}>
                    <h2 ref={el => animatedElementsRef.current[19 + quickLinks.length] = el} className={`${styles.sectionTitle} ${styles.animateOnScroll}`}>Department Events</h2>
                    <div className={styles.sectionUnderline} style={{filter: 'none'}}></div>

                    {featuredEvent && (
                        <div ref={el => animatedElementsRef.current[20 + quickLinks.length] = el} className={`${styles.eventsHero} ${styles.animateOnScroll}`}>
                            <div className={styles.eventsImage}>
                                <img
                                    src={getFullUrl(featuredEvent.event_image)}
                                    alt={featuredEvent.event_title}
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/800x400?text=Event+Image'}
                                />
                            </div>
                            <div className={styles.eventsContent}>
                                <h3>{featuredEvent.event_title}</h3>
                                <p>{featuredEvent.event_description}</p>
                                {featuredEvent.event_date && (
                                    <p className="text-sm mt-2 opacity-80">{formatDate(featuredEvent.event_date)}</p>
                                )}
                                {/* Assuming link_url for event is event_location or a separate field, using a placeholder for now */}
                                <Link to={featuredEvent.event_location || '#'} className={styles.learnMoreBtn}>Learn more --&gt;</Link>
                            </div>
                        </div>
                    )}

                    {events.length > 0 && (
                        <div className={styles.eventsCards}>
                            {events.map((event, index) => (
                                <div
                                    key={event.id}
                                    ref={el => animatedElementsRef.current[21 + quickLinks.length + index] = el} // Adjust index
                                    className={`${styles.eventCard} ${styles.animateOnScroll} ${index === 1 ? styles.delay1 : index === 2 ? styles.delay2 : ''}`}
                                >
                                    <div className={styles.eventCardHeader}>
                                        <h4>
                                            {event.event_title}
                                            {event.event_date && <><br/>{formatDate(event.event_date)}</>}
                                        </h4>
                                    </div>
                                    <div className={styles.eventCardContent}>
                                        {event.event_description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Tour Section - Updated with Gallery Images */}
            {gallery.length > 0 && (
                <section className={styles.tourSection}>
                    <h2 ref={el => animatedElementsRef.current[24 + quickLinks.length + events.length] = el} className={`${styles.sectionTitle} ${styles.animateOnScroll}`}>Civil Department Tour</h2>
                    <div className={styles.sectionUnderline} style={{filter: 'none'}}></div>

                    <div ref={el => animatedElementsRef.current[25 + quickLinks.length + events.length] = el} className={`${styles.tourContainer} ${styles.animateOnScroll}`}>
                        <div className={styles.galleryGrid}>
                            {gallery.map((image, index) => (
                                <div
                                    key={image.id}
                                    ref={el => animatedElementsRef.current[26 + quickLinks.length + events.length + index] = el} // Adjust index
                                    className={`${styles.galleryItem} ${styles.animateOnScroll} ${index % 3 === 1 ? styles.delay1 : index % 3 === 2 ? styles.delay2 : ''}`}
                                >
                                    <img
                                        src={getFullUrl(image.image_url)}
                                        alt={image.alt_text || 'Department gallery image'}
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=Gallery+Image'}
                                    />
                                    {image.caption && (
                                        <div className={styles.imageCaption}>
                                            <p>{image.caption}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </SharedCivilLayout>
    );
};

export default CivilOverview;