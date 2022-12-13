import React from 'react'
import { PropTypes } from 'prop-types'
import Star from './Star'

const Rating = ({value, text, color}) => {
  return (
    <span>
        <Star value={value}   style={color}/>
        <Star value={value-1} style={color}/>
        <Star value={value-2} style={color}/>
        <Star value={value-3} style={color}/>
        <Star value={value-4} style={color}/>
        <span className='mx-2'>{text && text}</span>
    </span>
  )
}


Rating.propTypes = {
    value: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    color: PropTypes.string
}

export default Rating