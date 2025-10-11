import React, { useState, useEffect } from 'react';
import Header from "../../components/header/Header.jsx";
import Footer from "../../components/footer/Footer.jsx";
import "./NewsDetails.css";

// Function to convert YYYY-MM-DD to "Month Day, Year"
const formatDate = (dateString) => {
    // Check if dateString is valid (e.g., "2025-09-05")
    if (!dateString) return ''; 

    // Create a Date object from the YYYY-MM-DD string
    const date = new Date(dateString);

    // Options for formatting
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    // Format the date using locale settings (e.g., "September 5, 2025")
    return date.toLocaleDateString('en-US', options);
};

const NewsDetails = () => {
    const [newsList, setNewsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await fetch('https://ccet.ac.in/api/notice-details.php');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                setNewsList(data);
                setError(null);

            } catch (err) {
                console.error("Error fetching notice details:", err);
                setError("Failed to fetch notices. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotices();
    }, []);

    // Conditional rendering for loading and error states
    if (isLoading) {
        return (
            <section className="news-section">
                <h2 className="news-title1">Notices</h2>
                <div className="news-list">
                    <p>Loading notices...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="news-section">
                <h2 className="news-title1">Notices</h2>
                <div className="news-list">
                    <p style={{ color: 'red' }}>{error}</p>
                </div>
            </section>
        );
    }
    
    if (newsList.length === 0) {
        return (
            <section className="news-section">
                <h2 className="news-title1">Notices</h2>
                <div className="news-list">
                    <p>No notices available at this time.</p>
                </div>
            </section>
        );
    }

    // Main render logic using the fetched data
    return (
        <>
        {/* Header and Footer imports */}
        <section className="news-section">
            <h2 className="news-title1">Notices</h2>
            <div className="news-list">
                {newsList.map((news) => (
                    <div className="news-card" key={news.id}>
                        {/* 🌟 KEY CHANGE HERE: Use the formatDate function 🌟 */}
                        <div className="news-date">{formatDate(news.date)}</div>
                        <h3 className="news-headline">{news.title}</h3>
                        <p className="news-desc">{news.description}</p>
                    </div>
                ))}
            </div>
        </section>
        </>
    );
};

export default NewsDetails;