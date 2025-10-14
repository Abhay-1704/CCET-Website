import React, { useState, useEffect } from "react";
import ECEHeader from "./ece_header";
import ECEQuickLinksSidebar from "./sidebar";

export default function EceTimeTable() {
    const [timetablePdfUrl, setTimetablePdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🎯 KEY CHANGE 1: Define the department for filtering
    const DEPARTMENT_NAME = 'ECE'; 
    
    // 🎯 KEY CHANGE 2: Construct the API endpoint with the 'department' parameter
    const API_ENDPOINT = `https://ccet.ac.in/api/timetable.php?department=${DEPARTMENT_NAME}`;

    useEffect(() => {
        // Function to fetch the timetable data
        const fetchTimetable = async () => {
            try {
                // The URL now specifically asks the API for only ECE timetables
                const response = await fetch(API_ENDPOINT);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Check if the response indicates an error from the PHP script
                if (data && data.success === false) {
                    throw new Error(data.error || "Failed to fetch timetable data.");
                }

                // Assuming the API returns an array, and since we filtered by department,
                // the first entry (data[0]) is the most relevant/recent ECE timetable.
                if (Array.isArray(data) && data.length > 0) {
                    setTimetablePdfUrl(data[0].pdf);
                } else {
                    // Specific message for the ECE department
                    setError(`No timetable data found for ${DEPARTMENT_NAME} department.`);
                }

            } catch (err) {
                console.error("Error fetching timetable:", err);
                setError(err.message || "An unexpected error occurred while fetching the timetable.");
            } finally {
                setLoading(false);
            }
        };

        fetchTimetable();
    }, []);

    // --- Component Rendering (No changes needed below, but included for completeness) ---

    let content;

    if (loading) {
        content = (
            <div className="text-center text-lg font-medium text-blue-600 p-10">
                Loading Time Table for {DEPARTMENT_NAME}... ⏳
            </div>
        );
    } else if (error) {
        content = (
            <div className="text-center text-lg font-medium text-red-600 p-10">
                Error: {error}
            </div>
        );
    } else if (timetablePdfUrl) {
        content = (
            <div className="border border-blue-900 rounded-lg shadow-md bg-white p-4">
                <h2 className="text-lg font-semibold text-center mb-4">{DEPARTMENT_NAME} Time Table</h2>
                
                {/* PDF Embed */}
                <div className="w-full h-[600px]">
                    <iframe
                        src={timetablePdfUrl}
                        title={`${DEPARTMENT_NAME} Time Table`}
                        className="w-full h-full rounded-md"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement.innerHTML = `
                                <div class="text-center p-4">
                                    <p>Your browser cannot display the PDF directly. 
                                    <a href="${timetablePdfUrl}" target="_blank" class="text-blue-600 hover:underline font-bold">
                                        Click here to download/view the Time Table PDF.
                                    </a></p>
                                </div>
                            `;
                        }}
                    >
                    </iframe>
                </div>
                
                <div className="text-center mt-4">
                    <a 
                        href={timetablePdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-700 hover:text-blue-900 font-semibold"
                    >
                        Click here to open the PDF in a new tab
                    </a>
                </div>
            </div>
        );
    } else {
        content = (
            <div className="text-center text-lg font-medium text-gray-600 p-10">
                No active Time Table is currently available for {DEPARTMENT_NAME}. 😟
            </div>
        );
    }


    return (
        <div>
            <ECEQuickLinksSidebar />
            <ECEHeader />
            
            <div className="p-8 bg-gray-50 text-gray-900 min-h-screen">
                {/* Heading */}
                <h1 className="text-2xl font-bold text-center mb-8 relative inline-block w-full">
                    <span className="relative px-4 bg-gray-50">
                        {DEPARTMENT_NAME} Time Table
                    </span>
                    <div className="absolute top-1/2 left-0 right-0 border-t border-gray-400 -z-10"></div>
                </h1>

                {content}
            </div>
        </div>
    );
}