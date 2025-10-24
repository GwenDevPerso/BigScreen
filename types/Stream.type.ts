import {Logo} from "./Logo.type";

export type Stream = {
    channel: string;
    feed: string;
    title: string;
    url: string;
    referrer: string;
    user_agent: string;
    quality: string;
    logo?: Logo;
};