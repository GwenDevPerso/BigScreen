import {mockStreams} from '@/mocks';
import {act, renderHook} from '@testing-library/react-native';
import MediaProvider, {useMedia} from './MediaContext';

const [mockStream1, mockStream2] = mockStreams;

describe('MediaContext', () => {
  describe('Initial state', () => {
    it('should provide initial context values', () => {
      const {result} = renderHook(() => useMedia(), {
        wrapper: MediaProvider,
      });

      expect(result.current.selectedStream).toBeNull();
      expect(typeof result.current.setSelectedStream).toBe('function');
      expect(typeof result.current.playStream).toBe('function');
      expect(typeof result.current.pauseStream).toBe('function');
      expect(typeof result.current.isStreamPlaying).toBe('function');
    });

    it('should return false for isStreamPlaying with null stream', () => {
      const {result} = renderHook(() => useMedia(), {
        wrapper: MediaProvider,
      });

      expect(result.current.isStreamPlaying(null)).toBe(false);
    });
  });

  describe('setSelectedStream', () => {
    it('should update selected stream', () => {
      const {result} = renderHook(() => useMedia(), {
        wrapper: MediaProvider,
      });

      act(() => {
        result.current.setSelectedStream(mockStream1);
      });

      expect(result.current.selectedStream).toEqual(mockStream1);
      expect(result.current.selectedStream?.title).toBe('Stream 1');
    });

    it('should allow setting stream to null', () => {
      const {result} = renderHook(() => useMedia(), {
        wrapper: MediaProvider,
      });

      act(() => {
        result.current.setSelectedStream(mockStream1);
      });

      act(() => {
        result.current.setSelectedStream(null);
      });

      expect(result.current.selectedStream).toBeNull();
    });

    it('should replace existing stream with new one', () => {
      const {result} = renderHook(() => useMedia(), {
        wrapper: MediaProvider,
      });

      act(() => {
        result.current.setSelectedStream(mockStream1);
      });

      expect(result.current.selectedStream?.title).toBe('Stream 1');

      act(() => {
        result.current.setSelectedStream(mockStream2);
      });

      expect(result.current.selectedStream?.title).toBe('Stream 2');
      expect(result.current.selectedStream?.channel).toBe('Channel2');
    });
  });

  describe('playStream', () => {
    it('should set isPlaying to true when playing a stream', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const {result} = renderHook(() => useMedia(), {
        wrapper: MediaProvider,
      });

      act(() => {
        result.current.setSelectedStream(mockStream1);
      });

      act(() => {
        result.current.playStream(mockStream1);
      });

      expect(result.current.isStreamPlaying(mockStream1)).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should handle playing a different stream while one is already playing', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const {result} = renderHook(() => useMedia(), {
        wrapper: MediaProvider,
      });

      act(() => {
        result.current.setSelectedStream(mockStream1);
      });

      act(() => {
        result.current.playStream(mockStream1);
      });

      expect(result.current.isStreamPlaying(mockStream1)).toBe(true);

      act(() => {
        result.current.setSelectedStream(mockStream2);
        result.current.playStream(mockStream2);
      });

      expect(result.current.isStreamPlaying(mockStream1)).toBe(false);
      expect(result.current.isStreamPlaying(mockStream2)).toBe(true);

      consoleSpy.mockRestore();
    });
  });

  describe('pauseStream', () => {
    it('should set isPlaying to false when pausing', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const {result} = renderHook(() => useMedia(), {
        wrapper: MediaProvider,
      });

      act(() => {
        result.current.setSelectedStream(mockStream1);
      });

      act(() => {
        result.current.playStream(mockStream1);
      });

      expect(result.current.isStreamPlaying(mockStream1)).toBe(true);

      act(() => {
        result.current.pauseStream();
      });

      expect(result.current.isStreamPlaying(mockStream1)).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should handle multiple pause calls', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const {result} = renderHook(() => useMedia(), {
        wrapper: MediaProvider,
      });

      act(() => {
        result.current.setSelectedStream(mockStream1);
        result.current.playStream(mockStream1);
      });

      act(() => {
        result.current.pauseStream();
      });

      expect(result.current.isStreamPlaying(mockStream1)).toBe(false);

      act(() => {
        result.current.pauseStream();
      });

      expect(result.current.isStreamPlaying(mockStream1)).toBe(false);

      consoleSpy.mockRestore();
    });
  });

  describe('isStreamPlaying', () => {
    it('should return true for the currently playing stream', () => {
      const {result} = renderHook(() => useMedia(), {
        wrapper: MediaProvider,
      });

      act(() => {
        result.current.setSelectedStream(mockStream1);
        result.current.playStream(mockStream1);
      });

      expect(result.current.isStreamPlaying(mockStream1)).toBe(true);
    });

    it('should return false for a different stream', () => {
      const {result} = renderHook(() => useMedia(), {
        wrapper: MediaProvider,
      });

      act(() => {
        result.current.setSelectedStream(mockStream1);
        result.current.playStream(mockStream1);
      });

      expect(result.current.isStreamPlaying(mockStream2)).toBe(false);
    });

    it('should return false when no stream is playing', () => {
      const {result} = renderHook(() => useMedia(), {
        wrapper: MediaProvider,
      });

      act(() => {
        result.current.setSelectedStream(mockStream1);
      });

      // Not playing yet
      expect(result.current.isStreamPlaying(mockStream1)).toBe(false);
    });

    it('should return false when stream is paused', () => {
      const {result} = renderHook(() => useMedia(), {
        wrapper: MediaProvider,
      });

      act(() => {
        result.current.setSelectedStream(mockStream1);
        result.current.playStream(mockStream1);
      });

      expect(result.current.isStreamPlaying(mockStream1)).toBe(true);

      act(() => {
        result.current.pauseStream();
      });

      expect(result.current.isStreamPlaying(mockStream1)).toBe(false);
    });
  });
});
