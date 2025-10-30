import { mapStreams } from './stream.utils';
import { mockLogos, mockStreams } from '@/mocks';

const customStream = {
  channel: 'Unknown',
  feed: 'feedX',
  title: 'Unknown Stream',
  url: 'https://x',
  referrer: '',
  user_agent: '',
  quality: 'HD'
};

describe('mapStreams', () => {
  it('maps each stream to its matching logo', () => {
    const result = mapStreams(mockStreams, mockLogos);
    expect(result).toHaveLength(2);
    expect(result[0].channel).toBe('Channel1');
    expect(result[0].logo?.url).toBe('https://example.com/logo1.png');
    expect(result[1].logo?.url).toBe('https://example.com/logo2.png');
  });

  it('filters streams with no matching logo', () => {
    const noLogo = result => result.every(s => s.channel !== 'Channel3');
    const result = mapStreams(mockStreams, mockLogos);
    expect(noLogo(result)).toBe(true);
  });

  it('handles empty stream and logo arrays', () => {
    expect(mapStreams([], [])).toEqual([]);
    expect(mapStreams([], mockLogos)).toEqual([]);
    expect(mapStreams(mockStreams, [])).toEqual([]);
  });

  it('ignores streams with logos missing url', () => {
    const badLogos = [{ ...mockLogos[0], url: undefined }, ...mockLogos.slice(1)];
    const result = mapStreams(mockStreams, badLogos);
    expect(result).toHaveLength(1);
    expect(result[0].logo?.url).toBe('https://example.com/logo2.png');
  });

  it('filters out non-matching channel/feeds', () => {
    const result = mapStreams([customStream], mockLogos);
    expect(result).toEqual([]);
  });

  it('can return streams with extended logo info', () => {
    const logos = [...mockLogos, { ...mockLogos[0], channel: 'ChannelExtra', url: 'https://extra.png' }];
    const extraStream = { ...mockStreams[0], channel: 'ChannelExtra' };
    const result = mapStreams([extraStream], logos);
    expect(result).toHaveLength(1);
    expect(result[0].logo?.url).toBe('https://extra.png');
  });
});