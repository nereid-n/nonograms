import React, {useState} from "react";
import './tabs.scss';

function Tabs(props: props) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="tabs-wrap">
      <div className="tabs">
        {
          props.tabs.map((tab: tab, i) => (
            <div
              key={tab.name}
              onClick={() => setCurrent(i)}
              className={`tab ${i === current ? 'active' : ''}`}
            >
              {tab.name}
            </div>
          ))
        }
      </div>
      <div className="tabs__content">
        {React.Children.map(props.children, (child, i) => {
          if (current === i) return child
        })}
      </div>
    </div>
  );
}

export default Tabs;

export interface tab {
  name: string
}

interface props {
  tabs: tab[],
  children: React.ReactNode
}