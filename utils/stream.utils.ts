import {Logo} from "../types/Logo.type";
import {Stream} from "../types/Stream.type";

export const mapStreams = (streams: Stream[], logos: Logo[]): Stream[] => {
    const mappedStreams = streams.map((stream: Stream) => ({
        ...stream,
        logo: logos.find((logo: Logo) => logo.channel === stream.channel),
    }));
    return mappedStreams.filter((stream: Stream) => stream.logo?.url);
};