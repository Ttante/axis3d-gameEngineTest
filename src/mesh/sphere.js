'use strict'

/**
 * Module dependencies.
 */

import { SphereGeometry } from '../geometry/sphere'
import { MeshCommand } from '../mesh'
import { define } from '../utils'
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
 * @extends MeshCommand
 */

export class SphereCommand extends MeshCommand {
  constructor(ctx, opts = {}) {
    const geometry = new SphereGeometry(opts)
    super(ctx, { ...opts, type: 'sphere', geometry })
    define(this, 'radius', { get: () => geometry.radius })
  }
}
