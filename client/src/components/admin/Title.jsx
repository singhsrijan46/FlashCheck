import React from 'react'
import './Title.css'

const Title = ({ text1, text2 }) => {
  return (
    <h1 className='admin-title'>
            {text1} <span className="admin-title-highlight">{text2}</span>
        </h1>
  )
}

export default Title
