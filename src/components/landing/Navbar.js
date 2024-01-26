import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import { Logo } from 'assets/img/images';

const Navbar = () => {
  return (
    <nav
      id="navbar-main"
      className="navbar navbar-horizontal navbar-transparent navbar-main navbar-expand-lg navbar-light"
    >
      <div className="container">
        <a className="navbar-brand" href="/">
          <img src={Logo} alt="Technorio Logo" />
        </a>
        <div className="navbar-collapse navbar-custom-collapse collapse" id="navbar-collapse">
          <ul className="navbar-nav align-items-lg-center ml-lg-auto">
            <li className="nav-item">
              <a
                className="nav-link nav-link-icon"
                href="https://www.facebook.com/technorio"
                data-toggle="tooltip"
                data-original-title="Like us on Facebook"
              >
                <FontAwesomeIcon icon={faFacebookSquare} />
                <span className="nav-link-inner--text d-lg-none">Facebook</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link nav-link-icon"
                href="https://www.instagram.com/technorio.inc"
                data-toggle="tooltip"
                data-original-title="Follow us on Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} />
                <span className="nav-link-inner--text d-lg-none">Instagram</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link nav-link-icon"
                href="https://linkedin.com/company/technorio-inc-/"
                data-toggle="tooltip"
                data-original-title="Follow us on Twitter"
              >
                <FontAwesomeIcon icon={faLinkedin} />
                <span className="nav-link-inner--text d-lg-none">Twitter</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link nav-link-icon"
                href="https://github.com/creativetimofficial"
                data-toggle="tooltip"
                data-original-title="Star us on Github"
              >
                <i className="fab fa-github"></i>
                <span className="nav-link-inner--text d-lg-none">Github</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
