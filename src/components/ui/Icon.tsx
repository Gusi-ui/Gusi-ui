import { ICONS, type IconName } from '@/lib/icons';

type IconProps = {
  name: IconName;
  spin?: boolean;
  className?: string;
};

const Icon = ({ name, spin = false, className = '' }: IconProps) => {
  const icon = ICONS[name];

  return (
    <span
      className={['icon', `icon--${name}`, spin ? 'icon--spin' : '', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={icon.viewBox} fill="currentColor">
        <path d={icon.path} />
      </svg>
    </span>
  );
};

export default Icon;
