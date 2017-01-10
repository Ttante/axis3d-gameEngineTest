'use strict'

/**
 * Module dependencies.
 */

import OrbitCameraController from 'axis3d/controls/orbit-camera'
import Keyboard from 'axis3d/input/keyboard'
import Context from 'axis3d/context'
import Camera from 'axis3d/camera'
import Sphere from 'axis3d/mesh/sphere'
import Mouse from 'axis3d/input/mouse'
import Image from 'axis3d/media/image'
import Frame from 'axis3d/frame'
import raf from 'raf'

// axis context
const ctx = Context()

// objects
const camera = Camera(ctx)
const frame = Frame(ctx)
const image = Image(ctx, './lake360.jpg')
const sphere = Sphere(ctx, { map: image })

Object.assign(window, {camera, frame, image, sphere})

// inputs
const keyboard = Keyboard(ctx)
const mouse = Mouse(ctx, {allowWheel: true})

// orbit controller
const orbitController = OrbitCameraController(ctx, {
  inputs: {mouse, keyboard},
  target: camera,
  invert: true,
})

// orient controllers to "center" of image/video
raf(() => {
  orbitController.orientation.y = Math.PI / 2
  // focus now
  ctx.focus()
})


let frameCount = 0
let recording = false
let playing = false
let count = 0
const maxCount = 120


document.addEventListener("keyup", recordingToggle)
function recordingToggle(e) {
  console.log('e.keyCode: ', e.keyCode)
  if (e.keyCode == 82) {
    recording = !recording
  } else if (e.keyCode == 80) {
    playing = !playing
    frameCount = 0
  } else {
    console.log("error")
  }
}


// rotate
let xCoords = []
let yCoords = []
// axis animation frame loop
frame(({time}) => {
  // update controller states
  orbitController()

  if (recording) {
    xCoords.push(orbitController.orientation.x)
    yCoords.push(orbitController.orientation.y)
  }

  if (recording === false && playing) {
    orbitController.orientation.x = xCoords[frameCount]
    orbitController.orientation.y = yCoords[frameCount]
    frameCount++
  }

  if (count < maxCount) {
    count++ 
  } else {
    console.log('recording: ', recording)
    count = 0
  }
  // draw camera scene
  camera(() => {
    sphere()
  })
})