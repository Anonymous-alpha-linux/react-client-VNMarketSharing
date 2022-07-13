import React from 'react'

function Text({ children }) {
    return (
        <p className='text__root'>{children}</p>
    )
}

Text.Title = function BoldText({ children }) {
    return <b>{children}</b>
}

Text.Note = function NoteText({ children }) {
    return <p>{children}</p>
}



export default Text