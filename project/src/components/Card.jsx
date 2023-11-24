import React from 'react'
import "./Card.css"

const Card = ( {item} ) => {
  return (
    <div className='card'>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
    </div>
  )
}

export default Card