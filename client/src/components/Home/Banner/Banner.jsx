import React from 'react'
import Carousel from 'react-material-ui-carousel'

export default function Banner() {
    const data = [
        "https://sc04.alicdn.com/kf/U42b08ee128924ffc84605e3d501a6568e/1010373393/U42b08ee128924ffc84605e3d501a6568e.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6zwm-Ode5qq3YoGZ9jJYKUjzjy5Wg2R4bCQ&s",
        "https://www.roomaif.com/image/catalog/mainBanner/Mid-Banner2.jpg",
        "https://img.freepik.com/free-photo/digital-art-style-boxing-day-celebration_23-2151040803.jpg?size=626&ext=jpg&ga=GA1.1.553209589.1715126400&semt=ais"
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

