import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import './ContactUs.css'

const ContactUs = () => {
  const { axios } = useAppContext()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate form data
      if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
        toast.error('Please fill in all fields')
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address')
        return
      }

      // Submit form to backend
      const response = await axios.post('/api/contact/submit', formData)

      if (response.data.success) {
        toast.success(response.data.message || 'Thank you for your message! We will get back to you soon.')
        
        // Reset form
        setFormData({ name: '', email: '', message: '' })
      } else {
        toast.error(response.data.message || 'Failed to submit message. Please try again.')
      }
    } catch (error) {
      
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Failed to submit message. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="contact-us">
      <div className="contact-container">
        <div className="contact-left">
          <div className="contact-intro">
            <span className="contact-subtitle">Let's talk</span>
            <h1 className="contact-title">Contact</h1>
            <p className="contact-description">
              Have questions about movie bookings, showtimes, or need assistance with your tickets? 
              We're here to help make your movie-going experience seamless and enjoyable.
            </p>
          </div>
        </div>

        <div className="contact-right">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                disabled={loading}
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactUs 