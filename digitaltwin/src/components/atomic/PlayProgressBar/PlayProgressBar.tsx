
import React, { useState, useEffect, useRef } from 'react';

interface ProgressBarProps {
    type: 'basic' | 'dynamic' | 'template' | 'indeterminate';
}

const PlayProgressBar: React.FC<ProgressBarProps> = ({ type }) => {
    const [value, setValue] = useState<number>(40);
    const interval = useRef<NodeJS.Timeout | null>(null); 

    useEffect(() => {
        if (type === 'dynamic') {
            interval.current = setInterval(() => {
                setValue(prevValue => {
                    const newValue = prevValue + Math.floor(Math.random() * 10) + 1;
                    return newValue >= 100 ? 100 : newValue;
                });
            }, 2000);
        }

        return () => {
            if (interval.current) {
                clearInterval(interval.current!); 
                interval.current = null;
            }
        };
    }, [type]);

    const valueTemplate = (value: number) => {
        return (
            <React.Fragment>
                {value}/<b>100</b>
            </React.Fragment>
        );
    };

    return (
        <div className="play-card">
            {type === 'dynamic' && (
                <div></div>
            )}
            <div className="play-progress-bar">
                {type === 'indeterminate' ? (
                    <div className="play-progress play-progress-indeterminate"></div>
                ) : (
                    <div className={`play-progress ${type === 'basic' ? '50%' : `${value}%` && type !== 'template' ? 'dynamic' : ''}`} style={{ width: type === 'basic' ? '50%' : `${value}%` }}>
                        {type !== 'template' && `${value}%`}
                        {type === 'template' && valueTemplate(value)}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PlayProgressBar;
