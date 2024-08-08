import React, { useState } from 'react';

function JournalEntry() {
    const [entry, setEntry] = useState('');

    const handleInputChange = (event) => {
        setEntry(event.target.value);
    };

    const handleSubmit = () => {
        const userInput = prompt('What would you like to write?');
        // You can use userInput here or set it to state like setEntry(userInput);
    };

    return (
        <div>
            <input type="text" value={entry} onChange={handleInputChange} />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default JournalEntry;