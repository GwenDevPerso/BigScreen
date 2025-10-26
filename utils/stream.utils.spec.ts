import {mockLogos, mockStreams} from '@/mocks';
import {Stream} from '@/types/Stream.type';
import {mapStreams} from './stream.utils';

describe('stream.utils', () => {
  it('should map streams with their logos', () => {
    const result = mapStreams(mockStreams, mockLogos);
    
    expect(result).toHaveLength(2);
    expect(result[0].logo).toBeDefined();
    expect(result[0].logo?.url).toBe('https://example.com/logo1.png');
    expect(result[1].logo).toBeDefined();
    expect(result[1].logo?.url).toBe('https://example.com/logo2.png');
  });

  it('should filter out streams without logos', () => {
    const result = mapStreams(mockStreams, mockLogos);
    
    expect(result).not.toContainEqual(
      expect.objectContaining({channel: 'Channel3'})
    );
  });

  it('should handle empty arrays', () => {
    const result = mapStreams([], []);
    
    expect(result).toEqual([]);
  });

  it('should handle streams with no matching logos', () => {
    const streamsWithNoLogos: Stream[] = [
      {
        channel: 'UnknownChannel',
        feed: 'feed',
        title: 'Unknown Stream',
        url: 'https://example.com/unknown',
        referrer: '',
        user_agent: '',
        quality: 'HD',
      },
    ];
    
    const result = mapStreams(streamsWithNoLogos, mockLogos);
    
    expect(result).toEqual([]);
  });
});