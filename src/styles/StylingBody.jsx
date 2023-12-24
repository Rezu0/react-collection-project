import React from "react";

function StylingBody() {
  return (
    <style>
      {`
        body {
          background-color: #101418;
          color: #ffffff;
        }
        button{
          transition: 0.5s;
        }
        .button-login:hover{
          background-color: #f20538;
        }
        .button-tarik:hover{
          background-color: #c2556d;
        }
        .button-status:hover{
          background-color: #7e57c2
        }
      `}
    </style>
  )
}

export default StylingBody;