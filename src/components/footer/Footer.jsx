import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

// Hook to detect if screen is mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

// Reusable FooterCard
function FooterCard({ title, links }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  const toggleOpen = () => {
    if (isMobile) setIsOpen((prev) => !prev);
  };

  const handleLinkClick = (link) => {
    if (link.external) {
      window.open(link.url || link.path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link.path);
    }
  };

  const showLinks = !isMobile || isOpen;
  const useSplit = title === "Important Links" || (links.length > 8 && showLinks);

  return (
      <div
          className={`footer-card ${isMobile ? "mobile-card" : ""} ${
              showLinks ? (useSplit ? "split-columns" : "") : ""
          } ${isOpen ? "open" : ""}`}
      >
        <div className="footer-card-header">
          <h3 className="footer-heading" onClick={toggleOpen}>
            <span className="footer-heading-text">{title}</span>
            {isMobile && <span className="toggle-icon">{isOpen ? "−" : "+"}</span>}
          </h3>
        </div>
        {showLinks && (
            <div className="footer-links-container">
              <div className="footer-links-grid">
                {links.map((item, i) => (
                    <div className="footer-link-item" key={i}>
                      {item.external ? (
                          <a
                              href={item.url || item.path}
                              className="footer-link-anchor"
                              target="_blank"
                              rel="noopener noreferrer"
                          >
                            <span className="link-text">{item.name}</span>
                          </a>
                      ) : (
                          <div
                              className="footer-link-anchor cursor-pointer"
                              onClick={() => handleLinkClick(item)}
                          >
                            <span className="link-text">{item.name}</span>
                          </div>
                      )}
                    </div>
                ))}
              </div>
            </div>
        )}
      </div>
  );
}

// Footer Component
function Footer() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Explore",
      links: [
        { name: "Library", path: "/life/library" },
        { name: "Sports", path: "/sports-facilities" },
        { name: "Hostel", path: "/boys-hostel" },
        { name: "IIRC", path: "/research/iirc" },
        { name: "IPRC", path: "/research/iprc" },
        { name: "Innovation Cell", path: "/academics/innovation-cell" },
        { name: "Computer Center", path: "/life/computer-center" },
        { name: "Research and Consultancy", path: "/research/consultancy" },
      ],
    },
    {
      title: "Important Links",
      links: [
        { name: "PU", url: "https://puchd.ac.in/", external: true },
        { name: "UPSC", url: "https://upsc.gov.in/", external: true },
        { name: "AICTE", url: "https://www.aicte-india.org/", external: true },
        { name: "UGC", url: "https://www.ugc.gov.in/", external: true },
        { name: "DST", url: "https://dst.gov.in/", external: true },
        { name: "MHRD", url: "http://mhrd.gov.in/", external: true },
        { name: "JEE", url: "https://jeemain.nta.nic.in/", external: true },
        { name: "KYC", url: "https://www.india.gov.in/content/know-your-college/", external: true },
        { name: "BIS", url: "https://www.bis.gov.in/", external: true },
        { name: "CRIKC", url: "https://crikc.puchd.ac.in/", external: true },
        { name: "NKN", url: "http://nkn.in/", external: true },
        { name: "NPTEL", url: "https://nptel.ac.in/", external: true },
        { name: "NISCAIR", url: "http://op.niscair.res.in/", external: true },
        { name: "GATE", path: "/admissions/gate" },
        { name: "DRDO", url: "https://drdo.gov.in/drdo/", external: true },
        { name: "CHD ADMIN", url: "https://chandigarh.gov.in/", external: true },
      ],
    },
    {
      title: "Info",
      links: [
        { name: "E-News Letter", path: "/magazine/fingerprint-vii-2" },
        { name: "Notices", path: "/notices" },
        { name: "Forms", path: "/student-forms" },
        { name: "Tenders", path: "/notices/tenders" },
        { name: "NIRF", path: "/academics/nirf" },
      ],
    },
    {
      title: "Departments",
      links: [
        { name: "Computer Science and Engineering", path: "/academics/cse/overview" },
        { name: "Electronics and Communication Engineering", path: "/academics/ece" },
        { name: "Mechanical Engineering", path: "/academics/mechanical/overview" },
        { name: "Civil Engineering", path: "/academics/civil/overview" },
        { name: "Applied Sciences", path: "/academics/appliedscience/overview" },
      ],
    },
  ];

  const handleFooterNavClick = (path, external = false) => {
    if (external) {
      window.open(path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(path);
    }
  };

  return (
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-header">
            <h2 className="footer-main-title">Quick Links</h2>
          </div>

          <div className="footer-content">
            <div className="footer-grid">
              {sections.map((section, idx) => (
                  <FooterCard key={idx} title={section.title} links={section.links} />
              ))}
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="copyright-text">© 2025, CCET, All rights reserved</p>
              <nav className="footer-nav" aria-label="Footer navigation">
                <div className="footer-nav-links">
                <span
                    onClick={() => handleFooterNavClick('/')}
                    className="cursor-pointer hover:text-yellow-300 transition-colors"
                >
                  Home
                </span>
                  <span
                      onClick={() => handleFooterNavClick('/about/webmasters')}
                      className="cursor-pointer hover:text-yellow-300 transition-colors"
                  >
                  Webmasters
                </span>
                  <span
                      onClick={() => handleFooterNavClick('/student-welfare/anti-ragging')}
                      className="cursor-pointer hover:text-yellow-300 transition-colors"
                  >
                  Anti-Ragging
                </span>
                  <span
                      onClick={() => handleFooterNavClick('/privacy-policy')}
                      className="cursor-pointer hover:text-yellow-300 transition-colors"
                  >
                  Privacy Policy
                </span>
                  <span
                      onClick={() => handleFooterNavClick('/contact')}
                      className="cursor-pointer hover:text-yellow-300 transition-colors"
                  >
                  Quick Inquiry
                </span>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </footer>
  );
}

export default Footer;