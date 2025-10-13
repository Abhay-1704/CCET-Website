import React, { useEffect, useState } from "react";
import SharedASLayout from "./SharedASLayout";
import styles from "./ASLabs.module.css";

const ASLabs = () => {
  const [labsData, setLabsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await fetch("https://ccet.ac.in/api/laboratories.php");
        if (!response.ok) {
          throw new Error("Failed to fetch labs data");
        }
        const data = await response.json();
        // Map API data to expected structure
        const formattedData = data.map((lab) => ({
          title: lab.lab_name,
          description: lab.lab_description,
          image: lab.lab_image,
        }));
        setLabsData(formattedData);
      } catch (error) {
        console.error(error);
        setLabsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLabs();
  }, []);

  return (
    <SharedASLayout pageTitle="Laboratories">
      <div className={styles.container}>
        <header>
          <h1 className={styles.ASlabsheading}>Laboratories</h1>
          <div className={styles.headerLine}></div>
          <p className={styles.ASintroText}>
            At AS Department, students are challenged by a flexible,
            thought-provoking curriculum and learn from faculty members who are
            experts in their areas. The courses in the Computer Sc. &
            Engineering are well organized to provide a wide spectrum of choices
            to the students. The faculty and students have interest in wide
            range of latest technologies that include Computer's Database
            Systems, Artificial Intelligence, Computer Networks & Distributed
            Computing, operating system, Computer Graphics, Mathematical
            Modelling, OOPS, Advanced DBMS (OODBMS, Distributed DBMS etc.),
            Software Engineering, Linux, Big Data, Computer Architecture, and
            Embedded Systems etc. To support the learning and practices in above
            technological area, Department of AS have well equipped computer
            justify, project lab and oracle sponsored lab that have various
            Software Packages relevant to the Development of Minor and Major
            Projects undertaken during the Coursework. All the state of Art
            Facilities, Resources and Guidelines are provided to the students as
            per their requirement.
          </p>
        </header>

        <div className={styles.labsGrid}>
          {loading ? (
            <p>Loading laboratories...</p>
          ) : labsData.length === 0 ? (
            <p>No laboratories found.</p>
          ) : (
            labsData.map((lab, index) => (
              <div key={index} className={styles.labCard}>
                <div className={styles.imagePlaceholder}>
                  {lab.image ? (
                    <img src={lab.image} alt={lab.title} />
                  ) : (
                    <span className={styles.dimensionLabel}>385px × 246px</span>
                  )}
                </div>
                <div className={styles.labContent}>
                  <h2 className={styles.labTitle}>{lab.title}</h2>
                  <p className={styles.labDescription}>{lab.description}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <footer>
          <p>© 2023 University Laboratories. All rights reserved.</p>
        </footer>
      </div>
    </SharedASLayout>
  );
};

export default ASLabs;
