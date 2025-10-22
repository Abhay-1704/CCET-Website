import React, { useState, useEffect } from "react";
import ECEQuickLinksSidebar from "./sidebar";
import ECEHeader from "./ece_header";

// API endpoint URL
const HODS_API_URL = "https://ccet.ac.in/api/hods.php";

function EceHOD() {
    const [hod, setHod] = useState(null); // State to store ECE HOD data
    const [loading, setLoading] = useState(true); // State to manage loading
    const [error, setError] = useState(false); // State to manage errors

    // Fetch HOD data on component mount
    useEffect(() => {
        const fetchHodData = async () => {
            try {
                // Real API fetch call 
                const response = await fetch(HODS_API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json(); // Data is the array of HOD objects

                // Find the ECE HOD from the fetched array
                const eceHod = data.find(
                    (p) => p.department === "Electronics & Communication Engineering"
                );
                
                if (eceHod) {
                    // Process and set the HOD state
                    const imageUrl = eceHod.image.startsWith("/") ? eceHod.image : `/${eceHod.image}`;
                    // Extract contact and area of interest using regex (as they are in the 'description' field)
                    const contactMatch = eceHod.description.match(/Contact: (\d+)/);
                    const areaMatch = eceHod.description.match(/Area of Interest: (.*?)(\n|$)/);

                    setHod({
                        name: eceHod.name,
                        designation: eceHod.designation,
                        email: eceHod.email,
                        image: imageUrl,
                        contact: contactMatch ? contactMatch[1] : 'N/A',
                        areaOfInterest: areaMatch ? areaMatch[1].trim() : 'N/A',
                    });
                } else {
                    console.warn("ECE HOD data not found in the API response.");
                }

            } catch (err) {
                console.error("Error fetching HOD data:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchHodData();
    }, []);

    const stats = [
        { value: "17+", label: "Years\nof Service" },
        { value: "20", label: "Faculty\nMembers" },
        { value: "400", label: "Students" },
        { value: "100", label: "Courses\nOffered", highlight: true }
    ];

    // --- Conditional Rendering ---
    if (loading) {
        return <div className="text-center py-10">Loading HOD information...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-600">Error loading HOD data. Please check the network connection or API endpoint.</div>;
    }

    // Default/Fallback data structure if HOD is still null (e.g., if ECE HOD wasn't found)
    const displayHod = hod || {
        name: "HOD Name Not Found",
        designation: "Department Head",
        email: "contact@ccet.ac.in",
        image: "/images/hod.jpg",
        contact: 'N/A',
        areaOfInterest: 'N/A',
    };
    
    // Default message content (as it's not provided in the API fields)
    const hodMessage = (
        <>
            <p>
                With technology spreading its domain to all walks of life, there is a need to upgrade the ever-widening knowledge base. CCET has risen to the occasion, and resolves to provide talented, skilled and highly competent technical human resource to the industrial society. Education is imparted in the institute in a manner that each student realizes his responsibility at enhancing the present skills and shaping the future.
            </p>
            <p>
                In its endeavour to foster an optimum blend of self-discipline and consistency, the college provides robust curriculum to attune to the scientific scenario of the industry. It commits to serve the society with versatile expertise in the field. I always strive to empower students with efforts to fulfill societal obligations with distinction. I invite all potential seekers to participate in the campus recruitment program.
            </p>
        </>
    );

    return (
        <div className="bg-white min-h-screen font-serif">
            <ECEQuickLinksSidebar />
            <div className="relative w-full">
                <ECEHeader />
                {/* Vertically centered aside */}
                <aside className="absolute inset-y-0 right-12 flex flex-col justify-center items-center h-[32rem] py-8 z-10 space-y-6">
                    {stats.map(({ value, label, highlight }, i) => (
                        <div
                            key={i}
                            className={`flex flex-col items-center justify-center border-2 w-32 h-32 rounded-full bg-black/60 ${highlight ? "border-yellow-400" : "border-white"
                                }`}
                        >
                            <span
                                className={`text-2xl md:text-3xl font-bold ${highlight ? "text-yellow-400" : "text-yellow-400"
                                    }`}
                            >
                                {value}
                            </span>
                            <span
                                className={`text-white text-base mt-1 text-center leading-tight px-2 ${highlight ? "text-yellow-400 font-bold" : ""
                                    }`}
                                style={{ whiteSpace: "pre-line" }}
                            >
                                {label}
                            </span>
                        </div>
                    ))}
                </aside>
            </div>


            <main className="container mx-auto px-3 md:px-8 py-8">
                {/* HOD's Message */}
                <section className="md:bg-gradient-to-r md:from-blue-900 md:to-slate-900 text-white rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-center mb-8">
                    <img
                        src={displayHod.image}
                        alt={displayHod.name}
                        className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full mr-6 mb-4 md:mb-0"
                    />
                    <div>
                        <h2 className="text-lg font-semibold">{displayHod.name}</h2>
                        <p>{displayHod.designation}</p>
                        <p>Email-ID: {displayHod.email}</p>
                        {displayHod.contact !== 'N/A' && <p>Contact: {displayHod.contact}</p>}
                        {displayHod.areaOfInterest !== 'N/A' && <p>Area of Interest: {displayHod.areaOfInterest}</p>}

                        <div className="mt-4 space-y-3 text-base">
                            {hodMessage}
                        </div>
                    </div>
                </section>

                {/* About Us Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">About us</h2>
                    <div className="flex flex-col md:flex-row items-center bg-gray-50 rounded-xl p-6 shadow-lg">
                        <img
                            src="/images/department-building.jpg"
                            alt="Department Building"
                            className="w-full md:w-64 h-40 object-cover rounded mb-6 md:mb-0 md:mr-8"
                        />
                        <div className="text-gray-700 space-y-3">
                            <p>
                                The Department of Electronics and Communication Engineering at Chandigarh College of Engineering and Technology (CCET) offers a comprehensive curriculum that equips students with technical knowledge in communication systems and electronic technologies.
                            </p>
                            <p>
                                Our B.E. (ECE) program has been accredited with the National Board of Accreditation (NBA), acknowledging the quality and rigour of our academic framework.
                            </p>
                            <p>
                                The B.E. (Electronics and Communication Engineering) program was granted NBA accreditation on February 12, 2025, affirming our dedication to maintaining excellence in engineering education and research.
                            </p>
                        </div>
                    </div>
                </section>

                {/* News + Photo Gallery Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="font-bold text-xl border-b pb-2 mb-4">
                            News and Announcements
                        </h2>
                        <ul className="space-y-3 text-gray-700 text-base">
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-bold text-xl mb-4 border-b pb-2">
                            Photo Gallery
                        </h2>
                        <img
                            src="/images/department-building.jpg"
                            alt="Department Gallery"
                            className="rounded-lg w-full h-52 object-cover"
                        />
                    </div>
                </section>

                {/* Research Highlights Section */}
                <section className="md:bg-gradient-to-r md:from-blue-900 md:to-slate-900 text-white rounded-2xl py-10 px-5 mb-12 flex flex-col items-center">
                    <h2 className="text-3xl font-bold mb-8">
                        Research <span className="text-orange-400">Highlights</span>
                    </h2>
                    <div className="flex flex-wrap justify-center items-center gap-12">
                        <div className="flex flex-col items-center">
                            {/* Publications Icon */}
                            <div className="mb-2 w-12 h-12 flex justify-center items-center">
                                <img
                                    src="/placeholder_icon.png"
                                    alt="Publications"
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                            <div className="text-2xl font-bold">165</div>
                            <div className="text-base">Publications</div>
                        </div>
                        <div className="flex flex-col items-center">
                            {/* Patents Icon */}
                            <div className="mb-2 w-12 h-12 flex justify-center items-center">
                                <img
                                    src="/placeholder_icon.png"
                                    alt="Patents"
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                            <div className="text-2xl font-bold">20</div>
                            <div className="text-base">Patents</div>
                        </div>
                        <div className="flex flex-col items-center">
                            {/* Funding Icon */}
                            <div className="mb-2 w-12 h-12 flex justify-center items-center">
                                <img src="/placeholder_icon.png" alt="Funding" className="w-10 h-10 object-contain" />
                            </div>
                            <div className="text-2xl font-bold">20</div>
                            <div className="text-base">Funding (in Lakhs)</div>
                        </div>
                        <div className="flex flex-col items-center">
                            {/* Projects Icon */}
                            <div className="mb-2 w-12 h-12 flex justify-center items-center">
                                <img src="/placeholder_icon.png" alt="Projects" className="w-10 h-10 object-contain" />
                            </div>
                            <div className="text-2xl font-bold">50</div>
                            <div className="text-base">Projects</div>
                        </div>
                    </div>
                </section>

                {/* Programs Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Programs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl shadow flex flex-col md:flex-row items-center p-6">
                            <img
                                src="/images/banner.jpg"
                                alt="B.E. Electronics"
                                className="w-full md:w-52 h-36 object-cover rounded-lg mr-0 md:mr-6 mb-4 md:mb-0"
                            />
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Bachelor of Engineering in ECE
                                </h3>
                                <p className="text-gray-700">
                                    Chandigarh College of Engineering and Technology
                                </p>
                                <div className="flex space-x-4 text-gray-600 mt-2 mb-4">
                                    <span>
                                        <strong>Tuition Fee:</strong> Rs. 65,000/year
                                    </span>
                                    <span>
                                        <strong>Duration:</strong> 4 Years
                                    </span>
                                </div>
                                <button className="px-4 py-2 bg-blue-900 hover:bg-blue-700 rounded text-white text-sm font-semibold">
                                    Details
                                </button>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow flex flex-col md:flex-row items-center p-6">
                            <img
                                src="/images/phd-ece.jpg"
                                alt="PhD ECE"
                                className="w-full md:w-52 h-36 object-cover rounded-lg mr-0 md:mr-6 mb-4 md:mb-0"
                            />
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    PhD in Electronics and Communication Engineering
                                </h3>
                                <p className="text-gray-700">
                                    Chandigarh College of Engineering and Technology
                                </p>
                                <div className="flex space-x-4 text-gray-600 mt-2 mb-4">
                                    <span>
                                        <strong>Tuition Fee:</strong> Rs. 65,000/year
                                    </span>
                                    <span>
                                        <strong>Duration:</strong> 24 Months
                                    </span>
                                </div>
                                <button className="px-4 py-2 bg-blue-900 hover:bg-blue-700 rounded text-white text-sm font-semibold">
                                    Details
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default EceHOD;