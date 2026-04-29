import React from 'react';
import '../styles/footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {currentYear} Thulomanche. All rights reserved.</p>
      </div>
    </footer>
  );
};
