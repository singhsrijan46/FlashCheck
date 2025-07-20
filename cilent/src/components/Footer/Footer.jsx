import React from 'react'
import './Footer.css'
import logo from '../../assets/logo.png'

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer__top">

        <div className="footer__brand">
          <div className="footer__logo">
            <img src={logo} alt="" />
            <p>FlashCheck</p>
          </div>

          <p className="footer__text">
            Lorem Ipsum has been the industry's standard dummy text ever since the
            1500s, when an unknown printer took a galley of type and scrambled it
            to make a type specimen book.
          </p>

          <div className="footer__download">
            <img
              className="footer__btn"
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/googlePlayBtnBlack.svg"
              alt="Google Play"
            />
            <img
              className="footer__btn"
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/appleStoreBtnBlack.svg"
              alt="App Store"
            />
          </div>
        </div>

        <div className="footer__links">
          <div>
            <h2 className="footer__title">Company</h2>
            <ul className="footer__list">
              <li>Home</li>
              <li>About us</li>
              <li>Contact us</li>
              <li>Privacy policy</li>
            </ul>
          </div>

          <div>
            <h2 className="footer__title">Get in touch</h2>
            <div className="footer__contact">
              <p>+91-9236379944</p>
              <p>singhsrijangkp@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      <p className="footer__copy">
        Copyright {new Date().getFullYear()} © PreBuiltUI. All Rights Reserved.
      </p>
    </div>
  )
}

export default Footer