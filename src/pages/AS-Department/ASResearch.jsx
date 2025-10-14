import React, { useEffect, useState } from "react";
import SharedASLayout from "./SharedASLayout";
import styles from "./ASResearch.module.css";

const ASResearch = () => {
  const [activeTab, setActiveTab] = useState("faculty");
  const [facultyPublications, setFacultyPublications] = useState([]);
  const [studentPublications, setStudentPublications] = useState([]);
  const [researchProjects, setResearchProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResearchData = async () => {
      try {
        const response = await fetch("https://ccet.ac.in/api/research.php");
        if (!response.ok) throw new Error("Failed to fetch research data");

        const data = await response.json();
        console.log("Research API Response:", data);

        // ✅ Adjust this based on actual API structure
        setFacultyPublications(data?.faculty || []);
        setStudentPublications(data?.student || []);
        setResearchProjects(data?.projects || []);
      } catch (err) {
        console.error(err);
        setError("Error loading research data");
      } finally {
        setLoading(false);
      }
    };

    fetchResearchData();
  }, []);

  const renderContent = () => {
    if (loading) return <p>Loading research data...</p>;
    if (error) return <p>{error}</p>;

    switch (activeTab) {
      case "faculty":
        return facultyPublications.length > 0 ? (
          facultyPublications.map((pub, index) => (
            <div key={index} className={styles.publication}>
              <div className={styles.publicationIndicator}></div>
              <div className={styles.publicationDetails}>
                <h3>{pub.title}</h3>
                <p>{pub.authors}</p>
                <p className={styles.meta}>{pub.meta}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No faculty publications available.</p>
        );

      case "student":
        return studentPublications.length > 0 ? (
          studentPublications.map((pub, index) => (
            <div key={index} className={styles.publication}>
              <div className={styles.publicationIndicator}></div>
              <div className={styles.publicationDetails}>
                <h3>{pub.title}</h3>
                <p>{pub.authors}</p>
                <p className={styles.meta}>{pub.meta}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No student publications available.</p>
        );

      case "projects":
        return researchProjects.length > 0 ? (
          researchProjects.map((proj, index) => (
            <div key={index} className={styles.publication}>
              <div className={styles.publicationIndicator}></div>
              <div className={styles.publicationDetails}>
                <h3>{proj.title}</h3>
                <p>{proj.authors}</p>
                <p className={styles.meta}>{proj.meta}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No research projects available.</p>
        );

      default:
        return null;
    }
  };

  return (
    <SharedASLayout pageTitle="Research">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Research & Publications</h1>
          <div className={styles.headerLine}></div>
          <p>Faculty and students research contributions</p>
        </div>

        <div className={styles.contentCard}>
          <div className={styles.cardHeader}>
            <div
              className={`${styles.tab} ${
                activeTab === "faculty" ? styles.active : styles.inactive
              }`}
              onClick={() => setActiveTab("faculty")}
            >
              Faculty Publications
            </div>
            <div
              className={`${styles.tab} ${
                activeTab === "student" ? styles.active : styles.inactive
              }`}
              onClick={() => setActiveTab("student")}
            >
              Student Publications
            </div>
            <div
              className={`${styles.tab} ${
                activeTab === "projects" ? styles.active : styles.inactive
              }`}
              onClick={() => setActiveTab("projects")}
            >
              Research Projects
            </div>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.sectionTitle}>
              {activeTab === "faculty" && "Faculty Publications"}
              {activeTab === "student" && "Student Publications"}
              {activeTab === "projects" && "Research Projects"}
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
    </SharedASLayout>
  );
};

export default ASResearch;
