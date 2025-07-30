import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UsersIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/Loading';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import './Dashboard.css';

const Dashboard = () => {

    const {axios, getToken, user, image_base_url} = useAppContext()

    const currency = import.meta.env.VITE_CURRENCY || '$'

    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        activeShows: [],
        totalUser: 0
    });
    const [loading, setLoading] = useState(true);

    const dashboardCards = [
        { title: "Total Bookings", value: dashboardData.totalBookings || "0", icon: ChartLineIcon },
        { title: "Total Revenue", value: currency + dashboardData.totalRevenue || "0", icon: CircleDollarSignIcon },
        { title: "Active Shows", value: dashboardData.activeShows.length || "0", icon: PlayCircleIcon },
        { title: "Total Users", value: dashboardData.totalUser || "0", icon: UsersIcon }
    ]

    const fetchDashboardData = async () => {
        try {
           const { data } = await axios.get("/api/admin/dashboard", {headers: { Authorization: `Bearer ${await getToken()}`}}) 
           if (data.success) {
            setDashboardData(data.dashboardData)
            setLoading(false)
           }else{
            toast.error(data.message)
           }
        } catch (error) {
            toast.error("Error fetching dashboard data:", error)
        }
    };

    useEffect(() => {
        if(user){
            fetchDashboardData();
        }   
    }, [user]);

  return !loading ? (
    <>
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
                {dashboardData.activeShows.map((show) => (
                    <div key={show._id} className="dashboard-show-card">
                        <div className="dashboard-show-image-container">
                            <img src={image_base_url + show.movie.backdrop_path} alt='' className="dashboard-show-image" />
                            <div className="dashboard-show-overlay-bottom">
                                <div className="dashboard-show-rating-block">
                                    <StarIcon className="dashboard-show-rating-icon"/>
                                    <span className="dashboard-show-rating-value">{show.movie.vote_average.toFixed(1)}</span>
                                </div>
                                <div className="dashboard-show-price-badge">
                                    {currency} {show.showPrice}
                                </div>
                            </div>
                        </div>
                        <div className="dashboard-show-details">
                            <p className="dashboard-show-title">{show.movie.title}</p>
                            <div className="dashboard-show-meta-row">
                                <span className="dashboard-show-date">{dateFormat(show.showDateTime)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

    </>
  ) : <Loading />
}

export default Dashboard
