import { describe, it, expect } from 'vitest'
import {
  getOppositeFace,
  getPerpendicularFaces,
  getRandomDifferentFace,
  getVisibleFace,
  getRightFace,
  isValidOrientation,
  getAllFaces,
} from './cube-faces'
import type { CubeFace, ViewingDirection } from './cube-types'

describe('getOppositeFace', () => {
  it('returns the opposite for each pair', () => {
    expect(getOppositeFace('frontA')).toBe('backA')
    expect(getOppositeFace('backA')).toBe('frontA')
    expect(getOppositeFace('frontB')).toBe('backB')
    expect(getOppositeFace('backB')).toBe('frontB')
    expect(getOppositeFace('frontC')).toBe('backC')
    expect(getOppositeFace('backC')).toBe('frontC')
  })

  it('is its own inverse', () => {
    for (const face of getAllFaces()) {
      expect(getOppositeFace(getOppositeFace(face))).toBe(face)
    }
  })
})

describe('getPerpendicularFaces', () => {
  it('returns exactly 4 faces', () => {
    for (const face of getAllFaces()) {
      expect(getPerpendicularFaces(face)).toHaveLength(4)
    }
  })

  it('excludes the face itself and its opposite', () => {
    for (const face of getAllFaces()) {
      const perpendicular = getPerpendicularFaces(face)
      expect(perpendicular).not.toContain(face)
      expect(perpendicular).not.toContain(getOppositeFace(face))
    }
  })

  it('returns correct faces for frontA', () => {
    const result = getPerpendicularFaces('frontA')
    expect(result).toContain('frontB')
    expect(result).toContain('frontC')
    expect(result).toContain('backB')
    expect(result).toContain('backC')
  })
})

describe('getRandomDifferentFace', () => {
  it('never returns the same face', () => {
    // Use a deterministic sequence that covers all outcomes
    const faces = getAllFaces()
    for (const face of faces) {
      for (let i = 0; i < 100; i++) {
        const random = () => i / 100
        const result = getRandomDifferentFace(face, random)
        expect(result).not.toBe(face)
      }
    }
  })

  it('can return any other face', () => {
    const results = new Set<CubeFace>()
    for (let i = 0; i < 5; i++) {
      const random = () => i / 5
      results.add(getRandomDifferentFace('frontA', random))
    }
    expect(results.size).toBe(5)
    expect(results).not.toContain('frontA')
  })
})

describe('isValidOrientation', () => {
  it('rejects same face as front and up', () => {
    for (const face of getAllFaces()) {
      expect(isValidOrientation(face, face)).toBe(false)
    }
  })

  it('rejects opposite face as up', () => {
    for (const face of getAllFaces()) {
      expect(isValidOrientation(face, getOppositeFace(face))).toBe(false)
    }
  })

  it('accepts perpendicular faces', () => {
    for (const face of getAllFaces()) {
      for (const up of getPerpendicularFaces(face)) {
        expect(isValidOrientation(face, up)).toBe(true)
      }
    }
  })
})

describe('getRightFace', () => {
  it('returns a face perpendicular to both front and up', () => {
    for (const front of getAllFaces()) {
      for (const up of getPerpendicularFaces(front)) {
        const right = getRightFace(front, up)
        expect(right).not.toBe(front)
        expect(right).not.toBe(getOppositeFace(front))
        expect(right).not.toBe(up)
        expect(right).not.toBe(getOppositeFace(up))
      }
    }
  })

  it('produces all 6 distinct faces for each orientation', () => {
    for (const front of getAllFaces()) {
      for (const up of getPerpendicularFaces(front)) {
        const right = getRightFace(front, up)
        const allSix = new Set([
          front, getOppositeFace(front),
          up, getOppositeFace(up),
          right, getOppositeFace(right),
        ])
        expect(allSix.size).toBe(6)
      }
    }
  })

  it('produces 24 unique orientations across all valid (front, up) pairs', () => {
    const orientations = new Set<string>()
    for (const front of getAllFaces()) {
      for (const up of getPerpendicularFaces(front)) {
        const right = getRightFace(front, up)
        orientations.add(`${front},${up},${right}`)
      }
    }
    expect(orientations.size).toBe(24)
  })

  it('matches known orientation: default (frontA forward, frontB up)', () => {
    // Default orientation: face 1 toward viewer, face 2 up, face 3 right
    expect(getRightFace('frontA', 'frontB')).toBe('frontC')
  })
})

describe('getVisibleFace', () => {
  const defaultOrientation = { facingViewer: 'frontA' as CubeFace, facingUp: 'frontB' as CubeFace }

  it('returns front face for front direction', () => {
    expect(getVisibleFace(defaultOrientation, 'front')).toBe('frontA')
  })

  it('returns opposite of front for back direction', () => {
    expect(getVisibleFace(defaultOrientation, 'back')).toBe('backA')
  })

  it('returns up face for top direction', () => {
    expect(getVisibleFace(defaultOrientation, 'top')).toBe('frontB')
  })

  it('returns opposite of up for bottom direction', () => {
    expect(getVisibleFace(defaultOrientation, 'bottom')).toBe('backB')
  })

  it('returns right face for right direction', () => {
    expect(getVisibleFace(defaultOrientation, 'right')).toBe('frontC')
  })

  it('returns opposite of right for left direction', () => {
    expect(getVisibleFace(defaultOrientation, 'left')).toBe('backC')
  })

  it('returns all 6 different faces for the 6 directions', () => {
    const directions: readonly ViewingDirection[] = ['front', 'back', 'top', 'bottom', 'left', 'right']
    for (const front of getAllFaces()) {
      for (const up of getPerpendicularFaces(front)) {
        const orientation = { facingViewer: front, facingUp: up }
        const visible = directions.map(d => getVisibleFace(orientation, d))
        expect(new Set(visible).size).toBe(6)
      }
    }
  })
})
