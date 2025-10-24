import {Logo} from "../types/Logo.type";
import {Stream} from "../types/Stream.type";

export const mapStreams = (streams: Stream[], logos: Logo[]): Stream[] => {
    return streams.map((stream: Stream) => ({
        ...stream,
        logo: logos.find((logo: Logo) => logo.channel === stream.channel),
    }));
};