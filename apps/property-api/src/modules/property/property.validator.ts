import { HttpStatus } from '@nestjs/common';
import { Polygon, Position } from 'geojson';
import { ApiException } from 'libs/utils';

export function parseLocationString(locationString: string): Polygon {
  try {
    const location = JSON.parse(locationString);
    if (!Array.isArray(location) || location?.length === 0) throw new Error('Invalid Array');
    const parsedLocation: Position[][] = location.map((ring) => {
      if (!Array.isArray(ring) || ring?.length === 0) throw new Error('Polygon Ring should be valid Array');
      const lastIndex = ring.length - 1;
      // eslint-disable-next-line security/detect-object-injection
      if (ring[0][0] !== ring[lastIndex][0] || ring[0][1] !== ring[lastIndex][1])
        throw new Error('Invalid Polygon Ring');
      return ring.map((position) => {
        if (position.length !== 2) throw new Error('Invalid Polygon Position');
        return position.map(Number);
      });
    });
    return {
      type: 'Polygon',
      coordinates: parsedLocation,
    };
  } catch (error) {
    throw new ApiException(`location should be a valid Polygon: ${error?.message}`, HttpStatus.PRECONDITION_FAILED);
  }
}
