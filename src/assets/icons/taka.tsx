import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TakaSvgIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="taka"
    className="icon line-color"
    data-name="Line Color"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      id="primary"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 3a3 3 0 0 1 3 3v11.34A3.66 3.66 0 0 0 12.66 21h0A3.66 3.66 0 0 0 16 18.83l1.75-3.94A2.87 2.87 0 0 0 16 11h0"
    ></path>
    <path
      id="secondary"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 11h6"
    ></path>
  </svg>
);

export default TakaSvgIcon;
