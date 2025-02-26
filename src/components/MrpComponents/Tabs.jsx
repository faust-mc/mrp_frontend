import { useState, useEffect } from 'react';

function Tabs({ activeTab, setActiveTab, tabNames }) {


    return (
        <ul className="nav nav-tabs">
            {Object.keys(tabNames).map(tab => (
                <li className="nav-item" key={tab}>
                    <button
                        className={`nav-link ${activeTab === tab ? "active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tabNames[tab]}
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default Tabs;
