import { useEffect } from 'react';
import '../styles/contributionGraph.css'
import { CssBaseline } from '@mui/material';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';

const ContributionGraph = ({ contributions }) => {
    // get the current month number
    const theme = useTheme();
    const currentMonth = dayjs().month();
    let currentDayInWeek = dayjs().day(); // 0 is Sunday
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov', 'Dec'];

    useEffect(() => {
        const contributionsList = contributions.map((contribution) => {
            if (contribution.end_time) {
                const days = 365 - (dayjs().day() -  dayjs(contribution.end_time).day()) - (7 - currentDayInWeek % 7);
                const level = contribution.status === 'Completed' ? 2 : -1;
                return {
                    days: days,
                    level: level
                }
            }
        });
        
        const squares = document.querySelector('.squares');
        squares.innerHTML = '';
        const currentDay = 365 - (7 - currentDayInWeek % 7) + 1;
        for (var i = 1; i < 366; i++) {
            if (i === currentDay) {
                break;
            }
            
            let level = 0;            
            const contribs = contributionsList.filter((contribution) => contribution?.days === i);

            if (contribs.length > 0) {
                for (var contrib of contribs) {
                    level += contrib.level;
                }

                if (level < 0) {
                    level = 1;
                }

                if (level > 3) {
                    level = 3;
                }
            }
            squares.insertAdjacentHTML('beforeend', `<li data-level="${level}"></li>`);
        }
    }, [contributions]);

        
    return (
        <>
        <CssBaseline />
        <div className="graph">
            <ul className="months">
                {
                    Array.from(Array(12).keys()).map((_, idx) => {
                        return <li key={idx}>{months[(idx + currentMonth) % 12]}</li>
                    })
                }
            </ul>
            <ul className="days">
            <li>Sun</li>
            <li>Mon</li>
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
            <li>Sat</li>
            </ul>
            <ul className={`squares ${theme.palette.mode === "dark" && "dark"}`}>
            </ul>
        </div>
        </>
    )
}

export default ContributionGraph;