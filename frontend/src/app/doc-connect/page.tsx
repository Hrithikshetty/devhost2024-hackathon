import React from 'react';

const RedirectPage: React.FC = () => {
  const handleRedirect = () => {
    // Change '3001' to the desired port number
    window.location.href = 'http://localhost:3000';
  };

  return (
    <div>
      <button onClick={handleRedirect}>Go to Port 3001</button>
    </div>
  );
};

export default RedirectPage;