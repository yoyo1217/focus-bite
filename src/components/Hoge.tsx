import React, { useState, useEffect } from 'react'

const Hoge = () => {
  const [x, setX] = useState(0)
  useEffect(() => {
    setInterval(() => {
      console.log(x)
      setX(1)
      console.log("after", x);
    }, 1000)
  }, [])
  return(
    <>
      <p>Hoge</p>
    </>
  )
}

export default Hoge