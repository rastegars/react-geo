import React from 'react'
import '../styles/Marker.css'

type MarkerPropsTypes = {
  dataTestID: string,
  onClick: (item: Location) => void,
  data: Location,
  title: string
};

const Marker = (props: MarkerPropsTypes) => {
  return (
    <div 
      data-testid={props.dataTestID}
      className='pin'
      onClick={() => props.onClick(props.data)}>
      <p className='marker-title'>{props.title}</p>
    </div>
  )
}

export default Marker