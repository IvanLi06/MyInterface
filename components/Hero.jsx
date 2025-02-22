import React from 'react';

import Logo from './Logo';

const Hero = () => (
  <div className="hero my-5 text-center" data-testid="hero">
    <Logo testId="hero-logo" />
    <h1 className="mb-4" data-testid="hero-title">
      MyInterface
    </h1>

    <p className="lead" data-testid="hero-lead">
      An AI-driven tool ensures industry-standard UI/UX formatting and SEO, allowing you to focus on what truly matters - YOUR CONTENT.
    </p>
  </div>
);

export default Hero;
