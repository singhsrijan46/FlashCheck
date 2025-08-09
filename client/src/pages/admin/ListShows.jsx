import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import './ListShows.css';

const ListShows = () => {
    const currency = import.meta.env.VITE_CURRENCY || '$'

    const {axios, getToken, user, shows} = useAppContext()

    const [adminShows, setAdminShows] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllShows = async () => {
        try {
            const token = await getToken();
            
            const { data } = await axios.get("/api/admin/all-shows", {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setAdminShows(data.shows || [])
            setLoading(false);
        } catch (error) {

            setLoading(false);
        }
    }

    useEffect(() => {
        if(user){
            getAllShows();
        }   
    }, [user]);

    // Refresh admin shows when the main shows data changes
    useEffect(() => {
        if(user){
            getAllShows();
        }   
    }, [user, shows]);

    return !loading ? (
        <>
            <div className="list-shows-container">
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Shows ({adminShows.length})</h2>
                </div>
                <table className="list-shows-table">
                    <thead className="list-shows-thead">
                        <tr>
                            <th className="list-shows-th">Movie Name</th>
                            <th className="list-shows-th">Show Time</th>
                            <th className="list-shows-th">Total Bookings</th>
                            <th className="list-shows-th">Earnings</th>
                        </tr>
                    </thead>
                    <tbody className="list-shows-tbody">
                        {adminShows.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                                    No shows found. Add some shows to see them here.
                                </td>
                            </tr>
                        ) : (
                            adminShows.map((show, index) => (
                                <tr key={index} className="list-shows-tr">
                                    <td className="list-shows-td">{show.movie?.title || 'Unknown Movie'}</td>
                                    <td className="list-shows-td">{dateFormat(show.showDateTime)}</td>
                                    <td className="list-shows-td">{Object.keys(show.occupiedSeats || {}).length}</td>
                                    <td className="list-shows-td">{currency} {Object.keys(show.occupiedSeats || {}).length * show.showPrice}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    ) : <Loading />
}

export default ListShows
