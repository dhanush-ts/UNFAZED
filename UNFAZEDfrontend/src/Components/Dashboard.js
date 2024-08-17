import React from 'react'
import { TopPerformersChart } from './DashComponents/BarTop5'
import { BottomPerformersChart } from './DashComponents/BarBottom5'
import { InteractionLinePlot } from './DashComponents/LineInter'
import { FeedbackRatingCard } from './DashComponents/Circular'
import { FeedbackPieChart } from './DashComponents/Pie'

export const Dashboard = ({id}) => {
  // console.log(id)
  return (
    <div >
      <div className='flex flex-wrap'>
        <TopPerformersChart id={id} />
        <BottomPerformersChart id={id} />
        </div>
        <div className='mx-3 p-10'>
          <InteractionLinePlot id={id} />
        </div>
        <div className='flex justify-between mx-1'>
          <FeedbackRatingCard id={id} />
          <FeedbackPieChart id={id} />
        </div>
    </div>
  )
}
