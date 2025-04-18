import React from "react";

type LogoProps = {
  className?: string;
  size?: number;
};

export default function Logo({className, size = 32}: LogoProps) {
  return (
      <svg className={className} id="Layer_2" data-name="Layer 2" height={size} width={size}
           xmlns="http://www.w3.org/2000/svg" viewBox="0 0 201 201">
        <g id="Layer_1-2" data-name="Layer 1">
          <rect fill={"#fff"} stroke={"#f0efef"} strokeMiterlimit={10} className="cls-2" x=".5" y=".5" width="200"
                height="200" rx="25.68" ry="25.68"/>
          <g>
            <path fill={"#353535"} className="cls-3"
                  d="m71.98,107.85c3.69-4.82,8.08-8.79,13.7-11.26,3.56-1.57,7.28-2.43,11.16-2.93,4.52-.59,8.89-.07,13.18,1.09,5.11,1.39,9.84,3.68,13.67,7.48,1.86,1.84,3.63,3.77,5.45,5.66,2.73,4.11,4.56,8.6,5.64,13.41,1.49,8.8.62,17.67.84,26.51.07,2.97-.83,5.67-3.16,7.52-2.35,1.86-6.29,1.36-8.56-.71-1.49-1.36-2.32-3.01-2.31-5.09.02-6.89.11-13.79-.04-20.67-.09-4.29-.98-8.44-3.54-12.07-4.19-5.95-9.83-9.13-17.16-9.28-6.27-.13-11.63,1.95-15.84,6.6-3.31,3.67-5.35,7.99-5.39,13.02-.07,7.22,0,14.44-.05,21.66-.03,3.37-1.85,6.23-5.46,7.38-2.62.83-4.62-.31-6.59-1.8-1.49-1.12-1.9-2.66-1.91-4.38-.05-7.6-.13-15.2-.1-22.8,0-1.96.37-3.92.57-5.88,1.21-4.82,3.23-9.28,5.92-13.45Z"/>
            <path fill={"#353535"} className="cls-3"
                  d="m79.57,65.31c-.36-11.76,9.42-20.62,19.81-20.83,13.81-.27,22.18,9.74,22.06,20.86-.13,12.54-9.6,21.27-21.76,21.03-10.76-.22-20.33-9.3-20.11-21.07Zm20.94-6.7c-4.85-.29-6.99,3.11-7.08,6.64-.1,3.74,3.14,7.1,6.76,7.12,3.95.02,7.32-3.22,7.29-7.27-.03-3.22-2.94-7.02-6.97-6.5Z"/>
            <path fill={"#425eab"} className="cls-1"
                  d="m134.76,121.3c-1.08-4.81-2.91-9.3-5.64-13.41,3.15-.51,6.3-.79,9.51-.41,7.42.86,14.03,3.44,19.75,8.39,5.86,5.08,9.5,11.36,11.28,18.85,1.2,5.07,1.11,10.22.78,15.33-.24,3.66-2.59,5.41-5.94,6.31-2.58.69-5.61-.95-7.03-3.79-.59-1.18-.71-2.65-.83-4-.35-3.87-.21-7.82-.98-11.6-1.03-4.97-3.97-8.84-8.22-11.83-3.87-2.72-8.12-3.65-12.67-3.84Z"/>
            <path fill={"#425eab"} className="cls-1"
                  d="m71.98,107.85c-2.69,4.17-4.71,8.63-5.92,13.45-6.18.06-11.64,1.96-15.87,6.6-3.56,3.92-5.69,8.5-5.65,13.93.02,2.4.05,4.81-.02,7.21-.11,4.2-2.47,6.34-6.01,7.32-2.75.76-6.5-1.63-7.74-4.65-.16-.38-.08-.86-.1-1.29-.11-3.36-.46-6.74-.26-10.09.23-3.93,1.2-7.76,2.72-11.44,1.58-3.8,3.8-7.15,6.56-10.2,4.76-5.27,10.56-8.76,17.48-10.36,4.3-.99,8.64-1.19,13.02-.52.59.09,1.2.02,1.8.03Z"/>
            <path fill={"#425eab"} className="cls-1"
                  d="m142.39,100.29c-7.21.46-14-6.51-13.93-13.76.08-8.34,6.23-14.2,14.12-14.13,6.92.07,14.22,4.79,13.89,15.15-.21,6.53-6.31,12.98-14.08,12.73Z"/>
            <path fill={"#425eab"} className="cls-1"
                  d="m51.46,100.29c-7.94.13-13.31-6.43-13.87-12.37-.93-9.8,6.96-15.56,13.51-15.56,8.39,0,14.06,6.15,14.38,13.46.37,8.26-7.06,14.79-14.02,14.46Z"/>
          </g>
        </g>
      </svg>
  );
}