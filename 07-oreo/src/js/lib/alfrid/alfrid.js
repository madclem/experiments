// alfrid.js

import * as GLM from 'gl-matrix'

import Batch from './alfrid/Batch'
import BatchAxis from './alfrid/helpers/BatchAxis'
import BatchBall from './alfrid/helpers/BatchBall'
// HELPERS
import BatchCopy from './alfrid/helpers/BatchCopy'
import BatchDotsPlane from './alfrid/helpers/BatchDotsPlane'
import BatchLine from './alfrid/helpers/BatchLine'
import BatchSky from './alfrid/helpers/BatchSky'
import BatchSkybox from './alfrid/helpers/BatchSkybox'
// LOADERS
import BinaryLoader from './alfrid/loaders/BinaryLoader'
// CAMERAS
import Camera from './alfrid/cameras/Camera'
import CameraCube from './alfrid/cameras/CameraCube'
import CameraOrtho from './alfrid/cameras/CameraOrtho'
import CameraPerspective from './alfrid/cameras/CameraPerspective'
import CubeFrameBuffer from './alfrid/CubeFrameBuffer'
import Draw from './alfrid/helpers/Draw'
import EaseNumber from './alfrid/utils/EaseNumber'
import EventDispatcher from './alfrid/utils/EventDispatcher'
import FboArray from './alfrid/FboArray'
import FboPingPong from './alfrid/FboPingPong'
import FrameBuffer from './alfrid/FrameBuffer'
import GL from './alfrid/GLTool'
import GLCubeTexture from './alfrid/GLCubeTexture'
import GLShader from './alfrid/GLShader'
import GLTFParser from './alfrid/loaders/GLTFParser'
import GLTexture from './alfrid/GLTexture2'
import Geom from './alfrid/Geom'
import HDRLoader from './alfrid/loaders/HDRLoader'
import Mesh from './alfrid/Mesh'
// WEBGL 2
import MultisampleFrameBuffer from './alfrid/MultisampleFrameBuffer'
import ObjLoader from './alfrid/loaders/ObjLoader'
// OBJECT
import Object3D from './alfrid/objects/Object3D'
import OrbitalControl from './alfrid/utils/OrbitalControl'
import QuatRotation from './alfrid/utils/QuatRotation'
// MATH
import Ray from './alfrid/math/Ray'
import Scene from './alfrid/helpers/Scene'
// TOOLS
import Scheduler from 'scheduling'
import ShaderLibs from './alfrid/utils/ShaderLibs'
import SpringNumber from './alfrid/utils/SpringNumber'
import TouchDetector from './alfrid/utils/TouchDetector'
import TransformFeedbackObject from './alfrid/TransformFeedbackObject'
import TweenNumber from './alfrid/utils/TweenNumber'
import View from './alfrid/helpers/View'
import View3D from './alfrid/helpers/View3D'
import WebglNumber from './alfrid/utils/WebglNumber'

// import WebglConst from './alfrid/utils/WebglConst'




// import ColladaParser  from './alfrid/loaders/ColladaParser';



const VERSION = '0.3.9'

class Alfrid {
  constructor () {
    this.glm = GLM
    this.GL = GL
    this.GLTool = GL
    this.GLShader = GLShader
    this.GLTexture = GLTexture
    this.GLCubeTexture = GLCubeTexture
    this.Mesh = Mesh
    this.Geom = Geom
    this.Batch = Batch
    this.FrameBuffer = FrameBuffer
    this.CubeFrameBuffer = CubeFrameBuffer
    this.Scheduler = Scheduler
    this.EventDispatcher = EventDispatcher
    this.EaseNumber = EaseNumber
    this.SpringNumber = SpringNumber
    this.TweenNumber = TweenNumber
    this.Camera = Camera
    this.CameraOrtho = CameraOrtho
    this.CameraPerspective = CameraPerspective
    this.Ray = Ray
    this.CameraCube = CameraCube
    this.OrbitalControl = OrbitalControl
    this.QuatRotation = QuatRotation
    this.BinaryLoader = BinaryLoader
    this.ObjLoader = ObjLoader
    this.GLTFParser = GLTFParser
    // this.ColladaParser     = ColladaParser;
    this.HDRLoader = HDRLoader
    this.BatchCopy = BatchCopy
    this.BatchAxis = BatchAxis
    this.BatchBall = BatchBall
    this.BatchBall = BatchBall
    this.BatchLine = BatchLine
    this.BatchSkybox = BatchSkybox
    this.BatchSky = BatchSky
    this.BatchDotsPlane = BatchDotsPlane
    this.Scene = Scene
    this.View = View
    this.View3D = View3D
    this.Draw = Draw
    this.Object3D = Object3D
    this.ShaderLibs = ShaderLibs
    this.WebglNumber = WebglNumber

    this.FboArray = FboArray
    this.FboPingPong = FboPingPong

    this.MultisampleFrameBuffer = MultisampleFrameBuffer
    this.TransformFeedbackObject = TransformFeedbackObject

    for (const s in GLM) {
      if (GLM[s]) {
        if (window) window[s] = GLM[s]
      }
    }
  }

  log () {
    if (navigator.userAgent.indexOf('Chrome') > -1) {
      console.log(`%clib alfrid : VERSION ${VERSION}`, 'background: #193441; color: #FCFFF5')
    } else {
      console.log('lib alfrid : VERSION ', VERSION)
    }
    console.log('%cClasses : ', 'color: #193441')

    for (const s in this) {
      if (this[s]) {
        console.log(`%c - ${s}`, 'color: #3E606F')
      }
    }
  }
}

const al = new Alfrid()

export default al
export {
  GL,
  GLShader,
  GLTexture,
  GLCubeTexture,
  Mesh,
  Geom,
  Batch,
  FrameBuffer,
  CubeFrameBuffer,
  MultisampleFrameBuffer,
  TransformFeedbackObject,
  Scheduler,
  EventDispatcher,
  EaseNumber,
  SpringNumber,
  TweenNumber,
  OrbitalControl,
  WebglNumber,
  QuatRotation,
  TouchDetector,
  Camera,
  CameraOrtho,
  CameraPerspective,
  CameraCube,
  Ray,
  Object3D,
  BinaryLoader,
  ObjLoader,
  HDRLoader,
  GLTFParser,
  BatchCopy,
  BatchAxis,
  BatchBall,
  BatchDotsPlane,
  BatchLine,
  BatchSkybox,
  BatchSky,
  Scene,
  View,
  View3D,
  Draw,
  ShaderLibs,
  FboArray,
  FboPingPong
}
