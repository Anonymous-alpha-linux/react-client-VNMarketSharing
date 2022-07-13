import React from 'react';

function Error({ statusNumber, error }) {
    return (<div>
        <span>
            <h1>{statusNumber}:</h1>
        </span>
        <span>
            <h1>{error}</h1>
        </span>
    </div>
    )
}

export default Error