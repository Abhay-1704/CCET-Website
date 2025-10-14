import React, { useState, useEffect } from 'react';
import ECEHeader from './ece_header';
import ECEQuickLinksSidebar from './sidebar';

const EceLabs = () => {
    // State to store the fetched lab data and loading/error status
    const [labs, setLabs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Effect hook to fetch data when the component mounts
    useEffect(() => {
        const fetchLabs = async () => {
            try {
                const response = await fetch('https://ccet.ac.in/api/laboratories.php');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                // 🚀 Modification: Sort the data to ensure ANALOG & DIGITAL ELECTRONICS LAB (ID 1)
                // appears before MICROPROCESSOR AND ADVANCED MICROPROCESSOR LAB (ID 3).
                // Sorting by ID as a string, or converting to number for robust sorting.
                const sortedData = data.sort((a, b) => {
                    return Number(a.id) - Number(b.id);
                });

                setLabs(sortedData);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch lab data:", err);
                setError('Failed to load lab data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchLabs();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Helper function to determine the background color and layout based on index
    const getLabStyles = (index) => {
        // Alternates layout: (Desc, Photo) for index 0, 2, ... and (Photo, Desc) for index 1, 3, ...
        // Alternates color: Blue for index 0, 2, ... and Darker Blue for index 1, 3, ...
        return index % 2 === 0
            ? { descBg: 'bg-[#1F3A93]', photoFirst: false } // Blue background, Description on left (matches original layout for first item)
            : { descBg: 'bg-[#09142A]', photoFirst: true };  // Darker background, Photo on left (matches original layout for second item)
    };

    if (loading) {
        return (
            <div>
                <ECEHeader />
                <ECEQuickLinksSidebar />
                <div className="bg-white min-h-screen flex items-center justify-center py-12">
                    <p className="text-xl text-gray-600">Loading Laboratories...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <ECEHeader />
                <ECEQuickLinksSidebar />
                <div className="bg-white min-h-screen flex items-center justify-center py-12">
                    <p className="text-xl text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    if (labs.length === 0) {
        return (
            <div>
                <ECEHeader />
                <ECEQuickLinksSidebar />
                <div className="bg-white min-h-screen flex items-center justify-center py-12">
                    <p className="text-xl text-gray-600">No laboratory data available.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <ECEHeader />
            <ECEQuickLinksSidebar />
            <div className="bg-white min-h-screen flex flex-col items-center px-6 py-12">
                {/* Heading with blue lines */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    <span className="block w-8 h-0.5 bg-blue-900"></span>
                    <h2 className="text-2xl font-bold text-gray-800">Laboratories</h2>
                    <span className="block w-8 h-0.5 bg-blue-900"></span>
                </div>

                {/* Dynamic Lab Sections */}
                {labs.map((lab, index) => {
                    const { descBg, photoFirst } = getLabStyles(index);

                    // Content for the photo placeholder
                    const photoContent = (
                        <div key={`photo-${lab.id}`} className="flex items-center justify-center">
                            <div className="w-64 h-72 bg-gray-300 rounded-md flex items-center justify-center">
                                <span className="text-gray-700">
                                    {/* Displaying lab_image if provided, otherwise a placeholder */}
                                    {lab.lab_image ? (
                                        <img src={lab.lab_image} alt={`${lab.lab_name} lab`} className="w-full h-full object-cover rounded-md" />
                                    ) : (
                                        'Photo Placeholder'
                                    )}
                                </span>
                            </div>
                        </div>
                    );

                    // Content for the description box
                    const descriptionContent = (
                        <div key={`desc-${lab.id}`} className={`${descBg} text-white rounded-xl shadow-lg p-6 text-sm leading-relaxed text-justify`}>
                            <h3 className="text-base font-semibold mb-2">
                                {lab.lab_name}
                            </h3>
                            <p>{lab.lab_description}</p>
                        </div>
                    );

                    // Determine the order for this row
                    const rowOrder = photoFirst
                        ? [photoContent, descriptionContent] // Photo on left, Description on right
                        : [descriptionContent, photoContent]; // Description on left, Photo on right

                    return (
                        <div
                            key={lab.id}
                            className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full mb-12 last:mb-0"
                        >
                            {/* Render based on the calculated order */}
                            {rowOrder}
                        </div>
                    );
                })}

            </div>
        </div>
    );
}

export default EceLabs;