import { useState, useEffect } from 'react';

function TabTitle({activeTab}) {
    const tabContent = {
        tab1: <h2>Content for Tab 1</h2>,
        tab2: <h2>Content for Tab 2</h2>,
        tab3: <h2>Content for Tab 3</h2>,
        tab4: <h2>Content for Tab 4</h2>
    };
    return <div className="tab-content p-3 border border-top-0">{tabContent[activeTab]}</div>;
}

export default TabTitle;
