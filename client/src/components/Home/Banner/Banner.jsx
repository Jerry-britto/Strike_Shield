import React from 'react'
import Carousel from 'react-material-ui-carousel'

export default function Banner() {
    const data = [
        "https://rukminim1.flixcart.com/flap/1680/280/image/1defb861e409319b.jpg?q=50",
        " https://rukminim1.flixcart.com/flap/1680/280/image/685712c6cefb3c02.jpg?q=50",
        "https://rukminim1.flixcart.com/flap/1680/280/image/8d4150cc4f3f967d.jpg?q=50",
        "https://rukminim1.flixcart.com/flap/1680/280/image/685712c6cefb3c02.jpg?q=50"
    ]
  return (
    <div>
        <Carousel
        className='w-full'
        autoPlay={true}
        animation='slide'

        navButtonsAlwaysInvisible={true}
        cycleNavigation={true}
        navButtonsProps={{
            style:{
                backgroundColor:"#fff",
                color:"#494949",
                borderRadius:0,
                marginTop:-22,
                height:"104px"
            }
          }}
        >
            {
                data.map((image,idx)=>(
                    <div key={idx}>
                        <img src={image} alt={`image_${idx}`} className='sm:w-full w-auto h-96 sm:h-[280px]'/>
                    </div>
                ))
            }
        </Carousel>
    </div>
  )
}

