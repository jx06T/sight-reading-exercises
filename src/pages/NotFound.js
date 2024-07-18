import React from "react";

function NotFound(props ) {
    return (
        <div className="not-found flex flex-col items-center">
            <h1 className="text-center text-[18rem] m-4 border-b">404</h1>
            <a href="/" className="text-center text-8xl w-72 p-2 mt-14 m-4 border-2 hover:border-gray-300 rounded-2xl">Home</a>
        </div>
    );
}

export default NotFound