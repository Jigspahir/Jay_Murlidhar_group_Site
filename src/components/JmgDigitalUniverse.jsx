import React from 'react';
import JmgEcosystem, { ECOSYSTEM_DOMAINS } from './ecosystem/JmgEcosystem';
import {
  CENTER_X,
  CENTER_Y,
  ORBIT_RADIUS,
  CORE_RADIUS,
  getRadialPosition,
  getRadialLineGeometry,
  getDomainEndRadius,
} from './ecosystem/ecosystemGeometry';

/* JmgDigitalUniverse Component
 * Thin wrapper around the production-ready JmgEcosystem component.
 * Ensures complete backward compatibility across existing views. */
export default function JmgDigitalUniverse({ onDomainChange, className = '' }) {
  return (
    <JmgEcosystem
      domains={ECOSYSTEM_DOMAINS}
      onDomainChange={onDomainChange}
      className={className}
    />
  );
}

export const JMG_DOMAINS = ECOSYSTEM_DOMAINS;

export {
  CENTER_X,
  CENTER_Y,
  ORBIT_RADIUS,
  CORE_RADIUS,
  getRadialPosition,
  getRadialLineGeometry,
  getDomainEndRadius,
  ECOSYSTEM_DOMAINS,
  JmgEcosystem,
};
