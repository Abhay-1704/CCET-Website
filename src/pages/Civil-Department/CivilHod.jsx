import React, { useEffect, useState } from "react";
import SharedCivilLayout from "./SharedCivilLayout";
import styles from "./CivilHod.module.css";

const CivilHod = () => {
  const [hodData, setHodData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch HOD data from the API
    fetch("https://ccet.ac.in/api/hods.php")
      .then((res) => res.json())
      .then((data) => {
        // Assuming API returns an array of HODs, take the first one
        if (data && data.length > 0) {
          setHodData(data[0]);
        }
      })
      .catch((err) => console.error("Failed to fetch HOD data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SharedCivilLayout pageTitle="HOD Desk">
        <div className={styles.container}>
          <p>Loading HOD data...</p>
        </div>
      </SharedCivilLayout>
    );
  }

  if (!hodData) {
    return (
      <SharedCivilLayout pageTitle="HOD Desk">
        <div className={styles.container}>
          <p>HOD data not available.</p>
        </div>
      </SharedCivilLayout>
    );
  }

  return (
    <SharedCivilLayout pageTitle="HOD Desk">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>HOD DESK</h1>
          <div className={styles.underline}></div>
          <p className={styles.subtitle}>
            Message from the Head of the Department
          </p>
        </div>

        <div className={styles.profileSection}>
          <div className={styles.profileContainer}>
            <div className={styles.profileBg}></div>
            <img
              className={styles.profileImg}
              src={hodData.image || "/fallback-image.jpg"}
              alt={hodData.name || "HOD"}
            />
          </div>

          <div className={styles.hodInfo}>
            <h2 className={styles.hodName}>{hodData.name}</h2>
            <p className={styles.designation}>{hodData.designation}</p>
            <p className={styles.department}>{hodData.department}</p>
          </div>

          <div className={styles.emailBox}>
            <div className={styles.emailIcon}>
              <svg
                width="20"
                height="16"
                viewBox="0 0 20 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 0H2C0.9 0 0.00999999 0.9 0.00999999 2L0 14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM18 4L10 9L2 4V2L10 7L18 2V4Z"
                  fill="#063068"
                />
              </svg>
            </div>
            <div className={styles.emailText}>
              {hodData.emails
                ? hodData.emails.join(" | ")
                : "Email not available"}
            </div>
          </div>
        </div>

        <div className={styles.contentBox}>
          <div className={styles.message}>
            {hodData.message ? (
              hodData.message.split("\n").map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>Message not available.</p>
            )}
          </div>
        </div>
      </div>
    </SharedCivilLayout>
  );
};

export default CivilHod;
