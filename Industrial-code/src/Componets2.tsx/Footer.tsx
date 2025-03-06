import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-body-tertiary text-center">
      {/* Grid container */}
      <div className="container p-4 pb-0">
        {/* Section: Social media */}

        {/* Section: Social media */}
      </div>

      <div className="text-center p-3" style={{ backgroundColor: '#2C3E50',fontSize:'14px' }}>
        <section className="mb-2">
          {/* Facebook */}
          <a
            data-mdb-ripple-init
            className="btn text-white btn-floating m-1"
            style={{ backgroundColor: '#3b5998' }}
            href="https://www.facebook.com/people/SHPropertiesin/61557284391727/"
            role="button"
          >
            <i className="fab fa-facebook-f"></i>
          </a>

          {/* Google */}
          <a
            data-mdb-ripple-init
            className="btn text-white btn-floating m-1"
            style={{ backgroundColor: '#dd4b39' }}
            href="#!"
            role="button"
          >
            <i className="fab fa-google"></i>
          </a>

          {/* Instagram */}
          <a
            data-mdb-ripple-init
            className="btn text-white btn-floating m-1"
            style={{ backgroundColor: '#ac2bac' }}
            href="#!"
            role="button"
          >
            <i className="fab fa-instagram"></i>
          </a>

        </section>
        © 2024 Copyright: &nbsp;
        <a className="text-body" href="https://mdbootstrap.com/" style={{color:'white'}}>
          www.shpproperties.in
        </a>
      </div>
      {/* Copyright */}
    </footer>
  );
};

export default Footer;
