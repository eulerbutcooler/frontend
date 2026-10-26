export const Logo: React.FC<React.SVGAttributes<SVGElement>> = (props) => (
  <svg
    viewBox="0 0 30 24"
    fill="none"
    width="30"
    height="24"
    {...props}
  >
    <g clipPath="url(#logo-icon-praq2q)" className="logo-icon">
      <path
        className="logo-stroke logo-stroke-1"
        d="M29.3388 9.46767H18.448V0.00146484H14.9293V10.2725C14.9293 11.3634 15.36 12.411 16.1254 13.183L25.018 22.151L27.506 19.6419L20.938 13.0183H29.3408V9.46975L29.3388 9.46767Z"
        fill="currentColor"
      ></path>
      <path
        className="logo-stroke logo-stroke-2"
        d="M1.82839 4.36056L8.39633 10.9842H-0.00646973V14.5328H10.8843V23.999H14.403V13.728C14.403 12.637 13.9723 11.5894 13.2069 10.8175L4.31635 1.85147L1.82839 4.36056Z"
        fill="currentColor"
      ></path>
    </g>
    <defs>
      <clipPath id="logo-icon-praq2q">
        <rect
          width="29.6"
          height="24"
          fill="white"
          transform="translate(-0.006)"
        ></rect>
      </clipPath>
    </defs>
  </svg>
);
