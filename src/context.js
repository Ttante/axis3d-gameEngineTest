'use strict'

/**
 * Module dependencies.
 */

import { EventEmitter } from 'events'
import events from 'dom-events'
import glsl from 'glslify'
// @TODO(werle) - consider using multi-regl
import regl from 'regl'

const computeCanvasDimensions = (domElement) => {
  const style = getComputedStyle(domElement)
  const width = parseFloat(style.width)
  const height = parseFloat(style.height)
  return Object.assign(domElement, {width, height})
}

/**
 * Module symbols.
 */

import {
  $reglContext,
  $domElement,
  $hasFocus,
  $previous,
  $current,
  $stack,
  $state,
  $regl
} from './symbols'

/**
 * Context class defaults.
 *
 * @public
 * @const
 * @type {Object}
 */

export const defaults = {
  clear: {
    // @TODO(werle) - use a color module
    color: [17/255, 17/255, 17/255, 1],
    depth: 1,
  },
}

/**
 * Creates a new Context instance with
 * sane defaults.
 *
 * @param {Object} opts
 */

export default (state, opts) => new Context({...defaults, ...state}, opts)

/**
 * Context class.
 *
 * @public
 * @class Context
 * @extends EventEmitter
 */

export class Context extends EventEmitter {

  /**
   * Context class constructor.
   *
   * @param {Objects} [initialState]
   * @param {Object} [opts]
   */

  constructor(initialState = {}, opts = {}, createRegl = regl) {
    super()

    const reglOptions = { ...opts.regl }
    if (opts.element && 'CANVAS' == opts.element.nodeName) {
      reglOptions.canvas = opts.element
    } else if (opts.element && opts.element.nodeName) {
      reglOptions.container = opts.element
    } else if ('string' == typeof opts.element) {
      reglOptions.container = opts.element
    }

    this[$regl] = createRegl(reglOptions)
    this[$stack] = []
    this[$state] = initialState
    this[$current] = null
    this[$previous] = null
    this[$hasFocus] = false
    this[$domElement] = this[$regl]._gl.canvas
    this[$reglContext] = null

    this.setMaxListeners(Infinity)

    events.on(this[$domElement], 'focus', () => this.focus())
    events.on(this[$domElement], 'blur', () => this.blur())
    events.on(window, 'blur', () => this.blur())
  }

  /**
   * Current command getter.
   *
   * @getter
   * @type {Command}
   */

  get current() {
    return this[$current]
  }

  /**
   * Previous command getter.
   *
   * @getter
   * @type {Command}
   */

  get previous() {
    return this[$previous]
  }

  /**
   * Current stack depth.
   *
   * @type {Number}
   */

  get depth() {
    return this[$stack].length
  }

  /**
   * DOM element associated with this
   * command context.
   *
   * @getter
   * @type {Element}
   */

  get domElement() {
    return this[$domElement]
  }

  /**
   * Boolean indicating if context has
   * focus.
   *
   * @getter
   * @type {Boolean}
   */

  get hasFocus() {
    return this[$hasFocus]
  }

  /**
   * regl instance.
   *
   * @getter
   * @type {Function}
   */

  get regl() {
    return this[$regl]
  }

  /**
   * State object.
   *
   * @getter
   * @type {Object}
   */

  get state() {
    return this[$stack]
  }

  /**
   * Contest canvas width
   *
   * @getter
   * @type {Number}
   */

  get width() {
    return computeCanvasDimensions(this.domElement).width
  }

  /**
   * Contest canvas height
   *
   * @getter
   * @type {Number}
   */

  get height() {
    return computeCanvasDimensions(this.domElement).height
  }

  /**
   * Focuses context.
   *
   * @return {Context}
   */

  focus() {
    this[$hasFocus] = true
    this.emit('focus')
    return this
  }

  /**
   * Blurs context.
   *
   * @return {Context}
   */

  blur() {
    this[$hasFocus] = false
    this.emit('blur')
    return this
  }

  /**
   * Pushes command to context stack.
   *
   * @param {Command} command
   * @return {Context}
   */

  push(command) {
    if ('function' == typeof command) {
      this[$stack].push(command)
      this[$current] = command
      this[$previous] = this[$stack][this[$stack].length - 2]
    }
    return this
  }

  /**
   * Pops tail of context command stack.
   *
   * @return {Context}
   */

  pop() {
    let command = this[$stack].pop()
    this[$current] = this[$stack][this[$stack].length - 1]
    this[$previous] = command
    return command
  }

  /**
   * Updates command context state.
   *
   * @param {Function|Object} block
   * @return {Context}
   */

  update(block) {
    if (block && 'object' == typeof block) {
      Object.assign(this[$state], block)
    }
    return this
  }

  /**
   * Clears the clear buffers in regl.
   *
   * @return {Context}
   */

  clear() {
    this.regl.clear(this[$state].clear)
    this[$current] = null
    this[$previous] = null
    this[$stack].splice(0, this[$stack].length)
    return this
  }
}
