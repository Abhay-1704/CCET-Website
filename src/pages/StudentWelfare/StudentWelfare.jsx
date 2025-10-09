import React, { useState, useEffect } from "react";
import { Mail, Phone } from "lucide-react";
import styles from "./StudentWelfare.module.css";

// Define the API URL
const API_URL = "https://ccet.ac.in/api/student-welfare.php";

// Define image URLs directly
const localImageMap = {
  "CSE-hodDesk.jpg": "https://www.ccet.ac.in/img/faculty-cse/sk_singh.jpg",
  "gulshan_goyal.jpg": "https://www.ccet.ac.in/img/faculty-cse/sk_singh.jpg",
  "anil_vaghmare.jpg": "https://www.ccet.ac.in/img/faculty-cse/sk_singh.jpg",
  // Add more if needed
};

const StudentWelfare = () => {
  const [officials, setOfficials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const processedOfficials = data.map((official) => ({
          id: official.id,
          name: official.name,
          position: official.position,
          email: official.email,
          mobile: official.mobile,
          image: localImageMap[official.image] || official.image, // fallback to API image
        }));

        setOfficials(processedOfficials);
        setError(null);
      } catch (e) {
        console.error("Failed to fetch student welfare officials:", e);
        setError("Failed to load officials. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfficials();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p>Loading officials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.errorMessage}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Main Heading */}
        <div className={styles.headerSection}>
          <h1 className={styles.mainHeading}>OFFICIALS at Student Welfare</h1>
          <div className={styles.underline}></div>
        </div>

        {/* Officials Cards */}
        <div className={styles.cardsGrid}>
          {officials.map((official, index) => (
            <div
              key={official.id}
              className={`${styles.card} ${styles[`cardDelay${index}`]}`}
            >
              {/* Profile Image */}
              <div className={styles.imageContainer}>
                <img
                  src={official.image}
                  alt={official.name}
                  className={styles.profileImage}
                />
                <div className={styles.imageOverlay}></div>
              </div>

              {/* Card Content */}
              <div className={styles.cardContent}>
                <h3 className={styles.officialName}>{official.name}</h3>
                <p className={styles.position}>{official.position}</p>

                {/* Contact Information */}
                <div className={styles.contactInfo}>
                  <div className={styles.contactItem}>
                    <Mail className={styles.contactIcon} />
                    <a
                      href={`mailto:${official.email}`}
                      className={styles.contactLink}
                    >
                      {official.email}
                    </a>
                  </div>
                  <div className={styles.contactItem}>
                    <Phone className={styles.contactIcon} />
                    <a
                      href={`tel:${official.mobile}`}
                      className={styles.contactLink}
                    >
                      {official.mobile}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentWelfare;
