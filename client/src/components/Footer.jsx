import React from 'react'
import { assets } from '../assets/assets'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="footer-logo-container">
                        <img className="footer-logo" src={assets.logoPng} alt="FlashCheck Logo" />
                        <span className="footer-logo-text">FlashCheck</span>
                    </div>
                    <p className="footer-description">
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                    <div className="footer-apps">
                        <img src={assets.googlePlay} alt="google play" className="footer-app-icon" />
                        <img src={assets.appStore} alt="app store" className="footer-app-icon" />
                    </div>
                </div>
                <div className="footer-links">
                    <div className="footer-section">
                        <h2 className="footer-section-title">Company</h2>
                        <ul className="footer-section-list">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">Privacy policy</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h2 className="footer-section-title">Get in touch</h2>
                        <div className="footer-section-text">
                            <p>+1-234-567-890</p>
                            <p>contact@example.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="footer-copyright">
                Copyright {new Date().getFullYear()} © FlashCheck. All Right Reserved.
            </p>
        </footer>
  )
}

export default Footer
