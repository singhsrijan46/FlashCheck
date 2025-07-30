import React, { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import './DateSelect.css'

const DateSelect = ({dateTime, id}) => {

    const navigate = useNavigate();

    const [selected, setSelected] = useState(null)

    const onBookHandler = ()=>{
        if(!selected){
            return toast('Please select a date')
        }
        navigate(`/movies/${id}/${selected}`)
        scrollTo(0,0)
    }

  return (
    <div id='dateSelect' className='date-select'>
      <div className='date-select-container'>
        <div>
            <p className='date-select-header'>Choose Date</p>
            <div className='date-select-navigation'>
                <ChevronLeftIcon width={28}/>
                <span className='date-select-dates'>
                    {Object.keys(dateTime).map((date)=>(
                        <button onClick={()=> setSelected(date)} key={date} className={`date-select-button ${selected === date ? "selected" : ""}`}>
                            <span>{new Date(date).getDate()}</span>
                            <span>{new Date(date).toLocaleDateString("en-US", {month: "short"})}</span>
                        </button>
                    ))}
                </span>
                <ChevronRightIcon width={28}/>
            </div>
        </div>
        <button onClick={onBookHandler} className='date-select-book-btn'>Book Now</button>
      </div>
    </div>
  )
}

export default DateSelect
