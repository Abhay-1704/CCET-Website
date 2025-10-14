import React, { useState, useEffect } from 'react';

const EceResearch = () => {
  const [activeTab, setActiveTab] = useState('faculty');
  const [facultyPublications, setFacultyPublications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'https://ccet.ac.in/api/research.php'; 

  const fetchFacultyPublications = async () => {
    if (activeTab !== 'faculty') return;

    setLoading(true);
    setError(null);
    
    const publicationsEndpoint = `${API_URL}?action=get_publications&type=faculty`;

    try {
      const response = await fetch(publicationsEndpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      setFacultyPublications(data);

    } catch (e) {
      console.error("Failed to fetch faculty publications:", e);
      setError("Failed to load publications. Please check the API connection.");
      setFacultyPublications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'faculty') {
      fetchFacultyPublications();
    }
  }, [activeTab]);


  const FacultyContent = () => {
    if (loading) {
      return (
        <div className="p-6 text-center text-gray-500">
          <p className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading Faculty Publications...</span>
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6 text-center text-red-500 border-l-4 border-red-500 bg-red-50">
          <p>⚠️ Error loading data: {error}</p>
          <p className="text-sm text-red-400 mt-1">Check the console for details or verify the API endpoint is active.</p>
        </div>
      );
    }

    if (facultyPublications.length === 0) {
      return (
        <div className="p-6 text-center text-gray-500">
          <p>No faculty publications found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {facultyPublications.map((pub, index) => (
          <div
            key={index}
            className="bg-gray-100 border-l-4 border-blue-600 rounded-lg shadow-sm p-4 hover:shadow-md transition"
          >
            <h3 className="text-blue-800 font-semibold">{pub.title}</h3>
            <p className="text-gray-700 text-sm mt-1">
              <span className="font-medium">{pub.authors}</span> <span className="italic">{pub.journal}</span>
            </p>
            <div className="text-gray-600 text-sm mt-2 flex justify-between">
              <span>Impact Factor: <span className="font-bold">{pub.impactFactor}</span></span>
              <span>Citations: <span className="font-bold">{pub.citations}</span></span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Research & Publications</h1>
        <div className="w-20 h-1 bg-yellow-500 mx-auto mt-2 rounded-full"></div>
        <p className="text-gray-600 mt-3">Faculty and students research contributions</p>
      </div>

      <div className="bg-white shadow-md rounded-lg w-full max-w-3xl">
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 font-medium text-center ${activeTab === 'faculty' ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700'} rounded-t-lg`}
            onClick={() => setActiveTab('faculty')}
          >
            Faculty Publications
          </button>
          <button
            className={`flex-1 py-3 font-medium text-center ${activeTab === 'student' ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700'} rounded-t-lg`}
            onClick={() => setActiveTab('student')}
          >
            Student Publications
          </button>
          <button
            className={`flex-1 py-3 font-medium text-center ${activeTab === 'projects' ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700'} rounded-t-lg`}
            onClick={() => setActiveTab('projects')}
          >
            Research Projects
          </button>
        </div>

        {activeTab === 'faculty' && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-l-4 border-yellow-500 pl-2">
              Faculty Publications
            </h2>
            <FacultyContent />
          </div>
        )}

        {activeTab === 'student' && (
          <div className="p-6 text-center text-gray-500">
            <p>Student publications will appear here.</p>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="p-6 text-center text-gray-500">
            <p>Research projects will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EceResearch;