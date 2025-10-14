import React, { useEffect, useState } from "react";
import SharedCseLayout from "./SharedCseLayout";
import styles from "./CseTimeTable.module.css";

const CseTimeTable = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTimeTable = async () => {
      try {
        const response = await fetch("https://ccet.ac.in/api/timetable.php");
        if (!response.ok) {
          throw new Error("Failed to fetch timetable data");
        }
        const data = await response.json();

        // ✅ Adjust according to actual API structure
        // For example, if API returns { timetable: "https://..." }
        const url = data?.timetable || data?.url || data?.[0]?.timetable || "";
        if (url) {
          setPdfUrl(url);
        } else {
          setError("No timetable available");
        }
      } catch (err) {
        console.error(err);
        setError("Error loading timetable");
      } finally {
        setLoading(false);
      }
    };

    fetchTimeTable();
  }, []);

  return (
    <SharedCseLayout pageTitle="Time Table">
      <div className={styles.container}>
        <h1 className={styles.heading}>Time-Table</h1>
        <div className={styles.underline}></div>

        <div className={styles.pdfPlaceholder}>
          {loading ? (
            <p>Loading timetable...</p>
          ) : error ? (
            <p>{error}</p>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="CSE Timetable"
              width="100%"
              height="600px"
              style={{ border: "none", borderRadius: "8px" }}
            ></iframe>
          ) : (
            <p>PDF not available</p>
          )}
        </div>
      </div>
    </SharedCseLayout>
  );
};

export default CseTimeTable;
