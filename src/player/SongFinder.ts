import { url } from "inspector";
import ytsr, { Video } from "ytsr";

type listOptions =
  | "YoutubeVideo"
  | "YoutubeVideoID"
  | "YoutubePlayList"
  | "YoutubePlaylistID"
  | "SearchResult";

export class SongFinder {
  static regex = {
    YouTubeVideo:
      /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))((?!channel)(?!user)\/(?:[\w\-]+\?v=|embed\/|v\/)?)((?!channel)(?!user)[\w\-]+)(((.*(\?|\&)t=(\d+))(\D?|\S+?))|\D?|\S+?)$/,
    YouTubeVideoID:
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
    YouTubePlaylist:
      /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#&?]*).*/,
    YouTubePlaylistID: /[&?]list=([^&]+)/,
  };

  static valdiateURL(url: string): listOptions {
    if (url.match(this.regex.YouTubeVideo)) {
      const t = url.match(this.regex.YouTubeVideo);
      console.log(t ? t[7] : null);
      return "YoutubeVideo";
    } else if (url.match(this.regex.YouTubeVideoID)) {
      return "YoutubeVideoID";
    } else if (url.match(this.regex.YouTubePlaylist)) {
      return "YoutubePlayList";
    } else if (url.match(this.regex.YouTubePlaylistID)) {
      return "YoutubePlaylistID";
    } else {
      return "SearchResult";
    }
  }
  static async search(searchQuery: string, limit: number = 10) {
    const res = await ytsr.getFilters(searchQuery);
    const video = res.get("Type").get("Video");
    const URL = await ytsr(video.url, { limit });

    return URL.items[0] as Video;
  }
}
