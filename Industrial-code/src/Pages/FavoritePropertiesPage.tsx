import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { getCartByUserId } from "../services/Api/Cart";

const FavoritePropertiesPage: React.FC = () => {
    const [favoriteProperties, setFavoriteProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavoriteProperties = async () => {
            const userId = localStorage.getItem("userId"); // Replace with actual logic for user ID
            if (!userId) {
                alert("User not logged in. Please log in to view favorite properties.");
                navigate("/login");
                return;
            }

            try {
                const data = await getCartByUserId(userId);
                setFavoriteProperties(data);
            } catch (err) {
                setError("Failed to fetch favorite properties. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteProperties();
    }, [navigate]);

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
            <h2 style={{ textAlign: "center", color: "#007bff" }}>Favorite Properties</h2>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    <CircularProgress />
                </div>
            ) : error ? (
                <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            ) : favoriteProperties.length > 0 ? (
                <div style={{ marginTop: "20px" }}>
                    {favoriteProperties.map((property, index) => (
                        <div
                            key={index}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "10px",
                                marginBottom: "20px",
                                padding: "15px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>{property.propertyName}</h3>
                            <p>
                                <strong>Location:</strong> {property.location}
                            </p>
                            <p>
                                <strong>Price:</strong> {property.price}
                            </p>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate(`/property/${property.id}`)}
                            >
                                View Details
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: "center", color: "#555" }}>No favorite properties found.</p>
            )}
        </div>
    );
};

export default FavoritePropertiesPage;
