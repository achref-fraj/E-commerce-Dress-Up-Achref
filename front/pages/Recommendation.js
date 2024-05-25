import { useState } from 'react';
import axios from 'axios';

const Recommendation = () => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleUpload = () => {
        if (image) {
            setLoading(true);
            const formData = new FormData();
            formData.append("image", image);

            axios
                .post("http://localhost:5000/recommend", formData)
                .then((response) => {
                    setRecommendations(response.data.recommendations);
                    setLoading(false);
                    setError(null);
                })
                .catch((error) => {
                    console.error("Error during recommendation:", error);
                    setError("Error during recommendation. Please try again.");
                    setLoading(false);
                });
        } else {
            setError("Please choose an image to upload.");
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left section */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Fashion Recommendation System</h1>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="fileUpload">
                            Select an image to upload
                        </label>
                        <input
                            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                            type="file"
                            id="fileUpload"
                            onChange={handleFileChange}
                        />
                        {imagePreview && (
                            <div className="mt-4">
                                <img
                                    className="w-full h-auto rounded-lg shadow-md max-h-64 object-contain"
                                    src={imagePreview}
                                    alt="Selected Image"
                                />
                            </div>
                        )}
                        <button
                            className={`mt-6 w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-600 focus:outline-none'}`}
                            onClick={handleUpload}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Recommend'}
                        </button>

                        {error && (
                            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        {loading && (
                            <div className="mt-4 flex justify-center">
                                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Right section */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Recommended Images:</h2>
                        {recommendations.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {recommendations.map((rec, index) => (
                                    <div key={index} className="col-span-1 flex flex-col items-center">
                                        <img
                                            className="w-full h-auto rounded-lg shadow-md"
                                            src={`data:image/png;base64,${rec}`}
                                            alt={`Recommendation ${index + 1}`}
                                        />
                                        <p className="mt-2 text-center text-sm">Recommendation {index + 1}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-600">No recommendations at the moment.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recommendation;
