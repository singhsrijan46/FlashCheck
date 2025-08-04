import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import { UsersIcon, TicketIcon, DollarSignIcon, FilmIcon } from 'lucide-react';
import { StarIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import './Dashboard.css';

const Dashboard = () => {
    const currency = import.meta.env.VITE_CURRENCY || '$'
    const { axios, getToken, user, image_base_url } = useAppContext()

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    const dashboardCards = [
        { title: "Total Shows", value: dashboardData?.totalShows || "0", icon: FilmIcon },
        { title: "Total Bookings", value: dashboardData?.totalBookings || "0", icon: TicketIcon },
        { title: "Total Revenue", value: `${currency} ${dashboardData?.totalRevenue || "0"}`, icon: DollarSignIcon },
        { title: "Total Users", value: dashboardData?.totalUser || "0", icon: UsersIcon }
    ]

    const fetchDashboardData = async () => {
        try {
           const { data } = await axios.get("/api/admin/dashboard", {headers: { Authorization: `Bearer ${await getToken()}`}}) 
           if (data.success) {
            setDashboardData(data.dashboardData || {
                totalBookings: 0,
                totalRevenue: 0,
                activeShows: [],
                totalUser: 0,
                totalShows: 0,
                totalMovies: 0
            })
            setLoading(false)
           } else {
            console.error('Dashboard API error:', data.message);
            toast.error(data.message)
            setLoading(false)
           }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("Error fetching dashboard data");
            setLoading(false);
        }
    };

    useEffect(() => {
        if(user){
            fetchDashboardData();
        }   
    }, [user]);

    // Show loading while fetching data
    if (loading) {
        return (
            <div className="dashboard-container">
                <Loading />
            </div>
        )
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-cards">
                <div className="dashboard-cards-container">
                    {dashboardCards.map((card, index) => (
                        <div key={index} className="dashboard-card">
                            <card.icon className="dashboard-card-icon" />
                            <div className="dashboard-card-content">
                                <h1>{card.title}</h1>
                                <p>{card.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <p className="dashboard-shows-title">Active Shows</p>
            <div className="dashboard-shows-grid">
                {dashboardData?.activeShows && dashboardData.activeShows.length > 0 ? (
                    dashboardData.activeShows.map((show) => (
                        <div key={show._id} className="dashboard-show-card">
                            <div className="dashboard-show-image-container">
                                <img src={image_base_url + (show.movie?.backdrop_path || '/default-backdrop.jpg')} alt='' className="dashboard-show-image" />
                                <div className="dashboard-show-overlay-bottom">
                                    <div className="dashboard-show-rating-block">
                                        <StarIcon className="dashboard-show-rating-icon"/>
                                        <span className="dashboard-show-rating-value">
                                            {show.movie?.vote_average?.toFixed(1) || '0.0'}
                                        </span>
                                    </div>
                                    <div className="dashboard-show-price-badge">
                                        {currency} {show.silverPrice || show.goldPrice || show.diamondPrice || '0'}
                                    </div>
                                </div>
                            </div>
                            <div className="dashboard-show-details">
                                <p className="dashboard-show-title">{show.movie?.title || 'Unknown Movie'}</p>
                                <div className="dashboard-show-meta-row">
                                    <span className="dashboard-show-date">{dateFormat(show.showDateTime)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="dashboard-no-shows">
                        <p>No active shows found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
