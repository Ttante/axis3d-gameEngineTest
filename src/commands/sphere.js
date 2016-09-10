'use strict'

/**
 * Module dependencies.
 */

import { SphereGeometry } from '../geometry/sphere'
import { ObjectCommand } from './object'
import mat4 from 'gl-mat4'
import glsl from 'glslify'

/**
 * SphereCommand constructor.
 * @see SphereCommand
 */

export default (...args) => new SphereCommand(...args)

/**
 * SphereCommand class.
 *
 * @public
 * @class SphereCommand
 * @extends ObjectCommand
 */

export class SphereCommand extends ObjectCommand {
  constructor(ctx, opts = {}) {
    const geometry = new SphereGeometry(opts.geometry)
    const defaults = {}
    const uniforms = {}

    if (opts.image) {
      uniforms.image = opts.image && opts.image.texture ?
        opts.image.texture :
        opts.image
    }

    super(ctx, {
      type: 'sphere',
      defaults,
      uniforms,
      geometry,
    })
  }
}
