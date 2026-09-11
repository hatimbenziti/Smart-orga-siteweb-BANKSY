import React from 'react';
import { Sun, Cloud, CloudRain, Snowflake, CloudLightning } from 'lucide-react';

interface WeatherIconProps {
  icon?: 'sun' | 'cloud' | 'cloud-rain' | 'snowflake' | 'cloud-lightning' | string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ icon, className = 'w-4 h-4' }) => {
  switch (icon) {
    case 'cloud':
      return <Cloud className={className} />;
    case 'cloud-rain':
      return <CloudRain className={className} />;
    case 'snowflake':
      return <Snowflake className={className} />;
    case 'cloud-lightning':
      return <CloudLightning className={className} />;
    case 'sun':
    default:
      return <Sun className={className} />;
  }
};
