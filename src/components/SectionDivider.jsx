import React from 'react';
import './SectionDivider.css';

const SectionDivider = ({ from, to, spaced }) => (
  <div
    className={`section-divider${spaced ? ' section-divider--spaced' : ''}`}
    style={{ background: `linear-gradient(90deg, transparent, ${from}, ${to}, transparent)` }}
  />
);

export default SectionDivider;
