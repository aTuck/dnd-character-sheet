import {Canvas} from '@react-three/fiber'
import React from 'react'
import {FC, useEffect, useState} from 'react'
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader.js'

interface Props {
  fileUrl: string
}

const Model: FC<Props> = ({fileUrl}) => {
  const [geometry, setGeometry] = useState()

  useEffect(() => {
    const stlLoader = new STLLoader()
    stlLoader.load(fileUrl, geo => {
      setGeometry(geo)
      console.log('loaded geometry', geo)
      console.log('loaded geometry', fileUrl)
    })
  }, [])

  return (
    <Canvas>
      <ambientLight />
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#cccccc" />
      </mesh>
    </Canvas>
  )
}

export default Model